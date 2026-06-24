import { type Page, type Locator, expect } from '@playwright/test';

/**
 * Page Object for the Run SQL page.
 * Available only to Triangulator Admin role.
 * URL: /app/my-workspace/tri-admin/run-sql
 */
export class RunSqlPage {
  readonly page: Page;

  // Navigation
  readonly myWorkplaceLink: Locator;
  readonly runSqlSidebarLink: Locator;

  // Page elements
  readonly pageHeading: Locator;
  readonly breadcrumbText: Locator;
  readonly sqlInput: Locator;
  readonly executeBtn: Locator;
  readonly downloadCsvBtn: Locator;
  readonly downloadAllBtn: Locator;

  // Results table
  readonly resultsTable: Locator;
  readonly tableHeaderRow: Locator;
  readonly tableBody: Locator;

  /** Dangerous SQL keywords that must never be executed */
  private static readonly BLOCKED_KEYWORDS = [
    'DELETE', 'DROP', 'ALTER', 'TRUNCATE', 'UPDATE',
  ];

  constructor(page: Page) {
    this.page = page;

    this.myWorkplaceLink = page.getByRole('link', { name: 'My Workplace' });
    this.runSqlSidebarLink = page.getByRole('link', { name: 'Run SQL' });

    this.pageHeading = page.getByRole('heading', { name: 'Run SQL', level: 1 });
    this.breadcrumbText = page.locator('#primary-content').getByText('Institutions');
    this.sqlInput = page.getByRole('textbox', { name: 'Enter SQL query' });
    this.executeBtn = page.getByRole('button', { name: 'Execute' });
    this.downloadCsvBtn = page.getByRole('button', { name: 'Download CSV' });
    this.downloadAllBtn = page.getByRole('button', { name: 'Download All' });

    this.resultsTable = page.getByRole('table');
    this.tableHeaderRow = page.getByRole('rowgroup').first().getByRole('row').first();
    this.tableBody = page.getByRole('rowgroup').nth(1);
  }

  // ─── Navigation ────────────────────────────────────────────────────────────

  async navigateToRunSqlPage(): Promise<void> {
    await this.myWorkplaceLink.click();
    await this.page.waitForLoadState('domcontentloaded');
    await this.runSqlSidebarLink.click();
    await this.page.waitForURL('**/run-sql');
    await expect(this.pageHeading).toBeVisible({ timeout: 15000 });
  }

  async navigateToRunSqlPageDirect(): Promise<void> {
    await this.page.goto('/app/my-workspace/tri-admin/run-sql');
    await this.page.waitForLoadState('domcontentloaded');
    await expect(this.pageHeading).toBeVisible({ timeout: 15000 });
  }

  // ─── Query Execution ──────────────────────────────────────────────────────

  /**
   * Validates that a query does not contain dangerous SQL keywords.
   * Throws if a blocked keyword is found.
   */
  assertQueryIsSafe(query: string): void {
    const upper = query.toUpperCase().trim();
    for (const keyword of RunSqlPage.BLOCKED_KEYWORDS) {
      const regex = new RegExp(`\\b${keyword}\\b`, 'i');
      if (regex.test(upper)) {
        throw new Error(
          `BLOCKED: Query contains forbidden keyword "${keyword}". ` +
          'Only SELECT and INSERT on graph_db_output are allowed.'
        );
      }
    }
  }

  async enterQuery(query: string): Promise<void> {
    this.assertQueryIsSafe(query);
    await this.sqlInput.click();
    await this.sqlInput.fill(query);
  }

  async executeQuery(query: string): Promise<void> {
    await this.enterQuery(query);
    await expect(this.executeBtn).toBeEnabled({ timeout: 5000 });
    await this.executeBtn.click();
    // Wait for results table to appear
    await expect(this.resultsTable).toBeVisible({ timeout: 60000 });
  }

  // ─── Results Validation ────────────────────────────────────────────────────

  async getColumnHeaders(): Promise<string[]> {
    const headers = this.resultsTable.getByRole('columnheader');
    const count = await headers.count();
    const names: string[] = [];
    for (let i = 0; i < count; i++) {
      const text = ((await headers.nth(i).textContent()) ?? '').trim();
      names.push(text);
    }
    return names;
  }

  async getResultRowCount(): Promise<number> {
    return await this.tableBody.getByRole('row').count();
  }

  async getCellValue(rowIndex: number, columnName: string): Promise<string> {
    const headers = await this.getColumnHeaders();
    const colIndex = headers.indexOf(columnName);
    if (colIndex === -1) {
      throw new Error(`Column "${columnName}" not found in results table`);
    }
    const row = this.tableBody.getByRole('row').nth(rowIndex);
    const cell = row.getByRole('cell').nth(colIndex);
    return ((await cell.textContent()) ?? '').trim();
  }

  /**
   * Extracts all values for a given column using page.evaluate for speed.
   * Returns an array of trimmed string values, one per data row.
   */
  async getColumnValues(columnName: string): Promise<string[]> {
    const headers = await this.getColumnHeaders();
    const colIndex = headers.indexOf(columnName);
    if (colIndex === -1) {
      throw new Error(`Column "${columnName}" not found in results table`);
    }
    return await this.page.evaluate((ci: number) => {
      const table = document.querySelector('table');
      if (!table) return [];
      const tbody = table.querySelectorAll('tbody');
      const body = tbody.length > 0 ? tbody[tbody.length - 1] : table;
      const rows = body.querySelectorAll('tr');
      const values: string[] = [];
      rows.forEach((row) => {
        const cells = row.querySelectorAll('td');
        values.push((cells[ci]?.textContent ?? '').trim());
      });
      return values;
    }, colIndex);
  }

  /**
   * Validates that every row in the target_institution_id column matches the expected value.
   */
  async validateAllRowsHaveTargetInstitution(expectedId: string): Promise<void> {
    const values = await this.getColumnValues('target_institution_id');
    expect(values.length).toBeGreaterThan(0);
    for (const value of values) {
      expect(value).toBe(expectedId);
    }
  }

  // ─── Download Actions ──────────────────────────────────────────────────────

  async downloadCsv(): Promise<string> {
    const downloadPromise = this.page.waitForEvent('download', { timeout: 60000 });
    await this.downloadCsvBtn.click();
    const download = await downloadPromise;
    const filePath = await download.path();
    expect(filePath).toBeTruthy();
    return filePath ?? '';
  }

  async downloadAll(): Promise<string> {
    const downloadPromise = this.page.waitForEvent('download', { timeout: 60000 });
    await this.downloadAllBtn.click();
    const download = await downloadPromise;
    const filePath = await download.path();
    expect(filePath).toBeTruthy();
    return filePath ?? '';
  }
}
