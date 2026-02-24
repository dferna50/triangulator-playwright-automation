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
        await loginPage.loginUser(creds.californiaoneadmin, creds.password);
        await uploadPage.upload('test_data/uploadRules/182290_NonCSVFile.xlsx', 1);
        await expect(uploadPage.page.getByText('Unsupported file. Only csv files are supported.')).toBeVisible();
    });

    test('TC_02: Upload rule file with spaces in the file name', async ({ loginPage, uploadPage }) => {
        await loginPage.loginUser(creds.rutgersadmin, creds.passwordnevadaqaenv);
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
        await loginPage.loginUser(creds.nebraskaadmin, creds.passwordnevadaqaenv);
        await uploadPage.upload('test_data/uploadRules/182290_FileWithNoError4copy.csv', 0);
        await uploadPage.uploadValid(0);
        await uploadPage.page.getByText('Cancel').click();
        await expect(uploadPage.page).toHaveURL(/\/my-workspace\/inst-admin\/summary/);
    });

    test.skip('TC_05: Uploads rules add function with no errors', async ({ loginPage, uploadPage }) => {
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

    test('TC_06: Uploads rules add function with critical error "Missing required columns"', async ({ loginPage, uploadPage }) => {
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

    test('TC_07: Uploads rules add function with error "duplicate rule identifier"', async ({ loginPage, uploadPage }) => {
        await loginPage.loginUser(creds.alvernoadmin, creds.password);

        const preUploadCount = await uploadPage.preUpload();
        await uploadPage.upload('test_data/uploadRules/182290_FileWithNoError4.csv', 0);
        await uploadPage.uploadValid(0);

        await uploadPage.criticalError('- Duplicate Rule Identifier');
        await uploadPage.readErrorCSVFile('Duplicate rule identifier', 1);

        await uploadPage.postUpload();
        await uploadPage.page.locator('.ring-red-500 > .opacity-0').click();
        const postUploadCount = await uploadPage.postUploadCount();
        expect(postUploadCount).toBe(preUploadCount);
    });

    test('TC_08: Uploads rules update function with critical error "Invalid Institution ID"', async ({ loginPage, uploadPage }) => {
        await loginPage.loginUser(creds.americanriveradmin, creds.password);

        const fileContent = await fs.readFile('test_data/uploadRules/182290_CritcalError-InvalidInstitutionId.csv', { encoding: 'utf-8' });
        const modifiedContent = UploadUtils.updateCSVContent(fileContent);
        await fs.writeFile('test_data/uploadRules/182290_CritcalError-InvalidInstitutionId.csv', modifiedContent);

        const preUploadCount = await uploadPage.preUpload();
        await uploadPage.upload('test_data/uploadRules/182290_CritcalError-InvalidInstitutionId.csv', 0);
        await uploadPage.uploadValid(1);

        await uploadPage.confirmationPageCount(
            '8', '+ 9 Rules in file', '+ 8 Rules loaded from file',
            '3', '+ 4 Institutions in file', '+ 3 Institutions loaded from file',
        );

        await uploadPage.criticalError('- Invalid institution id');
        await uploadPage.readErrorCSVFile('Invalid institution ID', 0);

        await uploadPage.postUpload();
        await uploadPage.page.locator('.ring-red-500 > .opacity-0').click();
        const postUploadCount = await uploadPage.postUploadCount();
        expect(postUploadCount).toBe(preUploadCount + 8);
    });

    test('TC_09: Uploads rules Replace function with critical error "MissingCourseSubject"', async ({ loginPage, uploadPage }) => {
        await loginPage.loginUser(creds.artadmin, creds.password);

        const fileContent = await fs.readFile('test_data/uploadRules/182290_CriticalError-MissingCourseSubject.csv', { encoding: 'utf-8' });
        const modifiedContent = UploadUtils.updateCSVContent(fileContent);
        await fs.writeFile('test_data/uploadRules/182290_CriticalError-MissingCourseSubject.csv', modifiedContent);

        await uploadPage.upload('test_data/uploadRules/182290_CriticalError-MissingCourseSubject.csv', 0);
        await uploadPage.uploadValid(2);

        await uploadPage.confirmationPageCount(
            '8', '+ 9 Rules in file', '+ 8 Rules loaded from file',
            '3', '+ 3 Institutions in file', '+ 3 Institutions loaded from file',
        );

        await uploadPage.criticalError('- Missing Course Subject');
        await uploadPage.readErrorCSVFile('Missing course subject', 0);

        await uploadPage.postUpload();
        await uploadPage.page.locator('.ring-red-500 > .opacity-0').click();
        const postUploadCount = await uploadPage.postUploadCount();
        expect(postUploadCount).toBe(8);
    });

    test.skip('TC_10: Uploads rules Update function with critical error "MissingCourseNumber"', async () => {
        // TODO: Requires uploadFiles fixture data not yet migrated
    });

    test.skip('TC_11: Uploads rules add function with critical error "Missing Institution Name"', async () => {
        // TODO: Requires uploadFiles fixture data not yet migrated
    });

    test.skip('TC_12: Uploads rules add function with critical error "Missing Rules"', async () => {
        // TODO: Requires uploadFiles fixture data not yet migrated
    });

    test.skip('TC_13: Uploads rules add function with critical error "Missing Source Course"', async () => {
        // TODO: Requires uploadFiles fixture data not yet migrated
    });

    test.skip('TC_14: Uploads rules add function with critical error "Missing Target Course"', async () => {
        // TODO: Requires uploadFiles fixture data not yet migrated
    });

    test.skip('TC_15: Uploads rules add function with critical error "Wrong Source Identifier"', async () => {
        // TODO: Requires uploadFiles fixture data not yet migrated
    });

    test.skip('TC_16: Uploads rules add function with critical error "Wrong Target Identifier"', async () => {
        // TODO: Requires uploadFiles fixture data not yet migrated
    });
});
