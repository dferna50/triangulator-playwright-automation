import { test, expect } from '../fixtures/test';

// Note: Original uses logindata.json credentials (creds.nevadaadmin)
// In TS version, use env vars or import the JSON directly
let creds: { nevadaadmin: string; password: string };
try {
    creds = require('../test_data/logindata.json');
} catch {
    creds = {
        nevadaadmin: process.env.INST_ADMIN_EMAIL ?? '',
        password: process.env.INST_ADMIN_PASSWORD ?? '',
    };
}

test.describe('Suggestions', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('');
    });

    test('Verifies that the user can navigate to new suggestion tab', async ({ loginPage, suggestionsPage }) => {
        await loginPage.loginUser(creds.nevadaadmin, creds.password);
        await suggestionsPage.navigateToNewSuggestionPage();
    });

    test('Verifies that the user can navigate to assigned suggestion tab', async ({ loginPage, suggestionsPage }) => {
        await loginPage.loginUser(creds.nevadaadmin, creds.password);
        await suggestionsPage.navigateToNewSuggestionPage();
        await suggestionsPage.navigateToAssignedPage();
    });

    test('Verifies that the user can navigate to other assigned suggestion tab', async ({ loginPage, suggestionsPage }) => {
        await loginPage.loginUser(creds.nevadaadmin, creds.password);
        await suggestionsPage.navigateToNewSuggestionPage();
        await suggestionsPage.navigateToAssignedPage();
        await suggestionsPage.navigateToOtherAssignedSuggestions();
    });

    test('Verifies that the user can navigate to Suggestion History tab', async ({ loginPage, suggestionsPage }) => {
        await loginPage.loginUser(creds.nevadaadmin, creds.password);
        await suggestionsPage.navigateToNewSuggestionPage();
        await suggestionsPage.navigateToHistoryTab();
    });

    test('Verifies that the user can sort A-Z for all columns in the new suggestions tab', async ({ loginPage, suggestionsPage }) => {
        await loginPage.loginUser(creds.nevadaadmin, creds.password);
        await suggestionsPage.navigateToNewSuggestionPage();
        await suggestionsPage.newSuggestionSorting(1);
    });

    test('Verifies that the user can sort A-Z for all columns in the assigned suggestion tab', async ({ loginPage, suggestionsPage }) => {
        await loginPage.loginUser(creds.nevadaadmin, creds.password);
        await suggestionsPage.navigateToNewSuggestionPage();
        await suggestionsPage.navigateToAssignedPage();
        await suggestionsPage.newSuggestionSorting(1);
    });

    test('Verifies that the user can sort A-Z for all columns in the suggestion History tab', async ({ loginPage, suggestionsPage }) => {
        await loginPage.loginUser(creds.nevadaadmin, creds.password);
        await suggestionsPage.navigateToNewSuggestionPage();
        await suggestionsPage.navigateToHistoryTab();
        await suggestionsPage.historySuggestionSorting(1);
    });

    test('Verifies that the user can sort Z-A for all columns in the new suggestions tab', async ({ loginPage, suggestionsPage }) => {
        await loginPage.loginUser(creds.nevadaadmin, creds.password);
        await suggestionsPage.navigateToNewSuggestionPage();
        await suggestionsPage.newSuggestionSorting(2);
    });

    test('Verifies that the user can sort Z-A for all columns in the assigned suggestion tab', async ({ loginPage, suggestionsPage }) => {
        await loginPage.loginUser(creds.nevadaadmin, creds.password);
        await suggestionsPage.navigateToNewSuggestionPage();
        await suggestionsPage.navigateToAssignedPage();
        await suggestionsPage.newSuggestionSorting(2);
    });

    test('Verifies that the user can sort Z-A for all columns in the suggestion History tab', async ({ loginPage, suggestionsPage }) => {
        await loginPage.loginUser(creds.nevadaadmin, creds.password);
        await suggestionsPage.navigateToNewSuggestionPage();
        await suggestionsPage.navigateToHistoryTab();
        await suggestionsPage.historySuggestionSorting(2);
    });

    test('Verifies that the user can filter all the values on the new suggestion page', async ({ loginPage, suggestionsPage }) => {
        await loginPage.loginUser(creds.nevadaadmin, creds.password);
        await suggestionsPage.navigateToNewSuggestionPage();
        await suggestionsPage.stateFilter();
        await suggestionsPage.sourceLevel();
        await suggestionsPage.institutionFilter();
        await suggestionsPage.subjectFilter();
        await suggestionsPage.numberFilter();
        await suggestionsPage.suggestionTypeFilter();
    });

    test('Verifies that a user can assign a single suggestion on the new suggestion page', async ({ loginPage, suggestionsPage }) => {
        await loginPage.loginUser(creds.nevadaadmin, creds.password);
        await suggestionsPage.navigateToNewSuggestionPage();
        await suggestionsPage.assignSuggestion();
    });

    test('Verifies that a user can assign multiple suggestions on the new suggestion page', async ({ loginPage, suggestionsPage }) => {
        await loginPage.loginUser(creds.nevadaadmin, creds.password);
        await suggestionsPage.navigateToNewSuggestionPage();
        await suggestionsPage.assignSuggestionMultiple();
    });

    test('Verifies that a user can assign a single suggestion on the assigned suggestion page', async ({ loginPage, suggestionsPage }) => {
        await loginPage.loginUser(creds.nevadaadmin, creds.password);
        await suggestionsPage.navigateToNewSuggestionPage();
        await suggestionsPage.navigateToAssignedPage();
        await suggestionsPage.assignSuggestion();
    });

    test('Verifies that a user can assign multiple suggestions on the assigned suggestion page', async ({ loginPage, suggestionsPage }) => {
        await loginPage.loginUser(creds.nevadaadmin, creds.password);
        await suggestionsPage.navigateToNewSuggestionPage();
        await suggestionsPage.navigateToAssignedPage();
        await suggestionsPage.assignSuggestionMultiple();
    });

    test('Verifies that a user can accept single suggestions on the assigned suggestion page', async ({ loginPage, suggestionsPage }) => {
        await loginPage.loginUser(creds.nevadaadmin, creds.password);
        await suggestionsPage.navigateToNewSuggestionPage();
        await suggestionsPage.navigateToAssignedPage();
    });

    test('Verifies that a user can accept multiple suggestions on the assigned suggestion page', async ({ loginPage, suggestionsPage }) => {
        await loginPage.loginUser(creds.nevadaadmin, creds.password);
        await suggestionsPage.navigateToNewSuggestionPage();
        await suggestionsPage.navigateToAssignedPage();
        await suggestionsPage.acceptSuggestionMultiple();
    });

    test('Verifies that a user can reject single suggestions on the assigned suggestion page', async ({ loginPage, suggestionsPage }) => {
        await loginPage.loginUser(creds.nevadaadmin, creds.password);
        await suggestionsPage.navigateToNewSuggestionPage();
        await suggestionsPage.navigateToAssignedPage();
        await suggestionsPage.rejectSuggestion();
    });

    test('Verifies that a user can reject multiple suggestions on the assigned suggestion page', async ({ loginPage, suggestionsPage }) => {
        await loginPage.loginUser(creds.nevadaadmin, creds.password);
        await suggestionsPage.navigateToNewSuggestionPage();
        await suggestionsPage.navigateToAssignedPage();
        await suggestionsPage.rejectSuggestionMultiple();
    });
});
