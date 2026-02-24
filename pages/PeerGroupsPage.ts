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

  async navigateToPeerGroupsPageDirect(): Promise<void> {
    const baseUrl = process.env.BASE_URL ?? 'https://qa.creditmobility.net/';
    await this.page.goto(`${baseUrl}app/my-workspace/inst-admin/inst/settings/peer-groups`);
    await this.page.waitForLoadState('domcontentloaded');
    await this.createPeerGroupBtn.waitFor({ state: 'visible', timeout: 15000 });
  }

  async openCreateDialog(): Promise<void> {
    await this.createPeerGroupBtn.waitFor({ state: 'visible', timeout: 10000 });
    await this.createPeerGroupBtn.click();
    await this.createDialog.waitFor({ state: 'visible', timeout: 5000 });
  }

  async selectInstitution(name: string): Promise<void> {
    await this.institutionCombobox.click();
    await this.institutionCombobox.fill(name);
    const option = this.page.getByRole('option', { name: name, exact: true });
    await option.waitFor({ state: 'visible', timeout: 10000 });
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
    const removeBtns = this.page.locator('[aria-label="Remove"] button');
    await removeBtns.nth(index).click();
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
    await this.page.evaluate(() => {
      const btns = [...document.querySelectorAll('.button-text')];
      const submitText = btns.find(b => b.textContent?.trim() === 'Submit');
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
    await this.page.waitForTimeout(1000);
    return await this.toggleSeeMoreBtn.count();
  }

  async openRowDropdown(index: number = 0): Promise<void> {
    await this.toggleSeeMoreBtn.nth(index).click();
    await this.editMenuItem.waitFor({ state: 'visible', timeout: 5000 });
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
    await confirmDeleteBtn.click({ force: true });
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
