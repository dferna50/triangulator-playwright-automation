const { test, expect } = require('@playwright/test');
const {loginPage} = require('../base_classes/login.js');
//const boostRequest = require('../../fixtures/baseClass/boostRequest');
const {SuggestionsPage} = require('../base_classes/suggestions.js'); //Suggestion = require('../base_classes/suggestions.js');
const creds = require('../test_data/logindata.json');

let loginPageInstance, suggestion;
let combobox;
let boost;


    test.beforeEach(async ({ browser }) => {
        const context = await browser.newContext();
        const page = await context.newPage();
        loginPageInstance = new loginPage(page);
        suggestion = new SuggestionsPage(page);
       // combobox = new boostRequest(page);
        //boost = new boostRequest(page);
        await page.goto('');
    });

    test('Verifies that the user can navigate to new suggestion tab', async () => {
        await loginPageInstance.loginuser(creds.nevadaadmin, creds.password);
        await suggestion.navigateToNewSuggestionPage();
    });

    test('Verifies that the user can navigate to assigned suggestion tab', async () => {
        await loginPageInstance.loginuser(creds.nevadaadmin, creds.password);
        await suggestion.navigateToNewSuggestionPage();
        await suggestion.navigateToAssignedPage();
    });

    test('Verifies that the user can navigate to other assigned suggestion tab', async () => {
        await loginPageInstance.loginuser(creds.nevadaadmin, creds.password);
        await suggestion.navigateToNewSuggestionPage();
        await suggestion.navigateToAssignedPage();
        await suggestion.navigateToOtherAssignedSuggestions();
    });

    test('Verifies that the user can navigate to Suggestion History tab', async () => {
        await loginPageInstance.loginuser(creds.nevadaadmin, creds.password);
        await suggestion.navigateToNewSuggestionPage();
        await suggestion.navigateToHistoryTab();
    });

    test('Verifies that the user can sort A-Z for all columns in the new suggestions tab', async () => {
        await loginPageInstance.loginuser(creds.nevadaadmin, creds.password);
        await suggestion.navigateToNewSuggestionPage();
        await suggestion.newSuggestionSorting(1);
    });

    test('Verifies that the user can sort A-Z for all columns in the assigned suggestion tab', async () => {
        await loginPageInstance.loginuser(creds.nevadaadmin, creds.password);
        await suggestion.navigateToNewSuggestionPage();
        await suggestion.navigateToAssignedPage();
        await suggestion.newSuggestionSorting(1);
    });

    test('Verifies that the user can sort A-Z for all columns in the suggestion History tab', async () => {
        await loginPageInstance.loginuser(creds.nevadaadmin, creds.password);
        await suggestion.navigateToNewSuggestionPage();
        await suggestion.navigateToHistoryTab();
        await suggestion.historySuggestionSorting(1);
    });

    test('Verifies that the user can sort Z-A for all columns in the new suggestions tab', async () => {
        await loginPageInstance.loginuser(creds.nevadaadmin, creds.password);
        await suggestion.navigateToNewSuggestionPage();
        await suggestion.newSuggestionSorting(2);
    });

    test('Verifies that the user can sort Z-A for all columns in the assigned suggestion tab', async () => {
        await loginPageInstance.loginuser(creds.nevadaadmin, creds.password);
        await suggestion.navigateToNewSuggestionPage();
        await suggestion.navigateToAssignedPage();
        await suggestion.newSuggestionSorting(2);
    });

    test('Verifies that the user can sort Z-A for all columns in the suggestion History tab', async () => {
        await loginPageInstance.loginuser(creds.nevadaadmin, creds.password);
        await suggestion.navigateToNewSuggestionPage();
        await suggestion.navigateToHistoryTab();
        await suggestion.historySuggestionSorting(2);
    });

    test('Verifies that the user can filter all the values on the new suggestion page', async () => {
        await loginPageInstance.loginuser(creds.nevadaadmin, creds.password);
        await suggestion.navigateToNewSuggestionPage();
        // await suggestion.dateRange();
        // await suggestion.confidanceScore();
        await suggestion.stateFilter();
        await suggestion.sourceLevel();
        await suggestion.institutionFilter();
        await suggestion.subjectFilter();
        await suggestion.numberFilter();
        await suggestion.suggestiontypefilter();
    });

    test('Verifies that a user can assign a single suggestion on the new suggestion page', async () => {
        await loginPageInstance.loginuser(creds.nevadaadmin, creds.password);
        await suggestion.navigateToNewSuggestionPage();
        await suggestion.assignSuggestion();
    });

    test('Verifies that a user can assign multiple suggestions on the new suggestion page', async () => {
        await loginPageInstance.loginuser(creds.nevadaadmin, creds.password);
        await suggestion.navigateToNewSuggestionPage();
        await suggestion.assignSuggestionMultiple();
    });

    test('Verifies that a user can assign a single suggestion on the assigned suggestion page', async () => {
        await loginPageInstance.loginuser(creds.nevadaadmin, creds.password);
        await suggestion.navigateToNewSuggestionPage();
        await suggestion.navigateToAssignedPage();
        await suggestion.assignSuggestion();
    });

    test('Verifies that a user can assign multiple suggestions on the assigned suggestion page', async () => {
        await loginPageInstance.loginuser(creds.nevadaadmin, creds.password);
        await suggestion.navigateToNewSuggestionPage();
        await suggestion.navigateToAssignedPage();
        await suggestion.assignSuggestionMultiple();
    });

    test('Verifies that a user can accept single suggestions on the assigned suggestion page', async () => {
        await loginPageInstance.loginuser(creds.nevadaadmin, creds.password);
        await suggestion.navigateToNewSuggestionPage();
        await suggestion.navigateToAssignedPage();
    });

    test('Verifies that a user can accept multiple suggestions on the assigned suggestion page', async () => {
        await loginPageInstance.loginuser(creds.nevadaadmin, creds.password);
        await suggestion.navigateToNewSuggestionPage();
        await suggestion.navigateToAssignedPage();
        await suggestion.acceptSuggestionMultiple();
    });

    test('Verifies that a user can reject single suggestions on the assigned suggestion page', async () => {
        await loginPageInstance.loginuser(creds.nevadaadmin, creds.password);
        await suggestion.navigateToNewSuggestionPage();
        await suggestion.navigateToAssignedPage();
        await suggestion.rejectSuggestion();
    });

    test('Verifies that a user can reject multiple suggestions on the assigned suggestion page', async () => {
        await loginPageInstance.loginuser(creds.nevadaadmin, creds.password);
        await suggestion.navigateToNewSuggestionPage();
        await suggestion.navigateToAssignedPage();
        await suggestion.rejectSuggestionMultiple();
    });
