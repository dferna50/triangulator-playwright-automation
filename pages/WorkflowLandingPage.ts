import { type Page, expect } from '@playwright/test';

export class WorkflowLandingPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async workflow(): Promise<void> {
    await this.page.getByRole('link', { name: 'My Workplace' }).click();
    await this.page.getByRole('link', { name: 'Settings' }).click();
    await this.page.locator('#primary-content section').filter({ hasText: 'Workflow configurations' }).getByRole('link').click();
  }

  async workflowViewProperContext(): Promise<void> {
    await this.page.getByRole('link', { name: 'Settings' }).click();
    await expect(this.page.getByRole('heading', { name: 'Workflow configurations' })).toBeVisible();
    await expect(this.page.getByText('Create evaluation groups and')).toBeVisible();
  }

  async subtextWorkflow(): Promise<void> {
    await this.page.getByRole('link', { name: 'Settings' }).click();
    await expect(this.page.getByRole('heading', { name: 'Institution coding scheme' })).toBeVisible();
    await expect(this.page.getByText('Create evaluation groups and')).toBeVisible();
    await expect(this.page.locator('#primary-content section').filter({ hasText: 'Workflow configurations' }).getByRole('link')).toBeVisible();
    await this.page.locator('#primary-content section').filter({ hasText: 'Workflow configurations' }).getByRole('link').click();
    await expect(this.page.getByText('Manage groups')).toBeVisible();
    await expect(this.page.getByText('Create groups and assign')).toBeVisible();
  }

  async seeAllLink(): Promise<void> {
    await this.page.getByRole('link', { name: 'Settings' }).click();
    await expect(this.page.getByRole('heading', { name: 'Institution coding scheme' })).toBeVisible();
    await expect(this.page.getByText('Create evaluation groups and')).toBeVisible();
    await expect(this.page.locator('#primary-content section').filter({ hasText: 'Workflow configurations' }).getByRole('link')).toBeVisible();
  }

  async headingTextNewWorkflow(): Promise<void> {
    await this.page.getByRole('link', { name: 'Settings' }).click();
    await this.page.locator('#primary-content section').filter({ hasText: 'Workflow configurations' }).getByRole('link').click();
    const heading = this.page.getByText('Workflow configurations');
    await expect(heading).toBeVisible();
    await expect(heading).toHaveText('Workflow configurations');
  }

  async manageGroupVisible(): Promise<void> {
    await expect(this.page.getByText('Manage groups')).toBeVisible();
  }

  async subtextManageGroup(): Promise<void> {
    await expect(this.page.getByText('Create groups and assign')).toBeVisible();
  }

  async popupWindowOccurs(): Promise<void> {
    await this.page.getByRole('button', { name: 'Create group' }).click();
    await expect(this.page.getByText('Step 1: Add users')).toBeVisible();
  }

  async manageGroupExistanceLanding(): Promise<void> {
    await expect(this.page.getByText('Group name')).toBeVisible();
    await this.page.getByRole('region', { name: 'Manage groups' }).getByRole('button').nth(1).click();
    await expect(this.page.getByText('test group').first()).toBeVisible();
    await expect(this.page.getByRole('paragraph').filter({ hasText: 'Chris Vouga - Pima' })).toBeVisible();
    await expect(this.page.getByRole('paragraph').filter({ hasText: 'Pima Admin2' })).toBeVisible();
  }

  async clickThreeDotsGroup(): Promise<void> {
    await this.page.getByRole('button', { name: 'Toggle see more' }).first().click();
    await expect(this.page.getByRole('menuitem', { name: 'Edit' })).toBeVisible();
    await expect(this.page.getByRole('menuitem', { name: 'Delete' })).toBeVisible();
  }

  async manageWorkflowExistence(): Promise<void> {
    await expect(this.page.getByText('Manage workflow')).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Add workflow' })).toBeVisible();
  }

  async subtextManageWorkflow(): Promise<void> {
    await this.page.getByRole('button', { name: 'Toggle see more' }).nth(1).click();
    await this.page.getByRole('menuitem', { name: 'View' }).click();
    await expect(this.page.getByText('Workflow info')).toBeVisible();
    await expect(this.page.getByRole('heading', { name: 'Assignment details' })).toBeVisible();
    await expect(this.page.getByRole('heading', { name: 'Content criteria' })).toBeVisible();
  }

  async workflowNameViewButton(): Promise<void> {
    await this.page.getByRole('button', { name: 'Toggle see more' }).nth(1).click();
    await this.page.getByRole('menuitem', { name: 'View' }).click();
    await expect(this.page.getByText('Workflow info')).toBeVisible();
    await expect(this.page.getByRole('heading', { name: 'Assignment details' })).toBeVisible();
    await expect(this.page.getByRole('heading', { name: 'Content criteria' })).toBeVisible();
  }

  async workflowNameEditButton(): Promise<void> {
    await this.page.getByRole('button', { name: 'Toggle see more' }).nth(1).click();
    await this.page.getByRole('menuitem', { name: 'Edit' }).click();
    await expect(this.page.getByText('Edit workflow')).toBeVisible();
    await this.page.locator('div').filter({ hasText: /^Approver$/ }).nth(2).click();
    await this.page.getByText('priya 111').click();
  }

  async workflowNameDeleteButton(): Promise<void> {
    await this.page.getByRole('button', { name: 'Toggle see more' }).nth(1).click();
    await this.page.getByRole('menuitem', { name: 'Delete' }).click();
    await expect(this.page.getByRole('heading', { name: 'Delete workflow?' })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Delete' })).toBeVisible();
  }
}
