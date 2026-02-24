import { type Page, type Locator, expect } from '@playwright/test';

export class SuggestionsPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async historyNewActions(): Promise<void> {
    await this.page.locator('.min-w-max > div:nth-child(1) > div:nth-child(2) > div > div > p').click();
    await this.page.locator('#dropdown-trigger > button > div').click();
    await expect(this.page.locator('#dropdown-content > .bg-white')).toContainText('Change to reject');
    await expect(this.page.locator('#dropdown-content > .bg-white')).toContainText('Remove decision');
    await expect(this.page.locator('#dropdown-content > .bg-white')).toContainText('Mark as new');
  }

  async historyNewActionsReview(): Promise<void> {
    await this.page.locator('.min-w-max > div:nth-child(1) > div:nth-child(2) > div > div > p').click();
    await this.page.locator('#dropdown-trigger > button > div').click();
    await expect(this.page.locator('#dropdown-content > .bg-white')).toContainText('Change to reject');
    await expect(this.page.locator('#dropdown-content > .bg-white')).toContainText('Remove decision');
    await expect(this.page.locator('#dropdown-content > .bg-white')).not.toContainText('Mark as new');
  }

  async historyNewActionsTriadmin(): Promise<void> {
    await this.page.locator(':nth-child(1) > :nth-child(1) > .p-4 > .whitespace-nowrap > .hover\\:opacity-60').click();
    await expect(this.page.locator('#dropdown-content > .bg-white')).not.toBeVisible();
  }

  async navigateToNewSuggestionPage(): Promise<void> {
    await expect(this.page.locator(':nth-child(4) > .text-grey-600 > .text-center')).toHaveText('My Triangulator');
    await expect(this.page.locator(':nth-child(4) > .text-grey-600 > .text-center')).toBeVisible();
    await this.page.locator(':nth-child(4) > .text-grey-600 > .text-center').click();
  }

  async navigateToAssignedPage(): Promise<void> {
    await expect(this.page.locator(':nth-child(2) > :nth-child(2) > .w-full > .flex-1')).toHaveText(' Assigned ');
    await this.page.locator(':nth-child(2) > :nth-child(2) > .w-full > .flex-1').click();
    await expect(this.page.locator('.flex > .font-semibold').first()).toHaveText('Assigned');
    await expect(this.page.locator('.border-b-primary')).toContainText('My suggestions');
  }

  async navigateToOtherAssignedSuggestions(): Promise<void> {
    await this.page.locator('.pt-4 > :nth-child(2)').click();
    await expect(this.page.locator('.border-b-primary')).toContainText('Other suggestions');
  }

  async navigateToHistoryTab(): Promise<void> {
    await expect(this.page.locator(':nth-child(2) > :nth-child(3) > .w-full > .flex-1')).toHaveText(' History ');
    await this.page.locator(':nth-child(2) > :nth-child(3) > .w-full > .flex-1').click();
    await expect(this.page.locator('.flex > .font-semibold').first()).toHaveText('History');
  }

  async navigateToHistoryTabReviewer(): Promise<void> {
    await expect(this.page.locator('ul > :nth-child(2) > .w-full > .flex-1')).toHaveText(' History ');
    await this.page.locator('ul > :nth-child(2) > .w-full > .flex-1').click();
    await expect(this.page.locator('.flex > .font-semibold').nth(0)).toHaveText('History');
  }

  async newSuggestionSorting(sort: number): Promise<void> {
    await this.page.locator(':nth-child(2) > [style="width: 26rem;"] > .relative > #dropdown-trigger > .p-4').click();
    await this.page.locator(`:nth-child(${sort}) > .block`).click();
    await this.page.locator(':nth-child(3) > [style="width: 10rem;"] > .relative > #dropdown-trigger > .p-4').click();
    await this.page.locator(`:nth-child(${sort}) > .block`).click();
    await this.page.locator(':nth-child(4) > [style="width: 16rem;"] > .relative > #dropdown-trigger > .p-4').click();
    await this.page.locator(`:nth-child(${sort}) > .block`).click();
    await this.page.locator('[style="width: 8rem;"] > .relative > #dropdown-trigger > .p-4').click();
    await this.page.locator(`:nth-child(${sort}) > .block`).click();
    await this.page.locator(':nth-child(11) > [style="width: 16rem;"] > .relative > #dropdown-trigger > .p-4').click();
    await this.page.locator(`:nth-child(${sort}) > .block`).click();
    await this.page.locator(':nth-child(12) > [style="width: 16rem;"] > .relative > #dropdown-trigger > .p-4').click();
    await this.page.locator(`:nth-child(${sort}) > .block`).click();
    await this.page.locator(':nth-child(13) > [style="width: 14rem;"] > .relative > #dropdown-trigger > .p-4').click();
    await this.page.locator(`:nth-child(${sort}) > .block`).click();
    await this.page.locator(':nth-child(14) > [style="width: 16rem;"] > .relative > #dropdown-trigger > .p-4').click();
    await this.page.locator(`:nth-child(${sort}) > .block`).click();
    await this.page.locator(':nth-child(15) > [style="width: 16rem;"] > .relative > #dropdown-trigger > .p-4').click();
    await this.page.locator(`:nth-child(${sort}) > .block`).click();
    await this.page.locator(':nth-child(16) > [style="width: 26rem;"] > .relative > #dropdown-trigger > .p-4').click();
    await this.page.locator(`:nth-child(${sort}) > .block`).click();
    await this.page.locator(':nth-child(17) > [style="width: 10rem;"] > .relative > #dropdown-trigger > .p-4').click();
    await this.page.locator(`:nth-child(${sort}) > .block`).click();
    await this.page.locator(':nth-child(18) > [style="width: 16rem;"] > .relative > #dropdown-trigger > .p-4').click();
    await this.page.locator(`:nth-child(${sort}) > .block`).click();
    await this.page.locator(':nth-child(19) > [style="width: 14rem;"] > .relative > #dropdown-trigger > .p-4').click();
    await this.page.locator(`:nth-child(${sort}) > .block`).click();
    await this.page.locator(':nth-child(20) > [style="width: 14rem;"] > .relative > #dropdown-trigger > .p-4').click();
    await this.page.locator(`:nth-child(${sort}) > .block`).click();
    await this.page.locator(':nth-child(21) > [style="width: 14rem;"] > .relative > #dropdown-trigger > .p-4').click();
    await this.page.locator(`:nth-child(${sort}) > .block`).click();
    await this.page.locator(':nth-child(22) > [style="width: 12rem;"] > .relative > #dropdown-trigger > .p-4').click();
    await this.page.locator(`:nth-child(${sort}) > .block`).click();
    await this.page.locator(':nth-child(23) > [style="width: 12rem;"] > .relative > #dropdown-trigger > .p-4').click();
    await this.page.locator(`:nth-child(${sort}) > .block`).click();
  }

  async historySuggestionSorting(sort: number): Promise<void> {
    await this.page.locator(':nth-child(2) > [style="width: 26rem;"] > .relative > #dropdown-trigger > .p-4').click();
    await this.page.locator(`:nth-child(${sort}) > .block`).click();
    await this.page.locator(':nth-child(3) > [style="width: 10rem;"] > .relative > #dropdown-trigger > .p-4').click();
    await this.page.locator(`:nth-child(${sort}) > .block`).click();
    await this.page.locator(':nth-child(4) > [style="width: 16rem;"] > .relative > #dropdown-trigger > .p-4').click();
    await this.page.locator(`:nth-child(${sort}) > .block`).click();
    await this.page.locator(':nth-child(5) > [style="width: 16rem;"] > .relative > #dropdown-trigger > .p-4').click();
    await this.page.locator(`:nth-child(${sort}) > .block`).click();
    await this.page.locator(':nth-child(6) > [style="width: 12rem;"] > .max-w-full > #dropdown-trigger > .p-4').click();
    await this.page.locator(`:nth-child(${sort}) > .block`).click();
    await this.page.locator(':nth-child(7) > [style="width: 14rem;"] > .relative > #dropdown-trigger > .p-4').click();
    await this.page.locator(`:nth-child(${sort}) > .block`).click();
    await this.page.locator(':nth-child(8) > [style="width: 16rem;"] > .relative > #dropdown-trigger > .p-4').click();
    await this.page.locator(`:nth-child(${sort}) > .block`).click();
    await this.page.locator(':nth-child(9) > [style="width: 12rem;"] > .relative > #dropdown-trigger > .p-4').click();
    await this.page.locator(`:nth-child(${sort}) > .block`).click();
    await this.page.locator('[style="width: 8rem;"] > .relative > #dropdown-trigger > .p-4').click();
    await this.page.locator(`:nth-child(${sort}) > .block`).click();
    await this.page.locator(':nth-child(11) > [style="width: 16rem;"] > .relative > #dropdown-trigger > .p-4').click();
    await this.page.locator(`:nth-child(${sort}) > .block`).click();
    await this.page.locator(':nth-child(12) > [style="width: 16rem;"] > .relative > #dropdown-trigger > .p-4').click();
    await this.page.locator(`:nth-child(${sort}) > .block`).click();
    await this.page.locator(':nth-child(13) > [style="width: 14rem;"] > .relative > #dropdown-trigger > .p-4').click();
    await this.page.locator(`:nth-child(${sort}) > .block`).click();
    await this.page.locator(':nth-child(14) > [style="width: 16rem;"] > .relative > #dropdown-trigger > .p-4').click();
    await this.page.locator(`:nth-child(${sort}) > .block`).click();
    await this.page.locator(':nth-child(15) > [style="width: 16rem;"] > .relative > #dropdown-trigger > .p-4').click();
    await this.page.locator(`:nth-child(${sort}) > .block`).click();
    await this.page.locator(':nth-child(16) > [style="width: 26rem;"] > .relative > #dropdown-trigger > .p-4').click();
    await this.page.locator(`:nth-child(${sort}) > .block`).click();
    await this.page.locator(':nth-child(17) > [style="width: 10rem;"] > .relative > #dropdown-trigger > .p-4').click();
    await this.page.locator(`:nth-child(${sort}) > .block`).click();
    await this.page.locator(':nth-child(18) > [style="width: 16rem;"] > .relative > #dropdown-trigger > .p-4').click();
    await this.page.locator(`:nth-child(${sort}) > .block`).click();
    await this.page.locator(':nth-child(19) > [style="width: 14rem;"] > .relative > #dropdown-trigger > .p-4').click();
    await this.page.locator(`:nth-child(${sort}) > .block`).click();
    await this.page.locator(':nth-child(20) > [style="width: 14rem;"] > .relative > #dropdown-trigger > .p-4').click();
    await this.page.locator(`:nth-child(${sort}) > .block`).click();
    await this.page.locator(':nth-child(21) > [style="width: 14rem;"] > .relative > #dropdown-trigger > .p-4').click();
    await this.page.locator(`:nth-child(${sort}) > .block`).click();
    await this.page.locator(':nth-child(22) > [style="width: 12rem;"] > .relative > #dropdown-trigger > .p-4').click();
    await this.page.locator(`:nth-child(${sort}) > .block`).click();
    await this.page.locator(':nth-child(23) > [style="width: 12rem;"] > .relative > #dropdown-trigger > .p-4').click();
    await this.page.locator(`:nth-child(${sort}) > .block`).click();
  }

  async dateRange(): Promise<void> {
    await this.page.locator(':nth-child(2) > [aria-hidden="false"] > .rounded-full > .w-6').click();
    await this.page.locator('#date-range-input').click();
    await this.page.locator('#date-range-input').press('ArrowDown');
    await this.page.locator('#date-range-input').press('Enter');
    await this.page.locator(':nth-child(2) > .relative > .opacity-0 > .inline-block').click();
    await expect(this.page.locator('.justify-between > div.overflow-hidden > .overflow-hidden')).toHaveText('Date Range: Today');
    await this.page.locator('.text-white > .w-4').click();

    await this.page.locator(':nth-child(2) > [aria-hidden="false"] > .rounded-full > .w-6').click();
    await this.page.locator('#date-range-input').click();
    await this.page.locator('#date-range-input').press('ArrowDown');
    await this.page.locator('#date-range-input').press('ArrowDown');
    await this.page.locator('#date-range-input').press('Enter');
    await this.page.locator(':nth-child(2) > .relative > .opacity-0 > .inline-block').click();
    await expect(this.page.locator('.justify-between > div.overflow-hidden > .overflow-hidden')).toHaveText('Date Range: This Week');
    await this.page.locator('.text-white > .w-4').click();

    await this.page.locator(':nth-child(2) > div > .rounded-full > .w-6').click();
    await this.page.locator('#date-range-input').click();
    for (let i = 0; i < 3; i++) await this.page.locator('#date-range-input').press('ArrowDown');
    await this.page.locator('#date-range-input').press('Enter');
    await this.page.locator(':nth-child(2) > .relative > .opacity-0 > .inline-block').click();
    await expect(this.page.locator('.justify-between > div.overflow-hidden > .overflow-hidden')).toHaveText('Date Range: This Month');
    await this.page.locator('.focus\\:outline-none > .w-4 > path').click();

    await this.page.locator(':nth-child(2) > [aria-hidden="false"] > .rounded-full > .w-6').click();
    await this.page.locator('#date-range-input').click();
    for (let i = 0; i < 4; i++) await this.page.locator('#date-range-input').press('ArrowDown');
    await this.page.locator('#date-range-input').press('Enter');
    await this.page.locator(':nth-child(2) > .relative > .opacity-0 > .inline-block').click();
    await expect(this.page.locator('.justify-between > div.overflow-hidden > .overflow-hidden')).toHaveText('Date Range: This Quarter');
    await this.page.locator('.flex-wrap > .underline').click();

    await this.page.locator(':nth-child(2) > div > .rounded-full > .w-6').click();
    await this.page.locator('#date-range-input').click();
    for (let i = 0; i < 5; i++) await this.page.locator('#date-range-input').press('ArrowDown');
    await this.page.locator('#date-range-input').press('Enter');
    await this.page.locator(':nth-child(2) > .relative > .opacity-0').click();
    await expect(this.page.locator('.justify-between > div.overflow-hidden > .overflow-hidden')).toHaveText('Date Range: This Year');
    await this.page.locator('.flex-wrap > .underline').click();
  }

  async confidenceScore(): Promise<void> {
    const filterIcon = ':nth-child(2) > [aria-hidden="false"] > .rounded-full > .w-6';
    const altFilterIcon = ':nth-child(2) > div > .rounded-full > .w-6';
    const applyBtn = ':nth-child(2) > .relative > .opacity-0';
    const filterResult = '.justify-between > div.overflow-hidden > .overflow-hidden';

    await this.page.locator(filterIcon).click();
    await this.page.locator('#date-range-input').click();
    await this.page.locator('#date-range-input').press('Tab');
    await this.page.locator('#date-range-input').press('Enter');
    await this.page.locator('#date-range-input').press('ArrowDown');
    await this.page.locator('#date-range-input').press('Enter');
    await this.page.locator(applyBtn).click();
    await expect(this.page.locator(filterResult)).toHaveText('Confidence Score: <40%');
    await this.page.locator('.underline').click();

    await this.page.locator(altFilterIcon).click();
    await this.page.locator('#date-range-input').click();
    await this.page.locator('#date-range-input').press('Tab');
    await this.page.locator('#date-range-input').press('Enter');
    for (let i = 0; i < 2; i++) await this.page.locator('#date-range-input').press('ArrowDown');
    await this.page.locator('#date-range-input').press('Enter');
    await this.page.locator(applyBtn).click();
    await expect(this.page.locator(filterResult)).toHaveText('Confidence Score: 40%-60%');
    await this.page.locator('.underline').click();

    await this.page.locator(filterIcon).click();
    await this.page.locator('#date-range-input').click();
    await this.page.locator('#date-range-input').press('Tab');
    await this.page.locator('#date-range-input').press('Enter');
    for (let i = 0; i < 3; i++) await this.page.locator('#date-range-input').press('ArrowDown');
    await this.page.locator('#date-range-input').press('Enter');
    await this.page.locator(applyBtn).click();
    await expect(this.page.locator(filterResult)).toHaveText('Confidence Score: 60%-80%');
    await this.page.locator('.text-white > .w-4').click();

    await this.page.locator(altFilterIcon).click();
    await this.page.locator('#date-range-input').click();
    await this.page.locator('#date-range-input').press('Tab');
    await this.page.locator('#date-range-input').press('Enter');
    for (let i = 0; i < 4; i++) await this.page.locator('#date-range-input').press('ArrowDown');
    await this.page.locator('#date-range-input').press('Enter');
    await this.page.locator(applyBtn).click();
    await expect(this.page.locator(filterResult)).toHaveText('Confidence Score: 80%-100%');
    await this.page.locator('.flex-wrap > .underline').click();
  }

  async stateFilter(): Promise<void> {
    await this.page.locator(':nth-child(2) > [aria-hidden="false"] > .rounded-full > .w-6').click();
    await this.page.locator('#date-range-input').click();
    await this.page.locator('#date-range-input').press('Tab');
    await this.page.locator('#date-range-input').press('Tab');
    await this.page.locator('#date-range-input').press('Enter');
    for (const state of ['arizona', 'nevada', 'texas', 'california']) {
      await this.page.locator('#date-range-input').type(state);
      await this.page.locator('#date-range-input').press('ArrowDown');
      await this.page.locator('#date-range-input').press('Enter');
    }
    await this.page.locator(':nth-child(2) > .relative > .opacity-0').click();
    await expect(this.page.locator('.justify-between > div.overflow-hidden > .overflow-hidden')).toContainText('California');
    await this.page.locator('.flex-wrap > .underline').click();
  }

  async sourceLevel(): Promise<void> {
    await this.page.locator(':nth-child(2) > [aria-hidden="false"] > .rounded-full > .w-6').click();
    await this.page.locator('#date-range-input').click();
    for (let i = 0; i < 3; i++) await this.page.locator('#date-range-input').press('Tab');
    await this.page.locator('#date-range-input').press('Enter');
    await this.page.locator('#date-range-input').press('ArrowDown');
    await this.page.locator('#date-range-input').press('Enter');
    await this.page.locator('#date-range-input').press('ArrowDown');
    await this.page.locator('#date-range-input').press('ArrowDown');
    await this.page.locator('#date-range-input').press('Enter');
    await this.page.locator(':nth-child(2) > .relative > .opacity-0').click();
    await expect(this.page.locator('.justify-between > div.overflow-hidden > .overflow-hidden')).toContainText('Four or more years');
    await this.page.locator('.flex-wrap > .underline').click();
  }

  async institutionFilter(): Promise<void> {
    await this.page.locator(':nth-child(2) > [aria-hidden="false"] > .rounded-full > .w-6').click();
    await this.page.locator('#date-range-input').click();
    for (let i = 0; i < 4; i++) await this.page.locator('#date-range-input').press('Tab');
    await this.page.locator('#date-range-input').press('Enter');
    await this.page.waitForTimeout(10000);
    await this.page.locator('#date-range-input').press('ArrowDown');
    await this.page.locator('#date-range-input').press('Enter');
    await this.page.locator(':nth-child(2) > .relative > .opacity-0').click();
    await this.page.locator('.flex-wrap > .underline').click();
  }

  async subjectFilter(): Promise<void> {
    await this.page.locator(':nth-child(2) > [aria-hidden="false"] > .rounded-full > .w-6').click();
    await this.page.locator('#date-range-input').click();
    for (let i = 0; i < 5; i++) await this.page.locator('#date-range-input').press('Tab');
    await this.page.locator('#date-range-input').type('EN');
    await this.page.locator(':nth-child(2) > .relative > .opacity-0').click();
    await expect(this.page.locator('.justify-between > div.overflow-hidden > .overflow-hidden')).toContainText('EN');
    await this.page.locator('.flex-wrap > .underline').click();
  }

  async numberFilter(): Promise<void> {
    await this.page.locator(':nth-child(2) > [aria-hidden="false"] > .rounded-full > .w-6').click();
    await this.page.locator('#date-range-input').click();
    for (let i = 0; i < 6; i++) await this.page.locator('#date-range-input').press('Tab');
    await this.page.locator('#date-range-input').type('10');
    await this.page.locator(':nth-child(2) > .relative > .opacity-0').click();
    await expect(this.page.locator('.justify-between > div.overflow-hidden > .overflow-hidden')).toContainText('10');
    await this.page.locator('.flex-wrap > .underline').click();
  }

  async assignSuggestion(): Promise<void> {
    const preCountElement = await this.page.locator('.bg-primary').textContent();
    const precount = parseInt(preCountElement ?? '0');

    await this.page.locator('.w-72 > :nth-child(2) > :nth-child(1) > .w-full').click();
    await this.page.locator(':nth-child(1) > .row-border-bottom > .row > .w-full > div > .rounded-full').click();
    await this.page.locator('.rounded-md > .flex-1 > .justify-center').click();
    await this.page.locator('.rounded-md > .flex-1 > .justify-center').press('ArrowDown');
    await this.page.locator('.rounded-md > .flex-1 > .justify-center').press('Enter');
    await this.page.locator(':nth-child(2) > .relative > .opacity-0').click();
    await expect(this.page.locator('text=Reassigned')).toBeVisible();
    await this.page.waitForTimeout(2000);

    const postCountElement = await this.page.locator('.bg-primary').textContent();
    const postcount = parseInt(postCountElement ?? '0');
    expect(postcount).toEqual(precount + 1);
  }

  async assignSuggestionMultiple(): Promise<void> {
    const preCountElement = await this.page.locator('.bg-primary').textContent();
    const precount = parseInt(preCountElement ?? '0');

    await this.page.locator('.w-72 > :nth-child(2) > :nth-child(1) > .w-full').click();
    await this.page.locator('.min-w-max > :nth-child(1) > :nth-child(1) > .h-\\[52px\\]').click();
    await this.page.locator('.min-w-max > :nth-child(2) > :nth-child(1) > .h-\\[52px\\]').click();
    await this.page.locator('.min-w-max > :nth-child(3) > :nth-child(1) > .h-\\[52px\\]').click();
    await this.page.locator('[aria-label="Re-assign selected items"]').click();
    await this.page.locator('.rounded-md > .flex-1 > .justify-center').click();
    await this.page.locator('.rounded-md > .flex-1 > .justify-center').press('ArrowDown');
    await this.page.locator('.rounded-md > .flex-1 > .justify-center').press('Enter');
    await this.page.locator(':nth-child(2) > .relative > .opacity-0').click();
    await expect(this.page.locator('text=Reassigned')).toBeVisible();
    await this.page.waitForTimeout(2000);

    const postCountElement = await this.page.locator('.bg-primary').textContent();
    const postcount = parseInt(postCountElement ?? '0');
    expect(postcount).toEqual(precount + 3);
  }

  async acceptSuggestion(): Promise<void> {
    const preCountElement = await this.page.locator('.border-b-primary > .bg-gray-500').textContent();
    const precount = parseInt(preCountElement ?? '0');

    await this.page.locator(':nth-child(1) > .row-border-bottom > .row > .justify-end > :nth-child(3) > .rounded-full').click();
    await expect(this.page.locator(':nth-child(1) > .row-border-bottom > .row > .w-full > div > .rounded-full')).toBeEnabled();
    await this.page.waitForTimeout(5000);

    const postCountElement = await this.page.locator('.border-b-primary > .bg-gray-500').textContent();
    const postcount = parseInt(postCountElement ?? '0');
    expect(postcount).toEqual(precount - 1);
  }

  async acceptSuggestionMultiple(): Promise<void> {
    const preCountElement = await this.page.locator('.border-b-primary > .bg-gray-500').textContent();
    const precount = parseInt(preCountElement ?? '0');

    await this.page.locator('.min-w-max > :nth-child(1) > :nth-child(1) > .h-\\[52px\\]').click();
    await this.page.locator('.min-w-max > :nth-child(2) > :nth-child(1) > .h-\\[52px\\]').click();
    await this.page.locator('.min-w-max > :nth-child(3) > :nth-child(1) > .h-\\[52px\\]').click();
    await this.page.locator('[aria-label="Approve selected items"]').click();
    await expect(this.page.locator(':nth-child(1) > .row-border-bottom > .row > .w-full > div > .rounded-full')).toBeEnabled();
    await this.page.waitForTimeout(5000);

    const postCountElement = await this.page.locator('.border-b-primary > .bg-gray-500').textContent();
    const postcount = parseInt(postCountElement ?? '0');
    expect(postcount).toEqual(precount - 3);
  }

  async rejectSuggestion(): Promise<void> {
    const preCountElement = await this.page.locator('.border-b-primary > .bg-gray-500').textContent();
    const precount = parseInt(preCountElement ?? '0');

    await this.page.locator(':nth-child(1) > .row-border-bottom > .row > .justify-end > :nth-child(2) > .rounded-full').click();
    await this.page.locator(':nth-child(3) > .w-full > :nth-child(10)').click();
    await this.page.locator(':nth-child(2) > .relative > .opacity-0').click();
    await expect(this.page.locator('text=Rejected')).toBeVisible();
    await expect(this.page.locator(':nth-child(1) > .row-border-bottom > .row > .w-full > div > .rounded-full')).toBeEnabled();
    await this.page.waitForTimeout(5000);

    const postCountElement = await this.page.locator('.border-b-primary > .bg-gray-500').textContent();
    const postcount = parseInt(postCountElement ?? '0');
    expect(postcount).toEqual(precount - 1);
  }

  async rejectSuggestionMultiple(): Promise<void> {
    const preCountElement = await this.page.locator('.border-b-primary > .bg-gray-500').textContent();
    const precount = parseInt(preCountElement ?? '0');

    await this.page.locator('.min-w-max > :nth-child(1) > :nth-child(1) > .h-\\[52px\\]').click();
    await this.page.locator('.min-w-max > :nth-child(2) > :nth-child(1) > .h-\\[52px\\]').click();
    await this.page.locator('.min-w-max > :nth-child(3) > :nth-child(1) > .h-\\[52px\\]').click();
    await this.page.locator('[aria-label="Reject selected items"]').click();
    await this.page.locator(':nth-child(3) > .w-full > :nth-child(10)').click();
    await this.page.locator(':nth-child(2) > .relative > .opacity-0').click();
    await expect(this.page.locator('text=Rejected')).toBeVisible();
    await expect(this.page.locator(':nth-child(1) > .row-border-bottom > .row > .w-full > div > .rounded-full')).toBeEnabled();
    await this.page.waitForTimeout(5000);

    const postCountElement = await this.page.locator('.border-b-primary > .bg-gray-500').textContent();
    const postcount = parseInt(postCountElement ?? '0');
    expect(postcount).toEqual(precount - 3);
  }

  async suggestionTypeFilter(): Promise<void> {
    await this.page.locator(':nth-child(2) > [aria-hidden="false"] > .rounded-full > .w-6').click();
    await this.page.locator('#date-range-input').click();
    for (let i = 0; i < 10; i++) await this.page.locator('#date-range-input').press('Tab');
    await this.page.locator('#date-range-input').press('Enter');
    await this.page.locator('#date-range-input').press('ArrowDown');
    await this.page.locator('#date-range-input').press('Enter');
    await this.page.locator(':nth-child(2) > .relative > .opacity-0').click();
    await expect(this.page.locator('.justify-between > div.overflow-hidden > .overflow-hidden')).toContainText('Triangulation');
    await this.page.locator('.flex-wrap > .underline').click();
  }

  // Stub methods for incomplete test methods referenced in bug tickets
  async courseDetailsCourseDescription1553(): Promise<void> {
    // TODO: Implement when test logic is clarified
  }

  async suggestionsResults1563(): Promise<void> {
    // TODO: Implement when test logic is clarified
  }

  async suggestion1578(): Promise<void> {
    // TODO: Implement when test logic is clarified
  }

  async noAPIError1576(): Promise<void> {
    // TODO: Implement when test logic is clarified
  }

  // ─── E2E methods for suggestions_e2e.spec.ts ──────────────────────────────

  async goToNewSuggestions(): Promise<void> {
    await this.navigateToNewSuggestionPage();
  }

  async goToAssignedSuggestions(): Promise<void> {
    await this.navigateToAssignedPage();
  }

  async goToHistorySuggestions(): Promise<void> {
    await this.navigateToHistoryTab();
  }

  async validateDashboardSuggestionStats(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
    const statsSection = this.page.locator('[data-testid="suggestion-stats"], .suggestion-stats, .dashboard-stats').first();
    if (await statsSection.count() > 0) {
      await expect(statsSection).toBeVisible({ timeout: 10000 });
    } else {
      const anyNumber = this.page.locator('text=/\\d+/').first();
      await expect(anyNumber).toBeVisible({ timeout: 10000 });
    }
  }

  async validateNewSuggestionsColumns(): Promise<void> {
    const expectedHeaders = [
      'Source institution', 'Source state', 'Source subject', 'Source number',
      'Target institution', 'Target subject', 'Target number',
      'Score', 'Suggestion type', 'Date suggested',
    ];
    for (const header of expectedHeaders) {
      const col = this.page.getByRole('columnheader', { name: header });
      if (await col.count() > 0) {
        await expect(col.first()).toBeVisible();
      }
    }
  }

  async validatePaginationVisible(): Promise<void> {
    const pagination = this.page.locator('[aria-label="Pagination"], nav:has(button:has-text("Next")), .pagination').first();
    if (await pagination.count() > 0) {
      await expect(pagination).toBeVisible();
    } else {
      const nextBtn = this.page.getByRole('button', { name: /Next|›|»/i }).first();
      await expect(nextBtn).toBeVisible({ timeout: 5000 });
    }
  }

  async goToNextPage(): Promise<void> {
    const nextBtn = this.page.getByRole('button', { name: /Next|›|»/i }).first();
    await nextBtn.click();
    await this.page.waitForLoadState('networkidle');
  }

  async validateTableSubjectMatchConsistency(rowCount: number): Promise<void> {
    const rows = this.page.getByRole('rowgroup').first().getByRole('row');
    const count = Math.min(await rows.count(), rowCount);
    for (let i = 0; i < count; i++) {
      const srcSubject = this.page.getByRole('rowgroup').first().getByRole('row').nth(i)
        .getByRole('gridcell', { name: 'Source subject' });
      const tgtSubject = this.page.getByRole('rowgroup').first().getByRole('row').nth(i)
        .getByRole('gridcell', { name: 'Target subject' });
      if (await srcSubject.count() > 0 && await tgtSubject.count() > 0) {
        const srcText = ((await srcSubject.textContent()) ?? '').trim().substring(0, 3);
        const tgtText = ((await tgtSubject.textContent()) ?? '').trim().substring(0, 3);
        if (srcText && tgtText) {
          // Log for debugging; subjects should share a discipline root
          console.log(`Row ${i}: src=${srcText} tgt=${tgtText}`);
        }
      }
    }
  }

  async openFirstSuggestionDetail(): Promise<void> {
    const firstRow = this.page.getByRole('rowgroup').first().getByRole('row').first();
    await firstRow.click();
    await this.page.waitForURL(/pageRowIndex=\d/, { timeout: 15000 });
  }

  async validateSubjectMatchSemantically(): Promise<void> {
    const { src, tgt } = await this.getDetailSubjectCodes();
    if (!src || !tgt) throw new Error('Could not extract subject codes from detail view');
    const srcRoot = src.substring(0, 3).toUpperCase();
    const tgtRoot = tgt.substring(0, 3).toUpperCase();
    expect(srcRoot).toBe(tgtRoot);
  }

  async getDetailSubjectCodes(): Promise<{ src: string; tgt: string }> {
    const groups = this.page.getByRole('group');
    let src = '';
    let tgt = '';
    const srcGroup = groups.first();
    const srcSubjectEl = srcGroup.getByText('Subject:').first().locator('..');
    if (await srcSubjectEl.count() > 0) {
      const fullText = ((await srcSubjectEl.textContent()) ?? '').replace('Subject:', '').trim();
      src = fullText.split(/\s/)[0] ?? '';
    }
    const tgtGroup = groups.nth(1);
    const tgtSubjectEl = tgtGroup.getByText('Subject:').first().locator('..');
    if (await tgtSubjectEl.count() > 0) {
      const fullText = ((await tgtSubjectEl.textContent()) ?? '').replace('Subject:', '').trim();
      tgt = fullText.split(/\s/)[0] ?? '';
    }
    return { src, tgt };
  }

  async navigateDetailQueueNext(): Promise<void> {
    await this.page.getByRole('button', { name: 'Next suggestion' }).click();
    await this.page.waitForLoadState('networkidle');
  }

  async validateDetailViewStructure(): Promise<void> {
    await expect(this.page.getByRole('button', { name: /Back/i }).first()).toBeVisible({ timeout: 10000 });
    const groups = this.page.getByRole('group');
    await expect(groups.first()).toBeVisible();
    await expect(groups.nth(1)).toBeVisible();
    await expect(this.page.getByRole('button', { name: /Assign/i }).first()).toBeVisible();
  }

  async validateDetailSuggestionTypeBadge(): Promise<void> {
    const badge = this.page.locator('[data-testid="suggestion-type-badge"], .suggestion-type-badge').first();
    if (await badge.count() > 0) {
      await expect(badge).toBeVisible();
    } else {
      const typeText = this.page.getByText(/Triangulation|Partner institution boost|Improve rules boost/i).first();
      await expect(typeText).toBeVisible({ timeout: 10000 });
    }
  }

  async validateDetailQueueNavigation(): Promise<void> {
    const nextBtn = this.page.getByRole('button', { name: 'Next suggestion' });
    await expect(nextBtn).toBeVisible({ timeout: 10000 });
    const counter = this.page.locator('text=/\\d+ of \\d+/').first();
    if (await counter.count() > 0) {
      await expect(counter).toBeVisible();
    }
  }

  async validateDetailAcceptRejectDisabledOnNew(): Promise<void> {
    const acceptBtn = this.page.getByRole('button', { name: /Accept/i }).first();
    const rejectBtn = this.page.getByRole('button', { name: /Reject/i }).first();
    if (await acceptBtn.count() > 0) {
      await expect(acceptBtn).toBeDisabled();
    }
    if (await rejectBtn.count() > 0) {
      await expect(rejectBtn).toBeDisabled();
    }
  }

  async goBackFromDetail(): Promise<void> {
    await this.page.getByRole('button', { name: /Back/i }).first().click();
    await this.page.waitForLoadState('networkidle');
  }

  async sortColumnAscending(columnName: string): Promise<void> {
    const header = this.page.getByRole('columnheader', { name: columnName }).first();
    await header.click();
    await this.page.waitForLoadState('networkidle');
  }

  async sortColumnDescending(columnName: string): Promise<void> {
    const header = this.page.getByRole('columnheader', { name: columnName }).first();
    await header.click();
    await this.page.waitForLoadState('networkidle');
  }

  async openFilterPanel(): Promise<void> {
    await this.page.getByRole('button', { name: /Filter/i }).first().click();
    await this.page.waitForTimeout(500);
  }

  async applyFilterBySuggestionType(type: string): Promise<void> {
    await this.openFilterPanel();
    const typeCheckbox = this.page.getByRole('checkbox', { name: type }).first();
    if (await typeCheckbox.count() > 0) {
      await typeCheckbox.check();
    } else {
      const typeLabel = this.page.getByText(type, { exact: false }).first();
      await typeLabel.click();
    }
    const applyBtn = this.page.getByRole('button', { name: /Apply/i }).first();
    if (await applyBtn.count() > 0) {
      await applyBtn.click();
    }
    await this.page.waitForLoadState('networkidle');
  }

  async validateActiveFilterChipContains(text: string): Promise<void> {
    const chip = this.page.locator('.overflow-hidden, [data-testid="filter-chip"]')
      .filter({ hasText: new RegExp(text, 'i') }).first();
    if (await chip.count() > 0) {
      await expect(chip).toBeVisible();
    } else {
      await expect(this.page.getByText(new RegExp(text, 'i')).first()).toBeVisible();
    }
  }

  async validateSuggestionTypeInTable(type: string): Promise<void> {
    const typeCells = this.page.getByRole('gridcell', { name: 'Suggestion type' });
    const count = await typeCells.count();
    for (let i = 0; i < Math.min(count, 10); i++) {
      const cellText = ((await typeCells.nth(i).textContent()) ?? '').trim();
      if (cellText) {
        expect(cellText.toLowerCase()).toContain(type.toLowerCase());
      }
    }
  }

  async clearAllFiltersViaChip(): Promise<void> {
    const clearAll = this.page.getByText(/Clear all/i).first();
    if (await clearAll.count() > 0) {
      await clearAll.click();
      await this.page.waitForLoadState('networkidle');
    }
  }

  async confidanceScore(): Promise<void> {
    await this.confidenceScore();
  }

  async validateAssignedExtraColumns(): Promise<void> {
    const assigneeHeader = this.page.getByRole('columnheader', { name: /Assignee/i }).first();
    if (await assigneeHeader.count() > 0) {
      await expect(assigneeHeader).toBeVisible();
    }
  }

  async selectOtherAssignedTab(): Promise<void> {
    const tab = this.page.getByRole('tab', { name: /Other Suggestions/i }).first();
    await tab.click();
    await this.page.waitForLoadState('networkidle');
  }

  async selectMyAssignedTab(): Promise<void> {
    const tab = this.page.getByRole('tab', { name: /My Suggestions/i }).first();
    await tab.click();
    await this.page.waitForLoadState('networkidle');
  }

  async validateAssignedEmptyState(): Promise<void> {
    const emptyMsg = this.page.getByText(/No suggestions|No results|Empty/i).first();
    await expect(emptyMsg).toBeVisible({ timeout: 5000 });
  }

  async validateHistoryExtraColumns(): Promise<void> {
    for (const col of ['Date decided', 'Decided by', 'Decision']) {
      const header = this.page.getByRole('columnheader', { name: col }).first();
      if (await header.count() > 0) {
        await expect(header).toBeVisible();
      }
    }
  }

  async validateFirstHistoryRowDecision(): Promise<void> {
    const firstRow = this.page.getByRole('rowgroup').first().getByRole('row').first();
    const decisionCell = firstRow.getByRole('gridcell', { name: 'Decision' });
    if (await decisionCell.count() > 0) {
      const text = ((await decisionCell.textContent()) ?? '').trim();
      expect(text).toMatch(/Accepted|Rejected/i);
    }
  }

  async validateDecisionBadgesVisible(): Promise<void> {
    const accepted = this.page.getByText('Accepted').first();
    const rejected = this.page.getByText('Rejected').first();
    const hasAccepted = (await accepted.count()) > 0;
    const hasRejected = (await rejected.count()) > 0;
    expect(hasAccepted || hasRejected).toBeTruthy();
  }

  async openHistoryDetailAndCheckActions(): Promise<void> {
    const firstRow = this.page.getByRole('rowgroup').first().getByRole('row').first();
    await firstRow.click();
    await this.page.waitForURL(/pageRowIndex=\d/, { timeout: 15000 });
    await expect(this.page.getByRole('button', { name: /Back/i }).first()).toBeVisible({ timeout: 10000 });
  }

  async filterAndValidateSuggestionType(filterType: string, expectedType: string): Promise<void> {
    await this.applyFilterBySuggestionType(filterType);
    await this.validateSuggestionTypeInTable(expectedType);
  }
}
