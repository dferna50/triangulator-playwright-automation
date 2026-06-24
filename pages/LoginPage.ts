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
    // Wait for page to be fully loaded
    await this.page.waitForLoadState('domcontentloaded');
    
    // Check if we're already on the login page with the form visible
    // Wait up to 5 seconds for the email field to appear
    let emailVisible = false;
    for (let i = 0; i < 10; i++) {
      emailVisible = await this.emailTextBox.isVisible().catch(() => false);
      if (emailVisible) break;
      await this.page.waitForTimeout(500);
    }
    
    if (!emailVisible) {
      // Only click the landing login button if email field is not visible
      await this.landingLoginButton.waitFor({ state: 'visible', timeout: 10000 });
      await this.landingLoginButton.click();
      // Wait for email field to appear after clicking login
      await this.emailTextBox.waitFor({ state: 'visible', timeout: 10000 });
    }
    
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
