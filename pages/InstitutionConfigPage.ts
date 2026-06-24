import { type Page, type Locator } from '@playwright/test';

export class InstitutionConfigPage {
  readonly page: Page;

  // Navigation
  readonly myWorkplaceLink: Locator;
  readonly settingsLink: Locator;
  readonly seeAllConfigLink: Locator;
  readonly backToSettingsBtn: Locator;

  // Configuration page elements
  readonly pageTitle: Locator;
  readonly addConfigBtn: Locator;

  // Table headers
  readonly configHeader: Locator;
  readonly titleHeader: Locator;

  // Dialog elements
  readonly dialog: Locator;
  readonly configDropdown: Locator;
  readonly submitBtn: Locator;
  readonly cancelBtn: Locator;
  readonly closeDialogBtn: Locator;

  // Lower Division / Upper Division fields (combobox)
  readonly minValueCombobox: Locator;
  readonly maxValueCombobox: Locator;

  // Graduate / Developmental fields (textbox)
  readonly minValueTextbox: Locator;
  readonly maxValueTextbox: Locator;

  // Special Topic / Inactive Courses / Developmental fields
  readonly courseSubjectCombobox: Locator;
  readonly courseNumberCombobox: Locator;

  // Inactive Courses specific fields
  readonly minCourseNumberRange: Locator;
  readonly maxCourseNumberRange: Locator;
  readonly courseTitleTextbox: Locator;

  // Checkboxes
  readonly excludeFromSuggestionsCheckbox: Locator;
  readonly excludeFromBoostCheckbox: Locator;
  readonly makeCourseInactiveCheckbox: Locator;
  readonly doNotSuggestLowerDivCheckbox: Locator;
  readonly titleCheckbox: Locator;
  readonly descriptionCheckbox: Locator;
  readonly minMaxHoursCheckbox: Locator;

  // Row actions
  readonly toggleDropdownBtn: Locator;
  readonly editMenuItem: Locator;
  readonly deleteMenuItem: Locator;

  // Toast
  readonly successToast: Locator;

  // My Triangulator
  readonly myTriangulatorLink: Locator;

  constructor(page: Page) {
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

    // Lower Division / Upper Division fields
    this.minValueCombobox = page.getByRole('combobox', { name: 'Minimum value' });
    this.maxValueCombobox = page.getByRole('combobox', { name: 'Maximum value' });

    // Graduate / Developmental fields
    this.minValueTextbox = page.getByRole('textbox', { name: 'Minimum value' });
    this.maxValueTextbox = page.getByRole('textbox', { name: 'Maximum value' });

    // Special Topic / Inactive Courses
    this.courseSubjectCombobox = page.getByRole('combobox', { name: 'Course subject' });
    this.courseNumberCombobox = page.getByRole('combobox', { name: 'Course Number' });

    // Inactive Courses specific
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

    // Toast
    this.successToast = page.getByRole('alert').filter({ hasText: 'Updated settings successfully' });

    // My Triangulator
    this.myTriangulatorLink = page.getByRole('link', { name: 'My Triangulator' });
  }

  async navigateToConfigPage(): Promise<void> {
    await this.myWorkplaceLink.click();
    await this.settingsLink.waitFor({ state: 'visible', timeout: 15000 });
    await this.settingsLink.click();
    await this.page.waitForLoadState('domcontentloaded');
    await this.seeAllConfigLink.waitFor({ state: 'visible', timeout: 10000 });
    await this.seeAllConfigLink.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async navigateToConfigPageDirect(): Promise<void> {
    const baseUrl = (process.env.BASE_URL ?? 'https://qa.creditmobility.net').replace(/\/$/, '');
    await this.page.goto(`${baseUrl}/app/my-workspace/inst-admin/inst/settings/suggestion-configs`);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async openAddConfigDialog(): Promise<void> {
    await this.addConfigBtn.waitFor({ state: 'visible', timeout: 10000 });
    await this.addConfigBtn.click();
    await this.dialog.waitFor({ state: 'visible', timeout: 5000 });
  }

  async selectConfigType(configType: string): Promise<void> {
    await this.configDropdown.click();
    const option = this.page.getByRole('option', { name: configType });
    await option.waitFor({ state: 'visible', timeout: 5000 });
    await option.click();
  }

  async getConfigOptions(): Promise<string[]> {
    await this.configDropdown.click();
    const options = this.page.getByRole('option');
    const texts = await options.allTextContents();
    await this.page.keyboard.press('Escape');
    return texts;
  }

  async clickSubmit(): Promise<void> {
    await this.submitBtn.click();
  }

  async clickCancel(): Promise<void> {
    await this.cancelBtn.click();
  }

  async closeDialog(): Promise<void> {
    await this.closeDialogBtn.click();
  }

  async waitForSuccessToast(): Promise<void> {
    await this.page.getByRole('alert').first().waitFor({ state: 'visible', timeout: 15000 });
  }

  async deleteLastConfig(): Promise<void> {
    const count = await this.toggleDropdownBtn.count();
    if (count > 0) {
      await this.clickDeleteOnRow(count - 1);
      await this.waitForSuccessToast();
      await this.page.getByRole('alert').waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
    }
  }

  async getConfigRowCount(): Promise<number> {
    const rows = this.page.locator('[class*="config-row"], [class*="suggestion-config"]').or(this.toggleDropdownBtn);
    return await rows.count();
  }

  async openRowDropdown(index: number = 0): Promise<void> {
    await this.toggleDropdownBtn.nth(index).click();
    await this.editMenuItem.waitFor({ state: 'visible', timeout: 5000 });
  }

  async clickEditOnRow(index: number = 0): Promise<void> {
    await this.openRowDropdown(index);
    await this.editMenuItem.click();
    await this.dialog.waitFor({ state: 'visible', timeout: 5000 });
  }

  async clickDeleteOnRow(index: number = 0): Promise<void> {
    await this.openRowDropdown(index);
    await this.deleteMenuItem.click();
  }

  async navigateBackToSettings(): Promise<void> {
    await this.backToSettingsBtn.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async isSubmitDisabled(): Promise<boolean> {
    return await this.submitBtn.isDisabled();
  }

  async fillMinValue(value: string): Promise<void> {
    await this.minValueTextbox.fill(value);
  }

  async fillMaxValue(value: string): Promise<void> {
    await this.maxValueTextbox.fill(value);
  }

  async selectMinValueCombobox(value: string): Promise<void> {
    await this.minValueCombobox.click();
    await this.minValueCombobox.fill(value);
    const option = this.page.getByRole('option', { name: value, exact: true });
    await option.waitFor({ state: 'visible', timeout: 5000 });
    await option.click();
  }

  async selectMaxValueCombobox(value: string): Promise<void> {
    await this.maxValueCombobox.click();
    await this.maxValueCombobox.fill(value);
    const option = this.page.getByRole('option', { name: value, exact: true });
    await option.waitFor({ state: 'visible', timeout: 5000 });
    await option.click();
  }

  async selectCourseSubject(subject: string): Promise<void> {
    await this.courseSubjectCombobox.click();
    await this.courseSubjectCombobox.fill(subject);
    const option = this.page.getByRole('option', { name: subject }).first();
    await option.waitFor({ state: 'visible', timeout: 5000 });
    await option.click();
  }

  async selectCourseNumber(number: string): Promise<void> {
    await this.courseNumberCombobox.click();
    await this.courseNumberCombobox.fill(number);
    const option = this.page.getByRole('option', { name: number }).first();
    await option.waitFor({ state: 'visible', timeout: 5000 });
    await option.click();
  }

  async isConfigInList(configName: string): Promise<boolean> {
    const configCell = this.page.locator(`text=${configName}`).first();
    return await configCell.isVisible().catch(() => false);
  }

  async getConfigRowText(index: number = 0): Promise<string> {
    const rows = this.page.locator('[class*="config"] >> nth=' + index);
    return await rows.textContent().catch(() => '') ?? '';
  }
}
