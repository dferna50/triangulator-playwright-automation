import { test, expect } from '../fixtures/test';
import { type Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { EditUserPage } from '../pages/EditUserPage';

test.describe('Edit workflow configuration', () => {
    test.describe.configure({ mode: 'serial' });

    const baseURL = (process.env.BASE_URL ?? 'https://qa.creditmobility.net').replace(/\/$/, '');
    const instAdminEmail = process.env.INST_ADMIN_EMAIL ?? '';
    const instAdminPassword = process.env.INST_ADMIN_PASSWORD ?? '';

    let page: Page;
    let loginPage: LoginPage;
    let editUserPage: EditUserPage;

    test.beforeAll(async ({ browser }) => {
        page = await browser.newPage();
        page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
        loginPage = new LoginPage(page);
        editUserPage = new EditUserPage(page);

        // Perform login exactly once for the entire suite to avoid rate-limiting/auth locks
        await page.goto(`${baseURL}/logged-out/login/email`);
        await loginPage.loginUser(instAdminEmail, instAdminPassword);

        // Wait for dashboard and navigation tabs to ensure session is fully active and established
        await page.waitForURL('**/app/dashboard**', { timeout: 30000 });
        await expect(loginPage.myWorkplaceTab).toBeVisible({ timeout: 20000 });
        await page.locator('.animate-spin, .loading, svg[class*="spin"]').first().waitFor({ state: 'hidden', timeout: 15000 }).catch(() => { });
        await page.waitForTimeout(10000);
    });

    test.afterAll(async () => {
        if (page) {
            await page.close();
        }
    });

    test.afterEach(async () => {
        console.log('afterEach: cleaning up any open dialogs/menus');
        // Press Escape to close any open dropdowns/listboxes first
        await page.keyboard.press('Escape').catch(() => { });

        // Check if there is an open dialog
        const dialog = page.getByRole('dialog');
        const isDialogVisible = await dialog.first().isVisible().catch(() => false);
        if (isDialogVisible) {
            console.log('afterEach: Dialog is visible, attempting to close it');
            // Try to click Cancel button if present
            const cancelButton = page.getByRole('button', { name: 'Cancel' }).first();
            if (await cancelButton.isVisible().catch(() => false)) {
                await cancelButton.click().catch(() => { });
            }
            // Press Escape to close modal
            await page.keyboard.press('Escape').catch(() => { });
            await page.keyboard.press('Escape').catch(() => { });

            // Check for discard changes confirmation dialog
            const discardDialog = page.getByRole('dialog').filter({ hasText: /discard|abandon|unsaved/i }).first();
            if (await discardDialog.isVisible().catch(() => false)) {
                const confirmButton = discardDialog.getByRole('button', { name: /discard|yes|confirm|leave/i }).first();
                if (await confirmButton.isVisible().catch(() => false)) {
                    await confirmButton.click().catch(() => { });
                }
            }
        }

        // Wait for all dialogs to be hidden
        await expect(page.getByRole('dialog').first()).not.toBeVisible({ timeout: 5000 }).catch(() => { });
    });

    test.beforeEach(async () => {
        console.log('beforeEach: ensuring we are on dashboard');
        const currentURL = page.url();
        if (!currentURL.includes('/app/dashboard')) {
            await page.getByRole('link', { name: 'Dashboard', exact: true }).click();
            await page.waitForURL('**/app/dashboard**');
        }

        console.log('beforeEach: navigating to settings via SPA');
        await editUserPage.editUserButtonView();
        console.log('beforeEach: settings page loaded');
    });

    test.skip('TC1- Verify access to workflow configurations page.', async () => {
        await editUserPage.editWorkflow();
    });

    test.skip('TC2-Verify chart presence on manage groups page TC3-Verify context menu display TC4-Verify navigation to edit group page.', async () => {
        await editUserPage.chartDisplayEdit();
    });

    test.skip('TC5-Verify UI consistency with edit peer group', async () => {
        await editUserPage.compareGroupAndEditGroupUsers();
    });

    test('TC7-Verify minimum group member constraint.', async () => {
        await editUserPage.errorMsgForEditUsers();
    });

    test('TC8-Verify no maximum group member constraint.', async () => {
        await editUserPage.noMaximumMember();
    });

    test('TC9-Verify active user availability in dropdown.', async () => {
        await editUserPage.allActiveUsersIsPresent();
    });

    test('TC10-Verify group name editing ability.TC12-Verify group name allows numbers.', async () => {
        await editUserPage.editExistingGroup();
    });

    test('TC11-Verify group name uniqueness (case-insensitive).', async () => {
        await editUserPage.sameGroupNameErrorMsg();
    });

    test('TC13-Verify group description adding ability.', async () => {
        await editUserPage.addGroupDescription();
    });

    test('TC14-Verify group description character limit.', async () => {
        await editUserPage.editCharLengthForGroupDescription();
    });

    test('TC15-Verify group description with special characters should allow to submit', async () => {
        await editUserPage.specialCharForGroupDescription();
    });

    test('TC16-Verify special characters in group name field', async () => {
        await editUserPage.clearGroupNameValidateErrorMsg();
    });

    test('TC17-Verify Cancel Functionality on Edit Group Page', async () => {
        await editUserPage.editGroupCancelButton();
    });

    test.skip('TC18-Verify warning when attempting to remove minimum members from a group', async () => {
        // TODO: Warningmsgremoveingalusers not yet implemented in EditUserPage
    });
});
