import { test, expect } from '../fixtures/test';
import fs from 'fs';

// Note: Original uses csvUtils.js (UploadUtils) and logindata.json
// TODO: Create helpers/csv-utils.ts when needed
let UploadUtils: any;
try {
    UploadUtils = require('../base_classes/csvUtils.js');
} catch {
    UploadUtils = { updateCSVContentCatalog: (content: string) => content };
}

let creds: Record<string, string>;
try {
    creds = require('../test_data/logindata.json');
} catch {
    creds = {
        nevadaadmin: process.env.INST_ADMIN_EMAIL ?? '',
        password: process.env.INST_ADMIN_PASSWORD ?? '',
    };
}

const filePath = 'test_data/uploadRules/182290_FileWithNoError4copy.csv';

test.describe('Upload Course Catalog', () => {

    test.beforeEach(async ({ page, loginPage }) => {
        await page.goto('');
        await loginPage.visit();
    });

    test('TC_01: Upload Catalog file with incorrect format (non CSV file)', async ({ loginPage, uploadPage }) => {
        await loginPage.loginUser(creds.nevadaadmin, creds.password);
        await uploadPage.upload('test_data/uploadRules/182290_NonCSVFile.xlsx', 1);
        await expect(uploadPage.page.getByText('Unsupported file. Only csv files are supported.')).toBeVisible();
    });

    test('TC_02: Upload Catalog file with spaces in the file name', async ({ loginPage, uploadPage }) => {
        await loginPage.loginUser(creds.nevadaadmin, creds.password);
        await uploadPage.upload('test_data/uploadRules/182290_This File has Spaces.CSV', 1);
        await expect(uploadPage.page.getByText('Please rename the file without spaces and try again.')).toBeVisible();
    });

    test('TC_03: Attempt to press on submit without checking the acknowledgement checkbox', async ({ loginPage, uploadPage }) => {
        await loginPage.loginUser(creds.nevadaadmin, creds.password);
        await uploadPage.upload(filePath, 1);
        await uploadPage.uploadCatalogValid(0);
        await expect(uploadPage.page.getByText('Submit')).toBeDisabled();
    });

    test('TC_04: Uploads a catalog file and click cancel on the upload summary page', async ({ loginPage, uploadPage }) => {
        await loginPage.loginUser(creds.nevadaadmin, creds.password);
        await uploadPage.upload(filePath, 1);
        await uploadPage.uploadCatalogValid(0);
        await uploadPage.page.getByText('Cancel').click();
        await expect(uploadPage.page).toHaveURL(/\/my-workspace\/inst-admin\/summary/);
    });

    test.skip('TC_05: Uploads catalog add function with no errors', async ({ loginPage, uploadPage }) => {
        await loginPage.loginUser(creds.nevadaadmin, creds.password);
        const fileContent = fs.readFileSync('playwright_migration/test_data/CatalogFiles/DuplicateCourseIdentifier.csv', 'utf-8');
        const modifiedContent = UploadUtils.updateCSVContentCatalog(fileContent);
        fs.writeFileSync('playwright_migration/test_data/CatalogFiles/DuplicateCourseIdentifier.csv', modifiedContent);

        const preUploadCount = await uploadPage.preUploadCatalog();
        await uploadPage.upload('playwright_migration/test_data/CatalogFiles/DuplicateCourseIdentifier.csv', 1);
        await uploadPage.uploadCatalogValid(0);

        await expect(uploadPage.page.getByText('Errors')).not.toBeVisible();
        await expect(uploadPage.page.getByText('Download csv file')).not.toBeVisible();

        await uploadPage.confirmationPageCountCatalog('3', '+ 3 new active courses', '3', '3 rows were successfully transformed', '+ 3 new courses');
        await uploadPage.postUpload();

        const postUploadCount = await uploadPage.postUploadCountCatalog();
        expect(postUploadCount).toEqual(preUploadCount + 3);
    });

    test.skip('TC_06: Uploads catalog add function with Invalid active course error', async ({ loginPage, uploadPage }) => {
        await loginPage.loginUser(creds.nevadaadmin, creds.password);
        // TODO: implement when catalog error test data is available
    });

    test.skip('TC_07: Uploads catalog update function new courses without any errors', async ({ loginPage, uploadPage }) => {
        await loginPage.loginUser(creds.nevadaadmin, creds.password);
        // TODO: implement when update catalog test is ready
    });

    test.skip('TC_08: Uploads catalog replace function new courses without any errors', async ({ loginPage, uploadPage }) => {
        await loginPage.loginUser(creds.nevadaadmin, creds.password);
        // TODO: implement when replace catalog test is ready
    });
});
