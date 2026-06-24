import { type Page, type Locator, expect } from '@playwright/test';

export interface RequestAccessData {
  institution: string;
  firstName: string;
  lastName: string;
  email: string;
  jobTitle: string;
}

export class RequestAccessPage {
  readonly page: Page;

  // Landing page
  readonly requestAccessButton: Locator;

  // Selection page
  readonly institutionOption: Locator;
  readonly userOption: Locator;

  // Form fields (common to both Institution and User forms)
  readonly institutionCombobox: Locator;
  readonly institutionToggleDropdown: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly jobTitleInput: Locator;
  readonly termsRegion: Locator;
  readonly termsCheckbox: Locator;
  readonly termsAcceptButton: Locator;
  readonly submitButton: Locator;

  // Validation / Error messages
  readonly institutionRequiredError: Locator;

  // Success state
  readonly successAlert: Locator;
  readonly successHeading: Locator;
  readonly successMessage: Locator;
  readonly goToLoginButton: Locator;

  // Back button
  readonly backButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Landing — there are multiple "Request access" buttons on the page;
    // .first() targets the one in the navigation bar.
    this.requestAccessButton = page.getByRole('button', { name: 'Request access' }).first();

    // Selection page options
    this.institutionOption = page.getByRole('link', { name: 'Institution' });
    this.userOption = page.getByRole('link', { name: 'User' });

    // Form fields
    this.institutionCombobox = page.getByRole('combobox', { name: 'Institution' });
    this.institutionToggleDropdown = page.getByRole('button', { name: 'Toggle dropdown' });
    this.firstNameInput = page.getByRole('textbox', { name: 'primary contact first name' });
    this.lastNameInput = page.getByRole('textbox', { name: 'primary contact last name' });
    this.emailInput = page.getByRole('textbox', { name: 'primary contact email' });
    this.jobTitleInput = page.getByRole('textbox', { name: 'job title' });
    this.termsRegion = page.locator('region[aria-label="terms and conditions"], [role="region"][aria-label*="terms and conditions" i]').first();
    this.termsCheckbox = page.getByRole('checkbox', { name: 'toggle accept terms' });
    this.termsAcceptButton = page.getByRole('button', { name: /I have read and agree to the Terms and Conditions/i });
    this.submitButton = page.getByRole('button', { name: 'Submit' });

    // Validation
    this.institutionRequiredError = page.getByText('Institution is required');

    // Success
    this.successAlert = page.getByRole('alert');
    this.successHeading = page.getByRole('heading', { name: 'Request sent' });
    this.successMessage = page.getByText("An admin will review your request and email you when it's approved.");
    this.goToLoginButton = page.getByRole('button', { name: 'Go to login' });

    // Back button (top-left arrow)
    this.backButton = page.locator('main button').first();
  }

  // ─── Navigation ───────────────────────────────────────────────────────────

  async navigateToLanding(): Promise<void> {
    await this.page.goto('/logged-out/landing');
    await this.page.waitForLoadState('networkidle');
    await expect(this.requestAccessButton).toBeVisible({ timeout: 15000 });
  }

  async clickRequestAccess(): Promise<void> {
    await this.requestAccessButton.click();
    await this.page.waitForURL('**/logged-out/request-access/**', { timeout: 10000 });
  }

  async selectInstitutionOption(): Promise<void> {
    await expect(this.institutionOption).toBeVisible({ timeout: 10000 });
    await this.institutionOption.click();
    await this.page.waitForURL('**/logged-out/request-access/inst**', { timeout: 10000 });
  }

  async selectUserOption(): Promise<void> {
    await expect(this.userOption).toBeVisible({ timeout: 10000 });
    await this.userOption.click();
    await this.page.waitForURL('**/logged-out/request-access/user**', { timeout: 10000 });
  }

  // ─── Form Helpers ─────────────────────────────────────────────────────────

  async waitForFormToLoad(): Promise<void> {
    await expect(this.institutionCombobox).toBeVisible({ timeout: 10000 });
    await expect(this.firstNameInput).toBeVisible({ timeout: 10000 });
    await expect(this.lastNameInput).toBeVisible({ timeout: 10000 });
    await expect(this.emailInput).toBeVisible({ timeout: 10000 });
    await expect(this.jobTitleInput).toBeVisible({ timeout: 10000 });
    await expect(this.termsAcceptButton).toBeVisible({ timeout: 10000 });
    await expect(this.submitButton).toBeVisible({ timeout: 10000 });
  }

  async selectInstitution(institutionName: string): Promise<void> {
    await this.institutionCombobox.click();
    await this.page.waitForTimeout(300);

    // Type to filter dropdown
    await this.institutionCombobox.fill(institutionName);
    await this.page.waitForTimeout(800);

    // Press Enter or click matching option
    try {
      const option = this.page.getByRole('option').filter({ hasText: institutionName }).first();
      await option.click({ timeout: 5000 });
    } catch {
      await this.page.keyboard.press('Enter');
    }

    await this.page.waitForTimeout(300);
  }

  async fillForm(data: RequestAccessData): Promise<void> {
    await this.selectInstitution(data.institution);
    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);
    await this.emailInput.fill(data.email);
    await this.jobTitleInput.fill(data.jobTitle);
  }

  async scrollTermsToBottom(): Promise<void> {
    // Scroll the terms region to bottom using JavaScript
    await this.page.evaluate(() => {
      const el = document.querySelector('[aria-label*="terms and conditions" i], [role="region"]');
      if (el) {
        el.scrollTop = el.scrollHeight;
      }
    });
    await this.page.waitForTimeout(500);
  }

  async acceptTerms(): Promise<void> {
    await this.scrollTermsToBottom();
    await this.termsCheckbox.click();
    await this.page.waitForTimeout(300);
  }

  async submitForm(): Promise<void> {
    await this.submitButton.click();
  }

  async completeRequestAccess(data: RequestAccessData): Promise<void> {
    await this.fillForm(data);
    await this.acceptTerms();
    await this.submitForm();
  }

  // ─── Assertions ───────────────────────────────────────────────────────────

  async assertSuccessState(): Promise<void> {
    await expect(this.successAlert).toBeVisible({ timeout: 15000 });
    await expect(this.successHeading).toBeVisible({ timeout: 10000 });
    await expect(this.successMessage).toBeVisible({ timeout: 10000 });
    await expect(this.goToLoginButton).toBeVisible({ timeout: 10000 });
  }

  async assertSuccessUrl(): Promise<void> {
    await expect(this.page).toHaveURL(/requestAccess__success=true/);
  }

  async assertSubmitDisabled(): Promise<void> {
    await expect(this.submitButton).toBeDisabled({ timeout: 5000 });
  }

  async assertSubmitEnabled(): Promise<void> {
    await expect(this.submitButton).toBeEnabled({ timeout: 5000 });
  }

  async assertTermsCheckboxDisabled(): Promise<void> {
    await expect(this.termsCheckbox).toBeDisabled({ timeout: 5000 });
  }

  async assertTermsCheckboxEnabled(): Promise<void> {
    await expect(this.termsCheckbox).toBeEnabled({ timeout: 5000 });
  }

  async assertFieldRequiredError(fieldName: string): Promise<void> {
    const errorLocator = this.page.getByText(`${fieldName} is required`);
    await expect(errorLocator).toBeVisible({ timeout: 5000 });
  }

  async assertInvalidEmailError(): Promise<void> {
    const errorLocator = this.page.getByText(/Please enter a valid email address|Invalid email/i);
    await expect(errorLocator).toBeVisible({ timeout: 5000 });
  }

  // ─── Validation Test Helpers ────────────────────────────────────────────────

  async clearAllFields(): Promise<void> {
    await this.institutionCombobox.fill('');
    await this.firstNameInput.fill('');
    await this.lastNameInput.fill('');
    await this.emailInput.fill('');
    await this.jobTitleInput.fill('');
  }

  async fillOnlyFirstName(): Promise<void> {
    await this.clearAllFields();
    await this.firstNameInput.fill('Test');
  }

  async fillOnlyLastName(): Promise<void> {
    await this.clearAllFields();
    await this.lastNameInput.fill('User');
  }

  async fillOnlyEmail(): Promise<void> {
    await this.clearAllFields();
    await this.emailInput.fill('test@example.com');
  }

  async fillOnlyJobTitle(): Promise<void> {
    await this.clearAllFields();
    await this.jobTitleInput.fill('QA Engineer');
  }

  async fillFormWithoutTerms(data: RequestAccessData): Promise<void> {
    await this.fillForm(data);
    // Do NOT accept terms
  }

  async fillFormWithInvalidEmail(data: RequestAccessData): Promise<void> {
    const invalidData = { ...data, email: 'invalid-email-format' };
    await this.fillForm(invalidData);
    await this.acceptTerms();
  }

  // ─── Email helpers ────────────────────────────────────────────────────────

  getSuccessPageEmail(): string | null {
    const url = this.page.url();
    const match = url.match(/[?&]email=([^&]+)/);
    return match ? decodeURIComponent(match[1]) : null;
  }
}
