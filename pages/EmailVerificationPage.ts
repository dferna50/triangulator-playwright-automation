import { type Page, expect } from '@playwright/test';

export class EmailVerificationPage {
  readonly page: Page;
  readonly emailInput: any;
  readonly passwordInput: any;
  readonly submitButton: any;
  readonly newPasswordInput: any;
  readonly confirmPasswordInput: any;
  readonly changePasswordButton: any;
  readonly successMessage: any;
  readonly welcomeMessage: any;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByRole('textbox', { name: 'Email' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.submitButton = page.getByRole('button', { name: 'Submit' });
    this.newPasswordInput = page.getByRole('textbox', { name: 'New Password' });
    this.confirmPasswordInput = page.getByRole('textbox', { name: 'Confirm Password' });
    this.changePasswordButton = page.getByRole('button', { name: 'Change Password' });
    this.successMessage = page.getByText('Password changed successfully');
    this.welcomeMessage = page.getByText('Welcome to Triangulator');
  }

  async navigateToLoginFromEmail(loginUrl: string): Promise<void> {
    await this.page.goto(loginUrl);
    await this.page.waitForTimeout(3000);
    
    // Step 1: Check if we're on accept-invite page with "Go to login" button
    const currentUrl = this.page.url();
    console.log(`Current URL: ${currentUrl}`);
    
    if (currentUrl.includes('accept-invite')) {
      const goToLoginButton = this.page.getByRole('button', { name: 'Go to login' });
      if (await goToLoginButton.isVisible().catch(() => false)) {
        console.log('Clicking "Go to login" button...');
        await goToLoginButton.click();
        // Wait for navigation to landing page
        await this.page.waitForURL('**/logged-out/landing', { timeout: 10000 }).catch(() => {});
        await this.page.waitForTimeout(3000);
      }
    }
    
    // Step 2: Check if we're on landing page with "Login" button
    const urlAfterStep1 = this.page.url();
    console.log(`URL after step 1: ${urlAfterStep1}`);
    
    if (urlAfterStep1.includes('logged-out/landing') || urlAfterStep1.includes('landing')) {
      const loginButton = this.page.getByRole('button', { name: 'Login' });
      if (await loginButton.isVisible().catch(() => false)) {
        console.log('Clicking "Login" button...');
        await loginButton.click();
        // Wait for navigation to login page
        await this.page.waitForURL('**/logged-out/login/**', { timeout: 10000 }).catch(() => {});
        await this.page.waitForTimeout(3000);
      }
    }
    
    // Step 3: Wait for login page to load (email input visible)
    const finalUrl = this.page.url();
    console.log(`Final URL: ${finalUrl}`);
    
    // Try flexible locator for email field
   await this.page.getByRole('link', { name: 'go to login' }).click();
   await this.page.getByRole('button', { name: 'Login' }).click();

  }

  async firstTimeLogin(email: string, tempPassword: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(tempPassword);
    await this.submitButton.click();
    
    // After login with temp password, user might be redirected to:
    // 1. Password change page (first-time login)
    // 2. Dashboard (if password was already changed)
    // 3. Login page with error (if login failed)
    
    // Wait a moment for redirect/navigation
    await this.page.waitForTimeout(10000);
    
    // // Check if we're on the password change page
    // const isPasswordChangePage = await this.newPasswordInput.isVisible().catch(() => false);
    
    // if (!isPasswordChangePage) {
    //   // Check if we're on dashboard (already logged in)
    //   const isDashboard = await this.page.getByRole('heading', { name: 'Dashboard' }).isVisible().catch(() => false);
      
    //   if (isDashboard) {
    //     console.log('✅ Already on dashboard - password may have been changed previously');
    //     return;
    //   }
      
    //   // If neither, something went wrong
    //   throw new Error('Login failed - neither password change page nor dashboard visible');
    // }
  }

  async changePassword(newPassword: string): Promise<void> {
    // Only change password if we're on the password change page

    await this.page.getByRole('textbox', { name: 'new password', exact: true }).fill('Triangulator!1')
    await this.page.getByRole('textbox', { name: 'confirm new password' }).fill('Triangulator!1')
    
 
    await this.changePasswordButton.click();
    
    await expect(this.page.getByText('Welcome,')).toBeVisible({ timeout: 10000 });
  }

  async completeFirstTimeLogin(email: string, tempPassword: string, newPassword: string): Promise<void> {
    await this.firstTimeLogin(email, tempPassword);
    await this.changePassword(newPassword);
    
    // Should redirect to dashboard after successful login/password change
    const isDashboard = await this.page.getByRole('heading', { name: 'Dashboard' }).isVisible({ timeout: 10000 }).catch(() => false);
    
    if (!isDashboard) {
      console.log('⚠️ Dashboard not visible after login - checking current URL...');
      console.log(`Current URL: ${await this.page.url()}`);
    }
  }

  async verifyPasswordChangeValidation(): Promise<void> {
    await this.newPasswordInput.fill('weak');
    await this.confirmPasswordInput.fill('weak');
    await this.changePasswordButton.click();
    
    // Check for password validation messages
    await expect(this.page.getByText('Password must be at least 8 characters')).toBeVisible();
  }

  async verifyPasswordMismatch(): Promise<void> {
    await this.newPasswordInput.fill('ValidPassword123!');
    await this.confirmPasswordInput.fill('DifferentPassword123!');
    await this.changePasswordButton.click();
    
    await expect(this.page.getByText('Passwords do not match')).toBeVisible();
  }

  async verifyExpiredTempPassword(email: string, expiredPassword: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(expiredPassword);
    await this.submitButton.click();
    
    await expect(this.page.getByText('Temporary password has expired')).toBeVisible();
  }

  async verifyInvalidTempPassword(email: string, invalidPassword: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(invalidPassword);
    await this.submitButton.click();
    
    await expect(this.page.getByText('Invalid email or password')).toBeVisible();
  }

  async waitForPasswordChangePage(): Promise<void> {
    await expect(this.newPasswordInput).toBeVisible({ timeout: 15000 });
    await expect(this.confirmPasswordInput).toBeVisible();
    await expect(this.changePasswordButton).toBeVisible();
  }

  async isPasswordChangedSuccessfully(): Promise<boolean> {
    try {
      await expect(this.successMessage).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  async waitForRedirectToDashboard(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Dashboard' })).toBeVisible({ timeout: 15000 });
  }

  async logout(): Promise<void> {
    // Look for logout button/link - adjust selector based on actual implementation
    await this.page.getByRole('button', { name: 'Logout' }).click();
    await expect(this.emailInput).toBeVisible({ timeout: 10000 });
  }

  async loginWithNewPassword(email: string, newPassword: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(newPassword);
    await this.submitButton.click();
    
    // Should go directly to dashboard (no password change required)
    await expect(this.page.getByRole('heading', { name: 'Dashboard' })).toBeVisible({ timeout: 10000 });
  }
}
