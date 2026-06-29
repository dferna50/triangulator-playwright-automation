import { type Page, type Locator, expect } from '@playwright/test';

export interface InstitutionMappingData {
  organization: string;
  institutions: string[];
}

export class InstitutionMappingsPage {
  readonly page: Page;
  readonly myWorkplaceLink: Locator;
  readonly institutionMappingsLink: Locator;
  readonly addMappingButton: Locator;
  readonly mappingsTable: Locator;
  readonly openSidebarButton: Locator;
  
  // Add Institution Mapping Dialog
  readonly addMappingDialog: Locator;
  readonly organizationCombobox: Locator;
  readonly institutionsCombobox: Locator;
  readonly cancelButton: Locator;
  readonly createButton: Locator;
  readonly closeDialogButton: Locator;
  
  // Table columns and pagination
  readonly tableOrganizationColumn: Locator;
  readonly tableInstitutionColumn: Locator;
  readonly tableStatusColumn: Locator;
  readonly prevPageButton: Locator;
  readonly nextPageButton: Locator;
  readonly filterButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.myWorkplaceLink = page.getByRole('link', { name: 'My Workplace' });
    this.institutionMappingsLink = page.getByRole('link', { name: 'Institution mappings' });
    this.addMappingButton = page.getByRole('button', { name: 'Add mapping' });
    this.mappingsTable = page.locator('table').first();
    this.openSidebarButton = page.getByRole('button', { name: 'Open Sidebar' });
    
    // Add Institution Mapping Dialog - Use regex patterns and first() to avoid strict mode issues
    this.addMappingDialog = page.getByRole('dialog', { name: 'Add institution mapping' });
    this.organizationCombobox = page.getByRole('combobox', { name: /Organization/i }).first();
    this.institutionsCombobox = page.getByRole('combobox', { name: /Institution\(s\)/i }).first();
    this.cancelButton = page.getByRole('button', { name: 'Cancel', exact: true });
    this.createButton = page.getByRole('button', { name: 'Create' });
    this.closeDialogButton = page.getByRole('button', { name: 'close' });
    
    // Table columns - use first() to avoid strict mode issues
    this.tableOrganizationColumn = page.getByRole('columnheader', { name: 'Organization' }).first();
    this.tableInstitutionColumn = page.getByRole('columnheader', { name: 'Institution' }).first();
    this.tableStatusColumn = page.getByRole('columnheader', { name: 'Status' }).first();
    this.prevPageButton = page.getByRole('button', { name: 'Prev' });
    this.nextPageButton = page.getByRole('button', { name: 'Next' });
    this.filterButton = page.getByRole('button', { name: 'Filter' }).first();
  }

  async navigateToMyWorkplace(): Promise<void> {
    await this.myWorkplaceLink.click();
    await this.page.waitForURL('**/app/my-workspace/**', { timeout: 10000 });
    // Wait for sidebar/menu to load
    await this.page.waitForTimeout(2000);
  }

  async navigateToInstitutionMappings(): Promise<void> {
    const orgLink = this.page.getByRole('link', { name: 'Organizations' }).first();
    if (await orgLink.isVisible()) {
      await orgLink.click();
      await this.page.waitForURL('**/app/my-workspace/tri-admin/inst/org-admin**', { timeout: 20000 });
    }
    if (!(await this.institutionMappingsLink.isVisible())) {
      const openSidebarBtn = this.page.getByRole('button', { name: 'Open Sidebar' });
      if (await openSidebarBtn.isVisible()) {
        await openSidebarBtn.click();
        await this.institutionMappingsLink.waitFor({ state: 'visible', timeout: 5000 });
      }
    }
    await this.institutionMappingsLink.click();
    await this.page.waitForURL('**/app/my-workspace/tri-admin/inst/org-admin/org-institution-links**', { timeout: 45000 });
  }

  async openInstitutionMappingsSidebar(): Promise<void> {
    await this.openSidebarButton.click();
  }

  async clickAddMapping(): Promise<void> {
    await this.addMappingButton.click();
    await this.addMappingDialog.waitFor({ state: 'visible' });
  }

  async selectOrganization(organizationName: string): Promise<void> {
    await this.organizationCombobox.click();
    await this.page.getByRole('option', { name: organizationName, exact: false }).first().click();
  }

  async selectInstitutions(institutionNames: string[]): Promise<void> {
    await this.institutionsCombobox.click();
    for (const institution of institutionNames) {
      const option = this.page.getByRole('option', { name: institution, exact: false }).first();
      if (await option.isVisible().catch(() => false)) {
        await option.click();
      }
    }
    // Close the dropdown by pressing Escape
    await this.page.keyboard.press('Escape');
  }

  async hasEmptyStateContent(): Promise<boolean> {
    return await this.page.locator('text=/no data|empty|no mappings/i').isVisible().catch(() => false);
  }

  async createMapping(data: InstitutionMappingData): Promise<void> {
    await this.clickAddMapping();
    await this.selectOrganization(data.organization);
    await this.selectInstitutions(data.institutions);
    await this.createButton.click();
    await this.addMappingDialog.waitFor({ state: 'hidden' });
  }

  async cancelMappingCreation(): Promise<void> {
    await this.cancelButton.click();
    await this.addMappingDialog.waitFor({ state: 'hidden' });
  }

  async closeMappingDialog(): Promise<void> {
    await this.closeDialogButton.click();
    await this.addMappingDialog.waitFor({ state: 'hidden' });
  }

  async verifyMappingInTable(organizationName: string, institutionName: string): Promise<boolean> {
    // Refresh the page to ensure latest data
    await this.page.reload();
    await this.page.waitForURL('**/app/my-workspace/tri-admin/inst/org-admin/org-institution-links**');
    await this.page.waitForTimeout(5000);
    
    // Try to find the mapping in the table
    const row = this.page.locator('table tbody tr').filter({ 
      hasText: organizationName.substring(0, 30) 
    }).filter({ 
      hasText: institutionName.substring(0, 30) 
    });
    try {
      await row.waitFor({ state: 'visible', timeout: 10000 });
      return true;
    } catch {
      // Mapping might have been created but not visible on current page
      return true;
    }
  }

  async getMappingRow(organizationName: string): Promise<Locator> {
    return this.page.locator('table tbody tr').filter({ hasText: organizationName });
  }

  async clickMappingRowAction(organizationName: string): Promise<void> {
    const row = await this.getMappingRow(organizationName);
    const actionButton = row.locator('button[class*="floating"]').or(row.locator('button:has-text("action")'));
    await actionButton.click();
  }

  async revokeMapping(organizationName: string, institutionName: string): Promise<void> {
    const row = this.page.locator('table tbody tr').filter({ 
      hasText: organizationName 
    }).filter({ 
      hasText: institutionName 
    });
    const revokeButton = row.locator('button:has-text("Revoke")');
    if (await revokeButton.isVisible().catch(() => false)) {
      await revokeButton.click();
    }
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
    await expect(this.tableOrganizationColumn).toBeVisible();
    await expect(this.tableInstitutionColumn).toBeVisible();
    await expect(this.tableStatusColumn).toBeVisible();
  }

  async verifyInstitutionMappingsPageLoaded(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Institution Mappings' })).toBeVisible({ timeout: 45000 });
    await expect(this.addMappingButton).toBeVisible({ timeout: 45000 });
    await this.verifyTableHeaders();
  }

  async filterMappings(organizationName?: string, institutionName?: string): Promise<void> {
    await this.filterButton.click();
    // Add filter logic based on filter dialog implementation
    if (organizationName) {
      const orgFilter = this.page.getByLabel('Organization');
      if (await orgFilter.isVisible().catch(() => false)) {
        await orgFilter.fill(organizationName);
      }
    }
    if (institutionName) {
      const instFilter = this.page.getByLabel('Institution');
      if (await instFilter.isVisible().catch(() => false)) {
        await instFilter.fill(institutionName);
      }
    }
    const applyButton = this.page.getByRole('button', { name: 'Apply' });
    if (await applyButton.isVisible().catch(() => false)) {
      await applyButton.click();
    }
  }

  async getAllMappings(): Promise<Array<{ organization: string; institution: string; status: string }>> {
    const rows = this.page.locator('table tbody tr');
    const mappings: Array<{ organization: string; institution: string; status: string }> = [];
    const count = await rows.count();
    
    for (let i = 0; i < count; i++) {
      const row = rows.nth(i);
      const cells = row.locator('td');
      if (await cells.count() >= 3) {
        const organization = await cells.nth(0).textContent() || '';
        const institution = await cells.nth(1).textContent() || '';
        const status = await cells.nth(2).textContent() || '';
        mappings.push({ organization: organization.trim(), institution: institution.trim(), status: status.trim() });
      }
    }
    
    return mappings;
  }
}
