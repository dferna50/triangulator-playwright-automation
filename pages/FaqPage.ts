import { type Page, type Locator } from '@playwright/test';

export class FaqPage {
  readonly page: Page;
  readonly myWorkplaceLink: Locator;
  readonly settingsLink: Locator;
  readonly openSidebarBtn: Locator;
  readonly faqLinkInSidebar: Locator;
  readonly faqInput: Locator;
  readonly saveButton: Locator;
  readonly faqLinkInNav: Locator;

  constructor(page: Page) {
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
  async navigateToFaqSettings(): Promise<void> {
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
  async openSidebarIfCollapsed(): Promise<void> {
    const isSidebarBtnVisible = await this.openSidebarBtn
      .isVisible()
      .catch(() => false);
    if (isSidebarBtnVisible) {
      await this.openSidebarBtn.click();
      await this.faqLinkInSidebar.waitFor({ state: 'visible', timeout: 5000 });
    }
  }

  /**
   * Set FAQ link URL
   */
  async setFaqUrl(url: string): Promise<void> {
    await this.faqInput.waitFor({ state: 'visible', timeout: 5000 });
    await this.faqInput.clear();
    await this.faqInput.fill(url);
  }

  /**
   * Click the Save button
   */
  async clickSave(): Promise<void> {
    await this.saveButton.click();
    // Wait for save to complete by checking button is re-enabled or checking for success state
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Set FAQ URL and save
   */
  async setAndSaveFaqUrl(url: string): Promise<void> {
    await this.setFaqUrl(url);
    await this.clickSave();
  }

  /**
   * Get the current FAQ URL value from input field
   */
  async getFaqUrlValue(): Promise<string> {
    return await this.faqInput.inputValue();
  }

  /**
   * Clear the FAQ URL input field
   */
  async clearFaqUrl(): Promise<void> {
    await this.faqInput.waitFor({ state: 'visible', timeout: 5000 });
    await this.faqInput.clear();
  }

  /**
   * Check if FAQ link is visible in top navigation
   */
  async isFaqLinkVisibleInNav(): Promise<boolean> {
    return await this.faqLinkInNav.isVisible().catch(() => false);
  }

  /**
   * Click FAQ link in top navigation
   */
  async clickFaqLinkInNav(): Promise<void> {
    await this.faqLinkInNav.click();
  }

  /**
   * Getter for the FAQ input locator (for direct assertions in tests)
   */
  getFaqInput(): Locator {
    return this.faqInput;
  }

  /**
   * Getter for the Save button locator (for direct assertions in tests)
   */
  getSaveButton(): Locator {
    return this.saveButton;
  }

  /**
   * Getter for the FAQ link in nav (for direct assertions in tests)
   */
  getFaqLinkInNav(): Locator {
    return this.faqLinkInNav;
  }

  /**
   * Verify FAQ settings page is loaded
   */
  async verifyFaqSettingsPageLoaded(): Promise<void> {
    await this.page.waitForURL(/.*settings.*faq.*/i, { timeout: 10000 });
    await this.faqInput.waitFor({ state: 'visible', timeout: 5000 });
  }

  /**
   * Navigate to FAQ settings and verify page loaded
   */
  async navigateAndVerify(): Promise<void> {
    await this.navigateToFaqSettings();
    await this.verifyFaqSettingsPageLoaded();
  }
}
