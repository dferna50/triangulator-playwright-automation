import { test, expect } from '../fixtures/test';

test.describe('Edit workflow configuration', () => {
    const instAdminEmail = process.env.INST_ADMIN_EMAIL ?? '';
    const instAdminPassword = process.env.INST_ADMIN_PASSWORD ?? '';

    test.beforeEach(async ({ page, loginPage, editUserPage }) => {
        await page.goto('');
        await loginPage.visit();
        await loginPage.loginUser(instAdminEmail, instAdminPassword);
        await editUserPage.editUserButtonView();
    });

    test('TC1- Verify access to workflow configurations page.', async ({ editUserPage }) => {
        await editUserPage.editWorkflow();
    });

    test('TC2-Verify chart presence on manage groups page TC3-Verify context menu display TC4-Verify navigation to edit group page.', async ({ editUserPage }) => {
        await editUserPage.chartDisplayEdit();
    });

    test('TC5-Verify UI consistency with edit peer group', async ({ editUserPage }) => {
        await editUserPage.compareGroupAndEditGroupUsers();
    });

    test('TC7-Verify minimum group member constraint.', async ({ editUserPage }) => {
        await editUserPage.errorMsgForEditUsers();
    });

    test('TC8-Verify no maximum group member constraint.', async ({ editUserPage }) => {
        await editUserPage.noMaximumMember();
    });

    test('TC9-Verify active user availability in dropdown.', async ({ editUserPage }) => {
        await editUserPage.allActiveUsersIsPresent();
    });

    test('TC10-Verify group name editing ability.TC12-Verify group name allows numbers.', async ({ editUserPage }) => {
        await editUserPage.editExistingGroup();
    });

    test('TC11-Verify group name uniqueness (case-insensitive).', async ({ editUserPage }) => {
        await editUserPage.sameGroupNameErrorMsg();
    });

    test('TC13-Verify group description adding ability.', async ({ editUserPage }) => {
        await editUserPage.addGroupDescription();
    });

    test('TC14-Verify group description character limit.', async ({ editUserPage }) => {
        await editUserPage.editCharLengthForGroupDescription();
    });

    test('TC15-Verify group description with special characters should allow to submit', async ({ editUserPage }) => {
        await editUserPage.specialCharForGroupDescription();
    });

    test('TC16-Verify special characters in group name field', async ({ editUserPage }) => {
        await editUserPage.clearGroupNameValidateErrorMsg();
    });

    test('TC17-Verify Cancel Functionality on Edit Group Page', async ({ editUserPage }) => {
        await editUserPage.editGroupCancelButton();
    });

    test.skip('TC18-Verify warning when attempting to remove minimum members from a group', async () => {
        // TODO: Warningmsgremoveingalusers not yet implemented in EditUserPage
    });
});
