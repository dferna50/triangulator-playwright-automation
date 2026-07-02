const { expect } = require('@playwright/test');
const { TIMEOUT } = require('dns');

class workflowconfiguration {
    constructor(page) {
        this.page = page;

    }
    async groupname() {
        await this.page.getByRole('link', { name: 'My Workplace' }).click();
        await this.page.getByRole('link', { name: 'Settings' }).click();
        await this.page.locator('#primary-content section').filter({ hasText: 'Workflow configurations' }).getByRole('link').click();
        // await this.page.getByRole('button', { name: 'Discard' }).click();



    }
    async groupnameusererrormsg() {
        await this.page.getByRole('button', { name: 'Toggle see more' }).nth(0).click();
        await this.page.getByRole('button', { name: 'Edit' }).click();
        await expect(this.page.getByLabel('Use arrow keys to navigate.').getByText('automation')).toBeVisible();
        await expect(this.page.getByLabel('Use arrow keys to navigate.').getByText('test 123')).toBeVisible();
        await expect(this.page.getByLabel('Use arrow keys to navigate.').getByText('Dallas College Inst Admin')).toBeVisible();
        await this.page.getByRole('button', { name: 'Cancel' }).click();
        await this.page.getByRole('link', { name: 'All' }).nth(0).click();
        await this.page.locator('div:nth-child(2) > .row-menu-action-cell > .relative > #dropdown-trigger > div > .rounded-full').click();
        await this.page.getByRole('button', { name: 'Suspend' }).click();
        await expect(this.page.getByText('Error message')).toBeVisible();
        await expect(this.page.getByText('This user is part of a group')).toBeVisible();
        await this.page.getByRole('button', { name: 'Close' }).nth(0).click();


    }
    async groupnameusernotinvolvederrormsg() {
        await this.page.getByRole('button', { name: 'Toggle see more' }).nth(0).click();
        await this.page.getByRole('button', { name: 'Edit' }).click();
        await expect(this.page.getByLabel('Use arrow keys to navigate.').getByText('automation')).toBeVisible();
        await expect(this.page.getByLabel('Use arrow keys to navigate.').getByText('test 123')).toBeVisible();
        await expect(this.page.getByLabel('Use arrow keys to navigate.').getByText('Dallas College Inst Admin')).toBeVisible();
        await this.page.getByRole('button', { name: 'Cancel' }).click();
        await this.page.getByRole('link', { name: 'All' }).nth(0).click();
        await this.page.locator('.row-menu-action-cell > .relative > #dropdown-trigger > div > .rounded-full').first().click();
        await this.page.getByRole('button', { name: 'Suspend' }).click();
        await expect(this.page.getByText('Suspend user')).toBeVisible();
        await expect(this.page.getByText('By temporarily suspending')).toBeVisible();
        await expect(this.page.getByRole('button', { name: 'Suspend' })).toBeVisible();

    }
    async useraccountinstadmin() {
        await this.page.getByRole('button', { name: 'Open account dropdown' }).click();
        await this.page.getByRole('button', { name: 'Account', exact: true }).click();
        await expect(this.page.getByText('test group')).toBeVisible();
        await this.page.locator('//button[@class="rounded-full grid place-items-center"]').nth(0).click();
        await expect(this.page.getByText('automation')).toBeVisible();
        await expect(this.page.getByText('Dallas College Inst Admin').first()).toBeVisible();
        await expect(this.page.getByText('test 123')).toBeVisible();

    }
    async Noworkflowicon() {
        await this.page.getByRole('button', { name: 'Open account dropdown' }).click();
        await this.page.getByRole('button', { name: 'Account', exact: true }).click();
        await expect(this.page.getByText('test group')).toBeVisible();
        // await expect(this.page.getByRole('img', { name: 'Clean up' })).toBeVisible({ timeout: 30000 });
        await expect(this.page.getByText('No workflows')).toBeVisible();
    }
    async Reviewer_rolegrpcheck() {
        await this.page.getByRole('button', { name: 'Open account dropdown' }).click();
        await this.page.getByRole('button', { name: 'Sign Out' }).click();
        await this.page.getByRole('button', { name: 'Login' }).click();
        await this.page.locator('.rounded-md > .flex-1 > div').first().click();
        await this.page.getByRole('textbox', { name: 'Email' }).click();
        await this.page.getByRole('textbox', { name: 'Email' }).fill('testtriangulator+108@gmail.com');
        await this.page.getByRole('textbox', { name: 'Password' }).fill('#TransferTri1');
        await this.page.getByRole('button', { name: 'Submit' }).click();
        await this.page.goto('https://qa.creditmobility.net/app/dashboard');
        await this.page.getByRole('button', { name: 'Open account dropdown' }).click();
        await this.page.getByRole('button', { name: 'Account', exact: true }).click();
        // await this.page.locator('.toggle-button-size').first().click();
    }
    async Workfloedetailspage() {
        await this.page.getByRole('link', { name: 'My Workplace' }).click();
        await this.page.getByRole('link', { name: 'Settings' }).click();
        await this.page.locator('#primary-content section').filter({ hasText: 'Workflow configurations' }).getByRole('link').click();
        // await this.page.getByRole('button', { name: 'Discard' }).click();
        await this.page.getByRole('button', { name: 'Toggle see more' }).nth(1).click();
        await this.page.getByRole('button', { name: 'View' }).click();
        await expect(this.page.getByText('Workflow info')).toBeVisible();
        await expect(this.page.getByRole('heading', { name: 'Overview' })).toBeVisible();
        await expect(this.page.getByRole('heading', { name: 'Assignment details' })).toBeVisible();
        await expect(this.page.getByRole('heading', { name: 'Content criteria' })).toBeVisible();
        await this.page.getByText('Workflow configurationsManage').click();
        await page.getByRole('button', { name: 'Toggle see more' }).nth(2).click();
    }
    async othersuggestionspageclick() {

    }
    async Notewhilereviewing() {

    }
    async StateconnecttoggleOFF() {

    }
}
module.exports = { workflowconfiguration };