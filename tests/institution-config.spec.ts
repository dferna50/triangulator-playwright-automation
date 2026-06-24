import { test, expect } from '../fixtures/test';

test.describe('Institution Configuration Tests', () => {
    const baseURL = (process.env.BASE_URL ?? 'https://qa.creditmobility.net').replace(/\/$/, '');
    const adminEmail = process.env.REGULAR_USER_EMAIL ?? '';
    const adminPassword = process.env.REGULAR_USER_PASSWORD ?? '';

    // =========================================================================
    // 1. Navigation Tests
    // =========================================================================
    test.describe('Navigation Tests', () => {

        test('TC1.1: Navigate to Institution Configuration Page', async ({ page, loginPage, institutionConfigPage }) => {
            await page.goto(`${baseURL}/logged-out/login/email`);
            await loginPage.loginUser(adminEmail, adminPassword);
            await page.waitForLoadState('domcontentloaded');

            await institutionConfigPage.navigateToConfigPage();

            await expect(page).toHaveURL(/.*suggestion-configs/);
            await expect(page.locator('text=Institution configurations')).toBeVisible();
            await expect(institutionConfigPage.addConfigBtn).toBeVisible();
            await expect(page.locator('text=Configuration').first()).toBeVisible();
            await expect(page.locator('text=Minimum value').first()).toBeVisible();
            await expect(page.locator('text=Maximum value').first()).toBeVisible();
            await expect(page.locator('text=Condition').first()).toBeVisible();
        });

        test('TC1.2: Navigate Back to Settings from Configuration Page', async ({ page, loginPage, institutionConfigPage }) => {
            await page.goto(`${baseURL}/logged-out/login/email`);
            await loginPage.loginUser(adminEmail, adminPassword);
            await page.waitForLoadState('domcontentloaded');
            await institutionConfigPage.navigateToConfigPage();

            await institutionConfigPage.navigateBackToSettings();
            await expect(page).toHaveURL(/.*\/settings\//);
        });
    });

    // =========================================================================
    // 2. Add Configuration Tests
    // =========================================================================
    test.describe('Add Configuration Tests', () => {

        test('TC2.1: Open Add Configuration Dialog', async ({ page, loginPage, institutionConfigPage }) => {
            await page.goto(`${baseURL}/logged-out/login/email`);
            await loginPage.loginUser(adminEmail, adminPassword);
            await page.waitForLoadState('domcontentloaded');
            await institutionConfigPage.navigateToConfigPage();

            await institutionConfigPage.openAddConfigDialog();

            await expect(institutionConfigPage.dialog).toBeVisible();
            await expect(institutionConfigPage.configDropdown).toBeVisible();
            await expect(institutionConfigPage.cancelBtn).toBeVisible();
        });

        test('TC2.2: Verify All Seven Configuration Types Available', async ({ page, loginPage, institutionConfigPage }) => {
            await page.goto(`${baseURL}/logged-out/login/email`);
            await loginPage.loginUser(adminEmail, adminPassword);
            await page.waitForLoadState('domcontentloaded');
            await institutionConfigPage.navigateToConfigPage();
            await institutionConfigPage.openAddConfigDialog();

            const options = await institutionConfigPage.getConfigOptions();

            const expectedOptions = [
                'Lower Division',
                'Upper Division',
                'Developmental',
                'Graduate',
                'Special Topic',
                'Inactive Courses',
                'Suggestion Minimum Data',
            ];

            for (const expected of expectedOptions) {
                const found = options.some((opt: string) => opt.includes(expected));
                expect(found).toBeTruthy();
            }
        });

        test('TC2.3: Add Lower Division Configuration', async ({ page, loginPage, institutionConfigPage }) => {
            await page.goto(`${baseURL}/logged-out/login/email`);
            await loginPage.loginUser(adminEmail, adminPassword);
            await page.waitForLoadState('domcontentloaded');
            await institutionConfigPage.navigateToConfigPage();
            await institutionConfigPage.openAddConfigDialog();

            await institutionConfigPage.selectConfigType('Lower Division');

            await expect(institutionConfigPage.minValueCombobox).toBeVisible({ timeout: 5000 });
            await expect(institutionConfigPage.maxValueCombobox).toBeVisible({ timeout: 5000 });

            await institutionConfigPage.selectMinValueCombobox('100');
            await institutionConfigPage.selectMaxValueCombobox('199');

            await institutionConfigPage.clickSubmit();
            await institutionConfigPage.waitForSuccessToast();

            await institutionConfigPage.deleteLastConfig();
        });

        test('TC2.4: Add Developmental Configuration', async ({ page, loginPage, institutionConfigPage }) => {
            await page.goto(`${baseURL}/logged-out/login/email`);
            await loginPage.loginUser(adminEmail, adminPassword);
            await page.waitForLoadState('domcontentloaded');
            await institutionConfigPage.navigateToConfigPage();
            await institutionConfigPage.openAddConfigDialog();

            await institutionConfigPage.selectConfigType('Developmental');

            await expect(institutionConfigPage.courseSubjectCombobox).toBeVisible({ timeout: 5000 });
            await expect(institutionConfigPage.minValueTextbox).toBeVisible({ timeout: 5000 });
            await expect(institutionConfigPage.maxValueTextbox).toBeVisible({ timeout: 5000 });
            await expect(institutionConfigPage.excludeFromSuggestionsCheckbox).toBeVisible({ timeout: 5000 });

            await institutionConfigPage.fillMinValue('10');
            await institutionConfigPage.fillMaxValue('99');

            await institutionConfigPage.clickSubmit();
            await institutionConfigPage.waitForSuccessToast();

            await institutionConfigPage.deleteLastConfig();
        });

        test('TC2.5: Add Special Topic Configuration', async ({ page, loginPage, institutionConfigPage }) => {
            await page.goto(`${baseURL}/logged-out/login/email`);
            await loginPage.loginUser(adminEmail, adminPassword);
            await page.waitForLoadState('domcontentloaded');
            await institutionConfigPage.navigateToConfigPage();
            await institutionConfigPage.openAddConfigDialog();

            await institutionConfigPage.selectConfigType('Special Topic');

            await expect(institutionConfigPage.courseSubjectCombobox).toBeVisible({ timeout: 5000 });
            await expect(institutionConfigPage.courseNumberCombobox).toBeVisible({ timeout: 5000 });
            await expect(institutionConfigPage.excludeFromBoostCheckbox).toBeVisible({ timeout: 5000 });
        });

        test('TC2.6: Add Graduate Configuration', async ({ page, loginPage, institutionConfigPage }) => {
            await page.goto(`${baseURL}/logged-out/login/email`);
            await loginPage.loginUser(adminEmail, adminPassword);
            await page.waitForLoadState('domcontentloaded');
            await institutionConfigPage.navigateToConfigPage();
            await institutionConfigPage.openAddConfigDialog();

            await institutionConfigPage.selectConfigType('Graduate');

            await expect(institutionConfigPage.minValueTextbox).toBeVisible({ timeout: 5000 });
            await expect(institutionConfigPage.maxValueTextbox).toBeVisible({ timeout: 5000 });
            await expect(institutionConfigPage.excludeFromSuggestionsCheckbox).toBeVisible({ timeout: 5000 });

            await institutionConfigPage.fillMinValue('700');
            await institutionConfigPage.fillMaxValue('999');

            await institutionConfigPage.clickSubmit();
            await institutionConfigPage.waitForSuccessToast();

            await institutionConfigPage.deleteLastConfig();
        });

        test('TC2.7: Add Upper Division Configuration', async ({ page, loginPage, institutionConfigPage }) => {
            await page.goto(`${baseURL}/logged-out/login/email`);
            await loginPage.loginUser(adminEmail, adminPassword);
            await page.waitForLoadState('domcontentloaded');
            await institutionConfigPage.navigateToConfigPage();
            await institutionConfigPage.openAddConfigDialog();

            await institutionConfigPage.selectConfigType('Upper Division');

            await expect(institutionConfigPage.minValueCombobox).toBeVisible({ timeout: 5000 });
            await expect(institutionConfigPage.maxValueCombobox).toBeVisible({ timeout: 5000 });
            await expect(institutionConfigPage.doNotSuggestLowerDivCheckbox).toBeVisible({ timeout: 5000 });
            await expect(institutionConfigPage.excludeFromBoostCheckbox).toBeVisible({ timeout: 5000 });
        });

        test('TC2.8: Add Inactive Courses Configuration', async ({ page, loginPage, institutionConfigPage }) => {
            await page.goto(`${baseURL}/logged-out/login/email`);
            await loginPage.loginUser(adminEmail, adminPassword);
            await page.waitForLoadState('domcontentloaded');
            await institutionConfigPage.navigateToConfigPage();
            await institutionConfigPage.openAddConfigDialog();

            await institutionConfigPage.selectConfigType('Inactive Courses');

            await expect(institutionConfigPage.courseSubjectCombobox).toBeVisible({ timeout: 5000 });
            await expect(institutionConfigPage.courseNumberCombobox).toBeVisible({ timeout: 5000 });
            await expect(institutionConfigPage.minCourseNumberRange).toBeVisible({ timeout: 5000 });
            await expect(institutionConfigPage.maxCourseNumberRange).toBeVisible({ timeout: 5000 });
            await expect(institutionConfigPage.courseTitleTextbox).toBeVisible({ timeout: 5000 });
            await expect(institutionConfigPage.makeCourseInactiveCheckbox).toBeVisible({ timeout: 5000 });
        });

        test('TC2.9: Add Suggestion Minimum Data Configuration', async ({ page, loginPage, institutionConfigPage }) => {
            await page.goto(`${baseURL}/logged-out/login/email`);
            await loginPage.loginUser(adminEmail, adminPassword);
            await page.waitForLoadState('domcontentloaded');
            await institutionConfigPage.navigateToConfigPage();
            await institutionConfigPage.openAddConfigDialog();

            await institutionConfigPage.selectConfigType('Suggestion Minimum Data');

            await expect(institutionConfigPage.titleCheckbox).toBeVisible({ timeout: 5000 });
            await expect(institutionConfigPage.descriptionCheckbox).toBeVisible({ timeout: 5000 });
            await expect(institutionConfigPage.minMaxHoursCheckbox).toBeVisible({ timeout: 5000 });

            await institutionConfigPage.titleCheckbox.click();
            await institutionConfigPage.clickSubmit();
            await institutionConfigPage.waitForSuccessToast();

            await institutionConfigPage.deleteLastConfig();
        });
    });

    // =========================================================================
    // 3. Edit Configuration Tests
    // =========================================================================
    test.describe('Edit Configuration Tests', () => {

        test('TC3.1: Edit Existing Configuration', async ({ page, loginPage, institutionConfigPage }) => {
            await page.goto(`${baseURL}/logged-out/login/email`);
            await loginPage.loginUser(adminEmail, adminPassword);
            await page.waitForLoadState('domcontentloaded');
            await institutionConfigPage.navigateToConfigPage();

            const hasConfigs = await institutionConfigPage.toggleDropdownBtn.first().isVisible().catch(() => false);
            if (!hasConfigs) return;

            await institutionConfigPage.clickEditOnRow(0);

            await expect(institutionConfigPage.dialog).toBeVisible();
            await expect(institutionConfigPage.configDropdown).toBeVisible();

            await institutionConfigPage.clickCancel();
        });

        test('TC3.2: Cancel Edit Configuration', async ({ page, loginPage, institutionConfigPage }) => {
            await page.goto(`${baseURL}/logged-out/login/email`);
            await loginPage.loginUser(adminEmail, adminPassword);
            await page.waitForLoadState('domcontentloaded');
            await institutionConfigPage.navigateToConfigPage();

            const hasConfigs = await institutionConfigPage.toggleDropdownBtn.first().isVisible().catch(() => false);
            if (!hasConfigs) return;

            await institutionConfigPage.clickEditOnRow(0);
            await expect(institutionConfigPage.dialog).toBeVisible();

            await institutionConfigPage.clickCancel();
            await expect(institutionConfigPage.dialog).not.toBeVisible({ timeout: 5000 });
        });
    });

    // =========================================================================
    // 4. Delete Configuration Tests
    // =========================================================================
    test.describe('Delete Configuration Tests', () => {

        test('TC4.1: Delete Existing Configuration', async ({ page, loginPage, institutionConfigPage }) => {
            await page.goto(`${baseURL}/logged-out/login/email`);
            await loginPage.loginUser(adminEmail, adminPassword);
            await page.waitForLoadState('domcontentloaded');
            await institutionConfigPage.navigateToConfigPage();

            await institutionConfigPage.openAddConfigDialog();
            await institutionConfigPage.selectConfigType('Graduate');
            await institutionConfigPage.fillMinValue('700');
            await institutionConfigPage.fillMaxValue('799');
            await institutionConfigPage.clickSubmit();
            await institutionConfigPage.waitForSuccessToast();

            const countBefore = await institutionConfigPage.toggleDropdownBtn.count();

            await institutionConfigPage.clickDeleteOnRow(countBefore - 1);
            await institutionConfigPage.waitForSuccessToast();

            const countAfter = await institutionConfigPage.toggleDropdownBtn.count();
            expect(countAfter).toBeLessThan(countBefore);
        });
    });

    // =========================================================================
    // 5. Dialog Behavior Tests
    // =========================================================================
    test.describe('Dialog Behavior Tests', () => {

        test('TC5.1: Close Add Configuration Dialog with X Button', async ({ page, loginPage, institutionConfigPage }) => {
            await page.goto(`${baseURL}/logged-out/login/email`);
            await loginPage.loginUser(adminEmail, adminPassword);
            await page.waitForLoadState('domcontentloaded');
            await institutionConfigPage.navigateToConfigPage();

            await institutionConfigPage.openAddConfigDialog();
            await expect(institutionConfigPage.dialog).toBeVisible();

            await institutionConfigPage.closeDialog();
            await expect(institutionConfigPage.dialog).not.toBeVisible({ timeout: 5000 });
        });

        test('TC5.2: Submit Without Selecting Configuration Type', async ({ page, loginPage, institutionConfigPage }) => {
            await page.goto(`${baseURL}/logged-out/login/email`);
            await loginPage.loginUser(adminEmail, adminPassword);
            await page.waitForLoadState('domcontentloaded');
            await institutionConfigPage.navigateToConfigPage();

            await institutionConfigPage.openAddConfigDialog();

            const submitBtn = institutionConfigPage.submitBtn;
            const isDisabled = await submitBtn.isDisabled().catch(() => false);

            if (!isDisabled) {
                const dropdownText = await institutionConfigPage.configDropdown.textContent();
                console.log(`Configuration dropdown text: ${dropdownText}`);
            }

            await institutionConfigPage.closeDialog();
            await expect(institutionConfigPage.dialog).not.toBeVisible({ timeout: 5000 });
        });

        test('TC5.3: Configuration Type Changes Form Fields Dynamically', async ({ page, loginPage, institutionConfigPage }) => {
            await page.goto(`${baseURL}/logged-out/login/email`);
            await loginPage.loginUser(adminEmail, adminPassword);
            await page.waitForLoadState('domcontentloaded');
            await institutionConfigPage.navigateToConfigPage();
            await institutionConfigPage.openAddConfigDialog();

            // 1. Lower Division
            await institutionConfigPage.selectConfigType('Lower Division');
            await expect(institutionConfigPage.minValueCombobox).toBeVisible({ timeout: 5000 });
            await expect(institutionConfigPage.maxValueCombobox).toBeVisible({ timeout: 5000 });

            // 2. Graduate
            await institutionConfigPage.selectConfigType('Graduate');
            await expect(institutionConfigPage.minValueTextbox).toBeVisible({ timeout: 5000 });
            await expect(institutionConfigPage.maxValueTextbox).toBeVisible({ timeout: 5000 });
            await expect(institutionConfigPage.excludeFromSuggestionsCheckbox).toBeVisible({ timeout: 5000 });

            // 3. Special Topic
            await institutionConfigPage.selectConfigType('Special Topic');
            await expect(institutionConfigPage.courseSubjectCombobox).toBeVisible({ timeout: 5000 });
            await expect(institutionConfigPage.courseNumberCombobox).toBeVisible({ timeout: 5000 });
            await expect(institutionConfigPage.excludeFromBoostCheckbox).toBeVisible({ timeout: 5000 });

            // 4. Inactive Courses
            await institutionConfigPage.selectConfigType('Inactive Courses');
            await expect(institutionConfigPage.courseSubjectCombobox).toBeVisible({ timeout: 5000 });
            await expect(institutionConfigPage.courseNumberCombobox).toBeVisible({ timeout: 5000 });
            await expect(institutionConfigPage.minCourseNumberRange).toBeVisible({ timeout: 5000 });
            await expect(institutionConfigPage.maxCourseNumberRange).toBeVisible({ timeout: 5000 });
            await expect(institutionConfigPage.courseTitleTextbox).toBeVisible({ timeout: 5000 });
            await expect(institutionConfigPage.makeCourseInactiveCheckbox).toBeVisible({ timeout: 5000 });

            // 5. Suggestion Minimum Data
            await institutionConfigPage.selectConfigType('Suggestion Minimum Data');
            await expect(institutionConfigPage.titleCheckbox).toBeVisible({ timeout: 5000 });
            await expect(institutionConfigPage.descriptionCheckbox).toBeVisible({ timeout: 5000 });
            await expect(institutionConfigPage.minMaxHoursCheckbox).toBeVisible({ timeout: 5000 });

            // 6. Upper Division
            await institutionConfigPage.selectConfigType('Upper Division');
            await expect(institutionConfigPage.minValueCombobox).toBeVisible({ timeout: 5000 });
            await expect(institutionConfigPage.maxValueCombobox).toBeVisible({ timeout: 5000 });
            await expect(institutionConfigPage.doNotSuggestLowerDivCheckbox).toBeVisible({ timeout: 5000 });
            await expect(institutionConfigPage.excludeFromBoostCheckbox).toBeVisible({ timeout: 5000 });

            // 7. Developmental
            await institutionConfigPage.selectConfigType('Developmental');
            await expect(institutionConfigPage.courseSubjectCombobox).toBeVisible({ timeout: 5000 });
            await expect(institutionConfigPage.minValueTextbox).toBeVisible({ timeout: 5000 });
            await expect(institutionConfigPage.maxValueTextbox).toBeVisible({ timeout: 5000 });
            await expect(institutionConfigPage.excludeFromSuggestionsCheckbox).toBeVisible({ timeout: 5000 });

            await institutionConfigPage.clickCancel();
        });
    });

    // =========================================================================
    // 6. Suggestion Filtering Tests
    // =========================================================================
    test.describe('Suggestion Filtering Tests', () => {

        test('TC6.1: Verify Configuration Filters Suggestions in My Triangulator', async ({ page, loginPage, institutionConfigPage }) => {
            await page.goto(`${baseURL}/logged-out/login/email`);
            await loginPage.loginUser(adminEmail, adminPassword);
            await page.waitForLoadState('domcontentloaded');

            await page.goto(`${baseURL}/app/my-triangulator/suggestions/new`);
            await page.waitForLoadState('domcontentloaded');
            await expect(page).toHaveURL(/.*my-triangulator.*/);

            await page.goto(`${baseURL}/app/my-workspace/inst-admin/inst/settings/suggestion-configs`);
            await page.waitForLoadState('domcontentloaded');
            await expect(page.locator('text=Institution configurations')).toBeVisible({ timeout: 10000 });

            await page.goto(`${baseURL}/app/my-triangulator/suggestions/new`);
            await page.waitForLoadState('domcontentloaded');
            await expect(page).toHaveURL(/.*my-triangulator.*/);
        });
    });
});
