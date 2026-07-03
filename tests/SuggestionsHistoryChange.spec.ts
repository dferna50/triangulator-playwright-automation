import { test, expect } from '../fixtures/test';

test.describe('Suggestion Page - History Changes', () => {
    const instAdminEmail = process.env.INST_ADMIN_EMAIL ?? '';
    const instAdminPassword = process.env.INST_ADMIN_PASSWORD ?? '';
    const adminEmail = process.env.ADMIN_EMAIL ?? '';
    const adminPassword = process.env.ADMIN_PASSWORD ?? '';

    test.beforeEach(async ({ page, loginPage }) => {
        await page.goto('');
        await loginPage.visit();
    });

    test('Verifies that the user can navigate to Suggestion History tab', async ({ loginPage, suggestionsPage }) => {
        await loginPage.loginUser(instAdminEmail, instAdminPassword);
        await suggestionsPage.navigateToNewSuggestionPage();
        await suggestionsPage.navigateToHistoryTab();
    });

    test('Verifies actions on the history page for Institution Admin', async ({ loginPage, suggestionsPage }) => {
        await loginPage.loginUser(instAdminEmail, instAdminPassword);
        await suggestionsPage.navigateToNewSuggestionPage();
        await suggestionsPage.navigateToHistoryTab();
        await suggestionsPage.historyNewActions();
    });

    test.skip('Verifies actions on the history page for Reviewer role', async ({ loginPage, suggestionsPage }) => {
        // Note: Original used testtriangulatoroo+r123@gmail.com / #TransferTri1
        await loginPage.loginUser('testtriangulator+108@gmail.com', '#TransferTri1');
        await suggestionsPage.navigateToNewSuggestionPage();
        await suggestionsPage.navigateToHistoryTabReviewer();
        await suggestionsPage.historyNewActionsReview();
    });

    test('Verifies actions on the history page for Triangulator Admin', async ({ loginPage, suggestionsPage }) => {
        await loginPage.loginUser(adminEmail, adminPassword);
        await suggestionsPage.navigateToNewSuggestionPage();
        await suggestionsPage.navigateToHistoryTabReviewer();
        await suggestionsPage.historyNewActionsTriadmin();
    });
});
