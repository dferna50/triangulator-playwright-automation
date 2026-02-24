import { test, expect } from '../fixtures/test';

test.describe('Peer Groups Tests', () => {
    test.describe.configure({ mode: 'serial' });

    const baseURL = process.env.BASE_URL ?? 'https://qa.creditmobility.net';
    const adminEmail = process.env.REGULAR_USER_EMAIL ?? '';
    const adminPassword = process.env.REGULAR_USER_PASSWORD ?? '';

    const testInstitutions = [
        'Abilene Christian University',
        'Academy of Art University',
        'Adams State University',
    ];

    // Cleanup: delete all leftover peer groups before running tests
    test('TC0: Cleanup leftover peer groups', async ({ page, loginPage, peerGroupsPage }) => {
        await page.goto(`${baseURL}/logged-out/login/email`);
        await loginPage.loginUser(adminEmail, adminPassword);
        await page.waitForLoadState('domcontentloaded');
        await peerGroupsPage.navigateToPeerGroupsPageDirect();

        let count = await peerGroupsPage.getPeerGroupRowCount();
        while (count > 0) {
            await peerGroupsPage.clickDeleteOnRow(count - 1);
            await page.waitForTimeout(3000);
            await page.reload();
            await peerGroupsPage.createPeerGroupBtn.waitFor({ state: 'visible', timeout: 15000 });
            count = await peerGroupsPage.getPeerGroupRowCount();
        }
    });

    // =========================================================================
    // 1. Navigation Tests
    // =========================================================================
    test.describe('Navigation Tests', () => {

        test('TC1.1: Navigate to Peer Groups Page via Settings', async ({ page, loginPage, peerGroupsPage }) => {
            await page.goto(`${baseURL}/logged-out/login/email`);
            await loginPage.loginUser(adminEmail, adminPassword);
            await page.waitForLoadState('domcontentloaded');

            await peerGroupsPage.navigateToPeerGroupsPage();

            await expect(page).toHaveURL(/.*peer-groups/);
            await expect(peerGroupsPage.pageTitle).toBeVisible();
            await expect(peerGroupsPage.createPeerGroupBtn).toBeVisible();
            await expect(peerGroupsPage.manageHeading).toBeVisible();
        });

        test('TC1.2: Navigate to Peer Groups Page via Direct URL', async ({ page, loginPage, peerGroupsPage }) => {
            await page.goto(`${baseURL}/logged-out/login/email`);
            await loginPage.loginUser(adminEmail, adminPassword);
            await page.waitForLoadState('domcontentloaded');

            await peerGroupsPage.navigateToPeerGroupsPageDirect();

            await expect(page).toHaveURL(/.*peer-groups/);
            await expect(peerGroupsPage.createPeerGroupBtn).toBeVisible();
        });

        test('TC1.3: Navigate Back to Settings from Peer Groups', async ({ page, loginPage, peerGroupsPage }) => {
            await page.goto(`${baseURL}/logged-out/login/email`);
            await loginPage.loginUser(adminEmail, adminPassword);
            await page.waitForLoadState('domcontentloaded');
            await peerGroupsPage.navigateToPeerGroupsPageDirect();

            await peerGroupsPage.navigateBackToSettings();

            await expect(page).toHaveURL(/.*settings/);
            await expect(page.locator('text=Settings').first()).toBeVisible();
        });
    });

    // =========================================================================
    // 2. Create Peer Group Tests
    // =========================================================================
    test.describe('Create Peer Group Tests', () => {

        test('TC2.1: Create Peer Group - Happy Path', async ({ page, loginPage, peerGroupsPage }) => {
            await page.goto(`${baseURL}/logged-out/login/email`);
            await loginPage.loginUser(adminEmail, adminPassword);
            await page.waitForLoadState('domcontentloaded');
            await peerGroupsPage.navigateToPeerGroupsPageDirect();

            await peerGroupsPage.openCreateDialog();
            await expect(page.locator('text=Step 1: Add institutions')).toBeVisible();

            await peerGroupsPage.selectInstitutions(testInstitutions);

            const countText = await peerGroupsPage.getSelectedCountText();
            expect(countText).toContain('3/10');

            await peerGroupsPage.clickNext();
            await expect(page.locator('text=Step 2: Add a peer group name')).toBeVisible();

            const groupName = `Test PG ${Date.now()}`;
            await peerGroupsPage.fillPeerGroupName(groupName);

            await expect(page.locator('text=Step 3: Add match threshold')).toBeVisible();
            await expect(peerGroupsPage.matchThresholdBtn).toBeVisible();

            await expect(page.locator('text=Review details')).toBeVisible();
            const reviewList = page.locator('text=Review details').locator('..').getByRole('listitem');
            const reviewCount = await reviewList.count();
            expect(reviewCount).toBe(testInstitutions.length);

            await peerGroupsPage.selectMatchThreshold();
            await peerGroupsPage.clickSubmit();

            await peerGroupsPage.anyDialog.waitFor({ state: 'hidden', timeout: 30000 });
            await expect(page.locator(`text=${groupName}`)).toBeVisible({ timeout: 10000 });

            await peerGroupsPage.deleteLastPeerGroup();
        });

        test('TC2.2: Verify Minimum 3 Institutions Required', async ({ page, loginPage, peerGroupsPage }) => {
            await page.goto(`${baseURL}/logged-out/login/email`);
            await loginPage.loginUser(adminEmail, adminPassword);
            await page.waitForLoadState('domcontentloaded');
            await peerGroupsPage.navigateToPeerGroupsPageDirect();

            await peerGroupsPage.openCreateDialog();
            await expect(page.locator('text=Must select at least 3 institutions')).toBeVisible();

            await peerGroupsPage.selectInstitution(testInstitutions[0]);
            expect(await peerGroupsPage.getSelectedCount()).toBe(1);
            expect(await peerGroupsPage.isNextDisabled()).toBeTruthy();

            await peerGroupsPage.selectInstitution(testInstitutions[1]);
            expect(await peerGroupsPage.getSelectedCount()).toBe(2);
            expect(await peerGroupsPage.isNextDisabled()).toBeTruthy();

            await peerGroupsPage.selectInstitution(testInstitutions[2]);
            expect(await peerGroupsPage.getSelectedCount()).toBe(3);
            expect(await peerGroupsPage.isNextDisabled()).toBeFalsy();

            await peerGroupsPage.closeDialog();
        });

        test('TC2.3: Submit Without Name - Validation', async ({ page, loginPage, peerGroupsPage }) => {
            await page.goto(`${baseURL}/logged-out/login/email`);
            await loginPage.loginUser(adminEmail, adminPassword);
            await page.waitForLoadState('domcontentloaded');
            await peerGroupsPage.navigateToPeerGroupsPageDirect();

            await peerGroupsPage.openCreateDialog();
            await peerGroupsPage.selectInstitutions(testInstitutions);
            await peerGroupsPage.clickNext();

            expect(await peerGroupsPage.isSubmitDisabled()).toBeTruthy();

            await peerGroupsPage.closeDialog();
        });

        test('TC2.4: Name Character Limit (60 chars)', async ({ page, loginPage, peerGroupsPage }) => {
            await page.goto(`${baseURL}/logged-out/login/email`);
            await loginPage.loginUser(adminEmail, adminPassword);
            await page.waitForLoadState('domcontentloaded');
            await peerGroupsPage.navigateToPeerGroupsPageDirect();

            await peerGroupsPage.openCreateDialog();
            await peerGroupsPage.selectInstitutions(testInstitutions);
            await peerGroupsPage.clickNext();

            const shortName = 'Test Group';
            await peerGroupsPage.fillPeerGroupName(shortName);
            const charCount = await peerGroupsPage.getCharCountText();
            expect(charCount).toContain(`${shortName.length} / 60`);

            const longName = 'A'.repeat(60);
            await peerGroupsPage.fillPeerGroupName(longName);
            const maxCharCount = await peerGroupsPage.getCharCountText();
            expect(maxCharCount).toContain('60 / 60');

            await peerGroupsPage.closeDialog();
        });

        test('TC2.5: Cancel Create Dialog', async ({ page, loginPage, peerGroupsPage }) => {
            await page.goto(`${baseURL}/logged-out/login/email`);
            await loginPage.loginUser(adminEmail, adminPassword);
            await page.waitForLoadState('domcontentloaded');
            await peerGroupsPage.navigateToPeerGroupsPageDirect();

            const initialCount = await peerGroupsPage.getPeerGroupRowCount();

            await peerGroupsPage.openCreateDialog();
            await peerGroupsPage.selectInstitutions(testInstitutions);
            await peerGroupsPage.clickCancel();

            await expect(peerGroupsPage.createDialog).not.toBeVisible({ timeout: 5000 });

            const finalCount = await peerGroupsPage.getPeerGroupRowCount();
            expect(finalCount).toBe(initialCount);
        });

        test('TC2.6: Close Create Dialog with X Button', async ({ page, loginPage, peerGroupsPage }) => {
            await page.goto(`${baseURL}/logged-out/login/email`);
            await loginPage.loginUser(adminEmail, adminPassword);
            await page.waitForLoadState('domcontentloaded');
            await peerGroupsPage.navigateToPeerGroupsPageDirect();

            await peerGroupsPage.openCreateDialog();
            await expect(peerGroupsPage.createDialog).toBeVisible();

            await peerGroupsPage.closeDialog();
            await expect(peerGroupsPage.createDialog).not.toBeVisible({ timeout: 5000 });
        });

        test('TC2.7: Back Button from Step 2 to Step 1', async ({ page, loginPage, peerGroupsPage }) => {
            await page.goto(`${baseURL}/logged-out/login/email`);
            await loginPage.loginUser(adminEmail, adminPassword);
            await page.waitForLoadState('domcontentloaded');
            await peerGroupsPage.navigateToPeerGroupsPageDirect();

            await peerGroupsPage.openCreateDialog();
            await peerGroupsPage.selectInstitutions(testInstitutions);
            await peerGroupsPage.clickNext();

            await expect(page.locator('text=Step 2: Add a peer group name')).toBeVisible();

            await peerGroupsPage.clickBack();

            await expect(page.locator('text=Step 1: Add institutions')).toBeVisible();

            const count = await peerGroupsPage.getSelectedCount();
            expect(count).toBe(3);

            await peerGroupsPage.closeDialog();
        });

        test.skip('TC2.8: Remove Institution from Selection', async ({ page, loginPage, peerGroupsPage }) => {
            await page.goto(`${baseURL}/logged-out/login/email`);
            await loginPage.loginUser(adminEmail, adminPassword);
            await page.waitForLoadState('domcontentloaded');
            await peerGroupsPage.navigateToPeerGroupsPageDirect();

            await peerGroupsPage.openCreateDialog();
            await peerGroupsPage.selectInstitutions(testInstitutions);

            expect(await peerGroupsPage.getSelectedCount()).toBe(3);
            expect(await peerGroupsPage.isNextDisabled()).toBeFalsy();

            await peerGroupsPage.removeInstitution(0);

            expect(await peerGroupsPage.getSelectedCount()).toBe(2);
            expect(await peerGroupsPage.isNextDisabled()).toBeTruthy();

            await peerGroupsPage.closeDialog();
        });

        test('TC2.9: Search Institution Filters Results', async ({ page, loginPage, peerGroupsPage }) => {
            await page.goto(`${baseURL}/logged-out/login/email`);
            await loginPage.loginUser(adminEmail, adminPassword);
            await page.waitForLoadState('domcontentloaded');
            await peerGroupsPage.navigateToPeerGroupsPageDirect();

            await peerGroupsPage.openCreateDialog();

            await peerGroupsPage.institutionCombobox.click();
            await peerGroupsPage.institutionCombobox.fill('Arizona');

            const options = page.getByRole('option');
            const count = await options.count();

            for (let i = 0; i < Math.min(count, 5); i++) {
                const text = await options.nth(i).textContent();
                expect(text?.toLowerCase()).toContain('arizona');
            }

            await peerGroupsPage.closeDialog();
        });
    });

    // =========================================================================
    // 3. Edit Peer Group Tests
    // =========================================================================
    test.describe('Edit Peer Group Tests', () => {

        test('TC3.1: Open Edit Dialog for Existing Peer Group', async ({ page, loginPage, peerGroupsPage }) => {
            await page.goto(`${baseURL}/logged-out/login/email`);
            await loginPage.loginUser(adminEmail, adminPassword);
            await page.waitForLoadState('domcontentloaded');
            await peerGroupsPage.navigateToPeerGroupsPageDirect();

            const originalName = `Edit Test ${Date.now()}`;
            await peerGroupsPage.createPeerGroup(testInstitutions, originalName);

            const rowCount = await peerGroupsPage.getPeerGroupRowCount();
            expect(rowCount).toBeGreaterThan(0);

            await peerGroupsPage.clickEditOnRow(0);

            await expect(peerGroupsPage.anyDialog).toBeVisible();
            await expect(page.locator('text=Edit peer group')).toBeVisible();
            await expect(page.locator('text=Step 1: Add institutions')).toBeVisible();

            const selectedCount = await peerGroupsPage.getSelectedCount();
            expect(selectedCount).toBeGreaterThanOrEqual(3);

            await peerGroupsPage.closeDialog();
        });

        test('TC3.2: Edit Peer Group - Modify Name', async ({ page, loginPage, peerGroupsPage }) => {
            await page.goto(`${baseURL}/logged-out/login/email`);
            await loginPage.loginUser(adminEmail, adminPassword);
            await page.waitForLoadState('domcontentloaded');
            await peerGroupsPage.navigateToPeerGroupsPageDirect();

            const originalName = `Edit Test ${Date.now()}`;
            await peerGroupsPage.createPeerGroup(testInstitutions, originalName);

            const rowCount = await peerGroupsPage.getPeerGroupRowCount();
            await peerGroupsPage.clickEditOnRow(rowCount - 1);

            await peerGroupsPage.clickNext();

            const newName = `Edited PG ${Date.now()}`;
            await peerGroupsPage.fillPeerGroupName(newName);

            await peerGroupsPage.clickSubmit();

            await expect(page.locator(`text=${newName}`)).toBeVisible({ timeout: 10000 });

            await peerGroupsPage.deleteLastPeerGroup();
        });
    });

    // =========================================================================
    // 4. Delete Peer Group Tests
    // =========================================================================
    test.describe('Delete Peer Group Tests', () => {

        test('TC4.1: Delete Peer Group', async ({ page, loginPage, peerGroupsPage }) => {
            await page.goto(`${baseURL}/logged-out/login/email`);
            await loginPage.loginUser(adminEmail, adminPassword);
            await page.waitForLoadState('domcontentloaded');
            await peerGroupsPage.navigateToPeerGroupsPageDirect();

            const tempName = `Delete Test ${Date.now()}`;
            await peerGroupsPage.createPeerGroup(testInstitutions, tempName);

            const countAfterCreate = await peerGroupsPage.getPeerGroupRowCount();

            await peerGroupsPage.clickDeleteOnRow(countAfterCreate - 1);
            await peerGroupsPage.waitForSuccessToast();
            await peerGroupsPage.waitForToastDismiss();

            const countAfterDelete = await peerGroupsPage.getPeerGroupRowCount();
            expect(countAfterDelete).toBe(countAfterCreate - 1);
        });
    });

    // =========================================================================
    // 5. Page Element Verification Tests
    // =========================================================================
    test.describe('Page Element Verification Tests', () => {

        test('TC5.1: Verify Peer Group Display Elements', async ({ page, loginPage, peerGroupsPage }) => {
            await page.goto(`${baseURL}/logged-out/login/email`);
            await loginPage.loginUser(adminEmail, adminPassword);
            await page.waitForLoadState('domcontentloaded');
            await peerGroupsPage.navigateToPeerGroupsPageDirect();

            const displayName = `Display Test ${Date.now()}`;
            await peerGroupsPage.createPeerGroup(testInstitutions, displayName);

            const rowCount = await peerGroupsPage.getPeerGroupRowCount();
            expect(rowCount).toBeGreaterThan(0);
            await expect(peerGroupsPage.toggleSeeMoreBtn.first()).toBeVisible();
            await expect(page.locator('text=/\\d+ peers?/').first()).toBeVisible();

            await peerGroupsPage.deleteLastPeerGroup();
        });

        test('TC5.2: Verify Page Description Text', async ({ page, loginPage, peerGroupsPage }) => {
            await page.goto(`${baseURL}/logged-out/login/email`);
            await loginPage.loginUser(adminEmail, adminPassword);
            await page.waitForLoadState('domcontentloaded');
            await peerGroupsPage.navigateToPeerGroupsPageDirect();

            await expect(peerGroupsPage.manageHeading).toBeVisible();
            await expect(peerGroupsPage.pageDescription).toBeVisible();
            await expect(peerGroupsPage.backToSettingsBtn).toBeVisible();
        });
    });
});
