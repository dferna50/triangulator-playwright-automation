const { expect } = require('@playwright/test');

class PeerGroupsPage {
    constructor(page) {
        this.page = page;

        // Navigation
        this.myWorkplaceLink = page.getByRole('link', { name: 'My Workplace' });
        this.settingsLink = page.getByRole('link', { name: 'Settings' });
        this.seeAllPeerGroupsLink = page.getByRole('link', { name: 'Open Peer Groups page' });
        this.backToSettingsBtn = page.getByRole('button', { name: 'Return to Institution Settings' });

        // Page elements
        this.pageTitle = page.locator('text=Peer groups').first();
        this.createPeerGroupBtn = page.getByRole('button', { name: 'Create peer group' });
        this.manageHeading = page.locator('text=Manage peer groups');
        this.pageDescription = page.locator('text=Pick up to 10 peer groups');

        // Table headers
        this.nameHeader = page.locator('text=Name').first();
        this.stateHeader = page.locator('text=State').first();
        this.matchThresholdHeader = page.locator('text=Match threshold').first();

        // Create dialog
        this.createDialog = page.getByRole('dialog', { name: 'Create peer group' });
        this.editDialog = page.getByRole('dialog', { name: 'Edit peer group' });
        this.anyDialog = page.getByRole('dialog');

        // Dialog common elements
        this.closeDialogBtn = page.getByRole('button', { name: 'close' });
        this.cancelBtn = page.getByRole('button', { name: 'Cancel' });
        this.nextBtn = page.getByRole('button', { name: 'Next' });
        this.submitBtn = page.getByRole('button', { name: 'Submit' });
        this.backBtn = page.getByRole('button', { name: 'Back' });

        // Step 1: Institution search
        this.institutionCombobox = page.locator('#combobox-input');
        this.institutionList = page.getByRole('list', { name: 'Use arrow keys to navigate' });

        // Step 2: Peer group name
        this.peerGroupNameInput = page.getByRole('textbox', { name: 'Peer group name' });

        // Step 3: Match threshold
        this.matchThresholdBtn = page.getByRole('button', { name: /peers/ });

        // Row actions
        this.toggleSeeMoreBtn = page.getByRole('button', { name: 'Toggle see more' });
        this.editMenuItem = page.getByRole('menuitem', { name: 'Edit' });
        this.deleteMenuItem = page.getByRole('menuitem', { name: 'Delete' });
    }

    /**
     * Navigate to Peer Groups page via sidebar
     */
    async navigateToPeerGroupsPage() {
        await this.myWorkplaceLink.click();
        await this.settingsLink.waitFor({ state: 'visible', timeout: 15000 });
        await this.settingsLink.click();
        await this.page.waitForLoadState('domcontentloaded');
        await this.seeAllPeerGroupsLink.waitFor({ state: 'visible', timeout: 10000 });
        await this.seeAllPeerGroupsLink.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    /**
     * Navigate directly to Peer Groups page via URL
     */
    async navigateToPeerGroupsPageDirect() {
        await this.page.goto('https://qa.creditmobility.net/app/my-workspace/inst-admin/inst/settings/peer-groups');
        await this.page.waitForLoadState('domcontentloaded');
        await this.createPeerGroupBtn.waitFor({ state: 'visible', timeout: 15000 });
    }

    /**
     * Open the Create Peer Group dialog
     */
    async openCreateDialog() {
        await this.createPeerGroupBtn.waitFor({ state: 'visible', timeout: 10000 });
        await this.createPeerGroupBtn.click();
        await this.createDialog.waitFor({ state: 'visible', timeout: 5000 });
    }

    /**
     * Search and select an institution by name
     * @param {string} name - Institution name to search for
     */
    async selectInstitution(name) {
        await this.institutionCombobox.click();
        await this.institutionCombobox.fill(name);
        const option = this.page.getByRole('option', { name: name, exact: true });
        await option.waitFor({ state: 'visible', timeout: 10000 });
        await option.click();
    }

    /**
     * Select multiple institutions
     * @param {string[]} names - Array of institution names
     */
    async selectInstitutions(names) {
        for (const name of names) {
            await this.selectInstitution(name);
        }
    }

    /**
     * Get the institution selected count text (e.g. "3/10 institutions selected.")
     * @returns {Promise<string>}
     */
    async getSelectedCountText() {
        const countEl = this.page.locator('text=/\\d+\\/10 institutions selected/');
        await countEl.waitFor({ state: 'visible', timeout: 5000 });
        return await countEl.textContent();
    }

    /**
     * Get the number of currently selected institutions
     * @returns {Promise<number>}
     */
    async getSelectedCount() {
        const text = await this.getSelectedCountText();
        const match = text.match(/(\d+)\/10/);
        return match ? parseInt(match[1]) : 0;
    }

    /**
     * Remove an institution from the selected list by clicking its Remove button
     * @param {number} index - 0-indexed position in the selected list
     */
    async removeInstitution(index = 0) {
        const removeButtons = this.page.getByRole('button').filter({ has: this.page.locator('img') }).locator('xpath=ancestor::*[@aria-label="Remove"]/..');
        // Use the Remove generic container's button
        const removeBtns = this.page.locator('[aria-label="Remove"] button');
        await removeBtns.nth(index).click();
    }

    /**
     * Dismiss the institution dropdown by clicking on the selected institutions list area.
     * This reliably blurs the combobox without risking closing the dialog.
     */
    async dismissDropdown() {
        const listHeader = this.page.locator('text=/\\d+\\/10 institutions selected/');
        const isVisible = await listHeader.isVisible().catch(() => false);
        if (isVisible) {
            await listHeader.click();
            await this.page.waitForTimeout(300);
        }
    }

    /**
     * Click Next button (Step 1 -> Step 2).
     */
    async clickNext() {
        await this.dismissDropdown();
        await this.nextBtn.waitFor({ state: 'visible', timeout: 5000 });
        await this.nextBtn.click({ force: true });
        // Wait for Step 2 to render
        await this.peerGroupNameInput.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    }

    /**
     * Click Back button (Step 2 -> Step 1)
     */
    async clickBack() {
        await this.backBtn.waitFor({ state: 'visible', timeout: 5000 });
        await this.backBtn.click({ force: true });
    }

    /**
     * Fill in the peer group name
     * @param {string} name
     */
    async fillPeerGroupName(name) {
        await this.peerGroupNameInput.waitFor({ state: 'visible', timeout: 5000 });
        await this.peerGroupNameInput.fill(name);
    }

    /**
     * Get the character count text (e.g. "15 / 60")
     * @returns {Promise<string>}
     */
    async getCharCountText() {
        const countEl = this.page.locator('text=/\\d+ \\/ 60/');
        return await countEl.textContent();
    }

    /**
     * Click Submit button.
     * Uses dispatchEvent because the Vue button has an opacity-0 overlay
     * that intercepts normal Playwright clicks.
     */
    async clickSubmit() {
        await this.submitBtn.waitFor({ state: 'visible', timeout: 5000 });
        await this.page.evaluate(() => {
            const el = document.querySelector('.button-text');
            const btns = [...document.querySelectorAll('.button-text')];
            const submitText = btns.find(b => b.textContent.trim() === 'Submit');
            const btn = submitText ? submitText.closest('button') : null;
            if (btn) {
                btn.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
                btn.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                btn.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
                btn.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
                btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            }
        });
    }

    /**
     * Click Cancel button.
     */
    async clickCancel() {
        await this.dismissDropdown();
        await this.cancelBtn.waitFor({ state: 'visible', timeout: 5000 });
        await this.cancelBtn.click({ force: true });
    }

    /**
     * Close dialog with X button.
     */
    async closeDialog() {
        await this.dismissDropdown();
        await this.closeDialogBtn.waitFor({ state: 'visible', timeout: 5000 });
        await this.closeDialogBtn.click();
    }

    /**
     * Wait for success toast to appear
     */
    async waitForSuccessToast() {
        await this.page.getByRole('alert').first().waitFor({ state: 'visible', timeout: 15000 });
    }

    /**
     * Wait for toast to disappear
     */
    async waitForToastDismiss() {
        await this.page.getByRole('alert').waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
    }

    /**
     * Check if Next button is disabled.
     * The disabled Next button is wrapped in a tooltip div, so we check for it specifically.
     * @returns {Promise<boolean>}
     */
    async isNextDisabled() {
        // When disabled, the button has disabled attribute inside a tooltip wrapper
        const disabledBtn = this.page.locator('button:has-text("Next")[disabled]');
        const count = await disabledBtn.count();
        return count > 0;
    }

    /**
     * Check if Submit button is disabled.
     * @returns {Promise<boolean>}
     */
    async isSubmitDisabled() {
        const disabledBtn = this.page.locator('button:has-text("Submit")[disabled]');
        const count = await disabledBtn.count();
        return count > 0;
    }

    /**
     * Get the count of peer group rows in the list
     * @returns {Promise<number>}
     */
    async getPeerGroupRowCount() {
        await this.page.waitForTimeout(1000);
        return await this.toggleSeeMoreBtn.count();
    }

    /**
     * Open the row dropdown menu for a specific peer group (0-indexed)
     * @param {number} index
     */
    async openRowDropdown(index = 0) {
        await this.toggleSeeMoreBtn.nth(index).click();
        await this.editMenuItem.waitFor({ state: 'visible', timeout: 5000 });
    }

    /**
     * Click Edit on a peer group row
     * @param {number} index
     */
    async clickEditOnRow(index = 0) {
        await this.openRowDropdown(index);
        await this.editMenuItem.click();
        await this.anyDialog.waitFor({ state: 'visible', timeout: 10000 });
    }

    /**
     * Click Delete on a peer group row and confirm the deletion dialog
     * @param {number} index
     */
    async clickDeleteOnRow(index = 0) {
        await this.openRowDropdown(index);
        await this.deleteMenuItem.click();
        // Handle confirmation dialog
        await this.anyDialog.waitFor({ state: 'visible', timeout: 5000 });
        const confirmDeleteBtn = this.anyDialog.locator('.button-text:has-text("Delete")');
        await confirmDeleteBtn.click({ force: true });
    }

    /**
     * Navigate back to Settings page
     */
    async navigateBackToSettings() {
        await this.backToSettingsBtn.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    /**
     * Click the match threshold button to select it
     */
    async selectMatchThreshold() {
        await this.matchThresholdBtn.waitFor({ state: 'visible', timeout: 5000 });
        await this.matchThresholdBtn.click();
    }

    /**
     * Full flow: Create a peer group with given institutions and name
     * @param {string[]} institutions - Array of institution names (min 3, max 10)
     * @param {string} groupName - Name for the peer group
     */
    async createPeerGroup(institutions, groupName) {
        await this.openCreateDialog();
        await this.selectInstitutions(institutions);
        await this.clickNext();
        await this.fillPeerGroupName(groupName);
        await this.selectMatchThreshold();
        await this.clickSubmit();
        // Wait for dialog to close and list to update
       // await this.anyDialog.waitFor({ state: 'hidden', timeout: 30000 });
       // await this.page.waitForTimeout(1000);
    }

    /**
     * Delete the last peer group row (cleanup helper)
     */
    async deleteLastPeerGroup() {
        const count = await this.getPeerGroupRowCount();
        if (count > 0) {
            await this.clickDeleteOnRow(count - 1);
            // Wait for the deletion to complete
            await this.page.waitForTimeout(3000);
        }
    }

    /**
     * Check if a peer group with given name exists in the list
     * @param {string} name
     * @returns {Promise<boolean>}
     */
    async isPeerGroupInList(name) {
        const el = this.page.locator(`text=${name}`).first();
        return await el.isVisible().catch(() => false);
    }

    /**
     * Get the review details institution names from Step 2/3
     * @returns {Promise<string[]>}
     */
    async getReviewInstitutions() {
        const reviewSection = this.page.locator('text=Review details').locator('..');
        const items = reviewSection.getByRole('listitem');
        const count = await items.count();
        const names = [];
        for (let i = 0; i < count; i++) {
            const text = await items.nth(i).locator('p').textContent();
            names.push(text.trim());
        }
        return names;
    }
}

module.exports = { PeerGroupsPage };
