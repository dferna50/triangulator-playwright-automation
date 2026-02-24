import { type Page, expect } from '@playwright/test';

export class EditUserPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async editUserButtonView(): Promise<void> {
    await this.page.getByRole('link', { name: 'My Workplace' }).click();
    await this.page.getByRole('link', { name: 'Settings' }).click();
    await this.page.locator('#primary-content section').filter({ hasText: 'Workflow configurations' }).getByRole('link').click();
    await expect(this.page.getByRole('button', { name: 'Create group' })).toBeVisible();
    await this.page.getByRole('button', { name: 'Create group' }).click();
  }

  async editWorkflow(): Promise<void> {
    await this.page.locator('//*[@id="modal-outlet-0"]/div/div/div/div[3]/div[1]/button/div[1]').click();
    await expect(this.page.getByText('Manage groups')).toBeVisible();
    await expect(this.page.locator('div').filter({ hasText: /^Group name$/ }).first()).toBeVisible();
    await expect(this.page.getByRole('heading', { name: 'Workflow configurations' })).toBeVisible();
  }

  async chartDisplayEdit(): Promise<void> {
    await this.page.locator('//*[@id="modal-outlet-0"]/div/div/div/div[3]/div[1]/button/div[1]').click();
    await this.page.getByRole('button', { name: 'Toggle see more' }).first().click();
    await this.page.getByRole('button', { name: 'Edit' }).click();
    await this.page.locator('#combobox-input').click();
    await expect(this.page.locator('#combobox-input')).toBeVisible();
  }

  async compareGroupAndEditGroupUsers(): Promise<void> {
    await this.page.locator('//*[@id="modal-outlet-0"]/div/div/div/div[3]/div[1]/button/div[1]').click();
    await this.page.getByRole('button', { name: 'Toggle see more' }).first().click();
    await this.page.getByRole('button', { name: 'Edit' }).first().click();
    await expect(this.page.getByLabel('Use arrow keys to navigate.').getByText('Karthick N')).toBeVisible();
    await expect(this.page.getByLabel('Use arrow keys to navigate.').getByText('Priya Smith')).toBeVisible();
  }

  async errorMsgForEditUsers(): Promise<void> {
    await this.page.locator('//*[@id="modal-outlet-0"]/div/div/div/div[3]/div[1]/button/div[1]').click();
    await this.page.getByRole('button', { name: 'Toggle see more' }).nth(1).click();
    await this.page.getByRole('button', { name: 'Edit' }).click();
    await this.page.locator('//button[@class="text-error border border-error rounded-full p-2"]').nth(0).click();
    await this.page.locator('//button[@class="text-error border border-error rounded-full p-2"]').nth(1).click();
    await expect(this.page.getByText('Must select at least 3 users')).toBeVisible();
  }

  async noMaximumMember(): Promise<void> {
    await this.page.locator('//*[@id="modal-outlet-0"]/div/div/div/div[3]/div[1]/button/div[1]').click();
    await this.page.getByRole('button', { name: 'Toggle see more' }).first().click();
    await this.page.getByRole('button', { name: 'Edit' }).click();
    await this.page.locator('//*[@id="modal-outlet-0"]/div/div/div/div[3]/div[2]/button/div[1]').click();
  }

  async allActiveUsersIsPresent(): Promise<void> {
    await this.page.locator('//*[@id="modal-outlet-0"]/div/div/div/div[3]/div[1]/button/div[1]').click();
    await this.page.getByRole('link', { name: 'All' }).click();
    await this.page.getByRole('button', { name: 'Filter' }).click();
    await this.page.locator('#combobox-input').nth(2).click();
    await this.page.getByLabel('Filter users').getByText('Active', { exact: true }).click();
    await this.page.getByRole('button', { name: 'Apply' }).click();
    await expect(this.page.getByRole('link', { name: 'University Of Nevada Reno' })).toBeVisible();
    await expect(this.page.getByRole('link', { name: 'Karthick N' })).toBeVisible();
    await expect(this.page.getByRole('link', { name: 'Priya Smith' })).toBeVisible();
    await this.page.getByRole('link', { name: 'Settings' }).click();
    await this.page.locator('#primary-content section').filter({ hasText: 'Workflow configurations' }).getByRole('link').click();
    await this.page.getByRole('button', { name: 'Create group' }).click();
    await this.page.locator('#combobox-input').click();
    await expect(this.page.locator('#combobox-input-label').getByRole('button')).toBeVisible();
    await this.page.locator('#combobox-input').click();
    await this.page.getByRole('list', { name: 'Use arrow keys to navigate.' }).locator('div').click();
  }

  async editExistingGroup(): Promise<void> {
    await this.page.locator('//*[@id="modal-outlet-0"]/div/div/div/div[3]/div[1]/button/div[1]').click();
    await this.page.getByRole('button', { name: 'Toggle see more' }).first().click();
    await this.page.getByRole('button', { name: 'Edit' }).click();
    await this.page.getByRole('button', { name: 'Next' }).click();
    await this.page.getByRole('textbox', { name: 'Group name' }).click();
    await this.page.getByRole('textbox', { name: 'Group name' }).fill('7879866');
    await this.page.getByRole('button', { name: 'Submit' }).click();
    await expect(this.page.locator('.list-complete-item > .w-full')).toBeVisible();
  }

  async sameGroupNameErrorMsg(): Promise<void> {
    await this.page.locator('//*[@id="modal-outlet-0"]/div/div/div/div[3]/div[1]/button/div[1]').click();
    await this.page.getByRole('button', { name: 'Toggle see more' }).first().click();
    await this.page.getByRole('button', { name: 'Edit' }).click();
    await this.page.getByRole('button', { name: 'Next' }).click();
    await this.page.getByRole('textbox', { name: 'Group name' }).click();
    await this.page.getByRole('textbox', { name: 'Group name' }).fill('unique');
    await this.page.getByRole('button', { name: 'Submit' }).click();
    await expect(this.page.getByText('Errored while editing')).toBeVisible();
    await this.page.getByRole('button', { name: 'Submit' }).click();
    await this.page.getByRole('button', { name: 'See error' }).click();
    await expect(this.page.getByText('Evaluation group name is')).toBeVisible();
  }

  async addGroupDescription(): Promise<void> {
    await this.page.locator('//*[@id="modal-outlet-0"]/div/div/div/div[3]/div[1]/button/div[1]').click();
    await this.page.getByRole('button', { name: 'Toggle see more' }).first().click();
    await this.page.getByRole('button', { name: 'Edit' }).click();
    await this.page.getByRole('button', { name: 'Next' }).click();
    await this.page.getByRole('textbox', { name: 'Group name' }).click();
    await this.page.getByRole('textbox', { name: 'Group name' }).fill('unique');
    await this.page.getByRole('textbox', { name: 'Group description' }).fill('adding description');
    await this.page.getByRole('button', { name: 'Submit' }).click();
  }

  async editCharLengthForGroupDescription(): Promise<void> {
    await this.page.locator('//*[@id="modal-outlet-0"]/div/div/div/div[3]/div[1]/button/div[1]').click();
    await this.page.getByRole('button', { name: 'Toggle see more' }).nth(1).click();
    await this.page.getByRole('button', { name: 'Edit' }).click();
    await this.page.getByRole('button', { name: 'Next' }).click();
    const longText = 'A'.repeat(250);
    await this.page.getByRole('textbox', { name: 'Group description' }).fill(longText);
  }

  async specialCharForGroupDescription(): Promise<void> {
    await this.page.locator('//*[@id="modal-outlet-0"]/div/div/div/div[3]/div[1]/button/div[1]').click();
    await this.page.getByRole('button', { name: 'Toggle see more' }).nth(1).click();
    await this.page.getByRole('button', { name: 'Edit' }).click();
    await this.page.getByRole('button', { name: 'Next' }).click();
    await this.page.getByRole('textbox', { name: 'Group name' }).fill('^(*^(*');
    await this.page.getByRole('textbox', { name: 'Group description' }).fill('&^*&^*%*&%&(%');
    await this.page.getByRole('button', { name: 'Submit' }).click();
  }

  async clearGroupNameValidateErrorMsg(): Promise<void> {
    await this.page.locator('//*[@id="modal-outlet-0"]/div/div/div/div[3]/div[1]/button/div[1]').click();
    await this.page.getByRole('button', { name: 'Toggle see more' }).nth(1).click();
    await this.page.getByRole('button', { name: 'Edit' }).click();
    await this.page.getByRole('button', { name: 'Next' }).click();
    await this.page.getByRole('textbox', { name: 'Group name' }).click();
    await this.page.getByRole('textbox', { name: 'Group name' }).fill('^&^*^(*^%(%');
    await expect(this.page.getByRole('button', { name: 'Submit' })).toBeVisible();
  }

  async editGroupCancelButton(): Promise<void> {
    await this.page.locator('//*[@id="modal-outlet-0"]/div/div/div/div[3]/div[1]/button/div[1]').click();
    await this.page.getByRole('button', { name: 'Toggle see more' }).nth(1).click();
    await this.page.getByRole('button', { name: 'Edit' }).click();
    await this.page.getByRole('button', { name: 'Cancel' }).click();
  }
}
