class faqPage {
    constructor(page) {
        this.page = page;
        
        // Locators
        this.myWorkplaceLink = page.getByRole('link', { name: 'My Workplace' });
        this.settingsLink = page.getByRole('link', { name: 'Settings' });
        this.openSidebarBtn = page.getByRole('button', { name: 'open sidebar' });
        this.faqLinkInSidebar = page.getByRole('link', { name: 'FAQ Link' });
        this.faqInput = page.getByRole('textbox', { name: 'Set FAQ Link' });
        this.saveButton = page.getByRole('button', { name: 'Save' });
        this.faqLinkInNav = page.getByRole('link', { name: 'FAQ' });
    }

    /**
     * Navigate to FAQ settings page from dashboard
     */
    async navigateToFaqSettings() {
        // Click My Workplace
        await this.myWorkplaceLink.click();
        
        // Wait for Settings link using a more lenient approach
        try {
            await this.settingsLink.waitFor({ state: 'attached', timeout: 15000 });
        } catch {
            // If Settings not found, continue anyway
        }
        
        await this.settingsLink.click();
        
        // Handle collapsed sidebar if needed
        await this.openSidebarIfCollapsed();
        
        // Click FAQ Link in secondary sidebar
        await this.faqLinkInSidebar.waitFor({ state: 'visible', timeout: 10000 });
        await this.faqLinkInSidebar.click();
    }

    /**
     * Open the secondary sidebar if it's collapsed
     */
    async openSidebarIfCollapsed() {
        const isSidebarBtnVisible = await this.openSidebarBtn.isVisible().catch(() => false);
        if (isSidebarBtnVisible) {
            await this.openSidebarBtn.click();
            await this.faqLinkInSidebar.waitFor({ state: 'visible', timeout: 5000 });
        }
    }

    /**
     * Set FAQ link URL
     * @param {string} url - The FAQ URL to set
     */
    async setFaqUrl(url) {
        await this.faqInput.waitFor({ state: 'visible', timeout: 5000 });
        await this.faqInput.clear();
        await this.faqInput.fill(url);
    }

    /**
     * Click the Save button
     */
    async clickSave() {
        await this.saveButton.click();
        // Wait for save to complete by checking button is re-enabled or checking for success state
        await this.page.waitForLoadState('domcontentloaded');
    }

    /**
     * Set FAQ URL and save
     * @param {string} url - The FAQ URL to set
     */
    async setAndSaveFaqUrl(url) {
        await this.setFaqUrl(url);
        await this.clickSave();
    }

    /**
     * Get the current FAQ URL value from input field
     * @returns {Promise<string>} Current FAQ URL
     */
    async getFaqUrlValue() {
        return await this.faqInput.inputValue();
    }

    /**
     * Clear the FAQ URL input field
     */
    async clearFaqUrl() {
        await this.faqInput.waitFor({ state: 'visible', timeout: 5000 });
        await this.faqInput.clear();
    }

    /**
     * Check if FAQ link is visible in top navigation
     * @returns {Promise<boolean>} True if FAQ link is visible
     */
    async isFaqLinkVisibleInNav() {
        return await this.faqLinkInNav.isVisible().catch(() => false);
    }

    /**
     * Click FAQ link in top navigation
     */
    async clickFaqLinkInNav() {
        await this.faqLinkInNav.click();
    }

    /**
     * Get FAQ link element in navigation for custom interactions
     * @returns {Locator} FAQ link locator
     */
    getFaqLinkInNav() {
        return this.faqLinkInNav;
    }

    /**
     * Get FAQ input field for custom interactions
     * @returns {Locator} FAQ input locator
     */
    getFaqInput() {
        return this.faqInput;
    }

    /**
     * Get Save button for custom interactions
     * @returns {Locator} Save button locator
     */
    getSaveButton() {
        return this.saveButton;
    }

    /**
     * Verify FAQ settings page is loaded
     */
    async verifyFaqSettingsPageLoaded() {
        await this.page.waitForURL(/.*settings.*faq.*/i, { timeout: 10000 });
        await this.faqInput.waitFor({ state: 'visible', timeout: 5000 });
    }

    /**
     * Navigate to FAQ settings and verify page loaded
     */
    async navigateAndVerify() {
        await this.navigateToFaqSettings();
        await this.verifyFaqSettingsPageLoaded();
    }
}

module.exports = { faqPage };
