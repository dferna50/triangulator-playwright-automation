const { expect } = require('@playwright/test');

class InstitutionConfigPage {
    constructor(page) {
        this.page = page;

        // Navigation
        this.myWorkplaceLink = page.getByRole('link', { name: 'My Workplace' });
        this.settingsLink = page.getByRole('link', { name: 'Settings' });
        this.seeAllConfigLink = page.getByRole('link', { name: 'Open Suggestion Configurations page' });
        this.backToSettingsBtn = page.getByRole('button', { name: 'Return to Institution Settings' });

        // Configuration page elements
        this.pageTitle = page.locator('text=Institution configurations');
        this.addConfigBtn = page.getByRole('button', { name: 'Add Configuration' });

        // Table headers
        this.configHeader = page.locator('text=Configuration').first();
        this.titleHeader = page.locator('text=Title').first();

        // Dialog elements
        this.dialog = page.getByRole('dialog', { name: 'Add configurations' });
        this.configDropdown = page.getByRole('combobox', { name: 'Configuration' });
        this.submitBtn = page.getByRole('button', { name: 'Submit' });
        this.cancelBtn = page.getByRole('button', { name: 'Cancel' });
        this.closeDialogBtn = page.getByRole('button', { name: 'close' });

        // Lower Division / Upper Division fields (combobox)
        this.minValueCombobox = page.getByRole('combobox', { name: 'Minimum value' });
        this.maxValueCombobox = page.getByRole('combobox', { name: 'Maximum value' });

        // Graduate / Developmental fields (textbox)
        this.minValueTextbox = page.getByRole('textbox', { name: 'Minimum value' });
        this.maxValueTextbox = page.getByRole('textbox', { name: 'Maximum value' });

        // Special Topic / Inactive Courses / Developmental fields
        this.courseSubjectCombobox = page.getByRole('combobox', { name: 'Course subject' });
        this.courseNumberCombobox = page.getByRole('combobox', { name: 'Course Number' });

        // Inactive Courses specific fields
        this.minCourseNumberRange = page.getByRole('textbox', { name: 'Minimum Course Number range' });
        this.maxCourseNumberRange = page.getByRole('textbox', { name: 'Maximum course Number range' });
        this.courseTitleTextbox = page.getByRole('textbox', { name: 'Course Title' });

        // Checkboxes
        this.excludeFromSuggestionsCheckbox = page.getByRole('checkbox', { name: 'Exclude from suggestions' });
        this.excludeFromBoostCheckbox = page.getByRole('checkbox', { name: 'Exclude from boost suggestions' });
        this.makeCourseInactiveCheckbox = page.getByRole('checkbox', { name: 'Make course inactive' });
        this.doNotSuggestLowerDivCheckbox = page.getByRole('checkbox', { name: 'Do not suggest lower division courses to my upper division courses' });
        this.titleCheckbox = page.getByRole('checkbox', { name: 'Title' });
        this.descriptionCheckbox = page.getByRole('checkbox', { name: 'Description' });
        this.minMaxHoursCheckbox = page.getByRole('checkbox', { name: 'Min/Max hours' });

        // Row actions
        this.toggleDropdownBtn = page.getByRole('button', { name: 'Toggle drop down' });
        this.editMenuItem = page.getByRole('menuitem', { name: 'Edit' });
        this.deleteMenuItem = page.getByRole('menuitem', { name: 'Delete' });

        // Toast - use alert role for more reliable detection
        this.successToast = page.getByRole('alert').filter({ hasText: 'Updated settings successfully' });

        // My Triangulator
        this.myTriangulatorLink = page.getByRole('link', { name: 'My Triangulator' });
    }

    /**
     * Navigate to Institution Configuration page from dashboard
     */
    async navigateToConfigPage() {
        await this.myWorkplaceLink.click();
        await this.settingsLink.waitFor({ state: 'visible', timeout: 15000 });
        await this.settingsLink.click();
        await this.page.waitForLoadState('domcontentloaded');
        await this.seeAllConfigLink.waitFor({ state: 'visible', timeout: 10000 });
        await this.seeAllConfigLink.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    /**
     * Navigate directly to config page via URL
     */
    async navigateToConfigPageDirect() {
        await this.page.goto('https://qa.creditmobility.net/app/my-workspace/inst-admin/inst/settings/suggestion-configs');
        await this.page.waitForLoadState('domcontentloaded');
    }

    /**
     * Open the Add Configuration dialog
     */
    async openAddConfigDialog() {
        await this.addConfigBtn.waitFor({ state: 'visible', timeout: 10000 });
        await this.addConfigBtn.click();
        await this.dialog.waitFor({ state: 'visible', timeout: 5000 });
    }

    /**
     * Select a configuration type from the dropdown
     * @param {string} configType - e.g. 'Lower Division', 'Upper Division', etc.
     */
    async selectConfigType(configType) {
        await this.configDropdown.click();
        const option = this.page.getByRole('option', { name: configType });
        await option.waitFor({ state: 'visible', timeout: 5000 });
        await option.click();
    }

    /**
     * Get all available configuration options from the dropdown
     * @returns {Promise<string[]>} array of option texts
     */
    async getConfigOptions() {
        await this.configDropdown.click();
        const options = this.page.getByRole('option');
        const texts = await options.allTextContents();
        // Close dropdown by pressing Escape
        await this.page.keyboard.press('Escape');
        return texts;
    }

    /**
     * Click Submit button in the dialog
     */
    async clickSubmit() {
        await this.submitBtn.click();
    }

    /**
     * Click Cancel button in the dialog
     */
    async clickCancel() {
        await this.cancelBtn.click();
    }

    /**
     * Close dialog with X button
     */
    async closeDialog() {
        await this.closeDialogBtn.click();
    }

    /**
     * Wait for success toast to appear after adding/editing a config
     */
    async waitForSuccessToast() {
        await this.page.getByRole('alert').first().waitFor({ state: 'visible', timeout: 15000 });
    }

    /**
     * Delete the last configuration row (cleanup helper)
     */
    async deleteLastConfig() {
        const count = await this.toggleDropdownBtn.count();
        if (count > 0) {
            await this.clickDeleteOnRow(count - 1);
            await this.waitForSuccessToast();
            // Wait for toast to disappear before next action
            await this.page.getByRole('alert').waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
        }
    }

    /**
     * Get the count of configuration rows in the list
     * @returns {Promise<number>}
     */
    async getConfigRowCount() {
        const rows = this.page.locator('[class*="config-row"], [class*="suggestion-config"]').or(
            this.toggleDropdownBtn
        );
        return await rows.count();
    }

    /**
     * Click toggle dropdown on a specific config row (0-indexed)
     * @param {number} index
     */
    async openRowDropdown(index = 0) {
        await this.toggleDropdownBtn.nth(index).click();
        await this.editMenuItem.waitFor({ state: 'visible', timeout: 5000 });
    }

    /**
     * Edit a configuration row
     * @param {number} index - 0-indexed row
     */
    async clickEditOnRow(index = 0) {
        await this.openRowDropdown(index);
        await this.editMenuItem.click();
        await this.dialog.waitFor({ state: 'visible', timeout: 5000 });
    }

    /**
     * Delete a configuration row
     * @param {number} index - 0-indexed row
     */
    async clickDeleteOnRow(index = 0) {
        await this.openRowDropdown(index);
        await this.deleteMenuItem.click();
    }

    /**
     * Navigate back to Settings page
     */
    async navigateBackToSettings() {
        await this.backToSettingsBtn.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    /**
     * Check if Submit button is disabled
     * @returns {Promise<boolean>}
     */
    async isSubmitDisabled() {
        return await this.submitBtn.isDisabled();
    }

    /**
     * Fill Minimum value textbox (for Graduate, Developmental)
     * @param {string} value
     */
    async fillMinValue(value) {
        await this.minValueTextbox.fill(value);
    }

    /**
     * Fill Maximum value textbox (for Graduate, Developmental)
     * @param {string} value
     */
    async fillMaxValue(value) {
        await this.maxValueTextbox.fill(value);
    }

    /**
     * Select a value from Minimum value combobox (for Lower/Upper Division)
     * @param {string} value - must be an actual course number from the catalog
     */
    async selectMinValueCombobox(value) {
        await this.minValueCombobox.click();
        await this.minValueCombobox.fill(value);
        const option = this.page.getByRole('option', { name: value, exact: true });
        await option.waitFor({ state: 'visible', timeout: 5000 });
        await option.click();
    }

    /**
     * Select a value from Maximum value combobox (for Lower/Upper Division)
     * @param {string} value - must be an actual course number from the catalog
     */
    async selectMaxValueCombobox(value) {
        await this.maxValueCombobox.click();
        await this.maxValueCombobox.fill(value);
        const option = this.page.getByRole('option', { name: value, exact: true });
        await option.waitFor({ state: 'visible', timeout: 5000 });
        await option.click();
    }

    /**
     * Select a Course subject from combobox
     * @param {string} subject
     */
    async selectCourseSubject(subject) {
        await this.courseSubjectCombobox.click();
        await this.courseSubjectCombobox.fill(subject);
        const option = this.page.getByRole('option', { name: subject }).first();
        await option.waitFor({ state: 'visible', timeout: 5000 });
        await option.click();
    }

    /**
     * Select a Course Number from combobox
     * @param {string} number
     */
    async selectCourseNumber(number) {
        await this.courseNumberCombobox.click();
        await this.courseNumberCombobox.fill(number);
        const option = this.page.getByRole('option', { name: number }).first();
        await option.waitFor({ state: 'visible', timeout: 5000 });
        await option.click();
    }

    /**
     * Check if a specific configuration type exists in the list
     * @param {string} configName - e.g. 'Special Topic', 'Developmental'
     * @returns {Promise<boolean>}
     */
    async isConfigInList(configName) {
        const configCell = this.page.locator(`text=${configName}`).first();
        return await configCell.isVisible().catch(() => false);
    }

    /**
     * Get text content of a config row by index
     * @param {number} index
     * @returns {Promise<string>}
     */
    async getConfigRowText(index = 0) {
        const rows = this.page.locator('[class*="config"] >> nth=' + index);
        return await rows.textContent().catch(() => '');
    }
}

module.exports = { InstitutionConfigPage };
