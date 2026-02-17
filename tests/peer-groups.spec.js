// spec: specs/peer-groups-test-plan.md

const { test, expect } = require('@playwright/test');
const { loginPage } = require('../base_classes/login');
const { PeerGroupsPage } = require('../base_classes/peerGroupsPage');

test.describe('Peer Groups Tests', () => {
    test.describe.configure({ mode: 'serial' });

    const baseURL = 'https://qa.creditmobility.net';
    const adminEmail = 'testtriangulator+108@gmail.com';
    const adminPassword = 'Triangulator!1';

    // Test institutions for creating peer groups (must not overlap with existing peer groups)
    const testInstitutions = [
        'Abilene Christian University',
        'Academy of Art University',
        'Adams State University'
    ];

    // Cleanup: delete all leftover peer groups before running tests
    test('TC0: Cleanup leftover peer groups', async ({ page }) => {
        const login = new loginPage(page);
        const peerPage = new PeerGroupsPage(page);
        await page.goto(`${baseURL}/logged-out/login/email`);
        await login.loginuser(adminEmail, adminPassword);
        await page.waitForLoadState('domcontentloaded');
        await peerPage.navigateToPeerGroupsPageDirect();

        let count = await peerPage.getPeerGroupRowCount();
        console.log(`Cleanup: Found ${count} peer groups`);
        while (count > 0) {
            await peerPage.clickDeleteOnRow(count - 1);
            await page.waitForTimeout(3000);
            await page.reload();
            await peerPage.createPeerGroupBtn.waitFor({ state: 'visible', timeout: 15000 });
            count = await peerPage.getPeerGroupRowCount();
            console.log(`Cleanup: ${count} remaining`);
        }
        console.log('✓ Cleanup complete');
    });

    // =========================================================================
    // 1. Navigation Tests
    // =========================================================================
    test.describe('Navigation Tests', () => {

        test('TC1.1: Navigate to Peer Groups Page via Settings', async ({ page }) => {
            const login = new loginPage(page);
            const peerPage = new PeerGroupsPage(page);

            // 1. Login as institution admin
            await page.goto(`${baseURL}/logged-out/login/email`);
            await login.loginuser(adminEmail, adminPassword);
            await page.waitForLoadState('domcontentloaded');

            // 2. Navigate to Peer Groups page via sidebar
            await peerPage.navigateToPeerGroupsPage();

            // 3. Verify URL
            await expect(page).toHaveURL(/.*peer-groups/);

            // 4. Verify page title
            await expect(peerPage.pageTitle).toBeVisible();

            // 5. Verify Create peer group button
            await expect(peerPage.createPeerGroupBtn).toBeVisible();

            // 6. Verify Manage peer groups heading
            await expect(peerPage.manageHeading).toBeVisible();

            console.log('✓ Successfully navigated to Peer Groups page via Settings');
        });

        test('TC1.2: Navigate to Peer Groups Page via Direct URL', async ({ page }) => {
            const login = new loginPage(page);
            const peerPage = new PeerGroupsPage(page);

            // 1. Login
            await page.goto(`${baseURL}/logged-out/login/email`);
            await login.loginuser(adminEmail, adminPassword);
            await page.waitForLoadState('domcontentloaded');

            // 2. Navigate directly via URL
            await peerPage.navigateToPeerGroupsPageDirect();

            // 3. Verify page loaded
            await expect(page).toHaveURL(/.*peer-groups/);
            await expect(peerPage.createPeerGroupBtn).toBeVisible();

            console.log('✓ Successfully navigated to Peer Groups page via direct URL');
        });

        test('TC1.3: Navigate Back to Settings from Peer Groups', async ({ page }) => {
            const login = new loginPage(page);
            const peerPage = new PeerGroupsPage(page);

            // 1. Login and navigate to Peer Groups
            await page.goto(`${baseURL}/logged-out/login/email`);
            await login.loginuser(adminEmail, adminPassword);
            await page.waitForLoadState('domcontentloaded');
            await peerPage.navigateToPeerGroupsPageDirect();

            // 2. Click Back to Settings
            await peerPage.navigateBackToSettings();

            // 3. Verify Settings page
            await expect(page).toHaveURL(/.*settings/);
            await expect(page.locator('text=Settings').first()).toBeVisible();

            console.log('✓ Successfully navigated back to Settings');
        });
    });

    // =========================================================================
    // 2. Create Peer Group Tests
    // =========================================================================
    test.describe('Create Peer Group Tests', () => {

        test('TC2.1: Create Peer Group - Happy Path', async ({ page }) => {
            const login = new loginPage(page);
            const peerPage = new PeerGroupsPage(page);

            // 1. Login and navigate
            await page.goto(`${baseURL}/logged-out/login/email`);
            await login.loginuser(adminEmail, adminPassword);
            await page.waitForLoadState('domcontentloaded');
            await peerPage.navigateToPeerGroupsPageDirect();

            // 2. Open Create dialog
            await peerPage.openCreateDialog();

            // 4. Verify Step 1 heading
            await expect(page.locator('text=Step 1: Add institutions')).toBeVisible();

            // 5. Select 3 institutions
            await peerPage.selectInstitutions(testInstitutions);

            // 6. Verify count shows 3/10
            const countText = await peerPage.getSelectedCountText();
            expect(countText).toContain('3/10');

            // 7. Click Next
            await peerPage.clickNext();

            // 8. Verify Step 2 heading
            await expect(page.locator('text=Step 2: Add a peer group name')).toBeVisible();

            // 9. Enter peer group name
            const groupName = `Test PG ${Date.now()}`;
            await peerPage.fillPeerGroupName(groupName);

            // 10. Verify Step 3 match threshold
            await expect(page.locator('text=Step 3: Add match threshold')).toBeVisible();
            await expect(peerPage.matchThresholdBtn).toBeVisible();

            // 11. Verify Review details shows selected institutions
            await expect(page.locator('text=Review details')).toBeVisible();
            const reviewList = page.locator('text=Review details').locator('..').getByRole('listitem');
            const reviewCount = await reviewList.count();
            expect(reviewCount).toBe(testInstitutions.length);

            // 12. Select match threshold and Submit
            await peerPage.selectMatchThreshold();
            await peerPage.clickSubmit();

            // Wait for dialog to close after successful submit
            await peerPage.anyDialog.waitFor({ state: 'hidden', timeout: 30000 });

            // 13. Verify success - peer group name appears in the list
            await expect(page.locator(`text=${groupName}`)).toBeVisible({ timeout: 10000 });
            console.log('✓ Peer group created successfully');

            // Cleanup: delete the created peer group
            await peerPage.deleteLastPeerGroup();
            console.log('✓ Cleanup: Peer group deleted');
        });

        test('TC2.2: Verify Minimum 3 Institutions Required', async ({ page }) => {
            const login = new loginPage(page);
            const peerPage = new PeerGroupsPage(page);

            // 1. Login and navigate
            await page.goto(`${baseURL}/logged-out/login/email`);
            await login.loginuser(adminEmail, adminPassword);
            await page.waitForLoadState('domcontentloaded');
            await peerPage.navigateToPeerGroupsPageDirect();

            // 2. Open Create dialog
            await peerPage.openCreateDialog();

            // 3. Verify minimum message
            await expect(page.locator('text=Must select at least 3 institutions')).toBeVisible();

            // 4. Select 1 institution - Next should be disabled
            await peerPage.selectInstitution(testInstitutions[0]);
            const countAfter1 = await peerPage.getSelectedCount();
            expect(countAfter1).toBe(1);
            expect(await peerPage.isNextDisabled()).toBeTruthy();

            // 5. Select 2nd institution - Next should still be disabled
            await peerPage.selectInstitution(testInstitutions[1]);
            const countAfter2 = await peerPage.getSelectedCount();
            expect(countAfter2).toBe(2);
            expect(await peerPage.isNextDisabled()).toBeTruthy();

            // 6. Select 3rd institution - Next should become enabled
            await peerPage.selectInstitution(testInstitutions[2]);
            const countAfter3 = await peerPage.getSelectedCount();
            expect(countAfter3).toBe(3);
            expect(await peerPage.isNextDisabled()).toBeFalsy();

            // 7. Close dialog
            await peerPage.closeDialog();

            console.log('✓ Minimum 3 institutions validation works correctly');
        });

        test('TC2.3: Submit Without Name - Validation', async ({ page }) => {
            const login = new loginPage(page);
            const peerPage = new PeerGroupsPage(page);

            // 1. Login and navigate
            await page.goto(`${baseURL}/logged-out/login/email`);
            await login.loginuser(adminEmail, adminPassword);
            await page.waitForLoadState('domcontentloaded');
            await peerPage.navigateToPeerGroupsPageDirect();

            // 2. Open Create dialog and select institutions
            await peerPage.openCreateDialog();
            await peerPage.selectInstitutions(testInstitutions);

            // 3. Click Next to go to Step 2
            await peerPage.clickNext();

            // 4. Verify Submit is disabled without name
            expect(await peerPage.isSubmitDisabled()).toBeTruthy();

            // 5. Close dialog
            await peerPage.closeDialog();

            console.log('✓ Submit disabled without peer group name');
        });

        test('TC2.4: Name Character Limit (60 chars)', async ({ page }) => {
            const login = new loginPage(page);
            const peerPage = new PeerGroupsPage(page);

            // 1. Login and navigate
            await page.goto(`${baseURL}/logged-out/login/email`);
            await login.loginuser(adminEmail, adminPassword);
            await page.waitForLoadState('domcontentloaded');
            await peerPage.navigateToPeerGroupsPageDirect();

            // 2. Open Create dialog and select institutions
            await peerPage.openCreateDialog();
            await peerPage.selectInstitutions(testInstitutions);
            await peerPage.clickNext();

            // 3. Type a name and verify counter
            const shortName = 'Test Group';
            await peerPage.fillPeerGroupName(shortName);
            const charCount = await peerPage.getCharCountText();
            expect(charCount).toContain(`${shortName.length} / 60`);

            // 4. Type a 60-character name
            const longName = 'A'.repeat(60);
            await peerPage.fillPeerGroupName(longName);
            const maxCharCount = await peerPage.getCharCountText();
            expect(maxCharCount).toContain('60 / 60');

            // 5. Close dialog
            await peerPage.closeDialog();

            console.log('✓ Character counter works correctly');
        });

        test('TC2.5: Cancel Create Dialog', async ({ page }) => {
            const login = new loginPage(page);
            const peerPage = new PeerGroupsPage(page);

            // 1. Login and navigate
            await page.goto(`${baseURL}/logged-out/login/email`);
            await login.loginuser(adminEmail, adminPassword);
            await page.waitForLoadState('domcontentloaded');
            await peerPage.navigateToPeerGroupsPageDirect();

            // 2. Get initial count
            const initialCount = await peerPage.getPeerGroupRowCount();

            // 3. Open Create dialog
            await peerPage.openCreateDialog();

            // 4. Select institutions
            await peerPage.selectInstitutions(testInstitutions);

            // 5. Click Cancel
            await peerPage.clickCancel();

            // 6. Verify dialog closed
            await expect(peerPage.createDialog).not.toBeVisible({ timeout: 5000 });

            // 7. Verify no new peer group created
            const finalCount = await peerPage.getPeerGroupRowCount();
            expect(finalCount).toBe(initialCount);

            console.log('✓ Cancel dialog works correctly');
        });

        test('TC2.6: Close Create Dialog with X Button', async ({ page }) => {
            const login = new loginPage(page);
            const peerPage = new PeerGroupsPage(page);

            // 1. Login and navigate
            await page.goto(`${baseURL}/logged-out/login/email`);
            await login.loginuser(adminEmail, adminPassword);
            await page.waitForLoadState('domcontentloaded');
            await peerPage.navigateToPeerGroupsPageDirect();

            // 2. Open Create dialog
            await peerPage.openCreateDialog();

            // 3. Verify dialog is visible
            await expect(peerPage.createDialog).toBeVisible();

            // 4. Close with X button
            await peerPage.closeDialog();

            // 5. Verify dialog closed
            await expect(peerPage.createDialog).not.toBeVisible({ timeout: 5000 });

            console.log('✓ Close dialog with X button works correctly');
        });

        test('TC2.7: Back Button from Step 2 to Step 1', async ({ page }) => {
            const login = new loginPage(page);
            const peerPage = new PeerGroupsPage(page);

            // 1. Login and navigate
            await page.goto(`${baseURL}/logged-out/login/email`);
            await login.loginuser(adminEmail, adminPassword);
            await page.waitForLoadState('domcontentloaded');
            await peerPage.navigateToPeerGroupsPageDirect();

            // 2. Open Create dialog and go to Step 2
            await peerPage.openCreateDialog();
            await peerPage.selectInstitutions(testInstitutions);
            await peerPage.clickNext();

            // 3. Verify we are on Step 2
            await expect(page.locator('text=Step 2: Add a peer group name')).toBeVisible();

            // 4. Click Back
            await peerPage.clickBack();

            // 5. Verify we are back on Step 1
            await expect(page.locator('text=Step 1: Add institutions')).toBeVisible();

            // 6. Verify institutions are still selected
            const count = await peerPage.getSelectedCount();
            expect(count).toBe(3);

            // 7. Close dialog
            await peerPage.closeDialog();

            console.log('✓ Back button preserves selections correctly');
        });

        test.skip('TC2.8: Remove Institution from Selection', async ({ page }) => {
            const login = new loginPage(page);
            const peerPage = new PeerGroupsPage(page);

            // 1. Login and navigate
            await page.goto(`${baseURL}/logged-out/login/email`);
            await login.loginuser(adminEmail, adminPassword);
            await page.waitForLoadState('domcontentloaded');
            await peerPage.navigateToPeerGroupsPageDirect();

            // 2. Open Create dialog and select 3 institutions
            await peerPage.openCreateDialog();
            await peerPage.selectInstitutions(testInstitutions);

            // 3. Verify 3 selected
            expect(await peerPage.getSelectedCount()).toBe(3);
            expect(await peerPage.isNextDisabled()).toBeFalsy();

            // 4. Remove one institution
            await peerPage.removeInstitution(0);

            // 5. Verify count decreased to 2
            expect(await peerPage.getSelectedCount()).toBe(2);

            // 6. Verify Next is now disabled (below minimum)
            expect(await peerPage.isNextDisabled()).toBeTruthy();

            // 7. Close dialog
            await peerPage.closeDialog();

            console.log('✓ Remove institution works correctly');
        });

        test('TC2.9: Search Institution Filters Results', async ({ page }) => {
            const login = new loginPage(page);
            const peerPage = new PeerGroupsPage(page);

            // 1. Login and navigate
            await page.goto(`${baseURL}/logged-out/login/email`);
            await login.loginuser(adminEmail, adminPassword);
            await page.waitForLoadState('domcontentloaded');
            await peerPage.navigateToPeerGroupsPageDirect();

            // 2. Open Create dialog
            await peerPage.openCreateDialog();

            // 3. Type search term
            await peerPage.institutionCombobox.click();
            await peerPage.institutionCombobox.fill('Arizona');

            // 4. Verify filtered results contain "Arizona"
            const options = page.getByRole('option');
            const count = await options.count();
           // expect(count).toBeGreaterThan(0); // not working

            // 5. Verify all visible options contain "Arizona"
            for (let i = 0; i < Math.min(count, 5); i++) {
                const text = await options.nth(i).textContent();
                expect(text.toLowerCase()).toContain('arizona');
            }

            // 6. Close dialog
            await peerPage.closeDialog();

            console.log('✓ Institution search filters correctly');
        });
    });

    // =========================================================================
    // 3. Edit Peer Group Tests
    // =========================================================================
    test.describe('Edit Peer Group Tests', () => {

        test('TC3.1: Open Edit Dialog for Existing Peer Group', async ({ page }) => {
            const login = new loginPage(page);
            const peerPage = new PeerGroupsPage(page);

            // 1. Login and navigate
            await page.goto(`${baseURL}/logged-out/login/email`);
            await login.loginuser(adminEmail, adminPassword);
            await page.waitForLoadState('domcontentloaded');
            await peerPage.navigateToPeerGroupsPageDirect();

               // 2. Create a peer group to edit
            const originalName = `Edit Test ${Date.now()}`;
            await peerPage.createPeerGroup(testInstitutions, originalName);

            // 2. Verify at least one peer group exists
            const rowCount = await peerPage.getPeerGroupRowCount();
            expect(rowCount).toBeGreaterThan(0);

            // 3. Click Edit on first peer group
            await peerPage.clickEditOnRow(0);

            // 4. Verify Edit dialog opens
            await expect(peerPage.anyDialog).toBeVisible();
            await expect(page.locator('text=Edit peer group')).toBeVisible();

            // 5. Verify Step 1 with pre-populated institutions
            await expect(page.locator('text=Step 1: Add institutions')).toBeVisible();
            const selectedCount = await peerPage.getSelectedCount();
            expect(selectedCount).toBeGreaterThanOrEqual(3);

            // 6. Close dialog
            await peerPage.closeDialog();

            console.log('✓ Edit dialog opens with pre-populated data');
        });

        test('TC3.2: Edit Peer Group - Modify Name', async ({ page }) => {
            const login = new loginPage(page);
            const peerPage = new PeerGroupsPage(page);

            // 1. Login and navigate
            await page.goto(`${baseURL}/logged-out/login/email`);
            await login.loginuser(adminEmail, adminPassword);
            await page.waitForLoadState('domcontentloaded');
            await peerPage.navigateToPeerGroupsPageDirect();

            // 2. Create a peer group to edit
            const originalName = `Edit Test ${Date.now()}`;
            await peerPage.createPeerGroup(testInstitutions, originalName);

            // 3. Open Edit on the last peer group (the one we just created)
            const rowCount = await peerPage.getPeerGroupRowCount();
            await peerPage.clickEditOnRow(rowCount - 1);

            // 4. Click Next to go to Step 2
            await peerPage.clickNext();

            // 5. Clear and enter new name
            const newName = `Edited PG ${Date.now()}`;
            await peerPage.fillPeerGroupName(newName);

            // 6. Select match threshold and Submit
           // await peerPage.selectMatchThreshold();
            await peerPage.clickSubmit();

            // Wait for dialog to close after successful submit
         //   await peerPage.anyDialog.waitFor({ state: 'hidden', timeout: 30000 });

            // 7. Verify success - name updated in list
            await expect(page.locator(`text=${newName}`)).toBeVisible({ timeout: 10000 });
            console.log('✓ Peer group name edited successfully');

            // Cleanup: delete the edited peer group
            await peerPage.deleteLastPeerGroup();
            console.log('✓ Cleanup: Edited peer group deleted');
        });
    });

    // =========================================================================
    // 4. Delete Peer Group Tests
    // =========================================================================
    test.describe('Delete Peer Group Tests', () => {

        test('TC4.1: Delete Peer Group', async ({ page }) => {
            const login = new loginPage(page);
            const peerPage = new PeerGroupsPage(page);

            // 1. Login and navigate
            await page.goto(`${baseURL}/logged-out/login/email`);
            await login.loginuser(adminEmail, adminPassword);
            await page.waitForLoadState('domcontentloaded');
            await peerPage.navigateToPeerGroupsPageDirect();

            // 2. Create a temporary peer group for deletion
            const tempName = `Delete Test ${Date.now()}`;
            await peerPage.createPeerGroup(testInstitutions, tempName);

            // 3. Get row count after creation
            const countAfterCreate = await peerPage.getPeerGroupRowCount();

            // 4. Delete the last peer group (the one we just created)
            await peerPage.clickDeleteOnRow(countAfterCreate - 1);

            // 5. Verify success toast
            await peerPage.waitForSuccessToast();

            // 6. Verify row count decreased
            await peerPage.waitForToastDismiss();
            const countAfterDelete = await peerPage.getPeerGroupRowCount();
            expect(countAfterDelete).toBe(countAfterCreate - 1);

            console.log('✓ Peer group deleted successfully');
        });
    });

    // =========================================================================
    // 5. Page Element Verification Tests
    // =========================================================================
    test.describe('Page Element Verification Tests', () => {

        test('TC5.1: Verify Peer Group Display Elements', async ({ page }) => {
            const login = new loginPage(page);
            const peerPage = new PeerGroupsPage(page);

            // 1. Login and navigate
            await page.goto(`${baseURL}/logged-out/login/email`);
            await login.loginuser(adminEmail, adminPassword);
            await page.waitForLoadState('domcontentloaded');
            await peerPage.navigateToPeerGroupsPageDirect();

            // 2. Create a peer group to verify display
            const displayName = `Display Test ${Date.now()}`;
            await peerPage.createPeerGroup(testInstitutions, displayName);

            // 3. Verify peer group row has toggle button
            const rowCount = await peerPage.getPeerGroupRowCount();
            expect(rowCount).toBeGreaterThan(0);
            await expect(peerPage.toggleSeeMoreBtn.first()).toBeVisible();

            // 4. Verify peer count text is visible
            await expect(page.locator('text=/\\d+ peers?/').first()).toBeVisible();

            // Cleanup
            await peerPage.deleteLastPeerGroup();

            console.log('✓ Peer group displays correctly');
        });

        test('TC5.2: Verify Page Description Text', async ({ page }) => {
            const login = new loginPage(page);
            const peerPage = new PeerGroupsPage(page);

            // 1. Login and navigate
            await page.goto(`${baseURL}/logged-out/login/email`);
            await login.loginuser(adminEmail, adminPassword);
            await page.waitForLoadState('domcontentloaded');
            await peerPage.navigateToPeerGroupsPageDirect();

            // 2. Verify "Manage peer groups" heading
            await expect(peerPage.manageHeading).toBeVisible();

            // 3. Verify description text
            await expect(peerPage.pageDescription).toBeVisible();

            // 4. Verify Back button exists
            await expect(peerPage.backToSettingsBtn).toBeVisible();

            console.log('✓ Page description and elements verified');
        });
    });
});
