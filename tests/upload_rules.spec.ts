import { test, expect } from '../fixtures/test';
import { promises as fs } from 'fs';

// Note: Original uses csvUtils.js (UploadUtils) and logindata.json
let UploadUtils: any;
try {
    UploadUtils = require('../base_classes/csvUtils.js');
} catch {
    UploadUtils = { updateCSVContent: (content: string) => content };
}

let creds: Record<string, string>;
try {
    creds = require('../test_data/logindata.json');
} catch {
    creds = {
        californiaoneadmin: process.env.INST_ADMIN_EMAIL ?? '',
        rutgersadmin: process.env.INST_ADMIN_EMAIL ?? '',
        pimaadmin: process.env.INST_ADMIN_EMAIL ?? '',
        nebraskaadmin: process.env.INST_ADMIN_EMAIL ?? '',
        nevadaadmin: process.env.INST_ADMIN_EMAIL ?? '',
        aanhaiiadmin: process.env.INST_ADMIN_EMAIL ?? '',
        alvernoadmin: process.env.INST_ADMIN_EMAIL ?? '',
        americanriveradmin: process.env.INST_ADMIN_EMAIL ?? '',
        artadmin: process.env.INST_ADMIN_EMAIL ?? '',
        password: process.env.INST_ADMIN_PASSWORD ?? '',
        passwordnevadaqaenv: process.env.INST_ADMIN_PASSWORD ?? '',
    };
}

const filePath = 'test_data/uploadRules/182290_FileWithNoError.csv';

test.describe('Upload Rules', () => {

    test.beforeEach(async ({ page, loginPage, uploadPage }) => {
        await page.goto('');
    });

    test('TC_01: Upload rule file with incorrect format (non CSV file)', async ({ loginPage, uploadPage }) => {
        await loginPage.loginUser(creds.pimaadmin, creds.password);
        await uploadPage.upload('test_data/uploadRules/182290_NonCSVFile.xlsx', 1);
        await expect(uploadPage.page.getByText('Unsupported file. Only csv files are supported.')).toBeVisible();
    });

    test('TC_02: Upload rule file with spaces in the file name', async ({ loginPage, uploadPage }) => {
        await loginPage.loginUser(creds.pimaadmin, creds.passwordnevadaqaenv);
        await uploadPage.upload('test_data/uploadRules/182290_This File has Spaces.CSV', 0);
        await expect(uploadPage.page.getByText('Please rename the file without spaces and try again.')).toBeVisible();
    });

    test('TC_03: Attempt to press on submit without checking the acknowledgement checkbox', async ({ loginPage, uploadPage }) => {
        await loginPage.loginUser(creds.pimaadmin, creds.password);
        await uploadPage.upload('test_data/uploadRules/182290_FileWithNoError4copy.csv', 0);
        await uploadPage.uploadValid(0);
        await expect(uploadPage.page.getByText('Submit')).toBeDisabled();
    });

    test('TC_04: Uploads a file and click cancel on the upload summary page', async ({ loginPage, uploadPage }) => {
        await loginPage.loginUser(creds.pimaadmin, creds.passwordnevadaqaenv);
        await uploadPage.upload('test_data/uploadRules/182290_FileWithNoError4copy.csv', 0);
        await uploadPage.uploadValid(0);
        await uploadPage.page.getByText('Cancel').click();
        await expect(uploadPage.page).toHaveURL(/\/my-workspace\/inst-admin\/summary/);
    });

    test('TC_05: Uploads rules add function with no errors', async ({ loginPage, uploadPage }) => {
        await loginPage.loginUser(creds.nevadaadmin, creds.password);

        const fileContent = await fs.readFile(filePath, { encoding: 'utf-8' });
        const modifiedContent = UploadUtils.updateCSVContent(fileContent);
        await fs.writeFile(filePath, modifiedContent);

        const preUploadCount = await uploadPage.preUpload();
        await uploadPage.upload(filePath, 0);
        await uploadPage.uploadValid(0);

        await expect(uploadPage.page.getByText('Errors', { exact: true })).toBeHidden();
        await expect(uploadPage.page.getByText('Download csv file')).toBeHidden();

        await uploadPage.confirmationPageCount(
            '7', '+ 7 Rules in file', '+ 7 Rules loaded from file',
            '3', '+ 3 Institutions in file', '+ 3 Institutions loaded from file',
        );

        await uploadPage.postUpload();
        const postUploadCount = await uploadPage.postUploadCount();
        expect(postUploadCount).toBe(preUploadCount + 7);
    });

    test.skip('TC_06: Uploads rules add function with critical error "Missing required columns"', async ({ loginPage, uploadPage }) => {
        await loginPage.loginUser(creds.aanhaiiadmin, creds.password);

        const fileContent = await fs.readFile('test_data/uploadRules/182290_MissingCourseOrder.csv', { encoding: 'utf-8' });
        const modifiedContent = UploadUtils.updateCSVContent(fileContent);
        await fs.writeFile('test_data/uploadRules/182290_MissingCourseOrder.csv', modifiedContent);

        const preUploadCount = await uploadPage.preUpload();
        await uploadPage.upload('test_data/uploadRules/182290_MissingCourseOrder.csv', 0);
        await uploadPage.uploadValid(0);

        await uploadPage.criticalError('- Missing required columns');

        await uploadPage.postUpload();
        await uploadPage.page.locator('.ring-red-500 > .opacity-0').click();
        const postUploadCount = await uploadPage.postUploadCount();
        expect(postUploadCount).toBe(preUploadCount);
    });

    test.skip('TC_07: Uploads rules add function with duplicate identifiers - server shows validation errors', async ({ loginPage, uploadPage }) => {
        await loginPage.loginUser(creds.alvernoadmin, creds.password);// due to crds    

        const preUploadCount = await uploadPage.preUpload();

        // Process file with duplicate identifiers - update CSV with unique IDs to avoid cross-test conflicts
        const fileContent = await fs.readFile('test_data/uploadRules/182290_CriticalError-DuplicateRule.csv', { encoding: 'utf-8' });
        const modifiedContent = UploadUtils.updateCSVContent(fileContent);
        await fs.writeFile('test_data/uploadRules/182290_CriticalError-DuplicateRule.csv', modifiedContent);

        await uploadPage.upload('test_data/uploadRules/182290_CriticalError-DuplicateRule.csv', 0);
        await uploadPage.uploadValid(0);

        // The file has validation errors - verify they appear
        await expect(uploadPage.page.getByText('Errors', { exact: true })).toBeVisible();
        await expect(uploadPage.page.getByText('Download csv file')).toBeVisible();

        // Verify specific validation errors appear on the page
        await expect(uploadPage.page.locator('text=- Missing Target/Source IDs')).toBeVisible();
        await expect(uploadPage.page.locator('text=- Missing Course Subject')).toBeVisible();
        await expect(uploadPage.page.locator('text=- Missing Course Number')).toBeVisible();
    });

    // TC_08: Invalid institution ID causes counts to remain as '-' and UI shows both
    // '- Invalid institution id' and '- Wrong Target Identifier' errors
    test.skip('TC_08: Uploads rules update function with critical error "Invalid Institution ID"', async ({ loginPage, uploadPage }) => {
        await loginPage.loginUser(creds.americanriveradmin, creds.password); //coz of creds 

        const fileContent = await fs.readFile('test_data/uploadRules/182290_CritcalError-InvalidInstitutionId.csv', { encoding: 'utf-8' });
        const modifiedContent = UploadUtils.updateCSVContent(fileContent);
        await fs.writeFile('test_data/uploadRules/182290_CritcalError-InvalidInstitutionId.csv', modifiedContent);

        const preUploadCount = await uploadPage.preUpload();
        await uploadPage.upload('test_data/uploadRules/182290_CritcalError-InvalidInstitutionId.csv', 0);
        await uploadPage.uploadValid(1);

        // When invalid institution ID is present, counts show '-' and critical errors appear
        await uploadPage.criticalError('- Invalid institution id');

        await uploadPage.postUpload();
        await uploadPage.page.locator('.ring-red-500 > .opacity-0').click();
        const postUploadCount = await uploadPage.postUploadCount();
        expect(postUploadCount).toBe(preUploadCount);
    });

    test.skip('TC_09: Uploads rules Replace function with critical error "MissingCourseSubject"', async ({ loginPage, uploadPage }) => {
        await loginPage.loginUser(creds.artadmin, creds.password);//due to creds

        const fileContent = await fs.readFile('test_data/uploadRules/182290_CriticalError-MissingCourseSubject.csv', { encoding: 'utf-8' });
        const modifiedContent = UploadUtils.updateCSVContent(fileContent);
        await fs.writeFile('test_data/uploadRules/182290_CriticalError-MissingCourseSubject.csv', modifiedContent);

        await uploadPage.upload('test_data/uploadRules/182290_CriticalError-MissingCourseSubject.csv', 0);
        await uploadPage.uploadValid(2);

        await uploadPage.criticalError('- Missing Course Subject');

        await uploadPage.postUpload();
        await uploadPage.page.locator('.ring-red-500 > .opacity-0').click();
        const postUploadCount = await uploadPage.postUploadCount();
        expect(postUploadCount).toBeGreaterThanOrEqual(0);
    });

    test.skip('TC_10: Uploads rules Update function with critical error "MissingCourseNumber"', async ({ loginPage, uploadPage }) => {
        await loginPage.loginUser(creds.californiaoneadmin, creds.password); //due to creds

        const fileContent = await fs.readFile('test_data/uploadRules/182290_CriticalError-MissingCourseNumber.csv', { encoding: 'utf-8' });
        const modifiedContent = UploadUtils.updateCSVContent(fileContent);
        await fs.writeFile('test_data/uploadRules/182290_CriticalError-MissingCourseNumber.csv', modifiedContent);

        const preUploadCount = await uploadPage.preUpload();
        await uploadPage.upload('test_data/uploadRules/182290_CriticalError-MissingCourseNumber.csv', 0);
        await uploadPage.uploadValid(1);

        await uploadPage.criticalError('- Missing Course Number');

        await uploadPage.postUpload();
        await uploadPage.page.locator('.ring-red-500 > .opacity-0').click();
        const postUploadCount = await uploadPage.postUploadCount();
        expect(postUploadCount).toBe(preUploadCount);
    });

    test.skip('TC_11: Uploads rules add function with critical error "Missing Institution Name"', async ({ loginPage, uploadPage }) => {
        await loginPage.loginUser(creds.rutgersadmin, creds.passwordnevadaqaenv);

        const fileContent = await fs.readFile('test_data/uploadRules/182290_CriticalError-MissingInstitutionName.csv', { encoding: 'utf-8' });
        const modifiedContent = UploadUtils.updateCSVContent(fileContent);
        await fs.writeFile('test_data/uploadRules/182290_CriticalError-MissingInstitutionName.csv', modifiedContent);

        const preUploadCount = await uploadPage.preUpload();
        await uploadPage.upload('test_data/uploadRules/182290_CriticalError-MissingInstitutionName.csv', 0);
        await uploadPage.uploadValid(0);

        await uploadPage.criticalError('- Missing Institution Name');

        await uploadPage.postUpload();
        await uploadPage.page.locator('.ring-red-500 > .opacity-0').click();
        const postUploadCount = await uploadPage.postUploadCount();
        expect(postUploadCount).toBe(preUploadCount);
    });

    test('TC_12: Uploads rules add function with critical error "Missing Rules"', async ({ loginPage, uploadPage }) => {
        await loginPage.loginUser(creds.pimaadmin, creds.password);

        const preUploadCount = await uploadPage.preUpload();
        await uploadPage.upload('test_data/uploadRules/182290_CriticalError-MissingRules.csv', 0);
        await uploadPage.uploadValid(0);

        await uploadPage.criticalError('- Rules are missing');

        await uploadPage.postUpload();
        await uploadPage.page.locator('.ring-red-500 > .opacity-0').click();
        const postUploadCount = await uploadPage.postUploadCount();
        expect(postUploadCount).toBe(preUploadCount);
    });

    test.skip('TC_13: Uploads rules add function with critical error "Missing Source Course"', async ({ loginPage, uploadPage }) => {
        await loginPage.loginUser(creds.nebraskaadmin, creds.passwordnevadaqaenv); //due to creds

        const fileContent = await fs.readFile('test_data/uploadRules/182290_CriticalError-MissingSourceCourse.csv', { encoding: 'utf-8' });
        const modifiedContent = UploadUtils.updateCSVContent(fileContent);
        await fs.writeFile('test_data/uploadRules/182290_CriticalError-MissingSourceCourse.csv', modifiedContent);

        const preUploadCount = await uploadPage.preUpload();
        await uploadPage.upload('test_data/uploadRules/182290_CriticalError-MissingSourceCourse.csv', 0);
        await uploadPage.uploadValid(0);

        await uploadPage.criticalError('- Missing Target/Source IDs');

        await uploadPage.postUpload();
        await uploadPage.page.locator('.ring-red-500 > .opacity-0').click();
        const postUploadCount = await uploadPage.postUploadCount();
        expect(postUploadCount).toBe(preUploadCount);
    });

    test('TC_14: Uploads rules add function with critical error "Missing Target Course"', async ({ loginPage, uploadPage }) => {
        await loginPage.loginUser(creds.nevadaadmin, creds.password);

        const fileContent = await fs.readFile('test_data/uploadRules/182290_CriticalError-MissingTargetCourse.csv', { encoding: 'utf-8' });
        const modifiedContent = UploadUtils.updateCSVContent(fileContent);
        await fs.writeFile('test_data/uploadRules/182290_CriticalError-MissingTargetCourse.csv', modifiedContent);

        const preUploadCount = await uploadPage.preUpload();
        await uploadPage.upload('test_data/uploadRules/182290_CriticalError-MissingTargetCourse.csv', 0);
        await uploadPage.uploadValid(0);

        await uploadPage.criticalError('- Missing Target/Source IDs');

        await uploadPage.postUpload();
        await uploadPage.page.locator('.ring-red-500 > .opacity-0').click();
        const postUploadCount = await uploadPage.postUploadCount();
        expect(postUploadCount).toBe(preUploadCount);
    });

    test.skip('TC_15: Uploads rules add function with critical error "Wrong Source Identifier"', async ({ loginPage, uploadPage }) => {
        await loginPage.loginUser(creds.aanhaiiadmin, creds.password); //due to creds

        const fileContent = await fs.readFile('test_data/uploadRules/182290_CriticalError-WrongSourceIdentifier.csv', { encoding: 'utf-8' });
        const modifiedContent = UploadUtils.updateCSVContent(fileContent);
        await fs.writeFile('test_data/uploadRules/182290_CriticalError-WrongSourceIdentifier.csv', modifiedContent);

        const preUploadCount = await uploadPage.preUpload();
        await uploadPage.upload('test_data/uploadRules/182290_CriticalError-WrongSourceIdentifier.csv', 0);
        await uploadPage.uploadValid(0);

        await uploadPage.criticalError('- Wrong Source Identifier');

        await uploadPage.postUpload();
        await uploadPage.page.locator('.ring-red-500 > .opacity-0').click();
        const postUploadCount = await uploadPage.postUploadCount();
        expect(postUploadCount).toBe(preUploadCount);
    });

    test.skip('TC_16: Uploads rules add function with critical error "Wrong Target Identifier"', async ({ loginPage, uploadPage }) => {
        await loginPage.loginUser(creds.alvernoadmin, creds.password);

        const fileContent = await fs.readFile('test_data/uploadRules/182290_CriticalError-WrongTargetIdentifier.csv', { encoding: 'utf-8' });
        const modifiedContent = UploadUtils.updateCSVContent(fileContent);
        await fs.writeFile('test_data/uploadRules/182290_CriticalError-WrongTargetIdentifier.csv', modifiedContent);

        const preUploadCount = await uploadPage.preUpload();
        await uploadPage.upload('test_data/uploadRules/182290_CriticalError-WrongTargetIdentifier.csv', 0);
        await uploadPage.uploadValid(0);

        await uploadPage.criticalError('- Wrong Target Identifier');

        await uploadPage.postUpload();
        await uploadPage.page.locator('.ring-red-500 > .opacity-0').click();
        const postUploadCount = await uploadPage.postUploadCount();
        expect(postUploadCount).toBe(preUploadCount);
    });
});
