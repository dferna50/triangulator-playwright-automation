import { type Page, type Locator, expect } from '@playwright/test';

export class WorkflowConfigurationsPage {
  readonly page: Page;
  readonly pageHeading: Locator;
  readonly backButton: Locator;
  readonly returnToInstitutionSettingsButton: Locator;
  readonly manageGroupsSection: Locator;
  readonly manageGroupsHeading: Locator;
  readonly manageGroupsDescription: Locator;
  readonly createGroupButton: Locator;
  readonly groupNameColumnHeader: Locator;
  readonly manageWorkflowSection: Locator;
  readonly manageWorkflowHeading: Locator;
  readonly manageWorkflowDescription: Locator;
  readonly commentersInfo: Locator;
  readonly approversInfo: Locator;
  readonly addWorkflowButton: Locator;
  readonly workflowNameColumnHeader: Locator;
  readonly createGroupModal: Locator;
  readonly createGroupModalTitle: Locator;
  readonly createGroupModalCloseButton: Locator;
  readonly createGroupStep1Text: Locator;
  readonly createGroupStep1Description: Locator;
  readonly usersCombobox: Locator;
  readonly usersDropdownToggle: Locator;
  readonly usersDropdownMenu: Locator;
  readonly createGroupCancelButton: Locator;
  readonly createGroupNextButton: Locator;
  readonly createWorkflowModal: Locator;
  readonly createWorkflowModalTitle: Locator;
  readonly createWorkflowModalCloseButton: Locator;
  readonly createWorkflowStep1Text: Locator;
  readonly workflowSchemeCombobox: Locator;
  readonly workflowSchemeDropdownToggle: Locator;
  readonly workflowSchemeDropdownMenu: Locator;
  readonly createWorkflowCancelButton: Locator;
  readonly createWorkflowNextButton: Locator;
  readonly institutionFooter: Locator;
  readonly institutionName: Locator;
  readonly institutionLocation: Locator;
  readonly myWorkplaceLink: Locator;
  readonly settingsLink: Locator;
  readonly myTriangulatorLink: Locator;
  readonly openWorkflowConfigurationsLink: Locator;
  readonly suggestionManagementText: Locator;
  readonly suggestionsHeading: Locator;
  readonly assignedSuggestionsText: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageHeading = page.getByText('Workflow configurations');
    this.backButton = page.getByText('Back');
    this.returnToInstitutionSettingsButton = page.getByRole('button', { name: 'Return to Institution Settings' });
    this.manageGroupsSection = page.getByRole('region', { name: 'Manage groups' });
    this.manageGroupsHeading = page.getByText('Manage groups');
    this.manageGroupsDescription = page.getByText('Create groups and assign users.');
    this.createGroupButton = page.getByRole('button', { name: 'create group' });
    this.groupNameColumnHeader = page.getByText('Group name');
    this.manageWorkflowSection = page.getByRole('region', { name: 'Manage workflow' });
    this.manageWorkflowHeading = page.getByText('Manage workflow');
    this.manageWorkflowDescription = page.getByText('Create workflows by picking from a list of available schemes and adding customization.');
    this.commentersInfo = page.getByText('Commenters:');
    this.approversInfo = page.getByText('Approvers:');
    this.addWorkflowButton = page.getByRole('button', { name: 'add workflow' });
    this.workflowNameColumnHeader = page.getByText('Workflow name');
    this.createGroupModal = page.getByRole('dialog', { name: 'Create evaluation group' });
    this.createGroupModalTitle = page.getByRole('dialog').getByText('Create evaluation group').first();
    this.createGroupModalCloseButton = page.getByRole('dialog').getByRole('button', { name: 'close' });
    this.createGroupStep1Text = page.getByText('Step 1: Add users');
    this.createGroupStep1Description = page.getByText('Must select at least 3 users');
    this.usersCombobox = page.locator('[role="combobox"]');
    this.usersDropdownToggle = page.locator('.z-10').first();
    this.usersDropdownMenu = page.getByRole('listbox', { name: 'Users' });
    this.createGroupCancelButton = page.getByRole('dialog').getByRole('button', { name: 'Cancel' });
    this.createGroupNextButton = page.getByRole('dialog').getByRole('button', { name: 'Next' });
    this.createWorkflowModal = page.getByRole('dialog', { name: 'Create workflow' });
    this.createWorkflowModalTitle = page.getByRole('dialog').getByText('Create workflow').first();
    this.createWorkflowModalCloseButton = page.getByRole('dialog').getByRole('button', { name: 'close' });
    this.createWorkflowStep1Text = page.getByText('Step 1: Select a workflow scheme');
    this.workflowSchemeCombobox = page.getByRole('combobox', { name: 'Workflow Scheme' });
    this.workflowSchemeDropdownToggle = page.getByRole('button', { name: 'Toggle dropdown' });
    this.workflowSchemeDropdownMenu = page.getByRole('listbox', { name: 'Workflow scheme' });
    this.createWorkflowCancelButton = page.getByRole('dialog').getByRole('button', { name: 'Cancel' });
    this.createWorkflowNextButton = page.getByRole('dialog').getByRole('button', { name: 'Next' });
    this.institutionFooter = page.locator('.absolute.bottom-0');
    this.institutionName = page.getByText('University of Nevada-Reno');
    this.institutionLocation = page.getByText('Reno, Nevada');
    this.myWorkplaceLink = page.getByRole('link', { name: 'My Workplace' });
    this.settingsLink = page.getByRole('link', { name: 'Settings' });
    this.myTriangulatorLink = page.getByRole('link', { name: 'My Triangulator' });
    this.openWorkflowConfigurationsLink = page.getByRole('link', { name: 'Open Workflow Configurations' });
    this.suggestionManagementText = page.getByText('Suggestion management');
    this.suggestionsHeading = page.getByRole('heading', { name: 'Suggestions', exact: true });
    this.assignedSuggestionsText = page.getByText('Assigned');
  }

  async navigateToWorkflowConfigurations(): Promise<void> {
    await this.page.getByRole('link', { name: 'My Workplace' }).click();
    await this.page.waitForURL('**/app/my-workspace/inst-admin/summary**');
    await this.page.getByRole('link', { name: 'Settings' }).click();
    await this.page.waitForURL('**/app/my-workspace/inst-admin/inst/settings/**');
    await this.page.getByRole('link', { name: 'Open Workflow Configurations' }).click();
    await this.page.waitForURL('**/app/my-workspace/inst-admin/inst/settings/workflow-configs**');
    await this.page.waitForTimeout(1000);
  }

  async verifyPageElements(): Promise<void> {
    await expect(this.pageHeading).toBeVisible({ timeout: 10000 });
    await expect(this.backButton).toBeVisible();
    await expect(this.returnToInstitutionSettingsButton).toBeVisible();
    await expect(this.manageGroupsSection).toBeVisible();
    await expect(this.manageGroupsHeading).toBeVisible();
    await expect(this.manageGroupsDescription).toBeVisible();
    await expect(this.createGroupButton).toBeVisible();
    await expect(this.manageWorkflowSection).toBeVisible();
    await expect(this.manageWorkflowHeading).toBeVisible();
    await expect(this.manageWorkflowDescription).toBeVisible();
    await expect(this.commentersInfo).toBeVisible();
    await expect(this.approversInfo).toBeVisible();
    await expect(this.addWorkflowButton).toBeVisible();
    await expect(this.workflowNameColumnHeader).toBeVisible();
    await expect(this.institutionName).toBeVisible();
    await expect(this.institutionLocation).toBeVisible();
  }

  async clickCreateGroupButton(): Promise<void> {
    await this.createGroupButton.click();
    await expect(this.createGroupModal).toBeVisible();
  }

  async verifyCreateGroupModalElements(): Promise<void> {
    await expect(this.createGroupModal).toBeVisible();
    await expect(this.createGroupModalTitle).toBeVisible();
    await expect(this.createGroupModalCloseButton).toBeVisible();
    await expect(this.createGroupStep1Text).toBeVisible();
    await expect(this.createGroupStep1Description).toBeVisible();
    // Check for users input field with more flexible locator
    const usersInput = this.page.locator('input').filter({ hasText: '' }).first();
    await expect(usersInput).toBeVisible({ timeout: 5000 });
    await expect(this.createGroupCancelButton).toBeVisible();
    await expect(this.createGroupNextButton).toBeVisible();
  }

  async clickUsersDropdown(): Promise<void> {
    // Try to click the users combobox or any input field in the modal
    try {
      await this.usersCombobox.click({ timeout: 3000 });
    } catch (error) {
      // Fallback to any input field in the modal
      await this.page.locator('input').first().click();
    }
    await this.page.waitForTimeout(1000); // Increased wait for dropdown to stabilize
  }

  async verifyUsersDropdownVisible(): Promise<void> {
    await this.page.waitForTimeout(500);
    await expect(this.usersDropdownMenu).toBeVisible({ timeout: 10000 });
  }

  async selectUser(userName: string): Promise<void> {
    // Wait for option to be stable before clicking
    const option = this.page.getByRole('option', { name: userName, exact: false });
    await option.waitFor({ state: 'visible', timeout: 10000 });
    await option.click({ force: true });
    await this.page.waitForTimeout(500);
  }

  async selectMultipleUsers(userNames: string[]): Promise<void> {
    for (const userName of userNames) {
      await this.selectUser(userName);
      await this.page.waitForTimeout(800);
    }
  }

  async verifyCreateGroupNextButtonEnabled(): Promise<void> {
    await expect(this.createGroupNextButton).toBeEnabled();
  }

  async verifyCreateGroupNextButtonDisabled(): Promise<void> {
    await expect(this.createGroupNextButton).toBeDisabled();
  }

  async clickCreateGroupNextButton(): Promise<void> {
    await this.createGroupNextButton.click();
  }

  async clickCreateGroupCancelButton(): Promise<void> {
    await this.createGroupCancelButton.click();
    await expect(this.createGroupModal).not.toBeVisible();
  }

  async clickCreateGroupCloseButton(): Promise<void> {
    await this.createGroupModalCloseButton.click();
    await expect(this.createGroupModal).not.toBeVisible();
  }

  async clickAddWorkflowButton(): Promise<void> {
    await this.addWorkflowButton.click();
    await this.page.waitForTimeout(500);
    await expect(this.createWorkflowModal).toBeVisible({ timeout: 10000 });
  }

  async verifyCreateWorkflowModalElements(): Promise<void> {
    await expect(this.createWorkflowModal).toBeVisible();
    await expect(this.createWorkflowModalTitle).toBeVisible();
    await expect(this.createWorkflowModalCloseButton).toBeVisible();
    await expect(this.createWorkflowStep1Text).toBeVisible();
    await expect(this.workflowSchemeCombobox).toBeVisible();
    await expect(this.createWorkflowCancelButton).toBeVisible();
    await expect(this.createWorkflowNextButton).toBeVisible();
  }

  async clickWorkflowSchemeDropdown(): Promise<void> {
    await this.workflowSchemeCombobox.click();
    await this.page.waitForTimeout(1000); // Increased wait for dropdown to stabilize
  }

  async verifyWorkflowSchemeDropdownVisible(): Promise<void> {
    await this.page.waitForTimeout(500);
    await expect(this.workflowSchemeDropdownMenu).toBeVisible({ timeout: 10000 });
  }

  async selectWorkflowScheme(schemeName: string): Promise<void> {
    // Wait for option to be stable before clicking
    const option = this.page.getByRole('option', { name: schemeName, exact: false });
    await option.waitFor({ state: 'visible', timeout: 10000 });
    await option.click({ force: true });
    await this.page.waitForTimeout(500);
  }

  async verifyWorkflowSchemeSelected(schemeName: string): Promise<void> {
    await this.page.waitForTimeout(500);
    const currentValue = await this.workflowSchemeCombobox.inputValue();
    expect(currentValue).toBe(schemeName);
  }

  async verifyCreateWorkflowNextButtonEnabled(): Promise<void> {
    await expect(this.createWorkflowNextButton).toBeEnabled();
  }

  async verifyCreateWorkflowNextButtonDisabled(): Promise<void> {
    await expect(this.createWorkflowNextButton).toBeDisabled();
  }

  async clickCreateWorkflowNextButton(): Promise<void> {
    await this.createWorkflowNextButton.click();
  }

  async clickCreateWorkflowCancelButton(): Promise<void> {
    await this.createWorkflowCancelButton.click();
    await expect(this.createWorkflowModal).not.toBeVisible();
  }

  async clickCreateWorkflowCloseButton(): Promise<void> {
    await this.createWorkflowModalCloseButton.click();
    await expect(this.createWorkflowModal).not.toBeVisible();
  }

  async getAvailableUsers(): Promise<string[]> {
    await this.clickUsersDropdown();
    await this.page.waitForTimeout(1000);
    
    // Wait for any listbox to be visible (more general approach)
    const listbox = this.page.getByRole('listbox').first();
    await expect(listbox).toBeVisible({ timeout: 10000 });
    
    const options = listbox.getByRole('option');
    const count = await options.count();
    const userNames: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const text = await options.nth(i).textContent();
      if (text) {
        userNames.push(text.trim());
      }
    }
    
    return userNames;
  }

  async getAvailableWorkflowSchemes(): Promise<string[]> {
    await this.clickWorkflowSchemeDropdown();
    await this.page.waitForTimeout(1000);
    
    // Wait for any listbox to be visible (more general approach)
    const listbox = this.page.getByRole('listbox').first();
    await expect(listbox).toBeVisible({ timeout: 10000 });
    
    const options = listbox.getByRole('option');
    const count = await options.count();
    const schemeNames: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const text = await options.nth(i).textContent();
      if (text) {
        schemeNames.push(text.trim());
      }
    }
    
    return schemeNames;
  }

  async createEvaluationGroup(groupName: string, userNames: string[]): Promise<void> {
    await this.clickCreateGroupButton();
    await this.verifyCreateGroupModalElements();
    await this.clickUsersDropdown();
    await this.selectMultipleUsers(userNames);
    await this.verifyCreateGroupNextButtonEnabled();
    await this.clickCreateGroupNextButton();
    // Assuming there's a step 2 where we enter group name
    await this.page.waitForTimeout(1000);
  }

  async createWorkflow(workflowName: string, schemeName: string): Promise<void> {
    await this.clickAddWorkflowButton();
    await this.verifyCreateWorkflowModalElements();
    await this.clickWorkflowSchemeDropdown();
    await this.selectWorkflowScheme(schemeName);
    await this.verifyCreateWorkflowNextButtonEnabled();
    await this.clickCreateWorkflowNextButton();
    // Assuming there are additional steps for workflow creation
    await this.page.waitForTimeout(1000);
  }

  async clickBackButton(): Promise<void> {
    await this.backButton.click();
  }

  async clickReturnToInstitutionSettings(): Promise<void> {
    await this.returnToInstitutionSettingsButton.click();
    await this.page.waitForURL('**/app/my-workspace/inst-admin/inst/settings/**');
  }

  async getExistingGroups(): Promise<string[]> {
    const groupElements = this.page.locator('[data-testid="group-name"]'); // Adjust selector based on actual implementation
    const count = await groupElements.count();
    const groupNames: string[] = [];
    for (let i = 0; i < count; i++) {
      const text = await groupElements.nth(i).textContent();
      if (text) {
        groupNames.push(text);
      }
    }
    return groupNames;
  }

  async getExistingWorkflows(): Promise<string[]> {
    const workflowElements = this.page.locator('[data-testid="workflow-name"]'); // Adjust selector based on actual implementation
    const count = await workflowElements.count();
    const workflowNames: string[] = [];
    for (let i = 0; i < count; i++) {
      const text = await workflowElements.nth(i).textContent();
      if (text) {
        workflowNames.push(text);
      }
    }
    return workflowNames;
  }

  async verifyGroupExists(groupName: string): Promise<void> {
    const groups = await this.getExistingGroups();
    expect(groups).toContain(groupName);
  }

  async verifyWorkflowExists(workflowName: string): Promise<void> {
    const workflows = await this.getExistingWorkflows();
    expect(workflows).toContain(workflowName);
  }

  async navigateToMyWorkplace(): Promise<void> {
    await this.myWorkplaceLink.click();
    await this.page.waitForURL('**/app/my-workspace/inst-admin/summary**');
  }

  async navigateToSettings(): Promise<void> {
    await this.settingsLink.click();
    await this.page.waitForURL('**/app/my-workspace/inst-admin/inst/settings/**');
  }

  async navigateToMyTriangulator(): Promise<void> {
    await this.myTriangulatorLink.click();
    await this.page.waitForURL('**/app/my-triangulator/suggestions/**');
  }

  async openWorkflowConfigurationsFromSettings(): Promise<void> {
    await this.openWorkflowConfigurationsLink.click();
    await this.page.waitForURL('**/app/my-workspace/inst-admin/inst/settings/workflow-configs**');
  }

  async closeModalIfOpen(): Promise<void> {
    try {
      await this.page.getByRole('dialog').getByRole('button', { name: 'close' }).click({ timeout: 2000 });
      await this.page.waitForTimeout(500);
    } catch (error) {
      // Modal might already be closed
    }
  }

  async selectOptionByName(optionName: string, exact: boolean = false): Promise<void> {
    const option = this.page.getByRole('option', { name: optionName, exact });
    await option.waitFor({ state: 'visible', timeout: 5000 });
    await option.click({ force: true });
  }

  async selectFirstAvailableOption(): Promise<void> {
    const firstOption = this.page.getByRole('option').first();
    await firstOption.waitFor({ state: 'visible', timeout: 2000 });
    await firstOption.click({ force: true });
  }

  async selectNthOption(index: number): Promise<void> {
    const option = this.page.getByRole('option').nth(index);
    await option.waitFor({ state: 'visible', timeout: 2000 });
    await option.click({ force: true });
  }

  async getOptionByName(userName: string, exact: boolean = false): Promise<Locator> {
    return this.page.getByRole('option', { name: userName, exact });
  }
}
