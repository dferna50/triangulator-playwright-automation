const { test, expect } = require('@playwright/test');
const {loginPage} = require('../base_classes/login.js');
const { Upload } = require('../base_classes/upload.js');
const UploadUtils = require('../base_classes/csvUtils.js');
const creds = require('../test_data/logindata.json');
const fs = require('fs').promises;

// Define file paths
const filePath = 'test_data/uploadRules/182290_FileWithNoError.csv';
//const filePath2 = 'test_data/uploadRules/182290_FileWithNoError4.csv';

// Setup test context
let loginPageInstance, uploadInstance;
let  criticalError, preUploadCount, postUploadCount;

// Setup before each test
test.beforeEach(async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  uploadInstance = new Upload(page);
  loginPageInstance = new loginPage(page);
  await page.goto('');

});


test('TC_01: Upload rule file with incorrect format(non CSV file)', async () => {
 // test.setTimeout(120000);
  await loginPageInstance.loginuser(creds.californiaoneadmin, creds.password);
  await uploadInstance.upload('test_data/uploadRules/182290_NonCSVFile.xlsx', 1);
  await expect(uploadInstance.page.getByText("Unsupported file. Only csv files are supported.")).toBeVisible();
});

test('TC_02: Upload rule file with spaces in the file name', async () => {
 // test.setTimeout(120000);
  await loginPageInstance.loginuser(creds.rutgersadmin, creds.passwordnevadaqaenv);
  await uploadInstance.upload('test_data/uploadRules/182290_This File has Spaces.CSV', 0);
  await expect(uploadInstance.page.getByText("Please rename the file without spaces and try again.")).toBeVisible();
});

test('TC_03: Attempt to press on submit without checking the acknowledgement checkbox', async () => {
 // test.setTimeout(120000);
  await loginPageInstance.loginuser(creds.pimaadmin, creds.password);
  await uploadInstance.upload("test_data/uploadRules/182290_FileWithNoError4copy.csv", 0);
  await uploadInstance.uploadValid(0);
  
  await expect(uploadInstance.page.getByText('Submit')).toBeDisabled();
});

test('TC_04: Uploads a file and click cancel on the upload summary page', async () =>  {
 // test.setTimeout(120000);
  await loginPageInstance.loginuser(creds.nebraskaadmin, creds.passwordnevadaqaenv);
  await uploadInstance.upload("test_data/uploadRules/182290_FileWithNoError4copy.csv", 0);
  await uploadInstance.uploadValid(0);
  
  await uploadInstance.page.getByText('Cancel').click();
  await expect(uploadInstance.page).toHaveURL(/\/my-workspace\/inst-admin\/summary/);
});

test.skip('TC_05: Uploads rules add function with no errors', async () => {
  await loginPageInstance.loginuser(creds.nevadaadmin, creds.password);
 // test.setTimeout(120000);

  let fileRulecount = 7;
  
  // Read and update file content
  const fileContent = await fs.readFile(filePath, { encoding: 'utf-8' });
  const modifiedContent = UploadUtils.updateCSVContent(fileContent);
  await fs.writeFile(filePath, modifiedContent);
  
  // Get pre-upload count
  preUploadCount = await uploadInstance.preUpload();
  console.log(`Pre-upload count: ${preUploadCount}`);
  
  // Upload file
  await uploadInstance.upload(filePath, 0);
  await uploadInstance.uploadValid(0);
  
  // Verify no errors
  await expect(uploadInstance.page.getByText('Errors', {exact: true})).toBeHidden()
  await expect(uploadInstance.page.getByText('Download csv file')).toBeHidden()
  
  // Verify confirmation page counts
  await uploadInstance.confirmationPageCount(
    "7", "+ 7 Rules in file", "+ 7 Rules loaded from file", 
    "3", "+ 3 Institutions in file", "+ 3 Institutions loaded from file"
  );
  
  // Post upload verification
  await uploadInstance.postUpload();
  postUploadCount = await uploadInstance.postUploadCount();
  console.log(`Post-upload count: ${postUploadCount}`);
  expect(parseInt(postUploadCount)).toBe(parseInt(preUploadCount) + fileRulecount);
});

test('TC_06: Uploads rules add function with critical error "Missing required columns"', async () => {
  await loginPageInstance.loginuser(creds.aanhaiiadmin, creds.password);

 // test.setTimeout(120000);

  // Read and update file content
  const fileContent = await fs.readFile("test_data/uploadRules/182290_MissingCourseOrder.csv", { encoding: 'utf-8' });
  const modifiedContent = UploadUtils.updateCSVContent(fileContent);
  await fs.writeFile("test_data/uploadRules/182290_MissingCourseOrder.csv", modifiedContent);
  
  // Get pre-upload count
  preUploadCount = await uploadInstance.preUpload();
  
  // Upload file
  await uploadInstance.upload("test_data/uploadRules/182290_MissingCourseOrder.csv", 0);
  await uploadInstance.uploadValid(0);
  
  // Verify critical error
  await uploadInstance.criticalError('- Missing required columns');
  
  // Post upload verification
  await uploadInstance.postUpload();
  await uploadInstance.page.locator('.ring-red-500 > .opacity-0').click();
  postUploadCount = await uploadInstance.postUploadCount();
  expect(parseInt(postUploadCount)).toBe(parseInt(preUploadCount));
});

test('TC_07: Uploads rules add function with error "duplicate rule identifier"', async () => {
 // test.setTimeout(120000);
  await loginPageInstance.loginuser(creds.alvernoadmin, creds.password);

  // Get pre-upload count
  preUploadCount = await uploadInstance.preUpload();
  
  // Upload file
  await uploadInstance.upload("test_data/uploadRules/182290_FileWithNoError4.csv", 0);
  await uploadInstance.uploadValid(0);
  
  // Verify critical error
  await uploadInstance.criticalError("- Duplicate Rule Identifier");
  
  // Read error CSV file
  await uploadInstance.readErrorCSVFile('Duplicate rule identifier', 1);
  
  // Post upload verification
  await uploadInstance.postUpload();
  await uploadInstance.page.locator('.ring-red-500 > .opacity-0').click();
  postUploadCount = await uploadInstance.postUploadCount();
  expect(parseInt(postUploadCount)).toBe(parseInt(preUploadCount));
});

test('TC_08: Uploads rules update function with critical error "Invalid Institution ID"', async () => {
  await loginPageInstance.loginuser(creds.americanriveradmin, creds.password);

 // test.setTimeout(120000);

  // Read and update file content
  const fileContent = await fs.readFile('test_data/uploadRules/182290_CritcalError-InvalidInstitutionId.csv', { encoding: 'utf-8' });
  const modifiedContent = UploadUtils.updateCSVContent(fileContent);
  await fs.writeFile('test_data/uploadRules/182290_CritcalError-InvalidInstitutionId.csv', modifiedContent);
  
  // Get pre-upload count
  preUploadCount = await uploadInstance.preUpload();
  
  // Upload file
  await uploadInstance.upload('test_data/uploadRules/182290_CritcalError-InvalidInstitutionId.csv', 0);
  await uploadInstance.uploadValid(1);
  
  // Verify confirmation page counts
  await uploadInstance.confirmationPageCount(
    "8", "+ 9 Rules in file", "+ 8 Rules loaded from file", 
    "3", "+ 4 Institutions in file", "+ 3 Institutions loaded from file"
  );
  
  // Verify critical error
  await uploadInstance.criticalError("- Invalid institution id");
  
  // Read error CSV file
  await uploadInstance.readErrorCSVFile('Invalid institution ID', 0);
  
  // Post upload verification
  await uploadInstance.postUpload();
  await uploadInstance.page.locator('.ring-red-500 > .opacity-0').click();
  postUploadCount = await uploadInstance.postUploadCount();
  expect(parseInt(postUploadCount)).toBe(parseInt(preUploadCount) + 8);
});

test('TC_09: Uploads rules Replace function with critical error "MissingCourseSubject"', async () => {
 // test.setTimeout(120000);
  await loginPageInstance.loginuser(creds.artadmin, creds.password);


  // Read and update file content
  const fileContent = await fs.readFile('test_data/uploadRules/182290_CriticalError-MissingCourseSubject.csv', { encoding: 'utf-8' });
  const modifiedContent = UploadUtils.updateCSVContent(fileContent);
  await fs.writeFile('test_data/uploadRules/182290_CriticalError-MissingCourseSubject.csv', modifiedContent);
  
  // Get pre-upload count
  //preUploadCount = await uploadInstance.preUpload();
  
  // Upload file
  await uploadInstance.upload('test_data/uploadRules/182290_CriticalError-MissingCourseSubject.csv', 0);
  await uploadInstance.uploadValid(2);
  
  // Verify confirmation page counts
  await uploadInstance.confirmationPageCount(
    "8", "+ 9 Rules in file", "+ 8 Rules loaded from file", 
    "3", "+ 3 Institutions in file", "+ 3 Institutions loaded from file"
  );
  
  // Verify critical error
  await uploadInstance.criticalError("- Missing Course Subject");
  
  // Read error CSV file
  await uploadInstance.readErrorCSVFile('Missing course subject', 0);
  
  // Post upload verification
  await uploadInstance.postUpload();
  await uploadInstance.page.locator('.ring-red-500 > .opacity-0').click();
  postUploadCount = await uploadInstance.postUploadCount();
  expect(parseInt(postUploadCount)).toBe(parseInt(8));
});

test.skip('TC_10: Uploads rules Update function with critical error "MissingCourseNumber"', async () => {
 // test.setTimeout(120000);


  // Read and update file content
  const fileContent = await fs.readFile(uploadFiles.MissingCourseNumber, { encoding: 'utf-8' });
  const modifiedContent = UploadUtils.updateCSVContent(fileContent);
  await fs.writeFile(uploadFiles.MissingCourseNumber, modifiedContent);
  
  // Get pre-upload count
  preUploadCount = await uploadInstance.preUpload();
  
  // Upload file
  await uploadInstance.upload(uploadFiles.MissingCourseNumber, 0);
  await uploadInstance.uploadValid(0);
  
  // Verify confirmation page counts
  await uploadInstance.confirmationPageCount(
    "8", "+ 9 Rules in file", "+ 8 Rules loaded from file", 
    "3", "+ 3 Institutions in file", "+ 3 Institutions loaded from file"
  );
  
  // Verify critical error
  await uploadInstance.criticalError("- Missing Course Number");
  
  // Read error CSV file
  await uploadInstance.readErrorCSVFile('Missing course number', 0);
  
  // Post upload verification
  await uploadInstance.postUpload();
  await uploadInstance.page.locator('.ring-red-500 > .opacity-0').click();
  postUploadCount = await uploadInstance.postUploadCount();
  expect(parseInt(postUploadCount)).toBe(parseInt(preUploadCount) + 8);
});

test.skip('TC_11: Uploads rules add function with critical error "Missing Institution Name"', async () => {
 // test.setTimeout(120000);
  // Read and update file content
  const fileContent = await fs.readFile(uploadFiles.MissingInstitutionName, { encoding: 'utf-8' });
  const modifiedContent = UploadUtils.updateCSVContent(fileContent);
  await fs.writeFile(uploadFiles.MissingInstitutionName, modifiedContent);
  
  // Get pre-upload count
  preUploadCount = await uploadInstance.preUpload();
  
  // Upload file
  await uploadInstance.upload(uploadFiles.MissingInstitutionName, 0);
  await uploadInstance.uploadValid(0);
  
  // Verify confirmation page counts
  await uploadInstance.confirmationPageCount(
    "8", "+ 9 Rules in file", "+ 8 Rules loaded from file", 
    "3", "+ 3 Institutions in file", "+ 3 Institutions loaded from file"
  );
  
  // Verify critical error
  await uploadInstance.criticalError(criticalError.MissingInstitutionName);
  
  // Read error CSV file
  await uploadInstance.readErrorCSVFile('Missing institution name', 0);
  
  // Post upload verification
  await uploadInstance.postUpload();
  await uploadInstance.page.locator('.ring-red-500 > .opacity-0').click();
  postUploadCount = await uploadInstance.postUploadCount();
  expect(parseInt(postUploadCount)).toBe(parseInt(preUploadCount) + 8);
});

test.skip('TC_12: Uploads rules add function with critical error "Missing Rules"', async () => {
 // test.setTimeout(120000);
  // Get pre-upload count
  preUploadCount = await uploadInstance.preUpload();
  
  // Upload file
  await uploadInstance.upload(uploadFiles.MissingRules, 0);
  await uploadInstance.uploadValid(0);
  
  // Verify critical error
  await uploadInstance.criticalError(criticalError.MissingRules);
  
  // Read error CSV file
  await uploadInstance.readErrorCSVFile(undefined, 0);
  
  // Post upload verification
  await uploadInstance.postUpload();
  await uploadInstance.page.locator('.ring-red-500 > .opacity-0').click();
  postUploadCount = await uploadInstance.postUploadCount();
  expect(parseInt(postUploadCount)).toBe(parseInt(preUploadCount));
});

test.skip('TC_13: Uploads rules add function with critical error "Missing Source Course"', async () => {
 // test.setTimeout(120000);
  // Read and update file content
  const fileContent = await fs.readFile(uploadFiles.MissingSourceCourse, { encoding: 'utf-8' });
  const modifiedContent = UploadUtils.updateCSVContent(fileContent);
  await fs.writeFile(uploadFiles.MissingSourceCourse, modifiedContent);
  
  // Upload file
  await uploadInstance.upload(uploadFiles.MissingSourceCourse, 0);
  await uploadInstance.uploadValid(0);
  
  // Verify confirmation page counts
  await uploadInstance.confirmationPageCount(
    "8", "+ 9 Rules in file", "+ 8 Rules loaded from file", 
    "3", "+ 3 Institutions in file", "+ 3 Institutions loaded from file"
  );
  
  // Verify critical error
  await uploadInstance.criticalError(criticalError.MissingSourceCourse);
  
  // Read error CSV file
  await uploadInstance.readErrorCSVFile('Missing source or target course', 0);
  
  // Post upload verification
  await uploadInstance.postUpload();
  await uploadInstance.page.locator('.ring-red-500 > .opacity-0').click();
  postUploadCount = await uploadInstance.postUploadCount();
  expect(parseInt(postUploadCount)).toBe(parseInt(preUploadCount) + 8);
});

test.skip('TC_14: Uploads rules add function with critical error "Missing Target Course"', async () => {
 // test.setTimeout(120000);
  // Read and update file content
  const fileContent = await fs.readFile(uploadFiles.MissingTargetCourse, { encoding: 'utf-8' });
  const modifiedContent = UploadUtils.updateCSVContent(fileContent);
  await fs.writeFile(uploadFiles.MissingTargetCourse, modifiedContent);
  
  // Get pre-upload count
  preUploadCount = await uploadInstance.preUpload();
  
  // Upload file
  await uploadInstance.upload(uploadFiles.MissingTargetCourse, 0);
  await uploadInstance.uploadValid(0);
  
  // Verify confirmation page counts
  await uploadInstance.confirmationPageCount(
    "8", "+ 9 Rules in file", "+ 8 Rules loaded from file", 
    "3", "+ 3 Institutions in file", "+ 3 Institutions loaded from file"
  );
  
  // Verify critical error
  await uploadInstance.criticalError(criticalError.MissingTargetCourse);
  
  // Read error CSV file
  await uploadInstance.readErrorCSVFile('Missing source or target course', 0);
  
  // Post upload verification
  await uploadInstance.postUpload();
  await uploadInstance.page.locator('.ring-red-500 > .opacity-0').click();
  postUploadCount = await uploadInstance.postUploadCount();
  expect(parseInt(postUploadCount)).toBe(parseInt(preUploadCount) + 8);
});

test.skip('TC_15: Uploads rules add function with critical error "Wrong Source Identifier"', async () => {
 // test.setTimeout(120000);
  // Read and update file content
  const fileContent = await fs.readFile(uploadFiles.WrongSourceIdentifier, { encoding: 'utf-8' });
  const modifiedContent = UploadUtils.updateCSVContent(fileContent);
  await fs.writeFile(uploadFiles.WrongSourceIdentifier, modifiedContent);
  
  // Get pre-upload count
  preUploadCount = await uploadInstance.preUpload();
  
  // Upload file
  await uploadInstance.upload(uploadFiles.WrongSourceIdentifier, 0);
  await uploadInstance.uploadValid(0);
  
  // Verify confirmation page counts
  await uploadInstance.confirmationPageCount(
    "8", "+ 9 Rules in file", "+ 8 Rules loaded from file", 
    "4", "+ 5 Institutions in file", "+ 4 Institutions loaded from file"
  );
  
  // Verify critical error
  await uploadInstance.criticalError(criticalError.WrongSourceIdentifier, 0);
  
  // Read error CSV file
  await uploadInstance.readErrorCSVFile('Invalid institution ID', 0);
  
  // Post upload verification
  await uploadInstance.postUpload();
  await uploadInstance.page.locator('.ring-red-500 > .opacity-0').click();
  postUploadCount = await uploadInstance.postUploadCount();
  expect(parseInt(postUploadCount)).toBe(parseInt(preUploadCount) + 8);
});

test.skip('TC_16: Uploads rules add function with critical error "Wrong Target Identifier"', async () => {
 // test.setTimeout(120000);
  // Read and update file content
  const fileContent = await fs.readFile(uploadFiles.WrongTargetIdentifier, { encoding: 'utf-8' });
  const modifiedContent = UploadUtils.updateCSVContent(fileContent);
  await fs.writeFile(uploadFiles.WrongTargetIdentifier, modifiedContent);
  
  // Get pre-upload count
  preUploadCount = await uploadInstance.preUpload();
  
  // Upload file
  await uploadInstance.upload(uploadFiles.WrongTargetIdentifier, 0);
  await uploadInstance.uploadValid(0);
  
  // Verify confirmation page counts
  await uploadInstance.confirmationPageCount(
    "8", "+ 9 Rules in file", "+ 8 Rules loaded from file", 
    "3", "+ 3 Institutions in file", "+ 3 Institutions loaded from file"
  );
  
  // Verify critical error
  await uploadInstance.criticalError(criticalError.WrongTargetIdentifier);
  
  // Read error CSV file
  await uploadInstance.readErrorCSVFile('Wrong target institution', 0);
  
  // Post upload verification
  await uploadInstance.postUpload();
  await uploadInstance.page.locator('.ring-red-500 > .opacity-0').click();
  postUploadCount = await uploadInstance.postUploadCount();
  expect(parseInt(postUploadCount)).toBe(parseInt(preUploadCount) + 8);
});
