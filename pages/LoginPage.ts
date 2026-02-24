import { type Page, type Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly landingLoginButton: Locator;
  readonly emailTextBox: Locator;
  readonly passwordTextBox: Locator;
  readonly submitButton: Locator;
  readonly myWorkplaceTab: Locator;
  readonly settingsTab: Locator;
  readonly codingSchema: Locator;
  readonly roleIndicator: Locator;

  constructor(page: Page) {
    this.page = page;
    this.landingLoginButton = page.getByRole('button', { name: 'Login' });
    this.emailTextBox = page.getByRole('textbox', { name: 'Email' });
    this.passwordTextBox = page.getByRole('textbox', { name: 'Password' });
    this.submitButton = page.getByRole('button', { name: 'Submit' });
    this.myWorkplaceTab = page.getByRole('link', { name: 'My Workplace' });
    this.settingsTab = page.getByRole('link', { name: 'Settings' });
    this.codingSchema = page.locator('.value-wrapper').nth(2);
    this.roleIndicator = page.locator('.role-indicator');
  }

  async visit(): Promise<void> {
    await this.landingLoginButton.click();
  }

  async loginUser(email: string, password: string): Promise<void> {
    await this.landingLoginButton.click();
    await this.emailTextBox.fill(email);
    await this.passwordTextBox.fill(password);
    await this.submitButton.click();
    await this.page.waitForURL('**/app/dashboard');
  }

  async navigateToSettings(schema: string): Promise<void> {
    await this.page.setDefaultTimeout(120000);
    await this.myWorkplaceTab.click();
    await this.settingsTab.click();
    const handle = await this.codingSchema.elementHandle();
    if (handle) {
      await this.page.evaluate((el) => el.scrollIntoView(), handle);
    }
  }

  async districtHidesForTriangulatorAdmin(): Promise<void> {
    await this.page.getByRole('link', { name: 'My Workplace' }).click();
  }
}
