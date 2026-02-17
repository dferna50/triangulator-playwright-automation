const { expect } = require('@playwright/test');

class DeleteUser {
    constructor(page) {
        this.page = page;

    }
    async Deleteworkflowconfiguration()
    {
        await this.page.getByRole('link', { name: 'My Workplace' }).click();
        await this.page.getByRole('link', { name: 'Settings' }).click();
        await this.page.locator('#primary-content section').filter({ hasText: 'Workflow configurations' }).getByRole('link').click();
        await this.page.getByRole('button', { name: 'Discard' }).click();
  
    }
    async Deleticonvisible()
    {
        await this.page.getByRole('button', { name: 'Toggle see more' }).first().click();
  await expect(this.page.getByRole('button', { name: 'Delete' })).toBeVisible();
 
    }
    async Deletepopup()
    {
        await this.page.getByRole('button', { name: 'Toggle see more' }).first().click();
        await this.page.getByRole('button', { name: 'Delete' }).click();
        await expect(this.page.getByRole('heading', { name: 'Delete group' })).toBeVisible();
        await expect(this.page.getByText('Delete group?Delete this group forever. Loading... Cancel Loading... Delete')).toBeVisible();
    
    }
    async deletecancelbutton()
    {
        await this.page.getByRole('button', { name: 'Toggle see more' }).first().click();
    await this.page.getByRole('button', { name: 'Delete' }).click();
        await expect(this.page.getByRole('heading', { name: 'Delete group?' })).toBeVisible();
        await expect(this.page.getByText('Delete this group forever.')).toBeVisible();
        await this.page.locator('#modal-outlet-0 button >> svg').click();
    }
    async deleteXbutton()
    {
        await this.page.getByRole('button', { name: 'Toggle see more' }).first().click();
    await this.page.getByRole('button', { name: 'Delete' }).click();
        await expect(this.page.getByRole('heading', { name: 'Delete group?' })).toBeVisible();
        await expect(this.page.getByText('Delete group?Delete this group forever. Loading... Cancel Loading... Delete')).toBeVisible();
    await this.page.getByRole('button', { name: 'Cancel' }).click();
    }
    async Deletegrppopupforever()
      {
        await this.page.getByRole('button', { name: 'Toggle see more' }).first().click();
        await this.page.getByRole('button', { name: 'Delete' }).click();
        await expect(this.page.getByText('Delete this group forever.')).toBeVisible();
      }
      async Deletesuccessfully()
      {
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
  await this.page.locator('//*[@id="modal-outlet-0"]/div/div/div[2]/div[2]/button[2]/div[1]').click({force:true});
  await expect(this.page.getByText('Deleted evaluation group')).toBeVisible();
      }
     async  DelGrpNotVisible()
     {
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
       // await this.page.waitForTimeout(150000);
       const groupSection = this.page.locator(`section:has-text("${randomName}")`).toBeVisible();
       await groupSection.getByLabel('Toggle see more').click();
        await this.page.getByRole('button', { name: 'Delete' }).click();
       // await this.page.locator('//*[@id="modal-outlet-0"]/div/div/div[2]/div[2]/button[2]/div[1]').click({force:true});
        await expect(this.page.getByText('Deleted evaluation group')).toBeVisible();
      await expect(this.page.getByText(randomName)).not.toBeVisible();
            
     }
}
module.exports = { DeleteUser};