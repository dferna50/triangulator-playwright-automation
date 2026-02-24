import { type Page, expect } from '@playwright/test';

export class BoostRequestPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  generateUniqueAlphaNumeric(limit: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length: limit }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  }

  async autoName(name: string, score: number, requestName: number, assign: number): Promise<void> {
    await this.page.locator(`:nth-child(${score}) > .pb-8 > .gap-2 > .rounded-md > .flex-1 > .justify-center`).click();
    await this.page.keyboard.press('Control+A');
    await this.page.keyboard.press('Backspace');
    await this.page.keyboard.type('50');

    await this.page.locator(`:nth-child(${requestName}) > .pb-8 > .gap-2 > .rounded-md > .flex-1 > .justify-center`).click();
    await this.page.keyboard.press('Control+A');
    await this.page.keyboard.press('Backspace');
    await this.page.keyboard.type('Daniel Random 2' + name);

    await this.page.locator(`.bg-white > :nth-child(${assign})`).click();
  }

  async submitRequest(name: string): Promise<void> {
    await this.page.locator(':nth-child(2) > .relative > .opacity-0').click();
    await this.page.locator(':nth-child(2) > div.w-full > .relative > .opacity-0').click();
    await this.page.locator(':nth-child(3) > .relative > .opacity-0 > .inline-block').click();
    await expect(this.page.locator('.justify-between > div.overflow-hidden > .overflow-hidden'))
      .toHaveText('Request name: Daniel Random 2' + name);
    await expect(this.page.locator('text=assigned')).toBeVisible();
  }

  async submitRequestUnassigned(name: string): Promise<void> {
    await this.page.locator('.grid-flow-col > .p-0').click();
    await this.page.locator(':nth-child(2) > div.w-full > .relative > .opacity-0').click();
    await this.page.locator(':nth-child(3) > .relative > .opacity-0 > .inline-block').click();
    await expect(this.page.locator('.justify-between > div.overflow-hidden > .overflow-hidden'))
      .toHaveText('Request name: Daniel Random 2' + name);
    await expect(this.page.locator('text=New Suggestions')).toBeVisible();
  }

  async submitRequestUnassignedFindCourse(name: string): Promise<void> {
    await this.page.locator(':nth-child(2) > div.w-full > .relative > .opacity-0').click();
    await this.page.locator(':nth-child(3) > .relative > .opacity-0 > .inline-block').click();
    await expect(this.page.locator('.justify-between > div.overflow-hidden > .overflow-hidden'))
      .toHaveText('Request name: Daniel Random 2' + name);
    await expect(this.page.locator('text=New Suggestions')).toBeVisible();
  }

  async selectRandomItemFromComboBox(
    comboBoxSelector: string,
    itemList: string,
    num: number
  ): Promise<void> {
    await this.page.locator(comboBoxSelector).click();
    await this.page.locator(itemList).waitFor({ state: 'visible' });
    const randomIndex = Math.floor(Math.random() * num);
    for (let i = 0; i <= randomIndex; i++) {
      await this.page.keyboard.press('ArrowDown');
    }
    await this.page.waitForTimeout(1000);
    await this.page.keyboard.press('Enter');
  }

  async disabledSubmitButton(): Promise<void> {
    await this.page.hover('.gap-3 > :nth-child(2) > div.cursor-not-allowed');
    await expect(this.page.locator('text=Please complete all steps')).toBeVisible();
    await this.page.hover('body', { position: { x: 0, y: 0 } });
  }

  async navigateToPartnerBoost(): Promise<void> {
    await expect(this.page.locator(':nth-child(4) > .text-grey-600 > .text-center')).toHaveText('My Triangulator');
    await this.page.locator(':nth-child(4) > .text-grey-600 > .text-center').click();
    await expect(this.page.locator('.flex > .font-semibold')).toHaveText('New Suggestions');
    await this.page.locator('.relative > .opacity-0').click();
    await expect(this.page.locator(':nth-child(5) > .list-none > .w-full')).toHaveText(' Boost Suggestions ');
    await this.page.locator(':nth-child(5) > .list-none > .w-full > .flex-1').click();
    await expect(this.page.locator('.w-full.gap-4 > .flex-col > .flex > .font-semibold')).toHaveText('Boost Suggestions');
    await expect(this.page.locator('.items-stretch > :nth-child(1) > .flex')).toBeVisible();
    await expect(this.page.locator(':nth-child(1) > .flex > .text-lg')).toHaveText('Partner Institution');
    await this.page.locator('.items-stretch > :nth-child(1) > .flex').click();
    await expect(this.page.locator('.text-2xl')).toHaveText('Partner Institution');
    await expect(this.page.locator('.pb-2 > .text-secondary')).toContainText('Allow the Triangulator');
  }

  async navigateToImproveRule(): Promise<void> {
    await expect(this.page.locator(':nth-child(4) > .text-grey-600 > .text-center')).toHaveText('My Triangulator');
    await this.page.locator(':nth-child(4) > .text-grey-600 > .text-center').click();
    await expect(this.page.locator('.flex > .font-semibold')).toHaveText('New Suggestions');
    await this.page.locator('.relative > .opacity-0').click();
    await this.page.locator(':nth-child(5) > .list-none > .w-full > .flex-1').click();
    await expect(this.page.locator('.w-full.gap-4 > .flex-col > .flex > .font-semibold')).toHaveText('Boost Suggestions');
    await expect(this.page.locator('.items-stretch > :nth-child(2) > .flex')).toBeEnabled();
    await expect(this.page.locator(':nth-child(2) > .flex')).toContainText('Improve Rules');
    await this.page.locator('.items-stretch > :nth-child(2) > .flex').click();
    await expect(this.page.locator('.pb-2 > .text-secondary')).toContainText('Allow the Triangulator to assist your institution');
    await this.page.locator('.underline').click();
    await expect(this.page.locator('.bg-white > .flex > .text-2xl')).toHaveText('Improve Rules Example');
    await this.page.locator('.absolute > div > .rounded-full > .w-6 > path').click();
  }

  async navigateToFindCourse(): Promise<void> {
    await expect(this.page.locator(':nth-child(4) > .text-grey-600 > .text-center')).toHaveText('My Triangulator');
    await this.page.locator(':nth-child(4) > .text-grey-600 > .text-center').click();
    await expect(this.page.locator('.flex > .font-semibold')).toHaveText('New Suggestions');
    await this.page.locator('.relative > .opacity-0').click();
    await this.page.locator(':nth-child(5) > .list-none > .w-full > .flex-1').click();
    await expect(this.page.locator('.w-full.gap-4 > .flex-col > .flex > .font-semibold')).toHaveText('Boost Suggestions');
    await expect(this.page.locator('.items-stretch > :nth-child(3) > .flex')).toBeEnabled();
    await expect(this.page.locator(':nth-child(3) > .flex > .text-lg')).toHaveText('Find Course');
    await this.page.locator('#uuid-c3c86810-30c1-4d8d-b805-5be01eca2a12').click();
    await expect(this.page.locator('text=Find a Course')).toBeVisible();
    await expect(this.page.locator('.w-full.justify-start > .text-secondary')).toContainText('Allow the Triangulator');
    await this.page.locator('.underline').click();
    await expect(this.page.locator('.bg-white > .flex > .text-2xl')).toHaveText('Find Course Example');
    await this.page.locator('.absolute > [aria-hidden="false"] > .rounded-full > .w-6 > path').click();
  }

  async selectRandomInstitution(num: number): Promise<void> {
    const dropdown = `:nth-child(${num}) > .pb-8 > .timeline-input > #dropdown-trigger > .rounded-md >.flex-1`;
    await this.page.locator(dropdown).click();
    await this.page.waitForTimeout(5000);
    const randomIndex = Math.floor(Math.random() * 5);
    for (let i = 0; i <= randomIndex; i++) {
      await this.page.locator(`:nth-child(${num}) > .pb-8 > .timeline-input > #dropdown-trigger > .rounded-md`).press('ArrowDown');
    }
    await this.page.locator(`:nth-child(${num}) > .pb-8 > .timeline-input > #dropdown-trigger > .rounded-md`).press('Enter');
  }
}
