import { test, expect } from '../fixtures/test';

test.describe('Bug Tickets', () => {
    const instAdminEmail = process.env.INST_ADMIN_EMAIL ?? '';
    const instAdminPassword = process.env.INST_ADMIN_PASSWORD ?? '';

    test.beforeEach(async ({ page, loginPage }) => {
        await page.goto('');
        await loginPage.visit();
        await loginPage.loginUser(instAdminEmail, instAdminPassword);
    });

    test.skip('1.BUG ID:1608-IPEDS Information Not Visible After User Creation', async ({ filtersPage }) => {
        await filtersPage.ipedFilterSearch1608();
    });

    test('2.BUG ID:1610-Boost results details page changing', async ({ filtersPage }) => {
        await filtersPage.boostRequestLogPartnerInst1610();
    });

    test.skip('3.BUG ID:1550-Common Courses Not Visible in Course Search', async ({ filtersPage }) => {
        await filtersPage.courseByCourseSearchNotVisible1550();
    });

    test('4.BUG ID:1536-Page filter not applied correctly', async ({ filtersPage }) => {
        await filtersPage.pageFiltersOnStateAlign1536();
    });

    test('5.BUG ID-1595-Hide districts for Triangulator admin', async ({ loginPage }) => {
        await loginPage.districtHidesForTriangulatorAdmin();
        await expect(loginPage.page.getByRole('link', { name: 'Districts' })).not.toBeVisible();
    });

    test.skip('6.BUG ID-1553 Boost course details missing', async ({ suggestionsPage }) => {
        await suggestionsPage.courseDetailsCourseDescription1553();
    });

    test('7.BUG ID-1537-Failed to Fetch Error When Requesting Partner Boost', async ({ filtersPage }) => {
        await filtersPage.requestPartnerBoost1537();
    });

    test.skip('8.BUG ID-1619-Suggest list page column and filter removals', async ({ filtersPage }) => {
        await filtersPage.columnFiltersRemoval1619();
    });

    test('9.BUG ID-1562 Issues with next Triangulation', async ({ filtersPage }) => {
        await filtersPage.pastFutureDateComparison1562();
    });

    test('10.Bug ID-1580 IPEDS upload fails', async ({ uploadPage }) => {
        // TODO: IPEDSuploadfails1580 not yet implemented in UploadPage
    });

    test('11.BUG ID-1597 Unable to upload state connect course data', async ({ uploadPage }) => {
        // TODO: Connectcoursecatelog1597 not yet implemented in UploadPage
    });

    test('13.BUG ID-1551 Catalog File Upload Status Stuck in Processing', async ({ uploadPage }) => {
        // TODO: uploadstatus1551 not yet implemented in UploadPage
    });

    test('14.BUG ID-1568 Rules upload process fails', async ({ uploadPage }) => {
        // TODO: Rulesuploadprocessfails1568 not yet implemented in UploadPage
    });

    test.skip('15.BUG ID-1555 Missing data in external search pages', async ({ filtersPage }) => {
        await filtersPage.missingDataSearchPage1555();
    });

    test.skip('16.BUG ID-1564-Issue with submitting find a source course boost request for specific institution', async ({ filtersPage }) => {
        await filtersPage.instAdmin1564();
    });

    test.skip('17.BUG ID-1577-Filter alignment and out of alignment error message', async ({ filtersPage }) => {
        await filtersPage.alignmentErrorMessage1577();
    });

    test('18.BUG ID 1563-Suggestions results not returned from OS find source Boost', async ({ suggestionsPage }) => {
        await suggestionsPage.suggestionsResults1563();
    });

    test('19.BUG ID 1579-suggestions not checking against existing rules', async ({ suggestionsPage }) => {
        await suggestionsPage.suggestion1578();
    });

    test('20.BUG ID-1576-Issue with Sia API returning NaN values', async ({ suggestionsPage }) => {
        await suggestionsPage.noAPIError1576();
    });
});
