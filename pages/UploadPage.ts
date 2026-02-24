import { type Page, type Locator, expect } from '@playwright/test';
import Papa from 'papaparse';
import fs from 'fs';

export class UploadPage {
  readonly page: Page;
  readonly myTriangulatorTab: Locator;
  readonly uploadButton: Locator;
  readonly uploadModal: Locator;
  readonly selectFirstRadioButton: Locator;
  readonly selectSecondRadioButton: Locator;
  readonly selectThirdRadioButton: Locator;
  readonly openSlidebar: Locator;
  readonly uploadNextButton: Locator;
  readonly uploadFile: Locator;
  readonly scrollBottom: Locator;
  readonly dataReceivedMessage: Locator;
  readonly uploadSummaryPage: Locator;
  readonly uploadCatalogSummaryPage: Locator;
  readonly downloadCsvFileButton: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.myTriangulatorTab = page.locator(':nth-child(4) > .text-grey-600');
    this.uploadButton = page.getByRole('button', { name: 'Upload' });
    this.uploadModal = page.locator('.grid-flow-col');
    this.selectFirstRadioButton = page.locator('#optionLabel-0');
    this.selectSecondRadioButton = page.locator('#optionLabel-1');
    this.selectThirdRadioButton = page.locator('#optionLabel-2');
    this.openSlidebar = page.locator('.relative > .opacity-0').first();
    this.uploadNextButton = page.locator('.justify-end > :nth-child(2) > .relative > .opacity-0');
    this.uploadFile = page.locator('input[type="file"]');
    this.scrollBottom = page.locator('.overflow-y-scroll');
    this.dataReceivedMessage = page.getByText('Data received.');
    this.uploadSummaryPage = page.getByText('Upload Rules Summary');
    this.uploadCatalogSummaryPage = page.getByText('Upload Course Catalog Summary');
    this.downloadCsvFileButton = page.getByText('Download csv file');
    this.submitButton = page.getByText('Submit');
  }

  async preUpload(): Promise<number> {
    await this.page.locator(':nth-child(3) > .text-grey-600').click();
    await this.page.locator(':nth-child(5) > :nth-child(1) > .w-full > .flex-1').click();
    await this.scrollBottom.click();
    await this.scrollBottom.evaluate((el) => el.scrollTo(0, 500));
    await this.page.waitForTimeout(10000);
    const text = await this.page.locator(':nth-child(2) > .w-full > :nth-child(2) > .rounded > .text-4xl').textContent();
    return parseFloat((text ?? '0').replace(/,/g, ''));
  }

  async preUploadCatalog(): Promise<number> {
    await this.page.locator(':nth-child(3) > .text-grey-600').click();
    await this.page.locator(':nth-child(5) > :nth-child(1) > .w-full > .flex-1').click();
    await this.scrollBottom.click();
    await this.scrollBottom.evaluate((el) => el.scrollTo(0, 500));
    await this.page.waitForTimeout(10000);
    const text = await this.page.locator(':nth-child(3) > .w-full > :nth-child(2) > .rounded > .text-4xl').textContent();
    return parseFloat((text ?? '0').replace(/,/g, ''));
  }

  async postUploadCount(): Promise<number> {
    await expect(this.dataReceivedMessage).toBeVisible();
    await expect(this.page).toHaveURL(/\/my-workspace\/inst-admin\/summary/);
    await this.scrollBottom.click();
    await this.scrollBottom.evaluate((el) => el.scrollTo(0, 500));
    await this.page.waitForTimeout(5000);
    await this.page.reload();
    await this.page.waitForTimeout(5000);
    const text = await this.page.locator(':nth-child(2) > .w-full > :nth-child(2) > .rounded > .text-4xl').textContent();
    return parseFloat((text ?? '0').replace(/,/g, ''));
  }

  async postUploadCountCatalog(): Promise<number> {
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
    return parseFloat((text ?? '0').replace(/,/g, ''));
  }

  async confirmationPageCount(
    rCount: string,
    rInFile: string,
    rLoaded: string,
    iCount: string,
    iInFile: string,
    iLoaded: string
  ): Promise<void> {
    const rulesCount = await this.page.locator('.gap-4 > div > .font-bold').textContent();
    expect((rulesCount ?? '').trim()).toBe(rCount);

    const rulesInFile = await this.page.locator('.gap-4 > div > :nth-child(3)').textContent();
    expect((rulesInFile ?? '').trim()).toBe(rInFile);

    const rulesLoadedFromFile = await this.page.locator('.gap-4 > div > :nth-child(4)').textContent();
    expect((rulesLoadedFromFile ?? '').trim()).toBe(rLoaded);

    const institutionCount = await this.page.locator('.flex-col > .font-bold').textContent();
    expect((institutionCount ?? '').trim()).toBe(iCount);

    const institutionInFile = await this.page.locator('.items-stretch > .flex-col > :nth-child(3)').textContent();
    expect((institutionInFile ?? '').trim()).toBe(iInFile);

    const loadedInstitution = await this.page.locator('.items-stretch > .flex-col > :nth-child(4)').textContent();
    expect((loadedInstitution ?? '').trim()).toBe(iLoaded);
  }

  async confirmationPageCountCatalog(
    rCount: string,
    rInFile: string,
    iCount: string,
    iInFile: string,
    iLoaded: string
  ): Promise<void> {
    const rulesCount = await this.page.locator(':nth-child(3) > div > .font-bold').textContent();
    expect((rulesCount ?? '').trim()).toBe(rCount);

    const rulesInFile = await this.page.locator(':nth-child(3) > div > .text-neutral-400').textContent();
    expect((rulesInFile ?? '').trim()).toBe(rInFile);

    const institutionCount = await this.page.locator('.gap-4 > :nth-child(1) > .gap-8').textContent();
    expect((institutionCount ?? '').trim()).toBe(iCount);

    const institutionInFile = await this.page.locator(':nth-child(3) > .text-neutral-400').textContent();
    expect((institutionInFile ?? '').trim()).toBe(iInFile);

    const loadedInstitution = await this.page.locator(':nth-child(4) > .text-neutral-400').textContent();
    expect((loadedInstitution ?? '').trim()).toBe(iLoaded);
  }

  async upload(file: string, choice: number): Promise<void> {
    await this.myTriangulatorTab.click();
    await expect(this.page.getByText('New Suggestions').first()).toBeVisible();
    await this.uploadButton.click();
    await this.page.getByRole('link', { name: 'Upload' }).click();
    await this.page.locator(`#modal-outlet-0 > div.absolute.inset-0.flex.items-center.justify-center.z-30.pointer-events-none > div > div > div.p-6.gap-4.flex.flex-col.w-full > div > button:nth-child(${choice})`).first().click();
    await this.uploadFile.setInputFiles(file);
  }

  async uploadValid(choice: number): Promise<void> {
    await this.page.locator(`#optionLabel-${choice}`).first().click();
    await this.uploadNextButton.click();
    await expect(this.page.getByText('Uploaded')).toBeVisible({ timeout: 120000 });
    await expect(this.page.getByText('Upload Rules Summary')).toBeVisible({ timeout: 120000 });
  }

  async uploadCatalogValid(choice: number): Promise<void> {
    await this.page.locator(`#optionLabel-${choice}`).first().click();
    await this.uploadNextButton.click();
    await expect(this.page.getByText('Uploaded')).toBeVisible({ timeout: 120000 });
    await expect(this.page.getByText('Upload Course Catalog Summary')).toBeVisible({ timeout: 120000 });
  }

  async criticalError(error: string): Promise<void> {
    await expect(this.page.getByText('Errors', { exact: true })).toBeVisible({ timeout: 120000 });
    await expect(this.page.locator(`text=${error}`)).toBeVisible();
    await this.scrollBottom.click();
    await this.scrollBottom.evaluate((el) => el.scrollTo(0, el.scrollHeight));
    await expect(this.page.getByText('Review formatting errors/critical errors')).toBeVisible();
    await expect(this.page.getByText('Download csv file')).toBeVisible();
  }

  async catalogFormatError(): Promise<void> {
    await this.page.waitForSelector('.py-1', { timeout: 10000 });
    await expect(this.page.locator('.py-1')).toBeVisible({ timeout: 180000 });
    await expect(this.page.getByText('Download csv file')).toBeVisible();
  }

  async catalogCriticalError(): Promise<void> {
    await expect(this.page.locator('.py-1')).toBeVisible();
    await expect(this.page.locator('.w-full.flex-col > :nth-child(1) > .font-semibold')).toHaveText('Critical errors');
    await expect(this.page.getByText('Download csv file')).toBeVisible();
  }

  generateUniqueAlphaNumeric(limit: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < limit; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      result += chars.charAt(randomIndex);
    }
    return result;
  }

  updateCSVContent(fileContent: string): string {
    const rows = fileContent.split('\n');
    for (let i = 1; i < rows.length; i++) {
      const columns = rows[i].split(',');
      columns[0] = `AUTO${this.generateUniqueAlphaNumeric(8)}_SOURCE`;
      columns[8] = `AUTO${this.generateUniqueAlphaNumeric(8)}_TARGET`;
    }
    return rows.join('\n');
  }

  async readErrorCSVFile(error: string, row: number): Promise<void> {
    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      this.page.getByText('Download csv file').click(),
    ]);
    const csvPath = await download.path();
    if (!csvPath) throw new Error('Download path is null');
    const csvContent = fs.readFileSync(csvPath, 'utf8');
    const data = Papa.parse<Record<string, string>>(csvContent, { header: true }).data;
    const errorMessage = data[row]['Errors'];
    expect(errorMessage).toBe(error);
  }

  async catalogReadErrorCSVFile(error: string, row: number): Promise<void> {
    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      this.page.getByText('Download csv file').click(),
    ]);
    const csvPath = await download.path();
    if (!csvPath) throw new Error('Download path is null');
    const csvContent = fs.readFileSync(csvPath, 'utf8');
    const data = Papa.parse<Record<string, string>>(csvContent, { header: true }).data;
    const errorMessage = data[row]['format_errors'];
    expect(errorMessage).toBe(error);
  }

  async postUpload(): Promise<void> {
    await this.page.locator('.items-start > .flex').click();
    await this.submitButton.click();
  }
}
