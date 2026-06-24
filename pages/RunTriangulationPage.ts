import { type Page, type Locator, expect } from '@playwright/test';

export class RunTriangulationPage {
  readonly page: Page;
  readonly pageHeading: Locator;
  readonly pageDescription: Locator;
  readonly refreshButton: Locator;
  readonly runTriangulationButton: Locator;
  readonly prevButton: Locator;
  readonly nextButton: Locator;
  readonly runLogsTable: Locator;
  readonly institutionColumnHeader: Locator;
  readonly userColumnHeader: Locator;
  readonly dateColumnHeader: Locator;
  readonly noDataFoundMessage: Locator;
  readonly modalDialog: Locator;
  readonly modalTitle: Locator;
  readonly modalDescription: Locator;
  readonly modalCloseButton: Locator;
  readonly institutionCombobox: Locator;
  readonly institutionDropdownToggle: Locator;
  readonly institutionDropdownMenu: Locator;
  readonly modalCancelButton: Locator;
  readonly modalRunTriangulationButton: Locator;
  readonly myWorkplaceLink: Locator;
  readonly runTriangulationLink: Locator;
  readonly summaryLink: Locator;
  readonly jobStatusLink: Locator;
  readonly ipedsLink: Locator;
  readonly settingsLink: Locator;
  readonly runSqlLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageHeading = page.getByRole('heading', { name: 'Run Triangulation', level: 1 });
    this.pageDescription = page.getByText('Logs of manual triangulation runs from the last 24 hours are displayed below.');
    this.refreshButton = page.getByRole('button', { name: 'Refresh' });
    this.runTriangulationButton = page.getByRole('button', { name: 'Run Triangulation' }).first();
    this.prevButton = page.getByRole('button', { name: 'Prev' });
    this.nextButton = page.getByRole('button', { name: 'Next' });
    this.runLogsTable = page.getByRole('table', { name: 'runLogs' });
    this.institutionColumnHeader = page.getByRole('columnheader', { name: 'Institution' });
    this.userColumnHeader = page.getByRole('columnheader', { name: 'User' });
    this.dateColumnHeader = page.getByRole('columnheader', { name: 'Date' });
    this.noDataFoundMessage = page.getByText('No data found');
    this.modalDialog = page.getByRole('dialog', { name: 'Run triangulation' });
    this.modalTitle = page.getByRole('dialog').getByText('Run triangulation').first();
    this.modalDescription = page.getByText('Select an institution to run triangulation for');
    this.modalCloseButton = page.getByRole('button', { name: 'close' });
    this.institutionCombobox = page.getByRole('combobox', { name: 'Institution' });
    this.institutionDropdownToggle = page.getByRole('button', { name: 'Toggle dropdown' });
    this.institutionDropdownMenu = page.getByRole('listbox', { name: 'Institution' });
    this.modalCancelButton = page.getByRole('button', { name: 'Cancel' });
    this.modalRunTriangulationButton = page.getByRole('dialog').getByRole('button', { name: 'Run Triangulation' });
    this.myWorkplaceLink = page.getByRole('link', { name: 'My Workplace' });
    this.runTriangulationLink = page.getByRole('link', { name: 'Run Triangulation' });
    this.summaryLink = page.getByRole('link', { name: 'Summary' });
    this.jobStatusLink = page.getByRole('link', { name: 'Job Status' });
    this.ipedsLink = page.getByRole('link', { name: 'IPEDS' });
    this.settingsLink = page.getByRole('link', { name: 'Settings' });
    this.runSqlLink = page.getByRole('link', { name: 'Run SQL' });
  }

  async navigateToRunTriangulation(): Promise<void> {
    await this.page.getByRole('link', { name: 'My Workplace' }).click();
    await this.page.waitForURL('**/app/my-workspace/tri-admin/inst/summary**');
    await this.page.getByRole('link', { name: 'Run Triangulation' }).click();
    await this.page.waitForURL('**/app/my-workspace/tri-admin/run-triangulation**');
  }

  async verifyPageElements(): Promise<void> {
    await expect(this.pageHeading).toBeVisible();
    await expect(this.pageDescription).toBeVisible();
    await expect(this.refreshButton).toBeVisible();
    await expect(this.runTriangulationButton).toBeVisible();
    await expect(this.runLogsTable).toBeVisible();
    await expect(this.institutionColumnHeader).toBeVisible();
    await expect(this.userColumnHeader).toBeVisible();
    await expect(this.dateColumnHeader).toBeVisible();
  }

  async clickRunTriangulationButton(): Promise<void> {
    await this.runTriangulationButton.click();
    await expect(this.modalDialog).toBeVisible();
  }

  async verifyModalElements(): Promise<void> {
    await expect(this.modalDialog).toBeVisible();
    await expect(this.modalTitle).toBeVisible();
    await expect(this.modalDescription).toBeVisible();
    await expect(this.modalCloseButton).toBeVisible();
    await expect(this.institutionCombobox).toBeVisible();
    await expect(this.institutionDropdownToggle).toBeVisible();
    await expect(this.modalCancelButton).toBeVisible();
    await expect(this.modalRunTriangulationButton).toBeVisible();
  }

  async selectInstitutionByName(institutionName: string): Promise<void> {
    await this.institutionCombobox.click();
    await this.institutionCombobox.fill(institutionName);
    await this.page.waitForTimeout(1000);
    await this.page.getByRole('option', { name: institutionName }).click();
    await this.page.waitForTimeout(1500);
  }

  async selectInstitutionByTyping(searchText: string, optionName: string): Promise<void> {
    await this.institutionCombobox.click();
    await this.institutionCombobox.fill(searchText);
    await this.page.waitForTimeout(1000);
    await this.page.getByRole('option', { name: optionName }).click();
    await this.page.waitForTimeout(1500);
  }

  async verifyInstitutionSelected(institutionName: string): Promise<void> {
    await expect(this.institutionCombobox).toHaveValue(institutionName);
  }

  async verifyRunTriangulationButtonEnabled(): Promise<void> {
    await expect(this.modalRunTriangulationButton).toBeEnabled({ timeout: 10000 });
  }

  async verifyRunTriangulationButtonDisabled(): Promise<void> {
    await expect(this.modalRunTriangulationButton).toBeDisabled();
  }

  async clickModalRunTriangulationButton(): Promise<void> {
    await this.modalRunTriangulationButton.click();
  }

  async clickModalCancelButton(): Promise<void> {
    await this.modalCancelButton.click();
    await expect(this.modalDialog).not.toBeVisible();
  }

  async clickModalCloseButton(): Promise<void> {
    await this.modalCloseButton.click();
    await expect(this.modalDialog).not.toBeVisible();
  }

  async clickRefreshButton(): Promise<void> {
    await this.refreshButton.click();
  }

  async verifyTableHasData(): Promise<void> {
    const rows = this.runLogsTable.locator('tbody tr');
    await expect(rows.first()).toBeVisible();
  }

  async verifyNoDataFound(): Promise<void> {
    await expect(this.noDataFoundMessage).toBeVisible();
  }

  async getTableRowCount(): Promise<number> {
    const rows = this.runLogsTable.locator('tbody tr');
    return await rows.count();
  }

  async verifyInstitutionDropdownVisible(): Promise<void> {
    await this.institutionDropdownToggle.click();
    await expect(this.institutionDropdownMenu).toBeVisible();
  }

  async getInstitutionOptions(): Promise<string[]> {
    await this.institutionCombobox.click();
    await this.page.waitForTimeout(500);
    const options = this.page.getByRole('option');
    const count = await options.count();
    const optionTexts: string[] = [];
    for (let i = 0; i < count; i++) {
      const text = await options.nth(i).textContent();
      if (text) {
        optionTexts.push(text);
      }
    }
    return optionTexts;
  }

  async searchInstitution(searchText: string): Promise<void> {
    await this.institutionCombobox.click();
    await this.institutionCombobox.fill(searchText);
    await this.page.waitForTimeout(1000);
  }

  async verifySearchResults(expectedResults: string[]): Promise<void> {
    const options = this.page.getByRole('option');
    const count = await options.count();
    expect(count).toBe(expectedResults.length);
    for (let i = 0; i < count; i++) {
      const text = await options.nth(i).textContent();
      expect(expectedResults).toContain(text);
    }
  }

  async runTriangulationForInstitution(institutionName: string): Promise<void> {
    await this.clickRunTriangulationButton();
    await this.verifyModalElements();
    await this.selectInstitutionByName(institutionName);
    await this.verifyRunTriangulationButtonEnabled();
    await this.clickModalRunTriangulationButton();
  }
}
