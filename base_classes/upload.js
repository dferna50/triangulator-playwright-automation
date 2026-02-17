const { expect } = require('@playwright/test');
const Papa = require('papaparse');
const fs = require('fs');
const path = require('path');

class Upload {
  constructor(page) {
    this.page = page;
    this.myTriangulatorTab = page.locator(':nth-child(4) > .text-grey-600');
    this.uploadButton = page.getByRole('button', { name: 'Upload' });
    this.uploadModal = page.locator('.grid-flow-col');
    this.selectFirstRadioButton = page.locator('#optionLabel-0');
    this.selectSecondRadioButton = page.locator('#optionLabel-1');
    this.selectThirdRadioButton = page.locator('#optionLabel-2');
    this.openSlidebar = page.locator('.relative > .opacity-0').first();
    this.uploadNextButton = page.locator('.justify-end > :nth-child(2) > .relative > .opacity-0');
    this.uploadFile = page.locator('.border-2');
    this.scrollBottom = page.locator('.overflow-y-scroll');
    this.dataReceivedMessage = page.getByText('Data received.');
    this.uploadSummaryPage = page.getByText('Upload Rules Summary');
    this.uploadCatalogSummaryPage = page.getByText('Upload Course Catalog Summary');
    this.downloadCsvFileButton = page.getByText('Download csv file');
    this.submitButton = page.getByText('Submit');
  }

  async preUpload() {
    await this.page.locator(':nth-child(3) > .text-grey-600').click(); // Click on My Workspace
    //await this.page.locator('.px-4 > .relative > .opacity-0').click(); // Click on the sidebar
    await this.page.locator(':nth-child(5) > :nth-child(1) > .w-full > .flex-1').click(); // Click on the summary from the sidebar
    await this.scrollBottom.click();
    await this.scrollBottom.evaluate((el) => el.scrollTo(0, 500));
    await this.page.waitForTimeout(10000);
    const text = await this.page.locator(':nth-child(2) > .w-full > :nth-child(2) > .rounded > .text-4xl').textContent();
    return parseFloat(text.replace(/,/g, ''));
  }

  async preUploadCatalog() {
    await this.page.locator(':nth-child(3) > .text-grey-600').click(); // Click on My Workspace
   // await this.page.locator('.px-4 > .relative > .opacity-0').click(); // Click on the sidebar
    await this.page.locator(':nth-child(5) > :nth-child(1) > .w-full > .flex-1').click(); // Click on the summary from the sidebar
    await this.scrollBottom.click();
    await this.scrollBottom.evaluate((el) => el.scrollTo(0, 500));
    await this.page.waitForTimeout(10000);
    const text = await this.page.locator(':nth-child(3) > .w-full > :nth-child(2) > .rounded > .text-4xl').textContent();
    return parseFloat(text.replace(/,/g, ''));
  }

  async postUploadCount() {
    await expect(this.dataReceivedMessage).toBeVisible();
    await expect(this.page).toHaveURL(/\/my-workspace\/inst-admin\/summary/);
    await this.scrollBottom.click();
    await this.scrollBottom.evaluate((el) => el.scrollTo(0, 500));
    await this.page.waitForTimeout(5000);
    await this.page.reload();
    await this.page.waitForTimeout(5000);
    const text = await this.page.locator(':nth-child(2) > .w-full > :nth-child(2) > .rounded > .text-4xl').textContent();
    return parseFloat(text.replace(/,/g, ''));
  }

  async postUploadCountCatalog() {
    await expect(this.dataReceivedMessage).toBeVisible();
    await expect(this.page).toHaveURL(/\/my-workspace\/inst-admin\/summary/);
    await this.scrollBottom.click();
    await this.scrollBottom.evaluate((el) => el.scrollTo(0, 500));
    await this.page.waitForTimeout(10000);
    await this.page.reload();
    await expect(this.page).toHaveURL(/\/my-workspace\/inst-admin\/summary/);
    await this.scrollBottom.click();
    await this.scrollBottom.evaluate((el) => el.scrollTo(0, 500));
    await this.page.waitForTimeout(10000);
    const text = await this.page.locator(':nth-child(3) > .w-full > :nth-child(2) > .rounded > .text-4xl').textContent();
    return parseFloat(text.replace(/,/g, ''));
  }

  async confirmationPageCount(rCount, rInFile, rLoaded, iCount, iInFile, iLoaded) {
    const rulesCount = await this.page.locator('.gap-4 > div > .font-bold').textContent();
    expect(rulesCount.trim()).toBe(rCount);

    const rulesInFile = await this.page.locator('.gap-4 > div > :nth-child(3)').textContent();
    expect(rulesInFile.trim()).toBe(rInFile);

    const rulesLoadedFromFile = await this.page.locator('.gap-4 > div > :nth-child(4)').textContent();
    expect(rulesLoadedFromFile.trim()).toBe(rLoaded);

    const institutionCount = await this.page.locator('.flex-col > .font-bold').textContent();
    expect(institutionCount.trim()).toBe(iCount);

    const institutionInFile = await this.page.locator('.items-stretch > .flex-col > :nth-child(3)').textContent();
    expect(institutionInFile.trim()).toBe(iInFile);

    const loadedInstitution = await this.page.locator('.items-stretch > .flex-col > :nth-child(4)').textContent();
    expect(loadedInstitution.trim()).toBe(iLoaded);
  }
  async confirmationPageCountCatalog(rCount, rInFile, iCount, iInFile, iLoaded) {
    const rulesCount = await this.page.locator(':nth-child(3) > div > .font-bold').textContent();
    expect(rulesCount.trim()).toBe(rCount); // Accepted Rule count

    const rulesInFile = await this.page.locator(':nth-child(3) > div > .text-neutral-400').textContent();
    expect(rulesInFile.trim()).toBe(rInFile); // Rules in file

    const institutionCount = await this.page.locator('.gap-4 > :nth-child(1) > .gap-8').textContent();
    expect(institutionCount.trim()).toBe(iCount); // Institution count

    const institutionInFile = await this.page.locator(':nth-child(3) > .text-neutral-400').textContent();
    expect(institutionInFile.trim()).toBe(iInFile); // Institutions in file

    const loadedInstitution = await this.page.locator(':nth-child(4) > .text-neutral-400').textContent();
    expect(loadedInstitution.trim()).toBe(iLoaded); // Institution loaded from the file
}

  async upload(file, choice) {
    await this.myTriangulatorTab.click(); // Navigate to My Triangulator tab
    await expect(this.page.getByText('New Suggestions').first()).toBeVisible();
    //await this.openSlidebar.click(); // Open the slidebar
    //await expect(this.page.getByLabel('Upload').getByText('Upload', { exact: true })).toBeVisible();
    await this.uploadButton.click(); // Click on the upload button
    await this.page.getByRole('link', { name: 'Upload' }).click();
//    await expect(this.page.getByLabel('Upload').getByText('Upload', { exact: true })).toBeVisible(); // Assertions

    //await expect( this.page.locator('#dialog-title').textContent()).toBe('Upload'); // Modal title assertion
    await this.page.locator('#modal-outlet-0 > div.absolute.inset-0.flex.items-center.justify-center.z-30.pointer-events-none > div > div > div.p-6.gap-4.flex.flex-col.w-full > div > button:nth-child(' + choice +')').first().click(); // Select the option
    await this.uploadNextButton.click(); // Click on the next button
   // await expect(this.page.getByText('Upload data', {timeout:120000})).toBeVisible();
    await this.uploadFile.setInputFiles(file); // Select the file
  }


  async uploadValid(choice) {
    await this.page.locator(`#optionLabel-${choice}`).first().click(); // Click on add option
    await this.uploadNextButton.click(); // Submit button to upload the file
    await expect(this.page.getByText('Uploaded.')).toBeVisible({timeout:120000}); // Toast message assertion
    await expect(this.page.getByText('Upload Rules Summary')).toBeVisible({timeout:120000}); // Upload summary page assertion
  }

  async uplaodcatalogValid(choice) {
    await this.page.locator(`#optionLabel-${choice}`).first().click(); // Click on add option
    await this.uploadNextButton.click(); // Submit button to upload the file
    await expect(this.page.getByText('Uploaded.')).toBeVisible({timeout:120000}); // Toast message assertion
    await expect(this.page.getByText('Upload Course Catalog Summary')).toBeVisible({timeout:120000}); // Upload summary page assertion
  }
  

  async criticalError(error) {
    await expect(this.page.getByText('Errors', {exact: true})).toBeVisible({timeout:120000});
    await expect(this.page.locator(`text=${error}`)).toBeVisible(); // Assertion for type of critical error
    await this.scrollBottom.click();
    await this.scrollBottom.evaluate((el) => el.scrollTo(0, el.scrollHeight)); // Scroll to bottom
    await expect(this.page.getByText('Review formatting errors/critical errors')).toBeVisible();
    await expect(this.page.getByText('Download csv file')).toBeVisible();
  }

  async catalogFormatError() {
await this.page.waitForSelector('.py-1', { timeout: 10000 });
   // await this.page.waitForSelector('.py-1');
    await expect(this.page.locator('.py-1')).toBeVisible({timeout:180000});
//    await expect(this.page.locator('.w-full.flex-col > :nth-child(1) > .font-semibold')).toHaveText('Review formatting errors');
    await expect(this.page.getByText('Download csv file')).toBeVisible();
  }

  async catalogCriticalError() {
    await expect(this.page.locator('.py-1')).toBeVisible();
    await expect(this.page.locator('.w-full.flex-col > :nth-child(1) > .font-semibold')).toHaveText('Critical errors');
    await expect(this.page.getByText('Download csv file')).toBeVisible();
  }

  generateUniqueAlphaNumeric(limit) {
    const alphanumericCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < limit; i++) {
      const randomIndex = Math.floor(Math.random() * alphanumericCharacters.length);
      result += alphanumericCharacters.charAt(randomIndex);
    }

    return result;
  }

  updateCSVContent(fileContent) {
    const rows = fileContent.split('\n');

    // Process each row starting from the second row
    for (let i = 1; i < rows.length; i++) {
      const columns = rows[i].split(',');

      // Update values in column A (RulesIdentifier) with AUTO + random alphanumeric value + _SOURCE
      columns[0] = `AUTO${this.generateUniqueAlphaNumeric(8)}_SOURCE`;

      // Update values in column I (Number) with AUTO + random alphanumeric value + _TARGET
      columns[8] = `AUTO${this.generateUniqueAlphaNumeric(8)}_TARGET`;
    }

    // Update the modified content back to the file (if needed)
    return rows.join('\n');
  }

  async readErrorCSVFile(error, row) {
    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      this.page.getByText('Download csv file').click(),
    ]);
    const csvPath = await download.path();
    const csvContent = fs.readFileSync(csvPath, 'utf8');
    const data = Papa.parse(csvContent, { header: true }).data;
    const errorMessage = data[row]['Errors'];
    expect(errorMessage).toBe(error);
  }

  async catalogreadErrorCSVFile(error, row) {
    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      this.page.getByText('Download csv file').click(),
    ]);
    const csvPath = await download.path();
    const csvContent = fs.readFileSync(csvPath, 'utf8');
    const data = Papa.parse(csvContent, { header: true }).data;
    const errorMessage = data[row]['format_errors'];
    expect(errorMessage).toBe(error);
  }

  async postUpload() {
    await this.page.locator('.items-start > .flex').click();
    await this.submitButton.click();
  }
  async Rulesuploadprocessfails1568()
  {
    
  }

}

module.exports = {Upload};