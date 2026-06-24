import { type Page, type Locator, expect, type Download } from '@playwright/test';

/**
 * Page Object for Equivalency Download feature
 * Handles all interactions with the download dialog and related elements
 */
export class EquivalencyDownloadPage {
  readonly page: Page;
  readonly downloadButton: Locator;
  readonly downloadDialog: Locator;
  readonly downloadOptionCombobox: Locator;
  readonly startDateTextbox: Locator;
  readonly endDateTextbox: Locator;
  readonly sourceStateCombobox: Locator;
  readonly sourceInstitutionCombobox: Locator;
  readonly targetSubjectTextbox: Locator;
  readonly cancelButton: Locator;
  readonly downloadActionButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.downloadButton = page.locator('nav').getByRole('button', { name: 'Download' });
    this.downloadDialog = page.getByRole('dialog', { name: 'Download' });
    this.downloadOptionCombobox = page.getByRole('combobox', { name: 'Download option' });
    this.startDateTextbox = page.getByRole('textbox', { name: 'Start date' });
    this.endDateTextbox = page.getByRole('textbox', { name: 'End date' });
    this.sourceStateCombobox = page.getByRole('combobox', { name: 'Source state(s)' });
    this.sourceInstitutionCombobox = page.getByRole('combobox', { name: 'Source institution(s)' });
    this.targetSubjectTextbox = page.getByRole('textbox', { name: 'Target subject(s)' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    this.downloadActionButton = page.getByRole('button', { name: 'Download' }).last();
  }

  // Navigation and Dialog Methods

  async openDownloadDialog(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
    await this.downloadButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.downloadButton.click();
    await this.page.waitForSelector('[role="dialog"]', { timeout: 5000 });
  }

  async verifyDownloadButtonVisible(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
    await expect(this.downloadButton).toBeVisible({ timeout: 10000 });
    await expect(this.downloadButton).toBeEnabled();
  }

  async verifyDialogOpen(): Promise<void> {
    await expect(this.downloadDialog).toBeVisible({ timeout: 5000 });
  }

  async verifyDialogClosed(): Promise<void> {
    await expect(this.downloadDialog).not.toBeVisible({ timeout: 5000 });
  }

  async cancelDownload(): Promise<void> {
    await this.cancelButton.click();
    await this.verifyDialogClosed();
  }

  async closeDialogWithEscape(): Promise<void> {
    await this.page.keyboard.press('Escape');
    await this.verifyDialogClosed();
  }

  // Download Option Methods

  async selectDownloadOption(option = 'Download all'): Promise<void> {
    await this.downloadOptionCombobox.click();
    await this.page.getByRole('option', { name: option }).click();
  }

  async verifyDownloadOptionVisible(): Promise<void> {
    await expect(this.downloadOptionCombobox).toBeVisible();
  }

  // Date Methods

  async setStartDate(date: string): Promise<void> {
    await this.startDateTextbox.fill(date);
  }

  async setEndDate(date: string): Promise<void> {
    await this.endDateTextbox.fill(date);
  }

  async setDateRange(startDate: Date, endDate: Date): Promise<void> {
    await this.setStartDate(startDate.toISOString().split('T')[0]);
    await this.setEndDate(endDate.toISOString().split('T')[0]);
  }

  // State Methods

  async selectState(state: string): Promise<void> {
    await this.sourceStateCombobox.click();
    await this.sourceStateCombobox.fill(state);
    await this.page.waitForTimeout(1000);
    await this.page.keyboard.press('ArrowDown');
    await this.page.keyboard.press('Enter');
  }

  async selectMultipleStates(states: string[]): Promise<void> {
    for (const state of states) {
      await this.selectState(state);
      await this.page.waitForTimeout(500);
    }
  }

  // Institution Methods

  async selectInstitution(institution: string): Promise<void> {
    await this.sourceInstitutionCombobox.click();
    await this.sourceInstitutionCombobox.fill(institution);
    await this.page.waitForTimeout(2000);
    await this.page.keyboard.press('ArrowDown');
    await this.page.keyboard.press('Enter');
  }

  async selectInstitutionFromDropdown(): Promise<void> {
    await this.sourceInstitutionCombobox.click();
    await this.page.waitForTimeout(2000);
    await this.page.keyboard.press('ArrowDown');
    await this.page.keyboard.press('Enter');
  }

  // Subject Methods

  async setTargetSubject(subject: string): Promise<void> {
    await this.targetSubjectTextbox.click();
    await this.targetSubjectTextbox.fill(subject);
  }

  // Download Execution

  async clickDownloadAndWait(timeout = 300000): Promise<Download> {
    const downloadPromise = this.page.waitForEvent('download', { timeout });
    await this.downloadActionButton.click();
    return await downloadPromise;
  }

  async isDownloadButtonDisabled(): Promise<boolean> {
    return await this.downloadActionButton.isDisabled();
  }

  // Filter Verification Methods

  async verifyAllFilterFieldsVisible(): Promise<void> {
    await expect(this.downloadOptionCombobox).toBeVisible();
    await expect(this.startDateTextbox).toBeVisible();
    await expect(this.endDateTextbox).toBeVisible();
    await expect(this.sourceStateCombobox).toBeVisible();
    await expect(this.sourceInstitutionCombobox).toBeVisible();
    await expect(this.targetSubjectTextbox).toBeVisible();
    await expect(this.cancelButton).toBeVisible();
  }

  async verifyFilterLabelsVisible(): Promise<void> {
    await expect(this.page.getByText('Start date')).toBeVisible();
    await expect(this.page.getByText('End date')).toBeVisible();
    await expect(this.page.getByText('Source state(s)')).toBeVisible();
    await expect(this.page.getByText('Source institution(s)')).toBeVisible();
    await expect(this.page.getByText('Target subject(s)')).toBeVisible();
  }

  async verifyFilterFieldUsability(): Promise<void> {
    await expect(this.startDateTextbox).toBeEditable();
    await expect(this.sourceStateCombobox).toBeVisible();
    await expect(this.downloadActionButton).toBeEnabled();
  }

  // Validation Helpers

  getInvalidDateRangeError(): Locator {
    return this.page.getByText('Start date must be earlier');
  }

  getDownloadAllOption(): Locator {
    return this.page.getByRole('option', { name: 'Download all' });
  }

  // Keyboard Navigation

  async pressTab(times = 1): Promise<void> {
    for (let i = 0; i < times; i++) {
      await this.page.keyboard.press('Tab');
    }
  }

  async pressEscape(): Promise<void> {
    await this.page.keyboard.press('Escape');
  }

  async pressArrowDown(): Promise<void> {
    await this.page.keyboard.press('ArrowDown');
  }

  async pressEnter(): Promise<void> {
    await this.page.keyboard.press('Enter');
  }

  // Wait Helpers

  async waitForTimeout(ms: number): Promise<void> {
    await this.page.waitForTimeout(ms);
  }

  async getFocusedElementTagName(): Promise<string | undefined> {
    return await this.page.evaluate(() => document.activeElement?.tagName);
  }
}
