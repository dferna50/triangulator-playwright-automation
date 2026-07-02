import { test, expect } from '../fixtures/test';

test.describe('Delete workflow configuration', () => {
    // Note: Original uses different credentials (testtriangulator+107 / #TransferTri1)
    const instAdminEmail = process.env.INST_ADMIN_EMAIL ?? '';
    const instAdminPassword = process.env.INST_ADMIN_PASSWORD ?? '';

    test.beforeEach(async ({ page, loginPage, deleteUserPage }) => {
        await page.goto('');
        await loginPage.visit();
        await loginPage.loginUser(instAdminEmail, instAdminPassword);
        await deleteUserPage.deleteWorkflowConfiguration();
    });

    test('TC1-Verify delete group option access for Inst Admin', async ({ deleteUserPage }) => {
        await deleteUserPage.deleteIconVisible();
    });

    test('TC2-Verify pop-up when deleting a group that is part of a workflow.', async ({ deleteUserPage }) => {
        await deleteUserPage.deletePopup();
    });

    test('TC3-Verify cancel deletion of a group that is part of workflow using cancel button.', async ({ deleteUserPage }) => {
        await deleteUserPage.deleteCancelButton();
    });

    test('TC4-Verify cancel deletion of a group that is part of workflow using X button.', async ({ deleteUserPage }) => {
        await deleteUserPage.deleteXButton();
    });

    test('TC5-Verify confirmation pop-up when deleting a group that is not part of a workflow.', async ({ deleteUserPage }) => {
        await deleteUserPage.deleteGroupPopupForever();
    });

    test.skip('TC6-Verify successful deletion of a group that is not part of a workflow.', async ({ deleteUserPage }) => {
        await deleteUserPage.deleteSuccessfully();
    });

    test.skip('TC7-Verify group is removed from New Account page after deletion.', async () => {
        // TODO: DelGrpNotVisible not yet implemented in DeleteUserPage
    });
});
