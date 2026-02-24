import { type Page, expect } from '@playwright/test';

export class CreateUserPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async createUserButtonView(): Promise<void> {
    await this.page.getByRole('link', { name: 'My Workplace' }).click();
    await this.page.getByRole('link', { name: 'Settings' }).click();
    await this.page.locator('#primary-content section').filter({ hasText: 'Workflow configurations' }).getByRole('link').click();
    await expect(this.page.getByRole('button', { name: 'Create group' })).toBeVisible();
    await this.page.getByRole('button', { name: 'Create group' }).click();
  }

  async createUserValidationErrorMsg(): Promise<void> {
    await this.page.locator('#combobox-input').click();
    await expect(this.page.getByText('Must select at least 3 users')).toBeVisible();
  }

  async deleteIcon(): Promise<void> {
    await this.page.locator('#combobox-input-label').click();
    await this.page.getByLabel('Users').getByText('Truman Hale').click();
    await expect(this.page.getByRole('list', { name: 'Use arrow keys to navigate.' }).getByRole('button')).toBeVisible();
    await this.page.getByRole('list', { name: 'Use arrow keys to navigate.' }).getByRole('button').click();
  }

  async zeroUsersThrowsError(): Promise<void> {
    await this.page.locator('#combobox-input-label').click();
    await this.page.getByLabel('Users').getByText('Karthick N').click();
    await expect(this.page.getByRole('list', { name: 'Use arrow keys to navigate.' }).getByRole('button')).toBeVisible();
    await this.page.getByRole('list', { name: 'Use arrow keys to navigate.' }).getByRole('button').click();
    await expect(this.page.locator('//div[@class="cursor-not-allowed"]')).toBeVisible();
  }

  async allActiveUsers(): Promise<void> {
    await this.page.locator('#combobox-input-label').click();
    await this.page.waitForTimeout(3000);
    await this.page.locator('[aria-label="Close"]').click();
    await this.page.getByRole('link', { name: 'All' }).click();
    await this.page.getByRole('button', { name: 'Filter' }).click();
    await this.page.locator('//input[@id="combobox-input"]').nth(2).click();
    await this.page.getByLabel('Filter users').getByText('Active', { exact: true }).click();
    await this.page.getByRole('button', { name: 'Apply' }).click();
    await this.page.getByRole('link', { name: 'Settings' }).click();
    await this.page.locator('#primary-content section').filter({ hasText: 'Workflow configurations' }).getByRole('link').click();
    await this.page.getByRole('button', { name: 'Create group' }).click();
    await this.page.locator('#combobox-input-label').getByRole('button').click();
    await this.page.locator('#dropdown-content').click();
  }

  async enterNumberForCreateGroup(): Promise<void> {
    await this.page.locator('#combobox-input-label > .flex-1 > div').first().click();
    await this.page.getByLabel('Users').getByText('Karthick N').click();
    await this.page.locator('#combobox-input').click();
    await this.page.getByLabel('Users').getByText('Truman Hale').click();
    await this.page.locator('#combobox-input').click();
    await this.page.getByLabel('Users').getByText('University Of Nevada Reno').click();
    await this.page.getByRole('dialog', { name: 'Create evaluation group' }).click();
    await this.page.locator('//*[@id="modal-outlet-0"]/div/div/div/div[3]/div[2]/button/div[1]/div').nth(0).click({ force: true });
    await this.page.getByRole('textbox', { name: 'Group name' }).fill('testdata123');
  }

  async description250CharLength(): Promise<void> {
    await this.page.locator('#combobox-input-label > .flex-1 > div').first().click();
    await this.page.getByLabel('Users').getByText('Karthick N').click();
    await this.page.locator('#combobox-input').click();
    await this.page.getByLabel('Users').getByText('Truman Hale').click();
    await this.page.locator('#combobox-input').click();
    await this.page.getByLabel('Users').getByText('University Of Nevada Reno').click();
    await this.page.getByRole('dialog', { name: 'Create evaluation group' }).click();
    await this.page.locator('//*[@id="modal-outlet-0"]/div/div/div/div[3]/div[2]/button/div[1]/div').nth(0).click({ force: true });
    await this.page.getByRole('textbox', { name: 'Group name' }).fill('testdata123');
    const longText = 'A'.repeat(250);
    await this.page.getByRole('textbox', { name: 'Group description' }).fill(longText);
  }

  async discardChanges(): Promise<void> {
    await this.page.locator('#combobox-input-label > .flex-1 > div').first().click();
    await this.page.getByLabel('Users').getByText('Karthick N').click();
    await this.page.locator('#combobox-input').click();
    await this.page.getByLabel('Users').getByText('Truman Hale').click();
    await this.page.locator('#combobox-input').click();
    await this.page.getByLabel('Users').getByText('University Of Nevada Reno').click();
    await this.page.getByRole('dialog', { name: 'Create evaluation group' }).click();
    await this.page.locator('//*[@id="modal-outlet-0"]/div/div/div/div[3]/div[2]/button/div[1]/div').nth(0).click({ force: true });
    await this.page.getByRole('textbox', { name: 'Group name' }).fill('testdata123');
    await this.page.getByRole('textbox', { name: 'Group description' }).fill('tests');
    await this.page.mouse.click(10, 10);
    await expect(this.page.getByText("Are you sure you want to discard the changes you've made?")).toBeVisible();
  }

  async workflowGroupView(): Promise<void> {
    await this.page.locator('#combobox-input-label > .flex-1 > div').first().click();
    await this.page.getByLabel('Users').getByText('Karthick N').click();
    await this.page.locator('#combobox-input').click();
    await this.page.getByLabel('Users').getByText('Truman Hale').click();
    await this.page.locator('#combobox-input').click();
    await this.page.getByLabel('Users').getByText('Priya Smith').click();
    await this.page.locator('#combobox-input').click();
    await this.page.getByLabel('Users').getByText('Karthick N').click();
    await this.page.locator('#combobox-input').click();
    await this.page.getByLabel('Users').getByText('Kevin Maher').click();
    await this.page.getByRole('dialog', { name: 'Create evaluation group' }).click();
    await this.page.locator('//*[@id="modal-outlet-0"]/div/div/div/div[3]/div[2]/button/div[1]/div').nth(0).click({ force: true });
    const randomName = `Creategrp-${Math.random().toString(36).substring(2, 8)}`;
    await this.page.getByRole('textbox', { name: 'Group name' }).fill(randomName);
    const randomDescription = `desc-${Math.random().toString(36).substring(2, 30)}`;
    await this.page.getByRole('textbox', { name: 'Group description' }).fill(randomDescription);
    await this.page.locator('//*[@id="modal-outlet-0"]/div/div/div/div[3]/div[2]/button/div[1]').click();
    await expect(this.page.locator('//*[@id="primary-content"]/div/div[1]/div[1]/div[2]/section/div[7]/div[1]/div[1]/div[2]/div/p')).toBeVisible();
  }

  async uniqueGroupName(): Promise<void> {
    await this.page.locator('#combobox-input-label > .flex-1 > div').first().click();
    await this.page.getByLabel('Users').getByText('Karthick N').click();
    await this.page.locator('#combobox-input').click();
    await this.page.getByLabel('Users').getByText('Truman Hale').click();
    await this.page.locator('#combobox-input').click();
    await this.page.getByLabel('Users').getByText('priya test').click();
    await this.page.getByRole('dialog', { name: 'Create evaluation group' }).click();
    await this.page.locator('//*[@id="modal-outlet-0"]/div/div/div/div[3]/div[2]/button/div[1]/div').nth(0).click({ force: true });
    await this.page.getByRole('textbox', { name: 'Group name' }).fill('testdata1237');
    await this.page.getByRole('textbox', { name: 'Group description' }).fill('tests');
    await this.page.locator('//*[@id="modal-outlet-0"]/div/div/div/div[3]/div[2]/button/div[1]').click();
  }
}
