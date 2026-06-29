import { type Page, type Locator } from '@playwright/test';

export class PeerGroupsPage {
  readonly page: Page;

  // Navigation
  readonly myWorkplaceLink: Locator;
  readonly settingsLink: Locator;
  readonly seeAllPeerGroupsLink: Locator;
  readonly backToSettingsBtn: Locator;

  // Page elements
  readonly pageTitle: Locator;
  readonly createPeerGroupBtn: Locator;
  readonly manageHeading: Locator;
  readonly pageDescription: Locator;

  // Table headers
  readonly nameHeader: Locator;
  readonly stateHeader: Locator;
  readonly matchThresholdHeader: Locator;

  // Dialogs
  readonly createDialog: Locator;
  readonly editDialog: Locator;
  readonly anyDialog: Locator;

  // Dialog common elements
  readonly closeDialogBtn: Locator;
  readonly cancelBtn: Locator;
  readonly nextBtn: Locator;
  readonly submitBtn: Locator;
  readonly backBtn: Locator;

  // Step 1: Institution search
  readonly institutionCombobox: Locator;
  readonly institutionList: Locator;

  // Step 2: Peer group name
  readonly peerGroupNameInput: Locator;

  // Step 3: Match threshold
  readonly matchThresholdBtn: Locator;

  // Row actions
  readonly toggleSeeMoreBtn: Locator;
  readonly editMenuItem: Locator;
  readonly deleteMenuItem: Locator;

  constructor(page: Page) {
    this.page = page;

    this.myWorkplaceLink = page.getByRole('link', { name: 'My Workplace' });
    this.settingsLink = page.getByRole('link', { name: 'Settings' });
    this.seeAllPeerGroupsLink = page.getByRole('link', { name: 'Open Peer Groups page' });
    this.backToSettingsBtn = page.getByRole('button', { name: 'Return to Institution Settings' });

    this.pageTitle = page.locator('text=Peer groups').first();
    this.createPeerGroupBtn = page.getByRole('button', { name: 'Create peer group' });
    this.manageHeading = page.locator('text=Manage peer groups');
    this.pageDescription = page.locator('text=Pick up to 10 peer groups');

    this.nameHeader = page.locator('text=Name').first();
    this.stateHeader = page.locator('text=State').first();
    this.matchThresholdHeader = page.locator('text=Match threshold').first();

    this.createDialog = page.getByRole('dialog', { name: 'Create peer group' });
    this.editDialog = page.getByRole('dialog', { name: 'Edit peer group' });
    this.anyDialog = page.getByRole('dialog');

    this.closeDialogBtn = page.getByRole('button', { name: 'close' });
    this.cancelBtn = page.getByRole('button', { name: 'Cancel' });
    this.nextBtn = page.getByRole('button', { name: 'Next' });
    this.submitBtn = page.getByRole('button', { name: 'Submit' });
    this.backBtn = page.getByRole('button', { name: 'Back' });

    this.institutionCombobox = page.locator('#combobox-input');
    this.institutionList = page.getByRole('list', { name: 'Use arrow keys to navigate' });

    this.peerGroupNameInput = page.getByRole('textbox', { name: 'Peer group name' });

    this.matchThresholdBtn = page.getByRole('button', { name: /peers/ });

    this.toggleSeeMoreBtn = page.getByRole('button', { name: 'Toggle see more' });
    this.editMenuItem = page.getByRole('menuitem', { name: 'Edit' });
    this.deleteMenuItem = page.getByRole('menuitem', { name: 'Delete' });
  }

  async navigateToPeerGroupsPage(): Promise<void> {
    await this.myWorkplaceLink.click();
    await this.settingsLink.waitFor({ state: 'visible', timeout: 15000 });
    await this.settingsLink.click();
    await this.page.waitForLoadState('domcontentloaded');
    await this.seeAllPeerGroupsLink.waitFor({ state: 'visible', timeout: 10000 });
    await this.seeAllPeerGroupsLink.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async navigateToPeerGroupsPageDirect(forceReload: boolean = false): Promise<void> {
    const baseUrl = (process.env.BASE_URL ?? 'https://qa.creditmobility.net').replace(/\/$/, '');
    const targetUrl = `${baseUrl}/app/my-workspace/inst-admin/inst/settings/peer-groups`;

    if (!this.page.url().includes('/peer-groups')) {
      await this.page.goto(targetUrl);
      await this.page.waitForLoadState('domcontentloaded');
    } else if (forceReload) {
      await this.page.reload();
      await this.page.waitForLoadState('domcontentloaded');
    }

    await this.createPeerGroupBtn.waitFor({ state: 'visible', timeout: 45000 });
  }

  async openCreateDialog(): Promise<void> {
    await this.createPeerGroupBtn.waitFor({ state: 'visible', timeout: 10000 });
    await this.createPeerGroupBtn.click();
    await this.createDialog.waitFor({ state: 'visible', timeout: 5000 });
  }

  async selectInstitution(name: string): Promise<void> {
    const option = this.page.getByRole('option', { name: name, exact: true });

    for (let attempt = 0; attempt < 2; attempt++) {
      await this.institutionCombobox.click();
      await this.institutionCombobox.fill(name);

      try {
        await option.waitFor({ state: 'visible', timeout: 20000 });
        await option.click();
        return;
      } catch {
        // Retry: clear the input and try again
        await this.institutionCombobox.clear();
        await this.page.waitForTimeout(1000);
      }
    }

    // Final attempt with longer timeout
    await this.institutionCombobox.click();
    await this.institutionCombobox.fill(name);
    await option.waitFor({ state: 'visible', timeout: 30000 });
    await option.click();
  }

  async selectInstitutions(names: string[]): Promise<void> {
    for (const name of names) {
      await this.selectInstitution(name);
    }
  }

  async getSelectedCountText(): Promise<string> {
    const countEl = this.page.locator('text=/\\d+\\/10 institutions selected/');
    await countEl.waitFor({ state: 'visible', timeout: 5000 });
    return await countEl.textContent() ?? '';
  }

  async getSelectedCount(): Promise<number> {
    const text = await this.getSelectedCountText();
    const match = text.match(/(\d+)\/10/);
    return match ? parseInt(match[1]) : 0;
  }

  async removeInstitution(index: number = 0): Promise<void> {
    // Dismiss any open dropdown first
    await this.dismissDropdown();
    await this.page.waitForTimeout(300);
    const removeBtns = this.page.locator('[aria-label="Remove"] button');
    await removeBtns.nth(index).waitFor({ state: 'visible', timeout: 5000 });
    await removeBtns.nth(index).click({ force: true });
  }

  async dismissDropdown(): Promise<void> {
    const listHeader = this.page.locator('text=/\\d+\\/10 institutions selected/');
    const isVisible = await listHeader.isVisible().catch(() => false);
    if (isVisible) {
      await listHeader.click();
      await this.page.waitForTimeout(300);
    }
  }

  async clickNext(): Promise<void> {
    await this.dismissDropdown();
    await this.nextBtn.waitFor({ state: 'visible', timeout: 5000 });
    await this.nextBtn.click({ force: true });
    await this.peerGroupNameInput.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
  }

  async clickBack(): Promise<void> {
    await this.backBtn.waitFor({ state: 'visible', timeout: 5000 });
    await this.backBtn.click({ force: true });
  }

  async fillPeerGroupName(name: string): Promise<void> {
    await this.peerGroupNameInput.waitFor({ state: 'visible', timeout: 5000 });
    await this.peerGroupNameInput.fill(name);
  }

  async getCharCountText(): Promise<string> {
    const countEl = this.page.locator('text=/\\d+ \\/ 60/');
    return await countEl.textContent() ?? '';
  }

  async clickSubmit(): Promise<void> {
    await this.submitBtn.waitFor({ state: 'visible', timeout: 5000 });
    await this.submitBtn.scrollIntoViewIfNeeded();

    // Click Submit and wait for the GraphQL mutation response
    const [response] = await Promise.all([
      this.page.waitForResponse(
        resp => resp.url().includes('/graphql') && resp.status() === 200,
        { timeout: 30000 }
      ).catch(() => null),
      this.submitBtn.click({ timeout: 5000 }).catch(() =>
        this.submitBtn.click({ force: true })
      ),
    ]);

    if (response) {
      // Give the UI time to process the response
      await this.page.waitForTimeout(1000);
    }

    // If the dialog didn't auto-close, close it manually
    const dialogStillVisible = await this.anyDialog.isVisible().catch(() => false);
    if (dialogStillVisible) {
      // Try clicking the close button
      const closeBtn = this.anyDialog.locator('[aria-label="close"], button:has-text("close")').first();
      const closeBtnVisible = await closeBtn.isVisible().catch(() => false);
      if (closeBtnVisible) {
        await closeBtn.click({ force: true });
      } else {
        // Press Escape as fallback
        await this.page.keyboard.press('Escape');
      }
      await this.anyDialog.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
    }
  }

  async clickCancel(): Promise<void> {
    await this.dismissDropdown();
    await this.cancelBtn.waitFor({ state: 'visible', timeout: 5000 });
    await this.cancelBtn.click({ force: true });
  }

  async closeDialog(): Promise<void> {
    await this.dismissDropdown();
    await this.closeDialogBtn.waitFor({ state: 'visible', timeout: 5000 });
    await this.closeDialogBtn.click();
  }

  async waitForSuccessToast(): Promise<void> {
    await this.page.getByRole('alert').first().waitFor({ state: 'visible', timeout: 15000 });
  }

  async waitForToastDismiss(): Promise<void> {
    await this.page.getByRole('alert').waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
  }

  async isNextDisabled(): Promise<boolean> {
    const disabledBtn = this.page.locator('button:has-text("Next")[disabled]');
    const count = await disabledBtn.count();
    return count > 0;
  }

  async isSubmitDisabled(): Promise<boolean> {
    const disabledBtn = this.page.locator('button:has-text("Submit")[disabled]');
    const count = await disabledBtn.count();
    return count > 0;
  }

  async getPeerGroupRowCount(): Promise<number> {
    // Wait for skeleton loaders to disappear
    try {
      await this.page.locator('.skeleton-rect').first().waitFor({ state: 'hidden', timeout: 10000 });
      await this.page.locator('.animate-pulse').first().waitFor({ state: 'hidden', timeout: 10000 });
    } catch (e) {
      // Ignore timeouts if skeletons were already gone or never existed
    }
    await this.page.waitForTimeout(1000);
    return await this.toggleSeeMoreBtn.count();
  }

  async openRowDropdown(index: number = 0): Promise<void> {
    // Wait for page to be ready
    await this.createPeerGroupBtn.waitFor({ state: 'visible', timeout: 15000 });
    await this.page.waitForTimeout(500);

    const maxAttempts = 3;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      // On retry attempts, reload to get a clean DOM state
      if (attempt > 0) {
        await this.page.reload();
        await this.page.waitForLoadState('domcontentloaded');
        await this.createPeerGroupBtn.waitFor({ state: 'visible', timeout: 15000 });
        await this.page.waitForTimeout(1000);
      }

      // Dismiss any previously open menu by clicking elsewhere
      await this.page.locator('body').click({ position: { x: 10, y: 10 } });
      await this.page.waitForTimeout(300);

      const toggle = this.toggleSeeMoreBtn.nth(index);
      const toggleExists = await toggle.isVisible().catch(() => false);
      if (!toggleExists) {
        if (attempt < maxAttempts - 1) continue;
        throw new Error(`Toggle button at index ${index} not found after ${maxAttempts} attempts`);
      }

      await toggle.scrollIntoViewIfNeeded();
      await toggle.click({ force: true });

      // Wait for menu to appear
      let menuVisible = false;
      for (let i = 0; i < 5; i++) {
        menuVisible = await this.editMenuItem.isVisible().catch(() => false);
        if (menuVisible) break;
        await this.page.waitForTimeout(500);
      }

      if (menuVisible) return;

      // If menu didn't appear, try clicking again without force
      await toggle.click();
      await this.page.waitForTimeout(1000);
      menuVisible = await this.editMenuItem.isVisible().catch(() => false);
      if (menuVisible) return;
    }

    throw new Error(`Edit menu did not appear after ${maxAttempts} attempts`);
  }

  async clickEditOnRow(index: number = 0): Promise<void> {
    await this.openRowDropdown(index);
    await this.editMenuItem.click();
    await this.anyDialog.waitFor({ state: 'visible', timeout: 10000 });
  }

  async clickDeleteOnRow(index: number = 0): Promise<void> {
    await this.openRowDropdown(index);
    await this.deleteMenuItem.click();
    await this.anyDialog.waitFor({ state: 'visible', timeout: 5000 });
    const confirmDeleteBtn = this.anyDialog.locator('.button-text:has-text("Delete")');
    await confirmDeleteBtn.waitFor({ state: 'visible', timeout: 5000 });
    await confirmDeleteBtn.click({ force: true });
    // Wait for the confirmation dialog to close
    await this.anyDialog.waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {});
  }

  async navigateBackToSettings(): Promise<void> {
    await this.backToSettingsBtn.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async selectMatchThreshold(): Promise<void> {
    await this.matchThresholdBtn.waitFor({ state: 'visible', timeout: 5000 });
    await this.matchThresholdBtn.click();
  }

  async createPeerGroup(institutions: string[], groupName: string): Promise<void> {
    await this.openCreateDialog();
    await this.selectInstitutions(institutions);
    await this.clickNext();
    await this.fillPeerGroupName(groupName);
    await this.selectMatchThreshold();
    await this.clickSubmit();
    // Navigate back to ensure list is updated and dialog is dismissed
    await this.navigateToPeerGroupsPageDirect(true);
  }

  async deleteLastPeerGroup(): Promise<void> {
    const count = await this.getPeerGroupRowCount();
    if (count > 0) {
      await this.clickDeleteOnRow(count - 1);
      await this.page.waitForTimeout(3000);
    }
  }

  async isPeerGroupInList(name: string): Promise<boolean> {
    const el = this.page.locator(`text=${name}`).first();
    return await el.isVisible().catch(() => false);
  }

  async clickVueButton(locator: import('@playwright/test').Locator): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout: 5000 });
    await locator.click();
  }

  async getReviewInstitutions(): Promise<string[]> {
    const reviewSection = this.page.locator('text=Review details').locator('..');
    const items = reviewSection.getByRole('listitem');
    const count = await items.count();
    const names: string[] = [];
    for (let i = 0; i < count; i++) {
      const text = await items.nth(i).locator('p').textContent();
      names.push((text ?? '').trim());
    }
    return names;
  }
}
