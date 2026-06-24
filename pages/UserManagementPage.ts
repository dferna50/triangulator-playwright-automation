import { type Page, expect, type Locator } from '@playwright/test';

export class UserManagementPage {
  readonly page: Page;
  readonly myWorkplaceLink: Locator;
  readonly settingsLink: Locator;
  readonly allUsersLink: Locator;
  readonly addUserButton: Locator;
  readonly usersList: Locator;
  readonly searchInput: Locator;
  readonly filterButton: Locator;
  readonly filterDialog: Locator;
  readonly statusCombobox: Locator;
  readonly roleCombobox: Locator;
  readonly nameCombobox: Locator;
  readonly applyButton: Locator;
  readonly cancelButton: Locator;
  readonly usersTable: Locator;
  readonly paginationPrev: Locator;
  readonly paginationNext: Locator;
  readonly nameColumnHeader: Locator;
  readonly roleColumnHeader: Locator;

  constructor(page: Page) {
    this.page = page;
    this.myWorkplaceLink = page.getByRole('link', { name: 'My Workplace' });
    this.settingsLink = page.getByRole('link', { name: 'Settings' });
    this.allUsersLink = page.getByRole('link', { name: 'All' }).first();
    this.addUserButton = page.getByRole('button', { name: 'add user' });
    this.usersList = page.locator('#users-list');
    this.searchInput = page.locator('input[type="text"], input[placeholder*="search" i], input[placeholder*="Search" i]').first();
    this.filterButton = page.getByRole('button', { name: 'Filter' });
    this.filterDialog = page.getByRole('dialog', { name: 'Filter users' });
    this.statusCombobox = page.getByRole('combobox', { name: 'Status' });
    this.roleCombobox = page.getByRole('combobox', { name: 'Role(s)' });
    this.nameCombobox = page.getByRole('combobox', { name: 'Name(s)' });
    this.applyButton = page.getByRole('button', { name: 'Apply' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    this.usersTable = page.getByRole('table', { name: 'allUsers' });
    this.paginationPrev = page.getByRole('button', { name: 'Prev' });
    this.paginationNext = page.getByRole('button', { name: 'Next' });
    this.nameColumnHeader = page.getByRole('button', { name: 'Name' });
    this.roleColumnHeader = page.getByRole('button', { name: 'Role' });
  }

  async navigateToAllUsers(): Promise<void> {
    await this.myWorkplaceLink.click();
    await this.page.waitForTimeout(1000); // Wait for page to load after clicking My Workplace
    await expect(this.allUsersLink).toBeVisible({ timeout: 15000 });
    await this.allUsersLink.click();
    // Wait for users page to load - try multiple conditions
    try {
      await this.page.waitForURL('**/users-all', { timeout: 10000 });
    } catch {
      // If URL doesn't match, wait for search input to be visible instead
      await expect(this.searchInput).toBeVisible({ timeout: 15000 });
    }
  }

  async clickAddUser(): Promise<void> {
    await this.addUserButton.click();
    await expect(this.page.getByRole('dialog', { name: 'Invite user' })).toBeVisible();
  }

  async searchUser(email: string): Promise<void> {
    await this.searchInput.fill(email);
    await this.page.waitForTimeout(1000);
  }

  async verifyUserExists(email: string): Promise<boolean> {
    await this.searchUser(email);
    const userElement = this.page.getByText(email).first();
    return await userElement.isVisible();
  }

  async verifyUserStatus(email: string, expectedStatus: string): Promise<void> {
    await this.searchUser(email);
    const userRow = this.page.locator(`tr:has-text("${email}")`);
    await expect(userRow.getByText(expectedStatus)).toBeVisible();
  }

  async waitForUserCreation(email: string, timeout: number = 30000): Promise<void> {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      if (await this.verifyUserExists(email)) {
        return;
      }
      await this.page.waitForTimeout(2000);
      await this.searchUser(email);
    }
    throw new Error(`User ${email} was not created within ${timeout}ms`);
  }

  async getUserRole(email: string): Promise<string> {
    await this.searchUser(email);
    const userRow = this.page.locator(`tr:has-text("${email}")`);
    const roleCell = userRow.locator('td').nth(2); // Assuming role is in 3rd column
    return await roleCell.textContent() || '';
  }

  async getUserInstitution(email: string): Promise<string> {
    await this.searchUser(email);
    const userRow = this.page.locator(`tr:has-text("${email}")`);
    const institutionCell = userRow.locator('td').nth(3); // Assuming institution is in 4th column
    return await institutionCell.textContent() || '';
  }

  // Filter methods
  async openFilterDialog(): Promise<void> {
    await this.filterButton.click();
    await expect(this.filterDialog).toBeVisible();
  }

  async filterByStatus(status: string): Promise<void> {
    await this.statusCombobox.click();
    await this.page.getByRole('option', { name: status }).click();
    await this.applyButton.click();
    await this.page.waitForTimeout(1000);
  }

  async filterByRole(role: string): Promise<void> {
    await this.roleCombobox.click();
    await this.page.getByRole('option', { name: role }).click();
    await this.applyButton.click();
    await this.page.waitForTimeout(1000);
  }

  async filterByName(name: string): Promise<void> {
    await this.nameCombobox.click();
    await this.nameCombobox.fill(name);
    await this.page.waitForTimeout(500);
    await this.applyButton.click();
    await this.page.waitForTimeout(1000);
  }

  async clearFilters(): Promise<void> {
    await this.cancelButton.click();
    await this.page.waitForTimeout(500);
  }

  // Table and pagination methods
  async getTableRowCount(): Promise<number> {
    return await this.page.locator('table tbody tr').count();
  }

  async sortByName(): Promise<void> {
    await this.nameColumnHeader.click();
    await this.page.waitForTimeout(500);
  }

  async sortByRole(): Promise<void> {
    await this.roleColumnHeader.click();
    await this.page.waitForTimeout(500);
  }

  // User profile methods
  async openUserProfile(userName: string): Promise<void> {
    await this.page.getByRole('link', { name: userName }).click();
    await this.page.waitForTimeout(1000);
  }

  async openUserProfileByEmail(email: string): Promise<void> {
    const userNameCell = this.page.getByText(email).first();
    await userNameCell.click();
    await this.page.waitForURL(/.*user-profile|.*user\/\w+/, { timeout: 10000 });
  }

  getUserProfileFirstNameField(): Locator {
    return this.page.getByRole('textbox', { name: 'First Name' });
  }

  getUserProfileLastNameField(): Locator {
    return this.page.getByRole('textbox', { name: 'Last Name' });
  }

  getUserProfileRoleField(): Locator {
    return this.page.getByRole('combobox', { name: 'System Role' });
  }

  getUserProfileEmailField(): Locator {
    return this.page.getByRole('textbox', { name: /Email/i });
  }

  getUserProfileSaveButton(): Locator {
    return this.page.getByRole('button', { name: 'Save' });
  }

  getUserProfileSuspendButton(): Locator {
    return this.page.getByRole('button', { name: 'suspend' });
  }

  getUserProfileBackButton(): Locator {
    return this.page.getByRole('button', { name: 'Back to table view' });
  }

  async saveUserProfile(): Promise<void> {
    await this.getUserProfileSaveButton().click();
    await this.page.waitForTimeout(1000);
  }

  async goBackToTableView(): Promise<void> {
    await this.getUserProfileBackButton().click();
    await this.page.waitForTimeout(1000);
  }

  // Locator helpers for assertions
  getUserProfileHeading(): Locator {
    return this.page.getByRole('heading', { name: 'User profile' });
  }

  getSuspendSectionHeading(): Locator {
    return this.page.getByRole('heading', { name: 'Suspend account' });
  }

  getAllUsersHeading(): Locator {
    return this.page.getByRole('heading', { name: 'All Users' });
  }

  getActiveUserRow(): Locator {
    return this.page.locator('table tbody tr').filter({ hasText: 'Active' }).first();
  }

  getSuccessMessage(): Locator {
    return this.page.getByText(/saved|updated|success/i);
  }
}
