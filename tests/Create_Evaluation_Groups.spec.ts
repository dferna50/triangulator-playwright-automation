import { test, expect } from '../fixtures/test';
import { type Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { CreateUserPage } from '../pages/CreateUserPage';

test.describe('Create workflow configuration', () => {
    test.describe.configure({ mode: 'serial' });

    const baseURL = (process.env.BASE_URL ?? 'https://qa.creditmobility.net').replace(/\/$/, '');
    const instAdminEmail = process.env.INST_ADMIN_EMAIL ?? '';
    const instAdminPassword = process.env.INST_ADMIN_PASSWORD ?? '';

    let page: Page;
    let loginPage: LoginPage;
    let createUserPage: CreateUserPage;

    test.beforeAll(async ({ browser }) => {
        page = await browser.newPage();
        page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
        loginPage = new LoginPage(page);
        createUserPage = new CreateUserPage(page);

        // Perform login exactly once for the entire suite to avoid rate-limiting/auth locks
        await page.goto(`${baseURL}/logged-out/login/email`);
        await loginPage.loginUser(instAdminEmail, instAdminPassword);
        
        // Wait for dashboard and navigation tabs to ensure session is fully active and established
        await page.waitForURL('**/app/dashboard**', { timeout: 30000 });
        await expect(loginPage.myWorkplaceTab).toBeVisible({ timeout: 20000 });
        await page.locator('.animate-spin, .loading, svg[class*="spin"]').first().waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {});
        await page.waitForTimeout(10000);
        await page.screenshot({ path: 'scratch/debug_beforeall_done.png' });
    });

    test.afterAll(async () => {
        if (page) {
            await page.close();
        }
    });

    test.beforeEach(async () => {
        console.log('beforeEach: ensuring we are on dashboard');
        const currentURL = page.url();
        if (!currentURL.includes('/app/dashboard')) {
            await page.getByRole('link', { name: 'Dashboard', exact: true }).click();
            await page.waitForURL('**/app/dashboard**');
        }

        console.log('beforeEach: navigating to settings via SPA');
        await page.getByRole('link', { name: 'My Workplace' }).click();
        await page.getByRole('link', { name: 'Settings' }).click();
        await page.locator('#primary-content section').filter({ hasText: 'Workflow configurations' }).getByRole('link').click();
        console.log('beforeEach: settings page loaded');

        // Click "Create group" button to open the modal
        const createGroupButton = page.getByRole('button', { name: 'create group' });
        console.log('beforeEach: waiting for create group button');
        await expect(createGroupButton).toBeVisible({ timeout: 15000 });
        console.log('beforeEach: clicking create group button');
        await createGroupButton.click();

        // Wait for the modal to appear
        console.log('beforeEach: waiting for create group dialog');
        await expect(
            page.getByRole('dialog', { name: 'Create evaluation group' })
        ).toBeVisible({ timeout: 10000 });
        console.log('beforeEach: dialog visible');
        await page.screenshot({ path: 'scratch/debug_beforeeach_dialog.png' });
    });

    test('TC1-Verify user selection dropdown content and order', async () => {
        await createUserPage.createUserValidationErrorMsg();
    });

    test('TC2-Verify user deletion functionality in Step', async () => {
        await createUserPage.deleteIcon();
    });

    test('TC3-Verify zero user selection throws error', async () => {
        await createUserPage.zeroUsersThrowsError();
    });

    test('TC5-Verify all active users can be added to a group.', async () => {
        await createUserPage.allActiveUsers();
    });

    test('TC6-Verify error message if the user attempts to create a group with a name that already exists.', async () => {
        await createUserPage.enterNumberForCreateGroup();
    });

    test('TC7-validate error message upto 250 character length', async () => {
        await createUserPage.description250CharLength();
    });

    test('TC8-Verify that if the user abandons changes, the same error messaging is leveraged for discarding changes.', async () => {
        await createUserPage.discardChanges();
    });

    test.skip('TC9-Verify that the group is saved and visible on the chart on the Workflow configurations page.', async () => {
        await createUserPage.workflowGroupView();
    });

    test.skip('TC10-Verify that Step 2 requires a unique group name (not case-sensitive).', async () => {
        await createUserPage.uniqueGroupName();
    });
});
