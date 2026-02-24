import { test, expect } from '../fixtures/test';

test.describe('Create workflow configuration', () => {
    const instAdminEmail = process.env.INST_ADMIN_EMAIL ?? '';
    const instAdminPassword = process.env.INST_ADMIN_PASSWORD ?? '';

    test.beforeEach(async ({ page, loginPage, createUserPage }) => {
        await page.goto('');
        await loginPage.visit();
        await loginPage.loginUser(instAdminEmail, instAdminPassword);
        await createUserPage.createUserButtonView();
    });

    test('TC1-Verify user selection dropdown content and order', async ({ createUserPage }) => {
        await createUserPage.createUserValidationErrorMsg();
    });

    test('TC2-Verify user deletion functionality in Step', async ({ createUserPage }) => {
        await createUserPage.deleteIcon();
    });

    test('TC3-Verify zero user selection throws error', async ({ createUserPage }) => {
        await createUserPage.zeroUsersThrowsError();
    });

    test('TC5-Verify all active users can be added to a group.', async ({ createUserPage }) => {
        await createUserPage.allActiveUsers();
    });

    test('TC6-Verify error message if the user attempts to create a group with a name that already exists.', async ({ createUserPage }) => {
        await createUserPage.enterNumberForCreateGroup();
    });

    test('TC7-validate error message upto 250 character length', async ({ createUserPage }) => {
        await createUserPage.description250CharLength();
    });

    test('TC8-Verify that if the user abandons changes, the same error messaging is leveraged for discarding changes.', async ({ createUserPage }) => {
        await createUserPage.discardChanges();
    });

    test.skip('TC9-Verify that the group is saved and visible on the chart on the Workflow configurations page.', async ({ createUserPage }) => {
        await createUserPage.workflowGroupView();
    });

    test.skip('TC10-Verify that Step 2 requires a unique group name (not case-sensitive).', async ({ createUserPage }) => {
        await createUserPage.uniqueGroupName();
    });
});
