import { type Page, expect } from '@playwright/test';

export class DeleteUserPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async deleteWorkflowConfiguration(): Promise<void> {
    await this.page.getByRole('link', { name: 'My Workplace' }).click();
    await this.page.getByRole('link', { name: 'Settings' }).click();
    await this.page.locator('#primary-content section').filter({ hasText: 'Workflow configurations' }).getByRole('link').click();
    
    const discardBtn = this.page.getByRole('button', { name: 'Discard' });
    if (await discardBtn.isVisible()) {
      await discardBtn.click();
    }
  }

  async deleteIconVisible(): Promise<void> {
    await this.page.getByRole('button', { name: 'Toggle see more' }).first().click();
    const deleteBtn = this.page.getByRole('button', { name: 'Delete' });
    await deleteBtn.waitFor({ state: 'visible', timeout: 10000 });
    await expect(deleteBtn).toBeVisible();
  }

  async deletePopup(): Promise<void> {
    await this.page.getByRole('button', { name: 'Toggle see more' }).first().click();
    const deleteBtn = this.page.getByRole('button', { name: 'Delete' });
    await deleteBtn.waitFor({ state: 'visible', timeout: 10000 });
    await deleteBtn.click();
    await expect(this.page.getByRole('heading', { name: 'Delete group' })).toBeVisible({ timeout: 10000 });
    await expect(this.page.getByText('Delete this group forever.')).toBeVisible({ timeout: 5000 });
  }

  async deleteCancelButton(): Promise<void> {
    await this.page.getByRole('button', { name: 'Toggle see more' }).first().click();
    const deleteBtn = this.page.getByRole('button', { name: 'Delete' });
    await deleteBtn.waitFor({ state: 'visible', timeout: 10000 });
    await deleteBtn.click();
    await expect(this.page.getByRole('heading', { name: 'Delete group?' })).toBeVisible({ timeout: 10000 });
    await expect(this.page.getByText('Delete this group forever.')).toBeVisible({ timeout: 5000 });
    await this.page.locator('#modal-outlet-0 button >> svg').click();
  }

  async deleteXButton(): Promise<void> {
    await this.page.getByRole('button', { name: 'Toggle see more' }).first().click();
    const deleteBtn = this.page.getByRole('button', { name: 'Delete' });
    await deleteBtn.waitFor({ state: 'visible', timeout: 10000 });
    await deleteBtn.click();
    await expect(this.page.getByRole('heading', { name: 'Delete group?' })).toBeVisible({ timeout: 10000 });
    await expect(this.page.getByText('Delete this group forever.')).toBeVisible({ timeout: 5000 });
    await this.page.getByRole('button', { name: 'Cancel' }).click();
  }

  async deleteGroupPopupForever(): Promise<void> {
    await this.page.getByRole('button', { name: 'Toggle see more' }).first().click();
    const deleteBtn = this.page.getByRole('button', { name: 'Delete' });
    await deleteBtn.waitFor({ state: 'visible', timeout: 10000 });
    await deleteBtn.click();
    await expect(this.page.getByText('Delete this group forever.')).toBeVisible({ timeout: 10000 });
  }

  async deleteSuccessfully(): Promise<void> {
    await this.page.getByRole('button', { name: 'Create group' }).click();
    await this.page.locator('#combobox-input-label > .flex-1 > div').first().click();
    await this.page.getByLabel('Users').getByText('Tanaya Dempsey').click();
    await this.page.locator('#combobox-input').click();
    await this.page.getByLabel('Users').getByText('Jason Elwood').click();
    await this.page.locator('#combobox-input').click();
    await this.page.getByLabel('Users').getByText('Arizona State University Inst').click();
    await this.page.getByRole('button', { name: 'Next' }).click();
    await this.page.locator('.rounded-md > .flex-1 > div').first().click();
    const randomName = `group-${Math.random().toString(36).substring(2, 8)}`;
    await this.page.getByRole('textbox', { name: 'Group name' }).fill(randomName);
    await this.page.getByRole('textbox', { name: 'Group description' }).click();
    await this.page.getByRole('textbox', { name: 'Group description' }).fill('automation');
    await this.page.getByRole('button', { name: 'Submit' }).click();
    await this.page.waitForTimeout(3000);
    await this.page.getByText(randomName).click();
    await this.page.locator('div').filter({ hasText: /^delete groupArizona State University Inst AdminJason ElwoodTanaya Dempsey$/ }).getByLabel('Toggle see more').click();
    await this.page.getByRole('button', { name: 'Delete' }).click();
    await this.page.locator('//*[@id="modal-outlet-0"]/div/div/div[2]/div[2]/button[2]/div[1]').click({ force: true });
    await expect(this.page.getByText('Deleted evaluation group')).toBeVisible();
  }
}
