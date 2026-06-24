import { type Page, type Locator, expect } from '@playwright/test';

export interface ApiTokenData {
  organization: string;
}

export interface TokenInfo {
  tokenId: string;
  organization: string;
  status: string;
  created: string;
  expires: string;
}

export class ApiTokensPage {
  readonly page: Page;
  readonly myWorkplaceLink: Locator;
  readonly apiTokensLink: Locator;
  readonly generateTokenButton: Locator;
  readonly refreshButton: Locator;
  readonly tokensTable: Locator;
  readonly openSidebarButton: Locator;
  
  // Generate Token Dialog
  readonly generateTokenDialog: Locator;
  readonly organizationCombobox: Locator;
  readonly cancelButton: Locator;
  readonly generateButton: Locator;
  readonly closeDialogButton: Locator;
  
  // Token Display Dialog (after generation) - Optional as it appears only after token generation
  readonly tokenDisplayDialog?: Locator;
  readonly tokenValueText?: Locator;
  readonly copyTokenButton?: Locator;
  readonly closeTokenDialogButton?: Locator;
  
  // Table columns and pagination
  readonly tableTokenIdColumn: Locator;
  readonly tableOrganizationColumn: Locator;
  readonly tableStatusColumn: Locator;
  readonly tableCreatedColumn: Locator;
  readonly tableExpiresColumn: Locator;
  readonly prevPageButton: Locator;
  readonly nextPageButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.myWorkplaceLink = page.getByRole('link', { name: 'My Workplace' });
    this.apiTokensLink = page.getByRole('link', { name: 'API tokens' });
    this.generateTokenButton = page.getByRole('button', { name: 'Generate token' });
    this.refreshButton = page.getByRole('button', { name: 'Refresh' });
    this.tokensTable = page.locator('table[name="orgApiTokens"], table[id="orgApiTokens"]');
    this.openSidebarButton = page.getByRole('button', { name: 'Open Sidebar' });
    
    // Generate Token Dialog - Use regex patterns and first() to avoid strict mode issues
    this.generateTokenDialog = page.getByRole('dialog', { name: 'Generate org API token' });
    this.organizationCombobox = page.getByRole('combobox', { name: /Organization/i }).first();
    this.cancelButton = page.getByRole('button', { name: 'Cancel', exact: true });
    this.generateButton = page.getByRole('button', { name: 'Generate' });
    this.closeDialogButton = page.getByRole('button', { name: 'close' });
    
    // Table columns - use first() to avoid strict mode issues
    this.tableTokenIdColumn = page.getByRole('columnheader', { name: 'Token ID' }).first();
    this.tableOrganizationColumn = page.getByRole('columnheader', { name: 'Organization' }).first();
    this.tableStatusColumn = page.getByRole('columnheader', { name: 'Status' }).first();
    this.tableCreatedColumn = page.getByRole('columnheader', { name: 'Created' }).first();
    this.tableExpiresColumn = page.getByRole('columnheader', { name: 'Expires' }).first();
    this.prevPageButton = page.getByRole('button', { name: 'Prev' });
    this.nextPageButton = page.getByRole('button', { name: 'Next' });
  }

  async navigateToMyWorkplace(): Promise<void> {
    await this.myWorkplaceLink.click();
    await this.page.waitForURL('**/app/my-workspace/**');
  }

  async navigateToApiTokens(): Promise<void> {
    await this.apiTokensLink.click();
    await this.page.waitForURL('**/app/my-workspace/tri-admin/inst/org-admin/org-api-tokens**');
  }

  async openApiTokensSidebar(): Promise<void> {
    await this.openSidebarButton.click();
  }

  async clickGenerateToken(): Promise<void> {
    await this.generateTokenButton.click();
    await this.generateTokenDialog.waitFor({ state: 'visible' });
  }

  async selectOrganization(organizationName: string): Promise<void> {
    await this.organizationCombobox.click();
    await this.page.getByRole('option', { name: organizationName, exact: false }).first().click();
  }

  async generateToken(data: ApiTokenData): Promise<void> {
    await this.clickGenerateToken();
    await this.selectOrganization(data.organization);
    await this.generateButton.click();
    // Wait for token generation - a new dialog might appear showing the token
    await this.page.waitForTimeout(1000);
  }

  async cancelTokenGeneration(): Promise<void> {
    await this.cancelButton.click();
    await this.generateTokenDialog.waitFor({ state: 'hidden' });
  }

  async closeTokenDialog(): Promise<void> {
    await this.closeDialogButton.click();
    await this.generateTokenDialog.waitFor({ state: 'hidden' });
  }

  async refreshTokens(): Promise<void> {
    await this.refreshButton.click();
    // Wait for table to refresh (5 seconds for data to appear)
    await this.page.waitForTimeout(5000);
  }

  async revokeToken(tokenId: string): Promise<void> {
    const row = this.page.locator('table tbody tr').filter({ hasText: tokenId });
    const revokeButton = row.locator('button:has-text("Revoke")');
    if (await revokeButton.isVisible().catch(() => false)) {
      await revokeButton.click();
      // Confirm revocation if a confirmation dialog appears
      const confirmButton = this.page.getByRole('button', { name: 'Confirm' });
      if (await confirmButton.isVisible().catch(() => false)) {
        await confirmButton.click();
      }
    }
  }

  async revokeTokenByOrganization(organizationName: string): Promise<void> {
    const row = this.page.locator('table tbody tr').filter({ hasText: organizationName }).first();
    const revokeButton = row.locator('button:has-text("Revoke")');
    if (await revokeButton.isVisible().catch(() => false)) {
      await revokeButton.click();
      // Confirm revocation if a confirmation dialog appears
      const confirmButton = this.page.getByRole('button', { name: 'Confirm' });
      if (await confirmButton.isVisible().catch(() => false)) {
        await confirmButton.click();
      }
    }
  }

  async verifyTokenInTable(tokenId: string): Promise<boolean> {
    const row = this.page.locator('table tbody tr').filter({ hasText: tokenId });
    return await row.isVisible().catch(() => false);
  }

  async verifyTokenByOrganizationInTable(organizationName: string): Promise<boolean> {
    const row = this.page.locator('table tbody tr').filter({ hasText: organizationName });
    return await row.first().isVisible().catch(() => false);
  }

  async getTokenRow(tokenId: string): Promise<Locator> {
    return this.page.locator('table tbody tr').filter({ hasText: tokenId });
  }

  async getTokenInfo(tokenId: string): Promise<TokenInfo | null> {
    const row = await this.getTokenRow(tokenId);
    if (await row.isVisible().catch(() => false)) {
      const cells = row.locator('td');
      if (await cells.count() >= 5) {
        return {
          tokenId: await cells.nth(0).textContent() || '',
          organization: await cells.nth(1).textContent() || '',
          status: await cells.nth(2).textContent() || '',
          created: await cells.nth(3).textContent() || '',
          expires: await cells.nth(4).textContent() || ''
        };
      }
    }
    return null;
  }

  async sortByColumn(columnName: string): Promise<void> {
    const columnHeader = this.page.getByRole('columnheader', { name: columnName }).first();
    await columnHeader.click();
  }

  async goToNextPage(): Promise<void> {
    if (await this.nextPageButton.isEnabled().catch(() => false)) {
      await this.nextPageButton.click();
    }
  }

  async goToPrevPage(): Promise<void> {
    if (await this.prevPageButton.isEnabled().catch(() => false)) {
      await this.prevPageButton.click();
    }
  }

  async verifyTableHeaders(): Promise<void> {
    await expect(this.tableTokenIdColumn).toBeVisible();
    await expect(this.tableOrganizationColumn).toBeVisible();
    await expect(this.tableStatusColumn).toBeVisible();
    await expect(this.tableCreatedColumn).toBeVisible();
    await expect(this.tableExpiresColumn).toBeVisible();
  }

  async verifyApiTokensPageLoaded(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Org API tokens' })).toBeVisible();
    await expect(this.generateTokenButton).toBeVisible();
    await expect(this.refreshButton).toBeVisible();
    await this.verifyTableHeaders();
  }

  async getAllTokens(): Promise<TokenInfo[]> {
    const rows = this.page.locator('table tbody tr');
    const tokens: TokenInfo[] = [];
    const count = await rows.count();
    
    for (let i = 0; i < count; i++) {
      const row = rows.nth(i);
      const cells = row.locator('td');
      if (await cells.count() >= 5) {
        const token: TokenInfo = {
          tokenId: (await cells.nth(0).textContent() || '').trim(),
          organization: (await cells.nth(1).textContent() || '').trim(),
          status: (await cells.nth(2).textContent() || '').trim(),
          created: (await cells.nth(3).textContent() || '').trim(),
          expires: (await cells.nth(4).textContent() || '').trim()
        };
        tokens.push(token);
      }
    }
    
    return tokens;
  }

  async getActiveTokens(): Promise<TokenInfo[]> {
    const allTokens = await this.getAllTokens();
    return allTokens.filter(token => token.status === 'ACTIVE');
  }

  async getInactiveTokens(): Promise<TokenInfo[]> {
    const allTokens = await this.getAllTokens();
    return allTokens.filter(token => token.status === 'INACTIVE');
  }

  async getTokensByOrganization(organizationName: string): Promise<TokenInfo[]> {
    const allTokens = await this.getAllTokens();
    return allTokens.filter(token => token.organization.includes(organizationName));
  }
}
