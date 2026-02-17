import { test, expect } from '@playwright/test';
import { loginPage } from '../base_classes/login.js';
import { BoostRequest } from '../base_classes/Boostrequest.js';
import { SuggestionsPage } from '../base_classes/suggestions.js';

let loginPageObj, suggestion; //const combobox = new BoostRequest();
let boost;

test.describe('Suggestion Page', () => {
    test.beforeEach(async ({ browser }) => {
        const context = await browser.newContext();
        const page = await context.newPage();
        // Visit login page
        //const combobox = new BoostRequest();
       // boost = new BoostRequest(page);
        await page.goto('');
        loginPageObj = new loginPage(page);
        await loginPageObj.visit(page);
        suggestion = new SuggestionsPage(page);

    });

    test('Verifies that the user can navigate to Suggestion History tab', async ({ page }) => {

        await loginPageObj.loginuser('testtriangulator+109@gmail.com', 'Triangulator!1', 'Institution Admin');
        await suggestion.navigateToNewSuggestionPage();
        await suggestion.navigateToHistoryTab();
    });

    test('Verifies actions on the history page for Institution Admin', async ({ page }) => {
        await loginPageObj.loginuser('testtriangulator+109@gmail.com', 'Triangulator!1', 'Institution Admin');
        await suggestion.navigateToNewSuggestionPage();
        await suggestion.navigateToHistoryTab();
        await suggestion.historyNewActions();
    });

    test('Verifies actions on the history page for Reviewer role', async ({ page }) => {
        await loginPageObj.loginuser('testtriangulatoroo+r123@gmail.com', 'Triangulator!1', 'Reviewer');
        await suggestion.navigateToNewSuggestionPage();
        await suggestion.navigateToHistoryTabReviewer();
        await suggestion.historyNewActionsReview();
    });

    test('Verifies actions on the history page for Triangulator Admin', async ({ page }) => {
        await loginPageObj.loginuser('creditmobility@asu.edu', 'Triangulator!1', 'Triangulator Admin');
        await suggestion.navigateToNewSuggestionPage();
        await suggestion.navigateToHistoryTabReviewer();
        await suggestion.historyNewActionsTriadmin();
    });

    // test.afterEach(async ({browser}) => {
    //     await browser.close(); // Closes the page after each test
    //   });
});