import { test, expect } from '../fixtures/test';

// Note: Original imports workflowconfiguration class which does not have a TS POM yet.
// TODO: Create WorkflowConfigurationPage.ts when needed.

test.describe('US Tickets', () => {
    const regularUserEmail = process.env.REGULAR_USER_EMAIL ?? '';
    const regularUserPassword = process.env.REGULAR_USER_PASSWORD ?? '';

    test.beforeEach(async ({ page, loginPage }) => {
        await page.goto('');
        await loginPage.visit();
        await loginPage.loginUser(regularUserEmail, regularUserPassword);
        // TODO: await workflowConfigPage.groupName();
    });

    test('US_1515- Verify users in group show proper validation error while suspending same users', async () => {
        // TODO: await workflowConfigPage.groupNameUserErrorMsg();
    });

    test('US_1516- Verify users should show proper validation which is not present in the group', async () => {
        // TODO: await workflowConfigPage.groupNameUserNotInvolvedErrorMsg();
    });

    test.skip('TC3-Verify Institution admin roles should navigate to account page and check groups', async () => {
        // TODO: await workflowConfigPage.userAccountInstAdmin();
    });

    test.skip('TC5-Verify reviewer admin roles should navigate to account page and check groups', async () => {
        // TODO: await workflowConfigPage.reviewerRoleGroupCheck();
    });

    test.skip('US_1655-Verify display workflow details page', async () => {
        // TODO: await workflowConfigPage.workflowDetailsPage();
    });

    test.skip('US_1349-Update inst admin dashboard', async () => {
        // TODO: await workflowConfigPage.otherSuggestionsPageClick();
    });

    test.skip('US_1300-Verify allow inst admin and reviewer to include a note while reviewing', async () => {
        // TODO: await workflowConfigPage.noteWhileReviewing();
    });

    test.skip('BUG_1626-Verify State Connect Toggle Defaults to OFF for Newly Created Users', async () => {
        // TODO: await workflowConfigPage.stateConnectToggleOn();
    });
});
