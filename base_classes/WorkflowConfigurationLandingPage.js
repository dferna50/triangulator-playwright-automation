const { expect } = require('@playwright/test');

class WorkflowLandingPage {
    constructor(page) {
        this.page = page;

    }
    async workflow()
    {
        await this.page.getByRole('link', { name: 'My Workplace' }).click();
        await this.page.getByRole('link', { name: 'Settings' }).click();
        await this.page.locator('#primary-content section').filter({ hasText: 'Workflow configurations' }).getByRole('link').click();
    }
    async workflowviewpropercontext()
    {
        await this.page.getByRole('link', { name: 'Settings' }).click();
        await expect(this.page.getByRole('heading', { name: 'Workflow configurations' })).toBeVisible();
        await expect(this.page.getByText('Create evaluation groups and')).toBeVisible();
    }
  
    async subtextworkflow()
 {
    await this.page.getByRole('link', { name: 'Settings' }).click();
    await expect(this.page.getByRole('heading', { name: 'Institution coding scheme' })).toBeVisible();
    await expect(this.page.getByText('Create evaluation groups and')).toBeVisible();
    await expect(this.page.locator('#primary-content section').filter({ hasText: 'Workflow configurations' }).getByRole('link')).toBeVisible();
    await this.page.locator('#primary-content section').filter({ hasText: 'Workflow configurations' }).getByRole('link').click();
    // await this.page.getByRole('button', { name: 'Discard' }).waitFor({ state: 'visible' });
    //await this.page.getByRole('button', { name: 'Discard' }).click();
    await expect(this.page.getByText('Manage groups')).toBeVisible();
    await expect(this.page.getByText('Create groups and assign')).toBeVisible();
 }
 async seealllink()
 {
    await this.page.getByRole('link', { name: 'Settings' }).click();
    await expect(this.page.getByRole('heading', { name: 'Institution coding scheme' })).toBeVisible();
    await expect(this.page.getByText('Create evaluation groups and')).toBeVisible();
    await expect(this.page.locator('#primary-content section').filter({ hasText: 'Workflow configurations' }).getByRole('link')).toBeVisible();
 }
 async headingtextnewworkflow()
 {
    await this.page.getByRole('link', { name: 'Settings' }).click();
    await this.page.locator('#primary-content section').filter({ hasText: 'Workflow configurations' }).getByRole('link').click();
    const heading = this.page.getByText('Workflow configurations');
    await expect(heading).toBeVisible();
    await expect(heading).toHaveText('Workflow configurations');
 }
 async Managegrpvisible()
 {
    await expect(this.page.getByText('Manage groups')).toBeVisible();
 
 }
 async subtextmanagegrp()
 {
    await expect(this.page.getByText('Create groups and assign')).toBeVisible();
 }
 async Popupwindowoccurs()
{
    await this.page.getByRole('button', { name: 'Create group' }).click();
    await expect(this.page.getByText('Step 1: Add users')).toBeVisible();
}
async Managegrpexistancelanding()
{
    await expect(this.page.getByText('Group name')).toBeVisible();
    //await this.page.locator('div').filter({ hasText: /^test groupautomation 123Dallas College Inst Admintest 123$/ }).getByRole('button').first().click();
   await this.page.getByRole('region', { name: 'Manage groups' }).getByRole('button').nth(1).click();
   
    await expect(this.page.getByText('automation')).toBeVisible();
    await expect(this.page.getByRole('paragraph').filter({ hasText: 'Dallas College Inst Admin' })).toBeVisible();
    await expect(this.page.getByText('test 123')).toBeVisible();
}
async clickthreedotsgrp()
{
await this.page.getByRole('button', { name: 'Toggle see more' }).first().click();
await expect(this.page.getByRole('button', { name: 'Edit' })).toBeVisible();
await expect(this.page.getByRole('button', { name: 'Delete' })).toBeVisible();
}
async ManageworkflowExistance()
{
    await expect(this.page.getByText('Manage workflow')).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Add workflow' })).toBeVisible();
}
async Subtextmanageworkflow()
{
     await this.page.getByRole('button', { name: 'Toggle see more' }).nth(1).click();
    await this.page.getByRole('button', { name: 'View' }).click();
  await expect(this.page.getByText('Workflow info')).toBeVisible();
  await expect(this.page.getByRole('heading', { name: 'Assignment details' })).toBeVisible();
  await expect(this.page.getByRole('heading', { name: 'Content criteria' })).toBeVisible();
}
async workflownameviewbutton()
{
    await this.page.getByRole('button', { name: 'Toggle see more' }).nth(1).click();
    await this.page.getByRole('button', { name: 'View' }).click();
  await expect(this.page.getByText('Workflow info')).toBeVisible();
  await expect(this.page.getByRole('heading', { name: 'Assignment details' })).toBeVisible();
  await expect(this.page.getByRole('heading', { name: 'Content criteria' })).toBeVisible();
 // await this.page.getByRole('button', { name: 'Close' }).click();
}
async workflownameeditbutton()
{
    await this.page.getByRole('button', { name: 'Toggle see more' }).nth(1).click();
 await this.page.getByRole('button', { name: 'Edit' }).click();
await expect(this.page.getByText('Edit workflow')).toBeVisible();
await this.page.locator('div').filter({ hasText: /^Approver$/ }).nth(2).click();
await this.page.getByText('priya 111').click();
}
async workflownamedelbutton()
{
    await this.page.getByRole('button', { name: 'Toggle see more' }).nth(1).click();
    await this.page.getByRole('button', { name: 'Delete' }).click();
    await expect(this.page.getByRole('heading', { name: 'Delete workflow?' })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Delete' })).toBeVisible();
}
}
module.exports = {WorkflowLandingPage};