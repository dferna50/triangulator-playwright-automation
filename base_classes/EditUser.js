const { expect } = require('@playwright/test');

class EditUser {
    constructor(page) {
        this.page = page;

    }

   async  EditUserbuttonview()
    {
        await this.page.getByRole('link', { name: 'My Workplace' }).click();
        await this.page.getByRole('link', { name: 'Settings' }).click();
        await this.page.locator('#primary-content section').filter({ hasText: 'Workflow configurations' }).getByRole('link').click();
        // await this.page.getByRole('button', { name: 'Discard' }).click();
        await expect(this.page.getByRole('button', { name: 'Create group' })).toBeVisible();
       await this.page.getByRole('button', { name: 'Create group' }).click();
    }
    async editworkflow()
{
 await this.page.locator('//*[@id="modal-outlet-0"]/div/div/div/div[3]/div[1]/button/div[1]').click();
 await expect(this.page.getByText('Manage groups')).toBeVisible();
// await expect(this.page.getByRole('button', { name: 'Create group' })).toBeVisible();
 await expect(this.page.locator('div').filter({ hasText: /^Group name$/ }).first()).toBeVisible();
 await expect(this.page.getByRole('heading', { name: 'Workflow configurations' })).toBeVisible();
}
async chartdisplayedit()
{
    await this.page.locator('//*[@id="modal-outlet-0"]/div/div/div/div[3]/div[1]/button/div[1]').click();
    await this.page.getByRole('button', { name: 'Toggle see more' }).first().click();
    //await expect(this.page.getByText('Edit evaluation group')).toBeVisible();
    await this.page.getByRole('button', { name: 'Edit' }).click();
    await this.page.locator('#combobox-input').click();
    await expect(this.page.locator('#combobox-input')).toBeVisible();
}
async comparegrpandeditgroupUsers()
{   
    await this.page.locator('//*[@id="modal-outlet-0"]/div/div/div/div[3]/div[1]/button/div[1]').click();
    await this.page.getByRole('button', { name: 'Toggle see more' }).first().click();
    await this.page.getByRole('button', { name: 'Edit' }).first().click();
    await expect(this.page.getByLabel('Use arrow keys to navigate.').getByText('Karthick N')).toBeVisible();
    await expect(this.page.getByLabel('Use arrow keys to navigate.').getByText('Priya Smith')).toBeVisible();
   // await expect(this.page.getByLabel('Use arrow keys to navigate.').getByText('priya test')).toBeVisible();
}
async errormsgforeditusers()
{   
    await this.page.locator('//*[@id="modal-outlet-0"]/div/div/div/div[3]/div[1]/button/div[1]').click();
    await this.page.getByRole('button', { name: 'Toggle see more' }).nth(1).click();
    await this.page.getByRole('button', { name: 'Edit' }).click();
    await this.page.locator('//button[@class="text-error border border-error rounded-full p-2"]').nth(0).click();
    await this.page.locator('//button[@class="text-error border border-error rounded-full p-2"]').nth(1).click();
    await expect(this.page.getByText('Must select at least 3 users')).toBeVisible();
}
async NOmaximummember()
{
    await this.page.locator('//*[@id="modal-outlet-0"]/div/div/div/div[3]/div[1]/button/div[1]').click();
    await this.page.getByRole('button', { name: 'Toggle see more' }).first().click();
    await this.page.getByRole('button', { name: 'Edit' }).click();
    await this.page.locator('//*[@id="modal-outlet-0"]/div/div/div/div[3]/div[2]/button/div[1]').click();
    
    
}
async allactiveusersispresent()
{ 
    
  await this.page.locator('//*[@id="modal-outlet-0"]/div/div/div/div[3]/div[1]/button/div[1]').click();
 await this.page.getByRole('link', { name: 'All' }).click();
  await this.page.getByRole('button', { name: 'Filter' }).click();
  await this.page.locator('#combobox-input').nth(2).click();
  await this.page.getByLabel('Filter users').getByText('Active', { exact: true }).click();
  await this.page.getByRole('button', { name: 'Apply' }).click();
 // await expect(this.page.getByRole('link', { name: 'Truman Hale' })).toBeVisible();
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
async editexistinggroup()
{
    
    await this.page.locator('//*[@id="modal-outlet-0"]/div/div/div/div[3]/div[1]/button/div[1]').click();
    await this.page.getByRole('button', { name: 'Toggle see more' }).first().click();
    await this.page.getByRole('button', { name: 'Edit' }).click();
    await this.page.getByRole('button', { name: 'Next' }).click();
    await this.page.getByRole('textbox', { name: 'Group name' }).click();
  await this.page.getByRole('textbox', { name: 'Group name' }).fill('7879866');  
    await this.page.getByRole('button', { name: 'Submit' }).click();
    await expect(this.page.locator('.list-complete-item > .w-full')).toBeVisible();

}
 async samegroupnameerroemsg()
 {
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
 async Addgroupdescription()
 {
    await this.page.locator('//*[@id="modal-outlet-0"]/div/div/div/div[3]/div[1]/button/div[1]').click();
    await this.page.getByRole('button', { name: 'Toggle see more' }).first().click();
      await this.page.getByRole('button', { name: 'Edit' }).click();
      await this.page.getByRole('button', { name: 'Next' }).click();
      await this.page.getByRole('textbox', { name: 'Group name' }).click();
      await this.page.getByRole('textbox', { name: 'Group name' }).fill('unique');
      await this.page.getByRole('textbox',{name:'Group description'}).fill('adding description');
      //this should be randomly genreated
      await this.page.getByRole('button', { name: 'Submit' }).click();

 }
 async editcharlengthforgrpdescription()
{
    await this.page.locator('//*[@id="modal-outlet-0"]/div/div/div/div[3]/div[1]/button/div[1]').click();
    await this.page.getByRole('button', { name: 'Toggle see more' }).nth(1).click();
      await this.page.getByRole('button', { name: 'Edit' }).click();
      await this.page.getByRole('button', { name: 'Next' }).click();
    const longText = 'A'.repeat(250);
    await this.page.getByRole('textbox', { name: 'Group description' }).fill(longText);

}
async specialchrforgrpdescription()
{
    await this.page.locator('//*[@id="modal-outlet-0"]/div/div/div/div[3]/div[1]/button/div[1]').click();
    await this.page.getByRole('button', { name: 'Toggle see more' }).nth(1).click();
    await this.page.getByRole('button', { name: 'Edit' }).click();
 await this.page.getByRole('button', { name: 'Next' }).click();
 await this.page.getByRole('textbox', { name: 'Group name' }).fill('^(*^(*');
await this.page.getByRole('textbox', { name: 'Group description' }).fill('&^*&^*%*&%&(%');
await this.page.getByRole('button', { name: 'Submit' }).click();
}
async cleargroupnamevalidateerroemsg()
{
    await this.page.locator('//*[@id="modal-outlet-0"]/div/div/div/div[3]/div[1]/button/div[1]').click();
    await this.page.getByRole('button', { name: 'Toggle see more' }).nth(1).click();
    await this.page.getByRole('button', { name: 'Edit' }).click();
    await this.page.getByRole('button', { name: 'Next' }).click(); 
 await this.page.getByRole('textbox', { name: 'Group name' }).click();
 await this.page.getByRole('textbox', { name: 'Group name' }).fill('^&^*^(*^%(%');
 await expect(this.page.getByRole('button', { name: 'Submit' })).toBeVisible();

 //should be enable 
 //await expect(this.page.getByText('Errored while editing evaluation group See error')).toBeVisible();
// await expect(this.page.getByLabel('Edit evaluation group').locator('div').filter({ hasText: 'Loading... Submit' }).nth(3)).toBeVisible();

}
async editgroupcancelbutton()
{
    await this.page.locator('//*[@id="modal-outlet-0"]/div/div/div/div[3]/div[1]/button/div[1]').click();
    await this.page.getByRole('button', { name: 'Toggle see more' }).nth(1).click();
    await this.page.getByRole('button', { name: 'Edit' }).click();
    await this.page.getByRole('button', { name: 'Cancel' }).click();
}

}
module.exports = { EditUser};