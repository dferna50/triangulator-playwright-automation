const { test, expect } = require('@playwright/test');
const {loginPage} = require('../base_classes/login.js');
const { Upload } = require('../base_classes/upload.js');
const UploadUtils = require('../base_classes/csvUtils.js');
const creds = require('../test_data/logindata.json');
const fs = require('fs').promises;


// Define file paths
const filePath = 'test_data/uploadRules/182290_FileWithNoError4copy.csv';
const filePath2 = 'test_data/uploadRules/182290_FileWithNoError4.csv';

// Setup test context
let loginPageInstance, uploadInstance;
let Creds, criticalError, preUploadCount, postUploadCount;

// Setup before each test
test.beforeEach(async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  loginPageInstance = new loginPage(page);
  uploadInstance = new Upload(page);
  await page.goto("https://qa.creditmobility.net/");
  const credsJson = require('../test_data/logindata.json');
    // const criticalErrorJson = require('../../fixtures/criticalErrorName.json');
    // const filesDataJson = require('../../fixtures/criticalErrorsFiles.json');
    
    Creds = credsJson;
    // criticalError = criticalErrorJson;
    // uploadFiles = filesDataJson;
    
    // Visit page and login
    await loginPageInstance.visit();
});

   //let loginPageInstance, uploadInstance;

  test("TC_01: Upload Catalog file with incorrect format(non CSV file)", async () => {
    await loginPageInstance.loginuser( Creds.nevadaadmin, Creds.password, 'Institution Admin');

    await uploadInstance.upload('test_data/uploadRules/182290_NonCSVFile.xlsx', 1);
    await expect(uploadInstance.page.getByText("Unsupported file. Only csv files are supported.")).toBeVisible();
  });

  test("TC_02: Upload Catalog file with spaces in the file name", async () => {
    await loginPageInstance.loginuser( Creds.nevadaadmin, Creds.password, 'Institution Admin');

    await uploadInstance.upload('test_data/uploadRules/182290_This File has Spaces.CSV', 1);
    await expect(uploadInstance.page.getByText("Please rename the file without spaces and try again.")).toBeVisible();
  });

  test("TC_03: Attempt to press on submit without checking the acknowledgement checkbox", async () => {
    await loginPageInstance.loginuser( Creds.nevadaadmin, Creds.password, 'Institution Admin');
    await uploadInstance.upload(filePath, 1);
    await uploadInstance.uplaodcatalogValid(0);
    await expect(uploadInstance.page.getByText('Submit')).toBeDisabled();
  });

  test("TC_04: Uploads a catalog file and click cancel on the upload summary page", async () => {
    await loginPageInstance.loginuser( Creds.nevadaadmin, Creds.password, 'Institution Admin');
    await uploadInstance.upload(filePath, 1);
    await uploadInstance.uplaodcatalogValid(0);
    await uploadInstance.page.getByText('Cancel').click();
    await expect(uploadInstance.page).toHaveURL(/\/my-workspace\/inst-admin\/summary/);
  });

  test.skip("TC_05: Uploads catalog add function with no errors", async () => {
    await loginPageInstance.loginuser( Creds.nevadaadmin, Creds.password, 'Institution Admin');
    let fileRulecount = 3;
   // C:\Automation\TriangulatorPlaywirght\playwright_migration\test_data\uploadRules\182290_CriticalError-DuplicateRule.csv
   // C:\Automation\TriangulatorPlaywirght\playwright_migration\test_data\CatalogFiles\DuplicateCourseIdentifier.csv
    // Read and modify CSV content
    const fs = require('fs');
    let fileContent = fs.readFileSync("././playwright_migration/test_data/CatalogFiles/DuplicateCourseIdentifier.csv", 'utf-8');
    const modifiedContent = UploadUtils.updateCSVContentCatalog(fileContent);
    fs.writeFileSync("playwright_migration/test_data/CatalogFiles/DuplicateCourseIdentifier.csv", modifiedContent);
    
    // Pre-upload catalog count
    preUploadCount = await uploadInstance.preUploadCatalog();
    console.log(preUploadCount);
    
    await uploadInstance.upload("playwright_migration/test_data/CatalogFiles/DuplicateCourseIdentifier.csv", 1);
    await uploadInstance.uplaodcatalogValid(0);
    
    // Verify no errors
    await expect(uploadInstance.page.getByText('Errors')).not.toBeVisible();
    await expect(uploadInstance.page.getByText('Download csv file')).not.toBeVisible();
    
    // Verify confirmation page counts
    await uploadInstance.confirmationPageCountCatalog("3", "+ 3 new active courses", "3", "3 rows were successfully transformed", "+ 3 new courses");
    
    // Post upload
    await uploadInstance.postUpload();
    postUploadCount = await uploadInstance.postUploadCountCatalog();
    console.log(postUploadCount);
    expect(parseInt(postUploadCount)).toEqual(parseInt(preUploadCount) + fileRulecount);
  });

  test.skip("Uploads catalog add function with Invalid active course error", async () => {
    await loginPageInstance.loginuser( Creds.nevadaadmin, Creds.password, 'Institution Admin');

    let fileRulecount = 2;
    //funstoinality as heen changed error popup has been removed this cane be ignored as of now
    // Read and modify CSV content
    const fs = require('fs');
    let fileContent = fs.readFileSync("././playwright_migration/test_data/CatalogFiles/DuplicateCourseIdentifier.csv", 'utf-8');
    const modifiedContent = UploadUtils.updateCSVContentCatalog(fileContent);
    fs.writeFileSync("playwright_migration/test_data/CatalogFiles/Format-InvalidActiveCourse.csv", modifiedContent);
    
    // Pre-upload catalog count
    preUploadCount = await uploadInstance.preUploadCatalog();
    console.log(preUploadCount);
    
    await uploadInstance.upload("playwright_migration/test_data/CatalogFiles/Format-InvalidActiveCourse.csv", 1);
    await uploadInstance.uplaodcatalogValid(0);
    
    // Verify format error
    await uploadInstance.catalogFormatError();
    
    // Verify confirmation page counts
    await uploadInstance.confirmationPageCountCatalog("2", "+ 2 new active courses", "3" + "1 format errors", "3 rows were successfully transformed", "+ 2 new courses");
    
    // Verify error message in CSV
  
    await uploadInstance.catalogreadErrorCSVFile("Invalid Active Course Indicator. Should be a boolean ", 0);
    
    // Post upload
    await uploadInstance.postUpload();
    postUploadCount = await uploadInstance.postUploadCountCatalog();
    console.log(postUploadCount);
    expect(parseInt(postUploadCount)).toEqual(parseInt(preUploadCount) + fileRulecount);
  });

  test.skip("Uploads catalog add function with Invalid Course Department name Error", async () => {
    let fileRulecount = 2;
    
    // Read and modify CSV content
    const fs = require('fs');
    let fileContent = fs.readFileSync("cypress/fixtures/CatalogFiles/Format-InvalidCourceDeparmentname.csv", 'utf-8');
    const modifiedContent = UploadUtils.updateCSVContentCatalog(fileContent);
    fs.writeFileSync("cypress/fixtures/CatalogFiles/Format-InvalidCourceDeparmentname.csv", modifiedContent);
    
    // Pre-upload catalog count
    preUploadCount = await uploadInstance.preUploadCatalog();
    console.log(preUploadCount);
    
    await uploadInstance.upload("cypress/fixtures/CatalogFiles/Format-InvalidCourceDeparmentname.csv", 1);
    await uploadInstance.uplaodcatalogValid(0);
    
    // Verify format error
    await uploadInstance.catalogFormatError();
    
    // Verify confirmation page counts
    await uploadInstance.confirmationPageCountCatalog("2", "+ 2 new active courses", "3" + "1 format errors", "3 rows were successfully transformed", "+ 2 new courses");
    
    // Verify error message in CSV
    await uploadInstance.catalogreadErrorCSVFile("Invalid Course Long Department Name. Should not exceed 500 characters ", 0);
    
    // Post upload
    await uploadInstance.postUpload();
    postUploadCount = await uploadInstance.postUploadCountCatalog();
    console.log(postUploadCount);
    expect(parseInt(postUploadCount)).toEqual(parseInt(preUploadCount) + fileRulecount);
  });

  test.skip("Uploads catalog add function with Invalid Course Credit Units Error", async () => {
    let fileRulecount = 2;
    
    // Read and modify CSV content
    const fs = require('fs');
    let fileContent = fs.readFileSync("cypress/fixtures/CatalogFiles/Format-InvalidCourseCreditUnits.csv", 'utf-8');
    const modifiedContent = UploadUtils.updateCSVContentCatalog(fileContent);
    fs.writeFileSync("cypress/fixtures/CatalogFiles/Format-InvalidCourseCreditUnits.csv", modifiedContent);
    
    // Pre-upload catalog count
    preUploadCount = await uploadInstance.preUploadCatalog();
    console.log(preUploadCount);
    
    await uploadInstance.upload("cypress/fixtures/CatalogFiles/Format-InvalidCourseCreditUnits.csv", 1);
    await uploadInstance.uplaodcatalogValid(0);
    
    // Verify format error
    await uploadInstance.catalogFormatError();
    
    // Verify confirmation page counts
    await uploadInstance.confirmationPageCountCatalog("2", "+ 2 new active courses", "3" + "1 format errors", "3 rows were successfully transformed", "+ 2 new courses");
    
    // Verify error message in CSV
    await uploadInstance.catalogreadErrorCSVFile("Invalid Course Credit Units. Should be one of enumerated values. ", 0);
    
    // Post upload
    await uploadInstance.postUpload();
    postUploadCount = await uploadInstance.postUploadCountCatalog();
    console.log(postUploadCount);
    expect(parseInt(postUploadCount)).toEqual(parseInt(preUploadCount) + fileRulecount);
  });

  test.skip("Uploads catalog add function with Invalid effective year error", async () => {
    let fileRulecount = 2;
    
    // Read and modify CSV content
    const fs = require('fs');
    let fileContent = fs.readFileSync("cypress/fixtures/CatalogFiles/Format-InvalidEffectiveYear.csv", 'utf-8');
    const modifiedContent = UploadUtils.updateCSVContentCatalog(fileContent);
    fs.writeFileSync("cypress/fixtures/CatalogFiles/Format-InvalidEffectiveYear.csv", modifiedContent);
    
    // Pre-upload catalog count
    preUploadCount = await uploadInstance.preUploadCatalog();
    console.log(preUploadCount);
    
    await uploadInstance.upload("cypress/fixtures/CatalogFiles/Format-InvalidEffectiveYear.csv", 1);
    await uploadInstance.uplaodcatalogValid(0);
    
    // Verify format error
    await uploadInstance.catalogFormatError();
    
    // Verify confirmation page counts
    await uploadInstance.confirmationPageCountCatalog("2", "+ 2 new active courses", "3" + "1 format errors", "3 rows were successfully transformed", "+ 2 new courses");
    
    // Verify error message in CSV
    await uploadInstance.catalogreadErrorCSVFile("Invalid Course Effective Year Month. Should be in YYYY-MM format ", 0);
    
    // Post upload
    await uploadInstance.postUpload();
    postUploadCount = await uploadInstance.postUploadCountCatalog();
    console.log(postUploadCount);
    expect(parseInt(postUploadCount)).toEqual(parseInt(preUploadCount) + fileRulecount);
  });

  test.skip("Uploads catalog add function with Invalid expiration year error", async () => {
    let fileRulecount = 2;
    
    // Read and modify CSV content
    const fs = require('fs');
    let fileContent = fs.readFileSync("cypress/fixtures/CatalogFiles/Format-InvalidExpirationYear.csv", 'utf-8');
    const modifiedContent = UploadUtils.updateCSVContentCatalog(fileContent);
    fs.writeFileSync("cypress/fixtures/CatalogFiles/Format-InvalidExpirationYear.csv", modifiedContent);
    
    // Pre-upload catalog count
    preUploadCount = await uploadInstance.preUploadCatalog();
    console.log(preUploadCount);
    
    await uploadInstance.upload("cypress/fixtures/CatalogFiles/Format-InvalidExpirationYear.csv", 1);
    await uploadInstance.uplaodcatalogValid(0);
    
    // Verify format error
    await uploadInstance.catalogFormatError();
    
    // Verify confirmation page counts
    await uploadInstance.confirmationPageCountCatalog("2", "+ 2 new active courses", "3" + "1 format errors", "3 rows were successfully transformed", "+ 2 new courses");
    
    // Verify error message in CSV
    await uploadInstance.catalogreadErrorCSVFile("Invalid Course Effective Year Month. Should be in YYYY-MM format ", 0);
    
    // Post upload
    await uploadInstance.postUpload();
    postUploadCount = await uploadInstance.postUploadCountCatalog();
    console.log(postUploadCount);
    expect(parseInt(postUploadCount)).toEqual(parseInt(preUploadCount) + fileRulecount);
  });

  test.skip("Uploads catalog add function with incorrect institution error", async () => {
    let fileRulecount = 2;
    
    // Read and modify CSV content
    const fs = require('fs');
    let fileContent = fs.readFileSync("cypress/fixtures/CatalogFiles/IncorrectInstitution.csv", 'utf-8');
    const modifiedContent = UploadUtils.updateCSVContentCatalog(fileContent);
    fs.writeFileSync("cypress/fixtures/CatalogFiles/IncorrectInstitution.csv", modifiedContent);
    
    // Pre-upload catalog count
    preUploadCount = await uploadInstance.preUploadCatalog();
    console.log(preUploadCount);
    
    await uploadInstance.upload("cypress/fixtures/CatalogFiles/IncorrectInstitution.csv", 1);
    await uploadInstance.uplaodcatalogValid(0);
    
    // Verify critical error
    await uploadInstance.catalogCriticalError();
    
    // Verify confirmation page counts
    await uploadInstance.confirmationPageCountCatalog("2", "+ 2 new active courses", "3" + "1 critical errors", "3 rows were successfully transformed", "+ 2 new courses");
    
    // Verify error message in CSV
    await uploadInstance.catalogreadErrorCSVFile("Invalid Course Effective Year Month. Should be in YYYY-MM format ", 0);
    
    // Post upload
    await uploadInstance.postUpload();
    await page.locator('.ring-red-500 > .opacity-0').click();
    postUploadCount = await uploadInstance.postUploadCountCatalog();
    console.log(postUploadCount);
    expect(parseInt(postUploadCount)).toEqual(parseInt(preUploadCount) + fileRulecount);
  });

  test.skip("Uploads catalog add function with missing course credit max value error", async () => {
    let fileRulecount = 2;
    
    // Read and modify CSV content
    const fs = require('fs');
    let fileContent = fs.readFileSync("cypress/fixtures/CatalogFiles/MissingCourseCreditMaxValue.csv", 'utf-8');
    const modifiedContent = UploadUtils.updateCSVContentCatalog(fileContent);
    fs.writeFileSync("cypress/fixtures/CatalogFiles/MissingCourseCreditMaxValue.csv", modifiedContent);
    
    // Pre-upload catalog count
    preUploadCount = await uploadInstance.preUploadCatalog();
    console.log(preUploadCount);
    
    await uploadInstance.upload("cypress/fixtures/CatalogFiles/MissingCourseCreditMaxValue.csv", 1);
    await uploadInstance.uplaodcatalogValid(0);
    
    // Verify critical error
    await uploadInstance.catalogCriticalError();
    
    // Verify confirmation page counts
    await uploadInstance.confirmationPageCountCatalog("2", "+ 2 new active courses", "3" + "1 critical errors 1 format errors", "3 rows were successfully transformed", "+ 2 new courses");
    
    // Verify error message in CSV
    await uploadInstance.catalogreadErrorCSVFile("Invalid Course Effective Year Month. Should be in YYYY-MM format ", 0);
  });

  test.skip("Uploads catalog add function with missing course credit min value error", async () => {
    let fileRulecount = 2;
    
    // Read and modify CSV content
    const fs = require('fs');
    let fileContent = fs.readFileSync("cypress/fixtures/CatalogFiles/MissingCourseCreditMinValue.csv", 'utf-8');
    const modifiedContent = UploadUtils.updateCSVContentCatalog(fileContent);
    fs.writeFileSync("cypress/fixtures/CatalogFiles/MissingCourseCreditMinValue.csv", modifiedContent);
    
    // Pre-upload catalog count
    preUploadCount = await uploadInstance.preUploadCatalog();
    console.log(preUploadCount);
    
    await uploadInstance.upload("cypress/fixtures/CatalogFiles/MissingCourseCreditMinValue.csv", 1);
    await uploadInstance.uplaodcatalogValid(0);
    
    // Verify critical error
    await uploadInstance.catalogCriticalError();
    
    // Verify confirmation page counts
    await uploadInstance.confirmationPageCountCatalog("2", "+ 2 new active courses", "3" + "1 critical errors 1 format errors", "3 rows were successfully transformed", "+ 2 new courses");
    
    // Verify error message in CSV
    await uploadInstance.catalogreadErrorCSVFile("Invalid Course Effective Year Month. Should be in YYYY-MM format ", 0);
    
    await page.locator('.ring-red-500 > .opacity-0').click();
    postUploadCount = await uploadInstance.postUploadCountCatalog();
    console.log(postUploadCount);
    expect(parseInt(postUploadCount)).toEqual(parseInt(preUploadCount) + fileRulecount);
  });

  test.skip("Uploads catalog add function with missing course long title error", async () => {
    let fileRulecount = 2;
    
    // Read and modify CSV content
    const fs = require('fs');
    let fileContent = fs.readFileSync("cypress/fixtures/CatalogFiles/MissingCourseLongTitle.csv", 'utf-8');
    const modifiedContent = UploadUtils.updateCSVContentCatalog(fileContent);
    fs.writeFileSync("cypress/fixtures/CatalogFiles/MissingCourseLongTitle.csv", modifiedContent);
    
    // Pre-upload catalog count
    preUploadCount = await uploadInstance.preUploadCatalog();
    console.log(preUploadCount);
    
    await uploadInstance.upload("cypress/fixtures/CatalogFiles/MissingCourseLongTitle.csv", 1);
    await uploadInstance.uplaodcatalogValid(0);
    
    // Verify critical error
    await uploadInstance.catalogCriticalError();
    
    // Verify confirmation page counts
    await uploadInstance.confirmationPageCountCatalog("2", "+ 2 new active courses", "3" + "1 critical errors", "3 rows were successfully transformed", "+ 2 new courses");
    
    // Verify error message in CSV
    await uploadInstance.catalogreadErrorCSVFile("Invalid Course Effective Year Month. Should be in YYYY-MM format ", 0);
    
    // Post upload
    await uploadInstance.postUpload();
    await page.locator('.ring-red-500 > .opacity-0').click();
    postUploadCount = await uploadInstance.postUploadCountCatalog();
    console.log(postUploadCount);
    expect(parseInt(postUploadCount)).toEqual(parseInt(preUploadCount) + fileRulecount);
  });

  test.skip("Uploads catalog update function new courses without any errors", async () => {
    let fileRulecount = 3;
    
    // Read and modify CSV content
    const fs = require('fs');
    let fileContent = fs.readFileSync("test_data/CatalogFiles/DuplicateCourseIdentifier.csv", 'utf-8');
    const modifiedContent = UploadUtils.updateCSVContentCatalog(fileContent);
    fs.writeFileSync("test_data/CatalogFiles/DuplicateCourseIdentifier.csv", modifiedContent);
    
    // Pre-upload catalog count
    preUploadCount = await uploadInstance.preUploadCatalog();
    console.log(preUploadCount);
    
    await uploadInstance.upload("test_data/CatalogFiles/DuplicateCourseIdentifier.csv", 1);
    await uploadInstance.uplaodcatalogValid(1);
    
    // Verify no errors
    await expect(page.getByText('Errors')).not.toBeVisible();
    await expect(page.getByText('Download csv file')).not.toBeVisible();
    
    // Verify confirmation page counts
    await uploadInstance.confirmationPageCountCatalog("3", "+ 3 new active courses", "3", "3 rows were successfully transformed", "+ 3 new courses");
    
    // Post upload
    await uploadInstance.postUpload();
    await page.locator('.ring-red-500 > .opacity-0').click();
    postUploadCount = await uploadInstance.postUploadCountCatalog();
    console.log(postUploadCount);
    expect(parseInt(postUploadCount)).toEqual(parseInt(preUploadCount) + fileRulecount);
  });

  test.skip("Uploads catalog replace function new courses without any errors", async () => {
    let fileRulecount = 3;
    
    // Read and modify CSV content
    const fs = require('fs');
    let fileContent = fs.readFileSync("test_data/CatalogFiles/DuplicateCourseIdentifier.csv", 'utf-8');
    const modifiedContent = UploadUtils.updateCSVContentCatalog(fileContent);
    fs.writeFileSync("test_data/CatalogFiles/DuplicateCourseIdentifier.csv", modifiedContent);
    
    // Pre-upload catalog count
    preUploadCount = await uploadInstance.preUploadCatalog();
    console.log(preUploadCount);
    
    await uploadInstance.upload("test_data/CatalogFiles/DuplicateCourseIdentifier.csv", 1);
    await uploadInstance.uplaodcatalogValid(2);
    
    // Verify no errors
    await expect(page.getByText('Errors')).not.toBeVisible();
    await expect(page.getByText('Download csv file')).not.toBeVisible();
    
    // Verify confirmation page counts
    await uploadInstance.confirmationPageCountCatalog("3", "+ 3 new active courses", "3", "3 rows were successfully transformed", "+ 3 new courses");
    
    // Post upload
    await uploadInstance.postUpload();
    await page.locator('.ring-red-500 > .opacity-0').click();
    postUploadCount = await uploadInstance.postUploadCountCatalog();
    console.log(postUploadCount);
    expect(parseInt(postUploadCount)).toEqual(3);
  });
