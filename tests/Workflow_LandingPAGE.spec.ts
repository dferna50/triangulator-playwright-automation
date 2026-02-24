import { test, expect } from '../fixtures/test';

test.describe('Workflow Landing Page', () => {
    const regularUserEmail = process.env.REGULAR_USER_EMAIL ?? '';
    const regularUserPassword = process.env.REGULAR_USER_PASSWORD ?? '';

    test.beforeEach(async ({ page, loginPage, workflowLandingPage }) => {
        await page.goto('');
        await loginPage.visit();
        await loginPage.loginUser(regularUserEmail, regularUserPassword);
        await workflowLandingPage.workflow();
    });

    test('TC1-Verify Workflow configuration page location.', async ({ workflowLandingPage }) => {
        await workflowLandingPage.workflowViewProperContext();
    });

    test('TC3-Verify the sub text of the Workflow configurations page.', async ({ workflowLandingPage }) => {
        await workflowLandingPage.subtextWorkflow();
    });

    test('TC4-Verify that the See all link exists on the Workflow configurations page.', async ({ workflowLandingPage }) => {
        await workflowLandingPage.seeAllLink();
    });

    test('TC5-Verify the heading text on the new Workflow configurations page.', async ({ workflowLandingPage }) => {
        await workflowLandingPage.headingTextNewWorkflow();
    });

    test('TC6-Verify Manage groups section existence.', async ({ workflowLandingPage }) => {
        await workflowLandingPage.manageGroupVisible();
    });

    test('TC7-Verify sub text in Manage groups section existence.', async ({ workflowLandingPage }) => {
        await workflowLandingPage.subtextManageGroup();
    });

    test('TC8-Verify Create group button functionality.', async ({ workflowLandingPage }) => {
        await workflowLandingPage.popupWindowOccurs();
    });

    test('TC9-Verify the chart display on Manage evaluation groups page.', async ({ workflowLandingPage }) => {
        await workflowLandingPage.manageGroupExistanceLanding();
    });

    test('TC10-Verify the three dots functionality.', async ({ workflowLandingPage }) => {
        await workflowLandingPage.clickThreeDotsGroup();
    });

    test('TC11-Verify Manage workflow section existence.', async ({ workflowLandingPage }) => {
        await workflowLandingPage.manageWorkflowExistence();
    });

    test('TC12,13,14,15,16-Verify sub text in Manage workflow section.', async ({ workflowLandingPage }) => {
        await workflowLandingPage.subtextManageWorkflow();
    });

    test('TC17-Verify the View functionality.', async ({ workflowLandingPage }) => {
        await workflowLandingPage.workflowNameViewButton();
    });

    test.skip('TC-18 Verify the Edit functionality.', async ({ workflowLandingPage }) => {
        await workflowLandingPage.workflowNameEditButton();
    });

    test('TC-19 Verify the Delete functionality.', async ({ workflowLandingPage }) => {
        await workflowLandingPage.workflowNameDeleteButton();
    });
});
