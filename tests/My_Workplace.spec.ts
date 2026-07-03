import { test, expect } from '../fixtures/test';

test.describe('MyWorkplace Filters', () => {
    const instAdminEmail = process.env.INST_ADMIN_EMAIL ?? '';
    const instAdminPassword = process.env.INST_ADMIN_PASSWORD ?? '';

    test.beforeEach(async ({ page, loginPage }) => {
        await page.goto('');
        await loginPage.visit();
        await loginPage.loginUser(instAdminEmail, instAdminPassword);
    });

    test.skip('TC1. navigates to myWorkplace', async ({ filtersPage }) => {
        await filtersPage.navigateToMyWorkplace();
    });

    test.skip('TC2. navigates to IPEDS', async ({ filtersPage }) => {
        await filtersPage.navigateToMyWorkplace();
        await filtersPage.navigateToIPEDS();
    });

    test.skip('filters the ipeds page', async ({ filtersPage }) => {
        await filtersPage.navigateToMyWorkplace();
        await filtersPage.navigateToIPEDS();
        await filtersPage.ipedsFilters();
    });

    test.skip('navigates to district', async ({ filtersPage }) => {
        await filtersPage.navigateToMyWorkplace();
        await filtersPage.navigateToDistrict();
    });

    test.skip('filters the district page', async ({ filtersPage }) => {
        await filtersPage.navigateToMyWorkplace();
        await filtersPage.navigateToDistrict();
        await filtersPage.ipedsFilters();
    });
});
