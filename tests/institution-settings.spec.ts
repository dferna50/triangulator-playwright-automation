import { test, expect } from '../fixtures/test';

const BASE_URL = (process.env.BASE_URL ?? 'https://qa.creditmobility.net').replace(/\/$/, '');
const INST_ADMIN_EMAIL = 'testtriangulator+109@gmail.com';
const INST_ADMIN_PASSWORD = '#TransferTri1';
const SETTINGS_URL = `${BASE_URL}/app/my-workspace/inst-admin/inst/settings/`;

async function loginAndGoToSettings(institutionSettingsPage: any, loginPage: any): Promise<void> {
    await loginPage.page.goto(`${BASE_URL}/logged-out/login/email`);
    await loginPage.loginUser(INST_ADMIN_EMAIL, INST_ADMIN_PASSWORD);
    await loginPage.page.goto(SETTINGS_URL);
    await loginPage.page.waitForURL('**/inst/settings/**', { timeout: 30000 });
    await loginPage.page.waitForLoadState('domcontentloaded');
}

test.describe('Institution Settings Tests', () => {

    // =========================================================================
    // 1. Navigation Tests
    // =========================================================================
    test.describe('1. Navigation Tests', () => {

        test('TC1.1: Navigate to Institution Settings via My Workplace sidebar', async ({ loginPage, institutionSettingsPage }) => {
            // Login to dashboard, then use sidebar navigation
            await loginPage.page.goto(`${BASE_URL}/logged-out/login/email`);
            await loginPage.loginUser(INST_ADMIN_EMAIL, INST_ADMIN_PASSWORD);

            // Navigate via My Workplace -> Settings in sidebar
            await institutionSettingsPage.navigateToSettings();

            // Verify URL
            await expect(loginPage.page).toHaveURL(/.*\/inst\/settings\//);
        });

        test('TC1.2: Navigate directly to Settings URL', async ({ loginPage, institutionSettingsPage }) => {
            // Login then navigate directly to settings URL
            await loginPage.page.goto(`${BASE_URL}/logged-out/login/email`);
            await loginPage.loginUser(INST_ADMIN_EMAIL, INST_ADMIN_PASSWORD);
            await loginPage.page.goto(SETTINGS_URL);
            await loginPage.page.waitForLoadState('domcontentloaded');

            // Verify we land on the correct page
            await expect(loginPage.page).toHaveURL(/.*\/inst\/settings\//);
            await expect(institutionSettingsPage.pageTitle).toBeVisible();
        });

        test('TC1.3: Settings link is active in sidebar when on settings page', async ({ loginPage, institutionSettingsPage }) => {
            // Login and navigate to settings
            await loginAndGoToSettings(institutionSettingsPage, loginPage);

            // Verify the Settings link uses font-bold class to indicate active state
            const activeSettingsLink = await institutionSettingsPage.getActiveSettingsLink();
            await expect(activeSettingsLink).toHaveClass(/font-bold/);
        });

        test('TC1.4: Verify page title is "Settings - Triangulator"', async ({ loginPage, institutionSettingsPage }) => {
            await loginAndGoToSettings(institutionSettingsPage, loginPage);

            await expect(loginPage.page).toHaveTitle('Settings - Triangulator');
        });
    });

    // =========================================================================
    // 2. Page Layout & Structure Tests
    // =========================================================================
    test.describe('2. Page Layout and Structure Tests', () => {

        test('TC2.1: Verify page heading and breadcrumb are visible', async ({ page, loginPage, institutionSettingsPage }) => {
            await loginAndGoToSettings(institutionSettingsPage, loginPage);

            // Verify heading and breadcrumb
            await expect(institutionSettingsPage.pageTitle).toBeVisible();
            await expect(institutionSettingsPage.breadcrumbLabel).toBeVisible();
        });

        test.skip('TC2.2: Verify institution info card is visible with correct institution name and location', async ({ page, loginPage, institutionSettingsPage }) => {
            await loginAndGoToSettings(institutionSettingsPage, loginPage);

            // Verify institution card elements
            await expect(institutionSettingsPage.institutionName).toBeVisible();
            await expect(institutionSettingsPage.institutionLocation).toBeVisible();
        });

        test('TC2.3: Verify all seven sections are visible on the Settings page', async ({ page, loginPage, institutionSettingsPage }) => {
            await loginAndGoToSettings(institutionSettingsPage, loginPage);

            // Verify all sections
            await expect(institutionSettingsPage.suggestionManagementSection).toBeVisible();
            await expect(institutionSettingsPage.institutionConfigSection).toBeVisible();
            await expect(institutionSettingsPage.alignSuggestionsSection).toBeVisible();
            await expect(institutionSettingsPage.stateConnectSection).toBeVisible();
            await expect(institutionSettingsPage.workflowConfigSection).toBeVisible();
            await expect(institutionSettingsPage.codingSchemeSection).toBeVisible();
            await expect(institutionSettingsPage.apiAccessTokenSection).toBeVisible();
        });

        test('TC2.4: Verify Save button is disabled by default (no changes)', async ({ page, loginPage, institutionSettingsPage }) => {
            await loginAndGoToSettings(institutionSettingsPage, loginPage);

            // Save button should be disabled when no changes have been made
            await expect(institutionSettingsPage.saveButton).toBeDisabled();
            await expect(institutionSettingsPage.saveButton).toBeVisible();
        });

        test('TC2.5: Verify My Workplace sidebar navigation items are visible', async ({ page, loginPage, institutionSettingsPage }) => {
            await loginAndGoToSettings(institutionSettingsPage, loginPage);

            // Sidebar navigation items
            await expect(institutionSettingsPage.usersHeading).toBeVisible();
            await expect(institutionSettingsPage.allLink).toBeVisible();
            await expect(institutionSettingsPage.requestsLink).toBeVisible();
            await expect(institutionSettingsPage.generalContactLink).toBeVisible();
            await expect(institutionSettingsPage.institutionHeading).toBeVisible();
            await expect(institutionSettingsPage.summaryLink).toBeVisible();
            await expect(institutionSettingsPage.profileLink).toBeVisible();
            await expect(institutionSettingsPage.ipedsLink).toBeVisible();
        });
    });

    // =========================================================================
    // 3. Suggestion Management Tests
    // =========================================================================
    test.describe('3. Suggestion Management Tests', () => {

        test('TC3.1: Verify Suggestion Management section has correct heading and description', async ({ page, loginPage, institutionSettingsPage }) => {
            await loginAndGoToSettings(institutionSettingsPage, loginPage);

            await expect(institutionSettingsPage.suggestionManagementHeading).toBeVisible();
            await expect(institutionSettingsPage.suggestionManagementDescription).toBeVisible();
        });

        test('TC3.2: Verify Frequency dropdown is visible with default value "Daily"', async ({ page, loginPage, institutionSettingsPage }) => {
            await loginAndGoToSettings(institutionSettingsPage, loginPage);

            await expect(institutionSettingsPage.frequencyCombobox).toBeVisible();
            const frequencyValue = await institutionSettingsPage.getFrequencyValue();
            expect(frequencyValue).toBe('Daily');
        });

        test('TC3.3: Verify all Frequency dropdown options are available', async ({ page, loginPage, institutionSettingsPage }) => {
            await loginAndGoToSettings(institutionSettingsPage, loginPage);

            const expectedOptions = ['Daily', 'Weekly', 'Bi-Weekly', 'Monthly', 'Pause'];
            const actualOptions = await institutionSettingsPage.getFrequencyOptions();

            for (const expected of expectedOptions) {
                expect(actualOptions.some((o) => o.includes(expected))).toBeTruthy();
            }
        });

        test('TC3.4: Changing Frequency enables the Save button', async ({ page, loginPage, institutionSettingsPage }) => {
            await loginAndGoToSettings(institutionSettingsPage, loginPage);

            // Save should be disabled initially
            await expect(institutionSettingsPage.saveButton).toBeDisabled();

            // Change frequency to Weekly
            await institutionSettingsPage.selectFrequency('Weekly');

            // Save should now be enabled
            await expect(institutionSettingsPage.saveButton).toBeEnabled();

            // Restore original value - set back to Daily and save
            await institutionSettingsPage.selectFrequency('Daily');
            await institutionSettingsPage.saveSettings();
        });

        test('TC3.5: Change Frequency to Weekly and save successfully', async ({ page, loginPage, institutionSettingsPage }) => {
            await loginAndGoToSettings(institutionSettingsPage, loginPage);

            // Change to Weekly
            await institutionSettingsPage.selectFrequency('Weekly');
            await institutionSettingsPage.saveSettings();

            // After save, button should be disabled again
            await expect(institutionSettingsPage.saveButton).toBeDisabled();

            // Verify the saved value persists
            const savedValue = await institutionSettingsPage.getFrequencyValue();
            expect(savedValue).toBe('Weekly');

            // Restore to Daily
            await institutionSettingsPage.selectFrequency('Daily');
            await institutionSettingsPage.saveSettings();
        });

        test('TC3.6: Change Frequency to Bi-Weekly and save successfully', async ({ page, loginPage, institutionSettingsPage }) => {
            await loginAndGoToSettings(institutionSettingsPage, loginPage);

            await institutionSettingsPage.selectFrequency('Bi-Weekly');
            await institutionSettingsPage.saveSettings();

            await expect(institutionSettingsPage.saveButton).toBeDisabled();
            const savedValue = await institutionSettingsPage.getFrequencyValue();
            expect(savedValue).toBe('Bi-Weekly');

            // Restore to Daily
            await institutionSettingsPage.selectFrequency('Daily');
            await institutionSettingsPage.saveSettings();
        });

        test('TC3.7: Change Frequency to Monthly and save successfully', async ({ page, loginPage, institutionSettingsPage }) => {
            await loginAndGoToSettings(institutionSettingsPage, loginPage);

            await institutionSettingsPage.selectFrequency('Monthly');
            await institutionSettingsPage.saveSettings();

            await expect(institutionSettingsPage.saveButton).toBeDisabled();
            const savedValue = await institutionSettingsPage.getFrequencyValue();
            expect(savedValue).toBe('Monthly');

            // Restore to Daily
            await institutionSettingsPage.selectFrequency('Daily');
            await institutionSettingsPage.saveSettings();
        });

        test('TC3.8: Change Frequency to Pause and save successfully', async ({ page, loginPage, institutionSettingsPage }) => {
            await loginAndGoToSettings(institutionSettingsPage, loginPage);

            await institutionSettingsPage.selectFrequency('Pause');
            await institutionSettingsPage.saveSettings();

            await expect(institutionSettingsPage.saveButton).toBeDisabled();
            const savedValue = await institutionSettingsPage.getFrequencyValue();
            expect(savedValue).toBe('Pause');

            // Restore to Daily
            await institutionSettingsPage.selectFrequency('Daily');
            await institutionSettingsPage.saveSettings();
        });

        test('TC3.9: Frequency dropdown can be dismissed with Escape key', async ({ page, loginPage, institutionSettingsPage }) => {
            await loginAndGoToSettings(institutionSettingsPage, loginPage);

            // Open the dropdown
            await institutionSettingsPage.frequencyCombobox.click();
            await expect(institutionSettingsPage.getOptionByName('Weekly')).toBeVisible();

            // Dismiss with Escape
            await institutionSettingsPage.pressEscape();
            await expect(institutionSettingsPage.getOptionByName('Weekly')).not.toBeVisible();

            // Save button should remain disabled (no change made)
            await expect(institutionSettingsPage.saveButton).toBeDisabled();
        });
    });

    // =========================================================================
    // 4. Institution Configurations Tests
    // =========================================================================
    test.describe('4. Institution Configurations Tests', () => {

        test('TC4.1: Verify Institution configurations section heading and description are visible', async ({ page, loginPage, institutionSettingsPage }) => {
            await loginAndGoToSettings(institutionSettingsPage, loginPage);

            await expect(institutionSettingsPage.institutionConfigHeading).toBeVisible();
            await expect(institutionSettingsPage.institutionConfigDescription).toBeVisible();
        });

        test('TC4.2: Verify "See all" link is visible for Institution configurations', async ({ page, loginPage, institutionSettingsPage }) => {
            await loginAndGoToSettings(institutionSettingsPage, loginPage);

            await expect(institutionSettingsPage.institutionConfigSeeAllLink).toBeVisible();
        });

        test('TC4.3: "See all" link navigates to suggestion-configs sub-page', async ({ page, loginPage, institutionSettingsPage }) => {
            await loginAndGoToSettings(institutionSettingsPage, loginPage);

            // Click "See all" link for institution configurations
            await institutionSettingsPage.institutionConfigSeeAllLink.click();
            await page.waitForLoadState('domcontentloaded');

            await expect(page).toHaveURL(/.*suggestion-configs/);
        });

        test('TC4.4: Navigate back to Settings from Institution Configurations page', async ({ page, loginPage, institutionSettingsPage }) => {
            await loginAndGoToSettings(institutionSettingsPage, loginPage);

            await institutionSettingsPage.institutionConfigSeeAllLink.click();
            await page.waitForLoadState('domcontentloaded');
            await expect(page).toHaveURL(/.*suggestion-configs/);

            // Go back to settings
            await page.goBack();
            await page.waitForLoadState('domcontentloaded');
            await expect(page).toHaveURL(/.*\/inst\/settings\//);
        });
    });

    // =========================================================================
    // 5. Receive Align Suggestions Tests
    // =========================================================================
    test.describe('5. Receive Align Suggestions Tests', () => {

        test('TC5.1: Verify Receive align suggestions section heading is visible', async ({ page, loginPage, institutionSettingsPage }) => {
            await loginAndGoToSettings(institutionSettingsPage, loginPage);

            await expect(institutionSettingsPage.alignSuggestionsHeading).toBeVisible();
        });

        test.skip('TC5.2: Verify "Align to peers" checkbox is visible and checked by default', async ({ page, loginPage, institutionSettingsPage }) => {
            await loginAndGoToSettings(institutionSettingsPage, loginPage);

            await expect(institutionSettingsPage.alignToPeersCheckbox).toBeVisible();
            await expect(institutionSettingsPage.alignToPeersCheckbox).toBeChecked();
        });

        test.skip('TC5.3: Toggling "Align to peers" checkbox enables the Save button', async ({ page, loginPage, institutionSettingsPage }) => {
            await loginAndGoToSettings(institutionSettingsPage, loginPage);

            // Save should be disabled initially
            await expect(institutionSettingsPage.saveButton).toBeDisabled();

            // Toggle Align to peers off
            await institutionSettingsPage.toggleAlignToPeers();
            await expect(institutionSettingsPage.alignToPeersCheckbox).not.toBeChecked();

            // Save should now be enabled
            await expect(institutionSettingsPage.saveButton).toBeEnabled();

            // Restore - toggle back on and save
            await institutionSettingsPage.toggleAlignToPeers();
            await expect(institutionSettingsPage.alignToPeersCheckbox).toBeChecked();
            await institutionSettingsPage.saveSettings();
        });

        test.skip('TC5.4: Uncheck "Align to peers" and save, then verify it remains unchecked', async ({ page, loginPage, institutionSettingsPage }) => {
            await loginAndGoToSettings(institutionSettingsPage, loginPage);

            // Uncheck Align to peers
            await institutionSettingsPage.toggleAlignToPeers();
            await expect(institutionSettingsPage.alignToPeersCheckbox).not.toBeChecked();
            await institutionSettingsPage.saveSettings();

            // Verify Save is disabled after save
            await expect(institutionSettingsPage.saveButton).toBeDisabled();
            await expect(institutionSettingsPage.alignToPeersCheckbox).not.toBeChecked();

            // Restore - re-enable and save
            await institutionSettingsPage.toggleAlignToPeers();
            await institutionSettingsPage.saveSettings();
            await expect(institutionSettingsPage.alignToPeersCheckbox).toBeChecked();
        });

        test('TC5.5: Verify "See all" link is visible for Peer Groups', async ({ page, loginPage, institutionSettingsPage }) => {
            await loginAndGoToSettings(institutionSettingsPage, loginPage);

            await expect(institutionSettingsPage.peerGroupsSeeAllLink).toBeVisible();
        });

        test('TC5.6: "See all" link navigates to peer-groups sub-page', async ({ page, loginPage, institutionSettingsPage }) => {
            await loginAndGoToSettings(institutionSettingsPage, loginPage);

            await institutionSettingsPage.peerGroupsSeeAllLink.click();
            await page.waitForLoadState('domcontentloaded');

            await expect(page).toHaveURL(/.*peer-groups/);
        });
    });

    // =========================================================================
    // 6. Receive State Connect Suggestions Tests
    // =========================================================================
    test.describe('6. Receive State Connect Suggestions Tests', () => {

        test('TC6.1: Verify Receive state connect suggestions section heading is visible', async ({ page, loginPage, institutionSettingsPage }) => {
            await loginAndGoToSettings(institutionSettingsPage, loginPage);

            await expect(institutionSettingsPage.stateConnectHeading).toBeVisible();
        });

        test('TC6.2: Verify "State connect" checkbox is visible and checked by default', async ({ page, loginPage, institutionSettingsPage }) => {
            await loginAndGoToSettings(institutionSettingsPage, loginPage);

            await expect(institutionSettingsPage.stateConnectCheckbox).toBeVisible();
            await expect(institutionSettingsPage.stateConnectCheckbox).toBeChecked();
        });

        test('TC6.3: Verify "State align" checkbox is visible and checked by default', async ({ page, loginPage, institutionSettingsPage }) => {
            await loginAndGoToSettings(institutionSettingsPage, loginPage);

            await expect(institutionSettingsPage.stateAlignCheckbox).toBeVisible();
            await expect(institutionSettingsPage.stateAlignCheckbox).toBeChecked();
        });

        test('TC6.4: Verify Threshold dropdown is visible with default value "60"', async ({ page, loginPage, institutionSettingsPage }) => {
            await loginAndGoToSettings(institutionSettingsPage, loginPage);

            await expect(institutionSettingsPage.thresholdCombobox).toBeVisible();
            const thresholdValue = await institutionSettingsPage.getThresholdValue();
            expect(thresholdValue).toBe('60');
        });

        test('TC6.5: Verify all Threshold dropdown options are available', async ({ page, loginPage, institutionSettingsPage }) => {
            await loginAndGoToSettings(institutionSettingsPage, loginPage);

            const expectedOptions = ['60', '65', '70', '75', '80', '85', '90', '95'];
            const actualOptions = await institutionSettingsPage.getThresholdOptions();

            for (const expected of expectedOptions) {
                expect(actualOptions.some((o) => o.includes(expected))).toBeTruthy();
            }
        });

        test.skip('TC6.6: Toggling "State connect" checkbox enables the Save button', async ({ page, loginPage, institutionSettingsPage }) => {
            await loginAndGoToSettings(institutionSettingsPage, loginPage);

            await expect(institutionSettingsPage.saveButton).toBeDisabled();

            // Toggle State connect off
            await institutionSettingsPage.toggleStateConnect();
            await expect(institutionSettingsPage.stateConnectCheckbox).not.toBeChecked();
            await expect(institutionSettingsPage.saveButton).toBeEnabled();

            // Restore
            await institutionSettingsPage.toggleStateConnect();
            await expect(institutionSettingsPage.stateConnectCheckbox).toBeChecked();
            await institutionSettingsPage.saveSettings();
        });

        test('TC6.7: Toggling "State align" checkbox enables the Save button', async ({ page, loginPage, institutionSettingsPage }) => {
            await loginAndGoToSettings(institutionSettingsPage, loginPage);

            await expect(institutionSettingsPage.saveButton).toBeDisabled();

            // Toggle State align off
            await institutionSettingsPage.toggleStateAlign();
            await expect(institutionSettingsPage.stateAlignCheckbox).not.toBeChecked();
            await expect(institutionSettingsPage.saveButton).toBeEnabled();

            // Restore
            await institutionSettingsPage.toggleStateAlign();
            await expect(institutionSettingsPage.stateAlignCheckbox).toBeChecked();
            await institutionSettingsPage.saveSettings();
        });

        test('TC6.8: Changing Threshold value enables the Save button', async ({ page, loginPage, institutionSettingsPage }) => {
            await loginAndGoToSettings(institutionSettingsPage, loginPage);

            await expect(institutionSettingsPage.saveButton).toBeDisabled();

            // Change threshold to 70
            await institutionSettingsPage.selectThreshold('70');
            await expect(institutionSettingsPage.saveButton).toBeEnabled();

            // Restore to 60
            await institutionSettingsPage.selectThreshold('60');
            await institutionSettingsPage.saveSettings();
        });

        test('TC6.9: Change Threshold to 80 and save, verify it persists', async ({ page, loginPage, institutionSettingsPage }) => {
            await loginAndGoToSettings(institutionSettingsPage, loginPage);

            await institutionSettingsPage.selectThreshold('80');
            await institutionSettingsPage.saveSettings();

            await expect(institutionSettingsPage.saveButton).toBeDisabled();
            const savedValue = await institutionSettingsPage.getThresholdValue();
            expect(savedValue).toBe('80');

            // Restore to 60
            await institutionSettingsPage.selectThreshold('60');
            await institutionSettingsPage.saveSettings();
        });

        test('TC6.10: Uncheck "State connect" and save, then verify state align and threshold are still present', async ({ page, loginPage, institutionSettingsPage }) => {
            await loginAndGoToSettings(institutionSettingsPage, loginPage);

            // Uncheck State connect
            await institutionSettingsPage.toggleStateConnect();
            await institutionSettingsPage.saveSettings();

            await expect(institutionSettingsPage.saveButton).toBeDisabled();
            await expect(institutionSettingsPage.stateConnectCheckbox).not.toBeChecked();

            // State align and threshold should still be present on the page
            await expect(institutionSettingsPage.stateAlignCheckbox).toBeVisible();
            await expect(institutionSettingsPage.thresholdCombobox).toBeVisible();

            // Restore - re-enable State connect
            await institutionSettingsPage.toggleStateConnect();
            await institutionSettingsPage.saveSettings();
            await expect(institutionSettingsPage.stateConnectCheckbox).toBeChecked();
        });

        test('TC6.11: Threshold dropdown can be dismissed with Escape key', async ({ page, loginPage, institutionSettingsPage }) => {
            await loginAndGoToSettings(institutionSettingsPage, loginPage);

            // Open the threshold dropdown
            await institutionSettingsPage.thresholdCombobox.click();
            await expect(institutionSettingsPage.getOptionByName('70')).toBeVisible();

            // Dismiss with Escape
            await institutionSettingsPage.pressEscape();
            await expect(institutionSettingsPage.getOptionByName('70')).not.toBeVisible();

            // Save button should remain disabled
            await expect(institutionSettingsPage.saveButton).toBeDisabled();
        });
    });

    // =========================================================================
    // 7. Workflow Configurations Tests
    // =========================================================================
    test.describe('7. Workflow Configurations Tests', () => {

        test('TC7.1: Verify Workflow configurations section heading and description are visible', async ({ page, loginPage, institutionSettingsPage }) => {
            await loginAndGoToSettings(institutionSettingsPage, loginPage);

            await expect(institutionSettingsPage.workflowConfigHeading).toBeVisible();
            await expect(institutionSettingsPage.workflowConfigDescription).toBeVisible();
        });

        test('TC7.2: Verify "See all" link is visible for Workflow configurations', async ({ page, loginPage, institutionSettingsPage }) => {
            await loginAndGoToSettings(institutionSettingsPage, loginPage);

            await expect(institutionSettingsPage.workflowConfigSeeAllLink).toBeVisible();
        });

        test('TC7.3: "See all" link navigates to workflow-configs sub-page', async ({ page, loginPage, institutionSettingsPage }) => {
            await loginAndGoToSettings(institutionSettingsPage, loginPage);

            await institutionSettingsPage.workflowConfigSeeAllLink.click();
            await page.waitForLoadState('domcontentloaded');

            await expect(page).toHaveURL(/.*workflow-configs/);
        });

        test('TC7.4: Navigate back to Settings from Workflow Configurations page', async ({ page, loginPage, institutionSettingsPage }) => {
            await loginAndGoToSettings(institutionSettingsPage, loginPage);

            await institutionSettingsPage.workflowConfigSeeAllLink.click();
            await page.waitForLoadState('domcontentloaded');
            await expect(page).toHaveURL(/.*workflow-configs/);

            await page.goBack();
            await page.waitForLoadState('domcontentloaded');
            await expect(page).toHaveURL(/.*\/inst\/settings\//);
        });
    });

    // =========================================================================
    // 8. Institution Coding Scheme Tests
    // =========================================================================
    test.describe('8. Institution Coding Scheme Tests', () => {

        test('TC8.1: Verify Institution coding scheme section heading and description are visible', async ({ page, loginPage, institutionSettingsPage }) => {
            await loginAndGoToSettings(institutionSettingsPage, loginPage);

            await expect(institutionSettingsPage.codingSchemeHeading).toBeVisible();
            await expect(institutionSettingsPage.codingSchemeDescription).toBeVisible();
        });

        test('TC8.2: Verify Scheme dropdown is visible with default value "IPEDS"', async ({ page, loginPage, institutionSettingsPage }) => {
            await loginAndGoToSettings(institutionSettingsPage, loginPage);

            await expect(institutionSettingsPage.schemeCombobox).toBeVisible();
            const schemeValue = await institutionSettingsPage.getSchemeValue();
            expect(schemeValue).toBe('IPEDS');
        });

        test('TC8.3: Verify all Scheme dropdown options are available', async ({ page, loginPage, institutionSettingsPage }) => {
            await loginAndGoToSettings(institutionSettingsPage, loginPage);

            const expectedSchemes = ['ACT', 'CEEB', 'FICE', 'GEO', 'IPEDS', 'OPEID'];
            const actualSchemes = await institutionSettingsPage.getSchemeOptions();

            for (const expected of expectedSchemes) {
                expect(actualSchemes.some((s) => s.includes(expected))).toBeTruthy();
            }
        });

        test('TC8.4: Changing Scheme enables the Save button', async ({ page, loginPage, institutionSettingsPage }) => {
            await loginAndGoToSettings(institutionSettingsPage, loginPage);

            await expect(institutionSettingsPage.saveButton).toBeDisabled();

            // Change scheme to CEEB
            await institutionSettingsPage.selectScheme('CEEB');
            await expect(institutionSettingsPage.saveButton).toBeEnabled();

            // Restore to IPEDS and save
            await institutionSettingsPage.selectScheme('IPEDS');
            await institutionSettingsPage.saveSettings();
        });

        test('TC8.5: Change Scheme to ACT and save, verify it persists', async ({ page, loginPage, institutionSettingsPage }) => {
            await loginAndGoToSettings(institutionSettingsPage, loginPage);

            await institutionSettingsPage.selectScheme('ACT');
            await institutionSettingsPage.saveSettings();

            await expect(institutionSettingsPage.saveButton).toBeDisabled();
            const savedValue = await institutionSettingsPage.getSchemeValue();
            expect(savedValue).toBe('ACT');

            // Restore to IPEDS
            await institutionSettingsPage.selectScheme('IPEDS');
            await institutionSettingsPage.saveSettings();
        });

        test('TC8.6: Change Scheme to OPEID and save, verify it persists', async ({ page, loginPage, institutionSettingsPage }) => {
            await loginAndGoToSettings(institutionSettingsPage, loginPage);

            await institutionSettingsPage.selectScheme('OPEID');
            await institutionSettingsPage.saveSettings();

            await expect(institutionSettingsPage.saveButton).toBeDisabled();
            const savedValue = await institutionSettingsPage.getSchemeValue();
            expect(savedValue).toBe('OPEID');

            // Restore to IPEDS
            await institutionSettingsPage.selectScheme('IPEDS');
            await institutionSettingsPage.saveSettings();
        });

        test('TC8.7: Scheme dropdown can be dismissed with Escape key', async ({ page, loginPage, institutionSettingsPage }) => {
            await loginAndGoToSettings(institutionSettingsPage, loginPage);

            // Open the scheme dropdown
            await institutionSettingsPage.schemeCombobox.click();
            await expect(institutionSettingsPage.getOptionByName('ACT')).toBeVisible();

            // Dismiss with Escape
            await institutionSettingsPage.pressEscape();
            await expect(institutionSettingsPage.getOptionByName('ACT')).not.toBeVisible();

            // Save button should remain disabled
            await expect(institutionSettingsPage.saveButton).toBeDisabled();
        });
    });

    // =========================================================================
    // 9. API Access Token Tests
    // =========================================================================
    test.describe('9. API Access Token Tests', () => {

        test('TC9.1: Verify API Access Token section heading and description are visible', async ({ page, loginPage, institutionSettingsPage }) => {
            await loginAndGoToSettings(institutionSettingsPage, loginPage);

            await expect(institutionSettingsPage.apiAccessTokenHeading).toBeVisible();
            await expect(institutionSettingsPage.apiAccessTokenDescription).toBeVisible();
        });

        test('TC9.2: Verify "See all" link is visible for API Access Token', async ({ page, loginPage, institutionSettingsPage }) => {
            await loginAndGoToSettings(institutionSettingsPage, loginPage);

            await expect(institutionSettingsPage.apiAccessTokenSeeAllLink).toBeVisible();
        });

        test('TC9.3: "See all" link navigates to api-access-tokens sub-page', async ({ page, loginPage, institutionSettingsPage }) => {
            await loginAndGoToSettings(institutionSettingsPage, loginPage);

            await institutionSettingsPage.apiAccessTokenSeeAllLink.click();
            await page.waitForLoadState('domcontentloaded');

            await expect(page).toHaveURL(/.*api-access-tokens/);
        });

        test('TC9.4: Navigate back to Settings from API Access Token page', async ({ page, loginPage, institutionSettingsPage }) => {
            await loginAndGoToSettings(institutionSettingsPage, loginPage);

            await institutionSettingsPage.apiAccessTokenSeeAllLink.click();
            await page.waitForLoadState('domcontentloaded');
            await expect(page).toHaveURL(/.*api-access-tokens/);

            await page.goBack();
            await page.waitForLoadState('domcontentloaded');
            await expect(page).toHaveURL(/.*\/inst\/settings\//);
        });
    });

    // =========================================================================
    // 10. Save Button Behaviour Tests
    // =========================================================================
    test.describe('10. Save Button Behaviour Tests', () => {

        test('TC10.1: Save button is disabled on initial page load', async ({ page, loginPage, institutionSettingsPage }) => {
            await loginAndGoToSettings(institutionSettingsPage, loginPage);

            await expect(institutionSettingsPage.saveButton).toBeDisabled();
        });

        test('TC10.2: Save button shows "No changes to save" tooltip when disabled', async ({ page, loginPage, institutionSettingsPage }) => {
            await loginAndGoToSettings(institutionSettingsPage, loginPage);

            // The save button wrapper has aria-label="No changes to save" when disabled
            const saveWrapper = page.locator('[aria-label="No changes to save"]');
            await expect(saveWrapper).toBeVisible();
        });

        test('TC10.3: Save button becomes enabled after changing Frequency', async ({ page, loginPage, institutionSettingsPage }) => {
            await loginAndGoToSettings(institutionSettingsPage, loginPage);

            await institutionSettingsPage.selectFrequency('Weekly');
            await expect(institutionSettingsPage.saveButton).toBeEnabled();

            // Restore
            await institutionSettingsPage.selectFrequency('Daily');
            await institutionSettingsPage.saveSettings();
        });

        test.skip('TC10.4: Save button becomes enabled after toggling Align to peers', async ({ page, loginPage, institutionSettingsPage }) => {
            await loginAndGoToSettings(institutionSettingsPage, loginPage);

            await institutionSettingsPage.toggleAlignToPeers();
            await expect(institutionSettingsPage.saveButton).toBeEnabled();

            // Restore
            await institutionSettingsPage.toggleAlignToPeers();
            await institutionSettingsPage.saveSettings();
        });

        test('TC10.5: Save button becomes enabled after toggling State connect', async ({ page, loginPage, institutionSettingsPage }) => {
            await loginAndGoToSettings(institutionSettingsPage, loginPage);

            await institutionSettingsPage.toggleStateConnect();
            await expect(institutionSettingsPage.saveButton).toBeEnabled();

            // Restore
            await institutionSettingsPage.toggleStateConnect();
            await institutionSettingsPage.saveSettings();
        });

        test('TC10.6: Save button becomes enabled after changing Scheme', async ({ page, loginPage, institutionSettingsPage }) => {
            await loginAndGoToSettings(institutionSettingsPage, loginPage);

            await institutionSettingsPage.selectScheme('CEEB');
            await expect(institutionSettingsPage.saveButton).toBeEnabled();

            // Restore
            await institutionSettingsPage.selectScheme('IPEDS');
            await institutionSettingsPage.saveSettings();
        });

        test('TC10.7: Save button is disabled again after saving changes', async ({ page, loginPage, institutionSettingsPage }) => {
            await loginAndGoToSettings(institutionSettingsPage, loginPage);

            // Make a change
            await institutionSettingsPage.selectFrequency('Weekly');
            await expect(institutionSettingsPage.saveButton).toBeEnabled();

            // Save
            await institutionSettingsPage.saveSettings();

            // Save should be disabled again
            await expect(institutionSettingsPage.saveButton).toBeDisabled();

            // Restore
            await institutionSettingsPage.selectFrequency('Daily');
            await institutionSettingsPage.saveSettings();
        });

        test('TC10.8: Multiple changes can be saved together in one save action', async ({ page, loginPage, institutionSettingsPage }) => {
            await loginAndGoToSettings(institutionSettingsPage, loginPage);

            // Make multiple changes
            await institutionSettingsPage.selectFrequency('Weekly');
            await institutionSettingsPage.selectThreshold('75');

            // Save button should be enabled
            await expect(institutionSettingsPage.saveButton).toBeEnabled();

            // Save all changes at once
            await institutionSettingsPage.saveSettings();

            // Verify both changes persisted
            await expect(institutionSettingsPage.saveButton).toBeDisabled();
            expect(await institutionSettingsPage.getFrequencyValue()).toBe('Weekly');
            expect(await institutionSettingsPage.getThresholdValue()).toBe('75');

            // Restore defaults
            await institutionSettingsPage.selectFrequency('Daily');
            await institutionSettingsPage.selectThreshold('60');
            await institutionSettingsPage.saveSettings();
        });
    });

    // =========================================================================
    // 11. Accessibility & Navigation Tests
    // =========================================================================
    test.describe('11. Accessibility and Cross-section Navigation Tests', () => {

        test('TC11.1: "Skip to main content" link is present on the Settings page', async ({ page, loginPage, institutionSettingsPage }) => {
            await loginAndGoToSettings(institutionSettingsPage, loginPage);

            const skipLink = page.getByRole('link', { name: 'Skip to main content' });
            await expect(skipLink).toBeAttached();
        });

        test('TC11.2: "Skip to primary content" link is present on the Settings page', async ({ page, loginPage, institutionSettingsPage }) => {
            await loginAndGoToSettings(institutionSettingsPage, loginPage);

            const skipPrimaryLink = page.getByRole('link', { name: 'Skip to primary content' });
            await expect(skipPrimaryLink).toBeAttached();
        });

        test('TC11.3: Main navigation links are visible on Settings page', async ({ page, loginPage, institutionSettingsPage }) => {
            await loginAndGoToSettings(institutionSettingsPage, loginPage);

            await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible();
            await expect(page.getByRole('link', { name: 'My Workplace' })).toBeVisible();
            await expect(page.getByRole('link', { name: 'My Triangulator' })).toBeVisible();
            await expect(page.getByRole('link', { name: 'Search' })).toBeVisible();
            await expect(page.getByRole('link', { name: 'FAQ' })).toBeVisible();
        });

        test('TC11.4: Navigate to Dashboard from Settings page using top navigation', async ({ page, loginPage, institutionSettingsPage }) => {
            await loginAndGoToSettings(institutionSettingsPage, loginPage);

            await page.getByRole('link', { name: 'Dashboard' }).click();
            await page.waitForLoadState('domcontentloaded');

            await expect(page).toHaveURL(/.*\/app\/dashboard/);
        });

        test('TC11.5: "2026 Triangulator Engine" footer label is visible in sidebar', async ({ page, loginPage, institutionSettingsPage }) => {
            await loginAndGoToSettings(institutionSettingsPage, loginPage);

            await expect(page.getByText('2026 Triangulator Engine')).toBeVisible();
        });

        test('TC11.6: Triangulator logo link is visible and links to dashboard', async ({ page, loginPage, institutionSettingsPage }) => {
            await loginAndGoToSettings(institutionSettingsPage, loginPage);

            const logoLink = page.getByRole('link', { name: 'logo' });
            await expect(logoLink).toBeVisible();
            await expect(logoLink).toHaveAttribute('href', '/app/dashboard');
        });

        test('TC11.7: Account dropdown button is visible on the Settings page', async ({ page, loginPage, institutionSettingsPage }) => {
            await loginAndGoToSettings(institutionSettingsPage, loginPage);

            await expect(page.getByRole('button', { name: 'Open account dropdown' })).toBeVisible();
        });
    });
});
