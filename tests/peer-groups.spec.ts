import { test, expect } from '../fixtures/test';
import { type Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { PeerGroupsPage } from '../pages/PeerGroupsPage';

test.describe('Peer Groups Tests', () => {
    test.describe.configure({ mode: 'serial' });

    const baseURL = (process.env.BASE_URL ?? 'https://qa.creditmobility.net').replace(/\/$/, '');
    const adminEmail = process.env.INST_ADMIN_EMAIL ?? '';
    const adminPassword = process.env.INST_ADMIN_PASSWORD ?? '';

    const testInstitutions = [
        'Abilene Christian University',
        'Academy of Art University',
        'Adams State University',
    ];

    let page: Page;
    let loginPage: LoginPage;
    let peerGroupsPage: PeerGroupsPage;

    test.beforeAll(async ({ browser }) => {
        page = await browser.newPage();
        loginPage = new LoginPage(page);
        peerGroupsPage = new PeerGroupsPage(page);

        // Perform login exactly once for the entire suite to avoid rate-limiting/auth locks
        await page.goto(`${baseURL}/logged-out/login/email`);
        await loginPage.loginUser(adminEmail, adminPassword);
        await page.waitForLoadState('domcontentloaded');
    });

    test.afterAll(async () => {
        if (page) {
            await page.close();
        }
    });

    // Cleanup: delete all leftover peer groups before running tests
    test('TC0: Cleanup leftover peer groups', async () => {
        test.setTimeout(120_000); // 2 minutes for cleanup of potentially many groups
        await peerGroupsPage.navigateToPeerGroupsPageDirect();

        let count = await peerGroupsPage.getPeerGroupRowCount();
        let maxIterations = 15; // Safety guard against infinite loops
        while (count > 0 && maxIterations > 0) {
            maxIterations--;
            try {
                // Always delete the first row (index 0) to avoid index shift issues
                await peerGroupsPage.clickDeleteOnRow(0);
                await page.waitForTimeout(2000);
            } catch (e) {
                console.log(`Cleanup: failed to delete row, reloading. Error: ${e}`);
            }
            await page.reload();
            await peerGroupsPage.createPeerGroupBtn.waitFor({ state: 'visible', timeout: 15000 });
            count = await peerGroupsPage.getPeerGroupRowCount();
        }
    });

    // =========================================================================
    // 1. Navigation Tests
    // =========================================================================
    test.describe('Navigation Tests', () => {

        test('TC1.1: Navigate to Peer Groups Page via Settings', async () => {
            if (!page.url().endsWith('/app/dashboard')) {
                await page.goto(`${baseURL}/app/dashboard`);
                await page.waitForLoadState('domcontentloaded');
            }

            await peerGroupsPage.navigateToPeerGroupsPage();

            await expect(page).toHaveURL(/.*peer-groups/);
            await expect(peerGroupsPage.pageTitle).toBeVisible();
            await expect(peerGroupsPage.createPeerGroupBtn).toBeVisible();
            await expect(peerGroupsPage.manageHeading).toBeVisible();
        });

        test('TC1.2: Navigate to Peer Groups Page via Direct URL', async () => {
            await peerGroupsPage.navigateToPeerGroupsPageDirect();

            await expect(page).toHaveURL(/.*peer-groups/);
            await expect(peerGroupsPage.createPeerGroupBtn).toBeVisible();
        });

        test('TC1.3: Navigate Back to Settings from Peer Groups', async () => {
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

        test('TC2.1: Create Peer Group - Happy Path', async () => {
            test.setTimeout(120_000);
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

            // After submit, the API call succeeds but dialog may not auto-close.
            // Navigate back and verify the peer group was created.
            await peerGroupsPage.navigateToPeerGroupsPageDirect(true);
            await expect(page.locator(`text=${groupName}`)).toBeVisible({ timeout: 10000 });

            await peerGroupsPage.deleteLastPeerGroup();
        });

        test('TC2.2: Verify Minimum 3 Institutions Required', async () => {
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

        test('TC2.3: Submit Without Name - Validation', async () => {
            await peerGroupsPage.navigateToPeerGroupsPageDirect();

            await peerGroupsPage.openCreateDialog();
            await peerGroupsPage.selectInstitutions(testInstitutions);
            await peerGroupsPage.clickNext();

            expect(await peerGroupsPage.isSubmitDisabled()).toBeTruthy();

            await peerGroupsPage.closeDialog();
        });

        test('TC2.4: Name Character Limit (60 chars)', async () => {
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

        test('TC2.5: Cancel Create Dialog', async () => {
            await peerGroupsPage.navigateToPeerGroupsPageDirect();

            const initialCount = await peerGroupsPage.getPeerGroupRowCount();

            await peerGroupsPage.openCreateDialog();
            await peerGroupsPage.selectInstitutions(testInstitutions);
            await peerGroupsPage.clickCancel();

            await expect(peerGroupsPage.createDialog).not.toBeVisible({ timeout: 5000 });

            const finalCount = await peerGroupsPage.getPeerGroupRowCount();
            expect(finalCount).toBe(initialCount);
        });

        test('TC2.6: Close Create Dialog with X Button', async () => {
            await peerGroupsPage.navigateToPeerGroupsPageDirect();

            await peerGroupsPage.openCreateDialog();
            await expect(peerGroupsPage.createDialog).toBeVisible();

            await peerGroupsPage.closeDialog();
            await expect(peerGroupsPage.createDialog).not.toBeVisible({ timeout: 5000 });
        });

        test('TC2.7: Back Button from Step 2 to Step 1', async () => {
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

        test('TC2.8: Remove Institution from Selection', async () => {
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

        test('TC2.9: Search Institution Filters Results', async () => {
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

        test('TC3.1: Open Edit Dialog for Existing Peer Group', async () => {
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

        test('TC3.2: Edit Peer Group - Modify Name', async () => {
            test.setTimeout(120_000);
            await peerGroupsPage.navigateToPeerGroupsPageDirect();

            const originalName = `Edit Test ${Date.now()}`;
            await peerGroupsPage.createPeerGroup(testInstitutions, originalName);

            const rowCount = await peerGroupsPage.getPeerGroupRowCount();
            await peerGroupsPage.clickEditOnRow(rowCount - 1);

            await peerGroupsPage.clickNext();

            const newName = `Edited PG ${Date.now()}`;
            await peerGroupsPage.fillPeerGroupName(newName);

            await peerGroupsPage.clickSubmit();

            // Navigate back to verify the edit was saved
            await peerGroupsPage.navigateToPeerGroupsPageDirect(true);
            await expect(page.locator(`text=${newName}`)).toBeVisible({ timeout: 10000 });

            await peerGroupsPage.deleteLastPeerGroup();
        });
    });

    // =========================================================================
    // 4. Delete Peer Group Tests
    // =========================================================================
    test.describe('Delete Peer Group Tests', () => {

        test('TC4.1: Delete Peer Group', async () => {
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

        test('TC5.1: Verify Peer Group Display Elements', async () => {
            await peerGroupsPage.navigateToPeerGroupsPageDirect();

            const displayName = `Display Test ${Date.now()}`;
            await peerGroupsPage.createPeerGroup(testInstitutions, displayName);

            const rowCount = await peerGroupsPage.getPeerGroupRowCount();
            expect(rowCount).toBeGreaterThan(0);
            await expect(peerGroupsPage.toggleSeeMoreBtn.first()).toBeVisible();
            await expect(page.locator('text=/\\d+ peers?/').first()).toBeVisible();

            await peerGroupsPage.deleteLastPeerGroup();
        });

        test('TC5.2: Verify Page Description Text', async () => {
            await peerGroupsPage.navigateToPeerGroupsPageDirect();

            await expect(peerGroupsPage.manageHeading).toBeVisible();
            await expect(peerGroupsPage.pageDescription).toBeVisible();
            await expect(peerGroupsPage.backToSettingsBtn).toBeVisible();
        });
    });
});
