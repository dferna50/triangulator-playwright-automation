import { type Page, expect } from '@playwright/test';

export class EditUserPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async editUserButtonView(): Promise<void> {
    await this.page.getByRole('link', { name: 'My Workplace' }).click();
    await this.page.waitForURL('**/app/my-workspace/inst-admin/summary**', { timeout: 20000 });
    
    await this.page.getByRole('link', { name: 'Settings' }).click();
    await this.page.waitForURL('**/app/my-workspace/inst-admin/inst/settings/**', { timeout: 20000 });
    
    await this.page.locator('#primary-content section').filter({ hasText: 'Workflow configurations' }).getByRole('link').click();
    await this.page.waitForURL('**/app/my-workspace/inst-admin/inst/settings/workflow-configs**', { timeout: 20000 });

    // Wait for the loading spinners and button loading states to disappear
    await this.page.locator('.animate-spin, .loading, svg[class*="spin"]').first().waitFor({ state: 'hidden', timeout: 30000 }).catch(() => {});
    const createGroupButton = this.page.getByRole('button', { name: 'create group' });
    await expect(createGroupButton).toBeVisible({ timeout: 20000 });
    await expect(createGroupButton.getByText('Loading...')).not.toBeVisible({ timeout: 20000 }).catch(() => {});
    await this.page.waitForTimeout(2000);
  }

  async editWorkflow(): Promise<void> {
    await expect(this.page.getByText('Manage groups')).toBeVisible();
    await expect(this.page.locator('div').filter({ hasText: /^Group name$/ }).first()).toBeVisible();
    await expect(this.page.getByText('Workflow configurations').first()).toBeVisible();
  }

  async chartDisplayEdit(): Promise<void> {
    await this.page.getByRole('button', { name: 'Toggle see more' }).first().click();
    await this.page.getByRole('menuitem', { name: 'Edit' }).click();
    await this.page.locator('#combobox-input').click();
    await expect(this.page.locator('#combobox-input')).toBeVisible();
  }

  async compareGroupAndEditGroupUsers(): Promise<void> {
    await this.page.getByRole('button', { name: 'Toggle see more' }).first().click();
    await this.page.getByRole('menuitem', { name: 'Edit' }).first().click();
    await expect(this.page.getByLabel('Use arrow keys to navigate.').getByText('Karthick N')).toBeVisible();
    await expect(this.page.getByLabel('Use arrow keys to navigate.').getByText('Priya Smith')).toBeVisible();
  }

  async errorMsgForEditUsers(): Promise<void> {
    await this.page.getByRole('button', { name: 'Toggle see more' }).nth(1).click();
    await this.page.getByRole('menuitem', { name: 'Edit' }).click();
    await this.page.locator('//button[@class="text-error border border-error rounded-full p-2"]').nth(0).click();
    await this.page.locator('//button[@class="text-error border border-error rounded-full p-2"]').nth(1).click();
    await expect(this.page.getByText('Must select at least 3 users')).toBeVisible();
  }

  async noMaximumMember(): Promise<void> {
    await this.page.getByRole('button', { name: 'Toggle see more' }).first().click();
    await this.page.getByRole('menuitem', { name: 'Edit' }).click();
    await this.page.locator('//*[@id="modal-outlet-0"]/div/div/div/div[3]/div[2]/button/div[1]').click();
  }

  async allActiveUsersIsPresent(): Promise<void> {
    await this.page.getByRole('button', { name: 'Create group' }).click();
    
    const dialog = this.page.getByRole('dialog', { name: 'Create evaluation group' });
    await expect(dialog).toBeVisible({ timeout: 20000 });
    
    const combobox = this.page.locator('#combobox-input');
    await combobox.click();
    
    const listbox = this.page.getByRole('listbox');
    await expect(listbox).toBeVisible({ timeout: 45000 });
    
    // Wait for the combobox loading state to clear
    await expect(async () => {
      const val = await combobox.inputValue();
      const placeholder = await combobox.getAttribute('placeholder') || '';
      expect(val.toLowerCase()).not.toContain('loading');
      expect(placeholder.toLowerCase()).not.toContain('loading');
    }).toPass({ timeout: 45000 });
    
    // Wait for spinners inside dialog to disappear
    await this.page.locator('.animate-spin, .loading, svg[class*="spin"]').first().waitFor({ state: 'hidden', timeout: 45000 }).catch(() => {});
    await this.page.waitForTimeout(2000);
    
    // Verify that known active users are visible in the dropdown
    await expect(listbox.getByText('University Of Nevada Reno Inst Admin').first()).toBeVisible({ timeout: 45000 });
    await expect(listbox.getByText('Karthick N').first()).toBeVisible({ timeout: 45000 });
    await expect(listbox.getByText('Priya Smith').first()).toBeVisible({ timeout: 45000 });
    
    await this.page.keyboard.press('Escape');
    await this.page.getByRole('button', { name: 'Cancel' }).click();
  }

  async editExistingGroup(): Promise<void> {
    await this.page.getByRole('button', { name: 'Toggle see more' }).first().click();
    await this.page.getByRole('menuitem', { name: 'Edit' }).click();
    await this.page.getByRole('button', { name: 'Next' }).click();
    await this.page.getByRole('textbox', { name: 'Group name' }).click();
    await this.page.getByRole('textbox', { name: 'Group name' }).fill('7879866');
    await this.page.getByRole('button', { name: 'Submit' }).click();
    await expect(this.page.locator('.list-complete-item > .w-full')).toBeVisible();
  }

  async sameGroupNameErrorMsg(): Promise<void> {
    await this.page.getByRole('button', { name: 'Toggle see more' }).first().click();
    await this.page.getByRole('menuitem', { name: 'Edit' }).click();
    await this.page.getByRole('button', { name: 'Next' }).click();
    await this.page.getByRole('textbox', { name: 'Group name' }).click();
    await this.page.getByRole('textbox', { name: 'Group name' }).fill('ABC');
    await this.page.getByRole('button', { name: 'Submit' }).click();
    await expect(this.page.getByText('Errored while editing')).toBeVisible();
    await this.page.getByRole('button', { name: 'Submit' }).click();
    await this.page.getByRole('button', { name: 'See error' }).click();
    await expect(this.page.getByText('Evaluation group name is')).toBeVisible();
  }

  async addGroupDescription(): Promise<void> {
    await this.page.getByRole('button', { name: 'Toggle see more' }).first().click();
    await this.page.getByRole('menuitem', { name: 'Edit' }).click();
    await this.page.getByRole('button', { name: 'Next' }).click();
    await this.page.getByRole('textbox', { name: 'Group name' }).click();
    await this.page.getByRole('textbox', { name: 'Group name' }).fill('unique');
    await this.page.getByRole('textbox', { name: 'Group description' }).fill('adding description');
    await this.page.getByRole('button', { name: 'Submit' }).click();
  }

  async editCharLengthForGroupDescription(): Promise<void> {
    await this.page.getByRole('button', { name: 'Toggle see more' }).nth(1).click();
    await this.page.getByRole('menuitem', { name: 'Edit' }).click();
    await this.page.getByRole('button', { name: 'Next' }).click();
    const longText = 'A'.repeat(250);
    await this.page.getByRole('textbox', { name: 'Group description' }).fill(longText);
  }

  async specialCharForGroupDescription(): Promise<void> {
    await this.page.getByRole('button', { name: 'Toggle see more' }).nth(1).click();
    await this.page.getByRole('menuitem', { name: 'Edit' }).click();
    await this.page.getByRole('button', { name: 'Next' }).click();
    await this.page.getByRole('textbox', { name: 'Group name' }).fill('^(*^(*');
    await this.page.getByRole('textbox', { name: 'Group description' }).fill('&^*&^*%*&%&(%');
    await this.page.getByRole('button', { name: 'Submit' }).click();
  }

  async clearGroupNameValidateErrorMsg(): Promise<void> {
    await this.page.getByRole('button', { name: 'Toggle see more' }).nth(1).click();
    await this.page.getByRole('menuitem', { name: 'Edit' }).click();
    await this.page.getByRole('button', { name: 'Next' }).click();
    await this.page.getByRole('textbox', { name: 'Group name' }).click();
    await this.page.getByRole('textbox', { name: 'Group name' }).fill('^&^*^(*^%(%');
    await expect(this.page.getByRole('button', { name: 'Submit' })).toBeVisible();
  }

  async editGroupCancelButton(): Promise<void> {
    await this.page.getByRole('button', { name: 'Toggle see more' }).nth(1).click();
    await this.page.getByRole('menuitem', { name: 'Edit' }).click();
    await this.page.getByRole('button', { name: 'Cancel' }).click();
  }
}
