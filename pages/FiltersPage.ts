import { type Page, type Locator, expect } from '@playwright/test';

export class FiltersPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateToMyWorkplace(): Promise<void> {
    await this.page.locator('//span[text()="My Workplace"]').click();
  }

  async navigateToIPEDS(): Promise<void> {
    await this.page.locator('//div[text()=" IPEDS "]').click();
  }

  async ipedsFilters(): Promise<void> {
    await this.page.locator('.gap-6 > div > .rounded-full').click();
    await this.page.locator('//input[@id="combobox-input"]').nth(0).fill('arizona');
    await this.page.keyboard.press('ArrowDown');
    await this.page.keyboard.press('Enter');

    await this.page.locator('//input[@id="combobox-input"]').nth(1).fill('arizona state university');
    await this.page.waitForTimeout(5000);
    await this.page.keyboard.press('ArrowDown');
    await this.page.keyboard.press('Enter');

    await this.page.locator(':nth-child(2) > .relative > .opacity-0').click();
    await this.page.locator('.underline').click();

    await this.page.locator('.gap-6 > div > .rounded-full').click();
    await this.page.locator('//input[@id="unique-identifiers-input"]').fill('104151');
    await this.page.waitForTimeout(5000);
    await this.page.keyboard.press('ArrowDown');
    await this.page.keyboard.press('Enter');

    await this.page.locator(':nth-child(2) > .relative > .opacity-0').click();
    await this.page.locator('.underline').click();
  }

  async navigateToDistrict(): Promise<void> {
    await this.page.locator('.px-4 > .relative > .opacity-0').click();
    await this.page.locator(':nth-child(8) > :nth-child(1) > .w-full > .flex-1').click();
  }

  async districtFilters(): Promise<void> {
    await this.page.locator('.gap-6 > div > .rounded-full').click();
    await this.page.locator(':nth-child(1) > #dropdown-trigger > .rounded-md > .relative > .justify-center').fill('arizona');
    await this.page.keyboard.press('ArrowDown');
    await this.page.keyboard.press('Enter');

    await this.page.locator(':nth-child(2) > #dropdown-trigger > .rounded-md > .relative > .justify-center').fill('arizona state university');
    await this.page.waitForTimeout(5000);
    await this.page.keyboard.press('ArrowDown');
    await this.page.keyboard.press('Enter');

    await this.page.locator(':nth-child(2) > .relative > .opacity-0').click();
    await this.page.locator('.underline').click();
  }

  generateRandomUsername(): string {
    const randomString = Math.random().toString(36).substring(2, 10);
    return `Testuser_${randomString}`;
  }

  async ipedFilterSearch1608(): Promise<void> {
    await this.page.getByRole('button', { name: 'Open account dropdown' }).click();
    await this.page.getByRole('menuitem', { name: 'Sign Out' }).click();
    await this.page.waitForTimeout(3000);
    await this.page.getByRole('navigation').getByRole('button', { name: 'Request access' }).click();
    await this.page.getByRole('button', { name: 'User' }).click();
    await this.page.getByRole('combobox', { name: 'Institution' }).click();
    await this.page.getByRole('option', { name: 'American River College' }).click();
    await this.page.getByRole('textbox', { name: 'First name' }).click();
    await this.page.getByRole('textbox', { name: 'First name' }).fill('Priya');
    await this.page.locator('div:nth-child(2) > .rounded-md > div > div').first().click();
    await this.page.getByRole('textbox', { name: 'Last name' }).fill('ab');
    await this.page.locator('div:nth-child(3) > .rounded-md > .flex-1 > div').first().click();
    let email = this.generateRandomUsername();
    email = email + '@gmail.com';
    await this.page.getByRole('textbox', { name: 'Email' }).fill(email);
    await this.page.getByRole('textbox', { name: 'Job title' }).click();
    await this.page.getByRole('textbox', { name: 'Job title' }).fill('Automation');
    await this.page.getByRole('checkbox', { name: 'Toggle accept terms' }).scrollIntoViewIfNeeded();
    await this.page.getByText('Lorem ipsum dolor sit amet,').nth(4).scrollIntoViewIfNeeded();
    await this.page.getByRole('checkbox', { name: 'Toggle accept terms' }).click();

    await this.page.getByRole('button', { name: 'Submit' }).click();
    await this.page.getByRole('button', { name: 'Go to login' }).click();
    await this.page.getByRole('textbox', { name: 'Email' }).click();
    await this.page.getByRole('textbox', { name: 'Email' }).fill(process.env.ADMIN_EMAIL ?? '');
    await this.page.getByRole('textbox', { name: 'Password' }).click();
    await this.page.getByRole('textbox', { name: 'Password' }).fill(process.env.ADMIN_PASSWORD ?? '');
    await this.page.getByRole('button', { name: 'Submit' }).click();
    await this.page.getByRole('link', { name: 'My Workplace' }).click();
    await this.page.getByRole('link', { name: 'Requests' }).click();
    await this.page.getByRole('button', { name: 'Accept request' }).first().click();
    await this.page.getByRole('link', { name: 'IPEDS' }).click();
    await this.page.waitForTimeout(5000);
    await this.page.getByRole('button', { name: 'Filter' }).click();
    await this.page.locator('div:nth-child(2) > #dropdown-trigger > .rounded-md > div > div').first().click();
    await this.page.locator('#combobox-input').nth(1).fill('alibena');
    await this.page.locator('#combobox-input').nth(1).press('ArrowLeft');

    await this.page.locator('#combobox-input').nth(1).fill('Abilene');
    await this.page.locator('#combobox-input').nth(1).click();
    await this.page.getByLabel('Filter IPEDS').getByText('Abilene Christian University', { exact: true }).click();
    await this.page.getByRole('button', { name: 'Apply' }).click();
    await this.page.waitForTimeout(5000);
    await this.page.getByRole('button', { name: 'See all' }).click();
    await expect(this.page.getByLabel('IPEDS information').getByRole('paragraph').filter({ hasText: 'Abilene Christian University' })).toBeVisible();
  }

  async boostRequestLogPartnerInst1610(): Promise<void> {
    await this.page.getByRole('link', { name: 'My Triangulator' }).click();
    await this.page.getByRole('link', { name: 'Boost Suggestions' }).click();
    await this.page.getByRole('link', { name: 'Boost Suggestions' }).press('ArrowDown');
    await this.page.locator('#primary-content > div > div > div.w-full.px-12.flex.flex-col.gap-3 > div:nth-child(2) > div.w-full.overflow-hidden.rounded-lg.relative.border-transparent > div > div.flex-1.overflow-hidden > div:nth-child(3) > div > div:nth-child(1) > div > div:nth-child(1) > div > div > button > p').first().click();
    await this.page.getByText('ParametersSource Institution').click();
    await expect(this.page.getByText('Parameters', { exact: true })).toBeVisible();
  }

  async courseByCourseSearchNotVisible1550(): Promise<void> {
    await this.page.getByRole('link', { name: 'Search' }).click();
    await this.page.getByRole('button', { name: 'Search course by course If' }).click();
    await this.page.getByRole('button', { name: 'Toggle dropdown' }).nth(1).click();
    await this.page.getByRole('combobox', { name: 'School name' }).fill('Arizona state');
    await this.page.getByText('Arizona State University Campus Immersion').click();
    await this.page.locator('.flex > .rounded-md > div > div').first().click();
    await this.page.getByRole('textbox', { name: 'Subject' }).fill('ENG');
    await this.page.getByRole('textbox', { name: 'Course number' }).click();
    await this.page.getByRole('textbox', { name: 'Course number' }).fill('101');
    await this.page.getByRole('button', { name: 'Add course' }).click();
    await this.page.getByRole('button', { name: 'Search' }).click();
    await this.page.waitForTimeout(6000);
    await this.page.getByRole('button', { name: '100% 1/1 approved Arizona Common Course' }).click();
    await expect(this.page.getByText('ENG 101').first()).toBeVisible();
  }

  async pageFiltersOnStateAlign1536(): Promise<void> {
    await this.page.getByRole('link', { name: 'My Triangulator' }).click();
    await this.page.getByRole('button', { name: 'Filter' }).click();
    await this.page.getByRole('combobox', { name: 'Suggestion Type' }).locator('div').nth(4).click();
    await this.page.getByText('State alignment').click();
    await this.page.getByRole('dialog', { name: 'Filter suggestions' }).click();
    await this.page.click('xpath=//*[@id="modal-outlet-0"]/div/div/div/div[3]/div[2]/button/div[1]');
  }

  async requestPartnerBoost1537(): Promise<void> {
    await this.page.getByRole('link', { name: 'My Triangulator' }).click();
    await this.page.getByRole('link', { name: 'Boost Suggestions' }).click();
    await this.page.getByRole('button', { name: 'Partner Institution Boost' }).click();
    await this.page.getByRole('combobox', { name: 'Source institution level' }).click();
    await this.page.getByText('At least 2 but less than 4').click();
    await this.page.locator('div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > #dropdown-trigger > .rounded-md > .flex-1 > div').first().click();
    await this.page.getByText('Arizona').click();
    await this.page.locator('div:nth-child(3) > div:nth-child(2) > div:nth-child(2) > #dropdown-trigger > .rounded-md > .flex-1 > div').first().click();
    await this.page.getByText('Central Arizona College').click();
    await this.page.locator('div').filter({ hasText: /^Minimum score$/ }).nth(1).click();
    await this.page.getByRole('textbox', { name: 'Minimum score' }).fill('68');
    await this.page.getByRole('textbox', { name: 'Request name' }).click();
    await this.page.getByRole('textbox', { name: 'Request name' }).fill('auto45');
    await this.page.getByRole('button', { name: 'Submit' }).click();
    await expect(this.page.getByText('Description')).toBeVisible();
  }

  async columnFiltersRemoval1619(): Promise<void> {
    await this.page.getByRole('link', { name: 'My Triangulator' }).click();
    await this.page.getByRole('button', { name: 'Source institution' }).click();
    await this.page.getByRole('menuitem', { name: 'Customize columns' }).click();
    await expect(this.page.getByLabel('Source credit hours')).not.toBeVisible();
    await expect(this.page.getByLabel('Source course level')).not.toBeVisible();
    await expect(this.page.getByLabel('Source effective begin date')).not.toBeVisible();
    await expect(this.page.getByLabel('Source effective end date')).not.toBeVisible();
    await expect(this.page.getByLabel('Target institution')).not.toBeVisible();
    await expect(this.page.getByLabel('Target state')).not.toBeVisible();
    await expect(this.page.getByLabel('Target credit hours')).not.toBeVisible();
    await expect(this.page.getByLabel('Target course level')).not.toBeVisible();
    await expect(this.page.getByLabel('General ed category')).not.toBeVisible();
    await expect(this.page.getByLabel('Elective indicator')).not.toBeVisible();
  }

  async pastFutureDateComparison1562(): Promise<void> {
    await this.page.getByRole('button', { name: 'Open account dropdown' }).click();
    await this.page.getByRole('menuitem', { name: 'Sign Out' }).click();
    await this.page.getByRole('button', { name: 'Login' }).click();
    await this.page.getByRole('textbox', { name: 'Email' }).click();
    await this.page.getByRole('textbox', { name: 'Email' }).fill(process.env.ADMIN_EMAIL ?? '');
    await this.page.locator('div:nth-child(2) > div > .rounded-md > .flex-1 > div').first().click();
    await this.page.getByRole('textbox', { name: 'Password' }).fill(process.env.ADMIN_PASSWORD ?? '');
    await this.page.getByRole('button', { name: 'Submit' }).click();
    await this.page.getByRole('link', { name: 'My Workplace' }).click();
    await this.page.getByRole('button', { name: 'Display Name' }).click();
    await this.page.getByRole('menuitem', { name: 'Customize columns' }).click();
    await this.page.getByLabel('Customize columns').getByRole('button', { name: 'Display Name' }).click();
    await this.page.getByRole('button', { name: 'close', exact: true }).click();
  }

  async missingDataSearchPage1555(): Promise<void> {
    await this.page.getByRole('link', { name: 'Search' }).click();
    await this.page.getByRole('button', { name: 'Explore all equivalencies If' }).click();
    await this.page.locator('xpath=//input[@id="inst-input-eyJ0Ijoic291cmNlIn0=-input"]').click();
    await this.page.getByText('Anywhere').click();
    await this.page.locator('div').filter({ hasText: /^Where are you transferring to\?$/ }).getByPlaceholder('Search and select a school').click();
    await this.page.locator('div').filter({ hasText: /^Where are you transferring to\?$/ }).getByPlaceholder('Search and select a school').fill('bois');
    await this.page.getByText('Boise State University').click();
    await this.page.getByRole('button', { name: 'Search' }).click();
    await this.page.getByRole('button', { name: 'Toggled row selection Abilene Christian University ENGL 112 Boise State' }).getByLabel('Toggle see more').click();
    await this.page.getByRole('button', { name: 'Toggled row selection Abilene Christian University ENGL 112 Level: No data' }).click();
    await this.page.locator('xpath=//p[@class="text-base font-bold cursor-pointer"]').nth(1).click();
  }

  async instAdmin1564(): Promise<void> {
    await this.page.getByRole('button', { name: 'Open account dropdown' }).click();
    await this.page.getByRole('menuitem', { name: 'Sign Out' }).click();
    await this.page.getByRole('button', { name: 'Login' }).click();
    await this.page.getByRole('textbox', { name: 'Email' }).click();
    await this.page.getByRole('textbox', { name: 'Email' }).fill(process.env.INST_ADMIN2_EMAIL ?? '');
    await this.page.locator('div:nth-child(2) > div > .rounded-md > .flex-1 > div').first().click();
    await this.page.getByRole('textbox', { name: 'Password' }).fill(process.env.INST_ADMIN2_PASSWORD ?? '');
    await this.page.getByRole('button', { name: 'Submit' }).click();
    await expect(this.page.getByText('University Of North Texas!')).toBeVisible();
    await this.page.getByRole('link', { name: 'My Triangulator' }).click();
    await this.page.getByRole('link', { name: 'Boost Suggestions' }).click();
    await this.page.getByRole('button', { name: 'Find Course Boost suggestions' }).click();
    await this.page.locator('.w-full > .px-2').first().click();
    await this.page.getByText('Four or more years').click();
    await this.page.getByRole('combobox', { name: 'Source state' }).click();
    await this.page.getByText('Arizona').click();
    await this.page.getByRole('combobox', { name: 'Source institution', exact: true }).click();
    await this.page.getByRole('combobox', { name: 'Source institution', exact: true }).fill('arizona');
    await this.page.getByRole('option', { name: 'Arizona State University' }).click();
    await this.page.locator('.flex > .rounded-md > .flex-1 > div').first().click();
    await this.page.getByRole('textbox', { name: 'Enter subject' }).fill('ENG');
    await this.page.locator('.w-full > div:nth-child(2) > div > .rounded-md > .flex-1 > div').first().click();
    await this.page.getByRole('textbox', { name: 'Enter course number' }).fill('101');
    await this.page.locator('div:nth-child(2) > .rounded-md > .flex-1 > div').first().click();
    await this.page.getByRole('textbox', { name: 'Minimum score' }).fill('60');
    await this.page.getByRole('textbox', { name: 'Request name' }).click();
    await this.page.getByRole('textbox', { name: 'Request name' }).fill('im test');
    await this.page.getByRole('button', { name: 'Submit' }).click();
    const baseUrl = process.env.BASE_URL ?? 'https://qa.creditmobility.net/';
    await this.page.goto(`${baseUrl}app/my-triangulator/requests/boost-suggestions/summary/5521b534-45b8-4a50-819d-58bdd546b46e`);
    await expect(this.page.getByText('Processing complete')).toBeVisible();
  }

  async alignmentErrorMessage1577(): Promise<void> {
    await this.page.getByRole('link', { name: 'My Triangulator' }).click();
    await this.page.getByRole('button', { name: 'Filter' }).click();
    await this.page.getByRole('combobox', { name: 'Suggestion Type' }).locator('div').nth(4).click();
    await this.page.getByText('Out of alignment').click();
    await this.page.getByRole('combobox', { name: 'Suggestion Type' }).press('Enter');
    await this.page.getByRole('option', { name: 'Out of alignment' }).locator('div').click();
    await this.page.getByRole('combobox', { name: 'Suggestion Type' }).locator('div').nth(4).click();
    await this.page.getByText('Out of alignment').click();
    await this.page.getByRole('button', { name: 'Apply' }).click();
  }
}
