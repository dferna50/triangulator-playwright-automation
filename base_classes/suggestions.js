const { expect } = require('@playwright/test');


class SuggestionsPage{
    constructor(page) {
      this.page = page;
    }

    async historyNewActions() {
      await this.page.locator(".min-w-max > div:nth-child(1) > div:nth-child(2) > div > div > p").click();
      await this.page.locator("#dropdown-trigger > button > div").click();
      await expect(this.page.locator("#dropdown-content > .bg-white")).toContainText('Change to reject');
      await expect(this.page.locator("#dropdown-content > .bg-white")).toContainText('Remove decision');
      await expect(this.page.locator("#dropdown-content > .bg-white")).toContainText('Mark as new');
    }
  
    async historyNewActionsReview() {
      await this.page.locator(".min-w-max > div:nth-child(1) > div:nth-child(2) > div > div > p").click();
      await this.page.locator("#dropdown-trigger > button > div").click();
      await expect(this.page.locator("#dropdown-content > .bg-white")).toContainText('Change to reject');
      await expect(this.page.locator("#dropdown-content > .bg-white")).toContainText('Remove decision');
      await expect(this.page.locator("#dropdown-content > .bg-white")).not.toContainText('Mark as new');
    }
  
    async historyNewActionsTriadmin() {
      await this.page.locator(':nth-child(1) > :nth-child(1) > .p-4 > .whitespace-nowrap > .hover\\:opacity-60').click();
      await expect(this.page.locator("#dropdown-content > .bg-white")).not.toBeVisible();
    }
  
    async navigateToNewSuggestionPage() {
      await expect(this.page.locator(':nth-child(4) > .text-grey-600 > .text-center')).toHaveText('My Triangulator');
      await expect(this.page.locator(':nth-child(4) > .text-grey-600 > .text-center')).toBeVisible();
      await this.page.locator(':nth-child(4) > .text-grey-600 > .text-center').click();
      // await expect(this.page.locator('.flex > .font-semibold')).toHaveText('New Suggestions');
      // await expect(this.page.locator(':nth-child(1) > .row-border-bottom > .row > .w-full > div > .rounded-full')).toBeEnabled();
    }
  
    async navigateToAssignedPage() {
      ////await this.page.locator('.px-4 > .relative > .opacity-0').click();
      await expect(this.page.locator(':nth-child(2) > :nth-child(2) > .w-full > .flex-1')).toHaveText(' Assigned ');
      await this.page.locator(':nth-child(2) > :nth-child(2) > .w-full > .flex-1').click();
      await expect(this.page.locator('.flex > .font-semibold').first()).toHaveText('Assigned');
      await expect(this.page.locator('.border-b-primary')).toContainText("My suggestions");
      // await expect(this.page.locator(':nth-child(1) > .row-border-bottom > .row > .w-full > div > .rounded-full')).toBeEnabled();
    }
  
    async navigateToOtherAssignedSuggestions() {
      await this.page.locator('.pt-4 > :nth-child(2)').click();
      await expect(this.page.locator('.border-b-primary')).toContainText("Other suggestions");
      // await expect(this.page.locator(':nth-child(1) > .row-border-bottom > .row > .w-full > div > .rounded-full')).toBeEnabled();
    }
  
    async navigateToHistoryTab() {
      //await this.page.locator('.px-4 > .relative > .opacity-0').click();
      await expect(this.page.locator(':nth-child(2) > :nth-child(3) > .w-full > .flex-1')).toHaveText(' History ');
      await this.page.locator(':nth-child(2) > :nth-child(3) > .w-full > .flex-1').click();
      await expect(this.page.locator('.flex > .font-semibold').first()).toHaveText('History');
      // await expect(this.page.locator('.border-b-primary')).toContainText("My suggestions");
      // await expect(this.page.locator(':nth-child(1) > .row-border-bottom > .row > .w-full > div > .rounded-full')).toBeEnabled();
      // await expect(this.page.locator(':nth-child(1) > .row-border-bottom > .row > .relative > #dropdown-trigger > div > .rounded-full')).toBeEnabled();
    }
  
    async navigateToHistoryTabReviewer() {
      //await this.page.locator('.px-4 > .relative > .opacity-0').click();
      await expect(this.page.locator('ul > :nth-child(2) > .w-full > .flex-1')).toHaveText(' History ');
      await this.page.locator('ul > :nth-child(2) > .w-full > .flex-1').click();
      await expect(this.page.locator('.flex > .font-semibold').nth(0)).toHaveText('History');
    }
  
    async newSuggestionSorting(sort) {
      await this.page.locator(':nth-child(2) > [style="width: 26rem;"] > .relative > #dropdown-trigger > .p-4').click();
      await this.page.locator(':nth-child(' + sort + ') > .block').click();
      // await expect(this.page.locator(':nth-child(1) > .row-border-bottom > .row > .w-full > div > .rounded-full')).toBeEnabled();
      await this.page.locator(':nth-child(3) > [style="width: 10rem;"] > .relative > #dropdown-trigger > .p-4').click();
      await this.page.locator(':nth-child(' + sort + ') > .block').click();
      // await expect(this.page.locator(':nth-child(1) > .row-border-bottom > .row > .w-full > div > .rounded-full')).toBeEnabled();
      await this.page.locator(':nth-child(4) > [style="width: 16rem;"] > .relative > #dropdown-trigger > .p-4').click();
      await this.page.locator(':nth-child(' + sort + ') > .block').click();
      // await expect(this.page.locator(':nth-child(1) > .row-border-bottom > .row > .w-full > div > .rounded-full')).toBeEnabled();
      // await this.page.locator(':nth-child(5) > [style="width: 16rem;"] > .relative > #dropdown-trigger > .p-4').click();
      // await this.page.locator(':nth-child(' + sort + ') > .block').click();
      // // await expect(this.page.locator(':nth-child(1) > .row-border-bottom > .row > .w-full > div > .rounded-full')).toBeEnabled();
      // await this.page.locator(':nth-child(6) > [style="width: 12rem;"] > .max-w-full > #dropdown-trigger > .p-4').click();
      // await this.page.locator(':nth-child(' + sort + ') > .block').click();
      // // await expect(this.page.locator(':nth-child(1) > .row-border-bottom > .row > .w-full > div > .rounded-full')).toBeEnabled();
      // await this.page.locator(':nth-child(7) > [style="width: 14rem;"] > .relative > #dropdown-trigger > .p-4').click();
      // await this.page.locator(':nth-child(' + sort + ') > .block').click();
      // // await expect(this.page.locator(':nth-child(1) > .row-border-bottom > .row > .w-full > div > .rounded-full')).toBeEnabled();
      // await this.page.locator(':nth-child(8) > [style="width: 16rem;"] > .relative > #dropdown-trigger > .p-4').click();
      // await this.page.locator(':nth-child(' + sort + ') > .block').click();
      // // await expect(this.page.locator(':nth-child(1) > .row-border-bottom > .row > .w-full > div > .rounded-full')).toBeEnabled();
      // await this.page.locator(':nth-child(9) > [style="width: 12rem;"] > .relative > #dropdown-trigger > .p-4').click();
      // await this.page.locator(':nth-child(' + sort + ') > .block').click();
      // await expect(this.page.locator(':nth-child(1) > .row-border-bottom > .row > .w-full > div > .rounded-full')).toBeEnabled();
      await this.page.locator('[style="width: 8rem;"] > .relative > #dropdown-trigger > .p-4').click();
      await this.page.locator(':nth-child(' + sort + ') > .block').click();
      // await expect(this.page.locator(':nth-child(1) > .row-border-bottom > .row > .w-full > div > .rounded-full')).toBeEnabled();
      await this.page.locator(':nth-child(11) > [style="width: 16rem;"] > .relative > #dropdown-trigger > .p-4').click();
      await this.page.locator(':nth-child(' + sort + ') > .block').click();
      // await expect(this.page.locator(':nth-child(1) > .row-border-bottom > .row > .w-full > div > .rounded-full')).toBeEnabled();
      await this.page.locator(':nth-child(12) > [style="width: 16rem;"] > .relative > #dropdown-trigger > .p-4').click();
      await this.page.locator(':nth-child(' + sort + ') > .block').click();
      // await expect(this.page.locator(':nth-child(1) > .row-border-bottom > .row > .w-full > div > .rounded-full')).toBeEnabled();
      await this.page.locator(':nth-child(13) > [style="width: 14rem;"] > .relative > #dropdown-trigger > .p-4').click();
      await this.page.locator(':nth-child(' + sort + ') > .block').click();
      // await expect(this.page.locator(':nth-child(1) > .row-border-bottom > .row > .w-full > div > .rounded-full')).toBeEnabled();
      await this.page.locator(':nth-child(14) > [style="width: 16rem;"] > .relative > #dropdown-trigger > .p-4').click();
      await this.page.locator(':nth-child(' + sort + ') > .block').click();
      // await expect(this.page.locator(':nth-child(1) > .row-border-bottom > .row > .w-full > div > .rounded-full')).toBeEnabled();
      await this.page.locator(':nth-child(15) > [style="width: 16rem;"] > .relative > #dropdown-trigger > .p-4').click();
      await this.page.locator(':nth-child(' + sort + ') > .block').click();
      // await expect(this.page.locator(':nth-child(1) > .row-border-bottom > .row > .w-full > div > .rounded-full')).toBeEnabled();
      await this.page.locator(':nth-child(16) > [style="width: 26rem;"] > .relative > #dropdown-trigger > .p-4').click();
      await this.page.locator(':nth-child(' + sort + ') > .block').click();
      // await expect(this.page.locator(':nth-child(1) > .row-border-bottom > .row > .w-full > div > .rounded-full')).toBeEnabled();
      await this.page.locator(':nth-child(17) > [style="width: 10rem;"] > .relative > #dropdown-trigger > .p-4').click();
      await this.page.locator(':nth-child(' + sort + ') > .block').click();
      // await expect(this.page.locator(':nth-child(1) > .row-border-bottom > .row > .w-full > div > .rounded-full')).toBeEnabled();
      await this.page.locator(':nth-child(18) > [style="width: 16rem;"] > .relative > #dropdown-trigger > .p-4').click();
      await this.page.locator(':nth-child(' + sort + ') > .block').click();
      // await expect(this.page.locator(':nth-child(1) > .row-border-bottom > .row > .w-full > div > .rounded-full')).toBeEnabled();
      await this.page.locator(':nth-child(19) > [style="width: 14rem;"] > .relative > #dropdown-trigger > .p-4').click();
      await this.page.locator(':nth-child(' + sort + ') > .block').click();
      // await expect(this.page.locator(':nth-child(1) > .row-border-bottom > .row > .w-full > div > .rounded-full')).toBeEnabled();
      await this.page.locator(':nth-child(20) > [style="width: 14rem;"] > .relative > #dropdown-trigger > .p-4').click();
      await this.page.locator(':nth-child(' + sort + ') > .block').click();
      // await expect(this.page.locator(':nth-child(1) > .row-border-bottom > .row > .w-full > div > .rounded-full')).toBeEnabled();
      await this.page.locator(':nth-child(21) > [style="width: 14rem;"] > .relative > #dropdown-trigger > .p-4').click();
      await this.page.locator(':nth-child(' + sort + ') > .block').click();
      // await expect(this.page.locator(':nth-child(1) > .row-border-bottom > .row > .w-full > div > .rounded-full')).toBeEnabled();
      await this.page.locator(':nth-child(22) > [style="width: 12rem;"] > .relative > #dropdown-trigger > .p-4').click();
      await this.page.locator(':nth-child(' + sort + ') > .block').click();
      // await expect(this.page.locator(':nth-child(1) > .row-border-bottom > .row > .w-full > div > .rounded-full')).toBeEnabled();
      await this.page.locator(':nth-child(23) > [style="width: 12rem;"] > .relative > #dropdown-trigger > .p-4').click();
      await this.page.locator(':nth-child(' + sort + ') > .block').click();
      // await expect(this.page.locator(':nth-child(1) > .row-border-bottom > .row > .w-full > div > .rounded-full')).toBeEnabled();
    }
  
    async historySuggestionSorting( sort) {
      await this.page.locator(':nth-child(2) > [style="width: 26rem;"] > .relative > #dropdown-trigger > .p-4').click();
      await this.page.locator(':nth-child(' + sort + ') > .block').click();
      // await expect(this.page.locator(':nth-child(1) > .row-border-bottom > .row > .relative > #dropdown-trigger > div > .rounded-full')).toBeEnabled();
      await this.page.locator(':nth-child(3) > [style="width: 10rem;"] > .relative > #dropdown-trigger > .p-4').click();
      await this.page.locator(':nth-child(' + sort + ') > .block').click();
      // await expect(this.page.locator(':nth-child(1) > .row-border-bottom > .row > .relative > #dropdown-trigger > div > .rounded-full')).toBeEnabled();
      await this.page.locator(':nth-child(4) > [style="width: 16rem;"] > .relative > #dropdown-trigger > .p-4').click();
      await this.page.locator(':nth-child(' + sort + ') > .block').click();
      // await expect(this.page.locator(':nth-child(1) > .row-border-bottom > .row > .relative > #dropdown-trigger > div > .rounded-full')).toBeEnabled();
      await this.page.locator(':nth-child(5) > [style="width: 16rem;"] > .relative > #dropdown-trigger > .p-4').click();
      await this.page.locator(':nth-child(' + sort + ') > .block').click();
      // await expect(this.page.locator(':nth-child(1) > .row-border-bottom > .row > .relative > #dropdown-trigger > div > .rounded-full')).toBeEnabled();
      await this.page.locator(':nth-child(6) > [style="width: 12rem;"] > .max-w-full > #dropdown-trigger > .p-4').click();
      await this.page.locator(':nth-child(' + sort + ') > .block').click();
      // await expect(this.page.locator(':nth-child(1) > .row-border-bottom > .row > .relative > #dropdown-trigger > div > .rounded-full')).toBeEnabled();
      await this.page.locator(':nth-child(7) > [style="width: 14rem;"] > .relative > #dropdown-trigger > .p-4').click();
    await this.page.locator(':nth-child(' + sort + ') > .block').click();
    // await expect(this.page.locator(':nth-child(1) > .row-border-bottom > .row > .relative > #dropdown-trigger > div > .rounded-full')).toBeEnabled();
    await this.page.locator(':nth-child(8) > [style="width: 16rem;"] > .relative > #dropdown-trigger > .p-4').click();
    await this.page.locator(':nth-child(' + sort + ') > .block').click();
    // await expect(this.page.locator(':nth-child(1) > .row-border-bottom > .row > .relative > #dropdown-trigger > div > .rounded-full')).toBeEnabled();
    await this.page.locator(':nth-child(9) > [style="width: 12rem;"] > .relative > #dropdown-trigger > .p-4').click();
    await this.page.locator(':nth-child(' + sort + ') > .block').click();
    // await expect(this.page.locator(':nth-child(1) > .row-border-bottom > .row > .relative > #dropdown-trigger > div > .rounded-full')).toBeEnabled();
    await this.page.locator('[style="width: 8rem;"] > .relative > #dropdown-trigger > .p-4').click();
    await this.page.locator(':nth-child(' + sort + ') > .block').click();
    // await expect(this.page.locator(':nth-child(1) > .row-border-bottom > .row > .relative > #dropdown-trigger > div > .rounded-full')).toBeEnabled();
    await this.page.locator(':nth-child(11) > [style="width: 16rem;"] > .relative > #dropdown-trigger > .p-4').click();
    await this.page.locator(':nth-child(' + sort + ') > .block').click();
    // await expect(this.page.locator(':nth-child(1) > .row-border-bottom > .row > .relative > #dropdown-trigger > div > .rounded-full')).toBeEnabled();
    await this.page.locator(':nth-child(12) > [style="width: 16rem;"] > .relative > #dropdown-trigger > .p-4').click();
    await this.page.locator(':nth-child(' + sort + ') > .block').click();
    // await expect(this.page.locator(':nth-child(1) > .row-border-bottom > .row > .relative > #dropdown-trigger > div > .rounded-full')).toBeEnabled();
    await this.page.locator(':nth-child(13) > [style="width: 14rem;"] > .relative > #dropdown-trigger > .p-4').click();
    await this.page.locator(':nth-child(' + sort + ') > .block').click();
    // await expect(this.page.locator(':nth-child(1) > .row-border-bottom > .row > .relative > #dropdown-trigger > div > .rounded-full')).toBeEnabled();
    await this.page.locator(':nth-child(14) > [style="width: 16rem;"] > .relative > #dropdown-trigger > .p-4').click();
    await this.page.locator(':nth-child(' + sort + ') > .block').click();
    // await expect(this.page.locator(':nth-child(1) > .row-border-bottom > .row > .relative > #dropdown-trigger > div > .rounded-full')).toBeEnabled();
    await this.page.locator(':nth-child(15) > [style="width: 16rem;"] > .relative > #dropdown-trigger > .p-4').click();
    await this.page.locator(':nth-child(' + sort + ') > .block').click();
    // await expect(this.page.locator(':nth-child(1) > .row-border-bottom > .row > .relative > #dropdown-trigger > div > .rounded-full')).toBeEnabled();
    await this.page.locator(':nth-child(16) > [style="width: 26rem;"] > .relative > #dropdown-trigger > .p-4').click();
    await this.page.locator(':nth-child(' + sort + ') > .block').click();
    // await expect(this.page.locator(':nth-child(1) > .row-border-bottom > .row > .relative > #dropdown-trigger > div > .rounded-full')).toBeEnabled();
    await this.page.locator(':nth-child(17) > [style="width: 10rem;"] > .relative > #dropdown-trigger > .p-4').click();
    await this.page.locator(':nth-child(' + sort + ') > .block').click();
    // await expect(this.page.locator(':nth-child(1) > .row-border-bottom > .row > .relative > #dropdown-trigger > div > .rounded-full')).toBeEnabled();
    await this.page.locator(':nth-child(18) > [style="width: 16rem;"] > .relative > #dropdown-trigger > .p-4').click();
    await this.page.locator(':nth-child(' + sort + ') > .block').click();
    // await expect(this.page.locator(':nth-child(1) > .row-border-bottom > .row > .relative > #dropdown-trigger > div > .rounded-full')).toBeEnabled();
    await this.page.locator(':nth-child(19) > [style="width: 14rem;"] > .relative > #dropdown-trigger > .p-4').click();
    await this.page.locator(':nth-child(' + sort + ') > .block').click();
    // await expect(this.page.locator(':nth-child(1) > .row-border-bottom > .row > .relative > #dropdown-trigger > div > .rounded-full')).toBeEnabled();
    await this.page.locator(':nth-child(20) > [style="width: 14rem;"] > .relative > #dropdown-trigger > .p-4').click();
    await this.page.locator(':nth-child(' + sort + ') > .block').click();
    // await expect(this.page.locator(':nth-child(1) > .row-border-bottom > .row > .relative > #dropdown-trigger > div > .rounded-full')).toBeEnabled();
    await this.page.locator(':nth-child(21) > [style="width: 14rem;"] > .relative > #dropdown-trigger > .p-4').click();
    await this.page.locator(':nth-child(' + sort + ') > .block').click();
    // await expect(this.page.locator(':nth-child(1) > .row-border-bottom > .row > .relative > #dropdown-trigger > div > .rounded-full')).toBeEnabled();
    await this.page.locator(':nth-child(22) > [style="width: 12rem;"] > .relative > #dropdown-trigger > .p-4').click();
    await this.page.locator(':nth-child(' + sort + ') > .block').click();
    // await expect(this.page.locator(':nth-child(1) > .row-border-bottom > .row > .relative > #dropdown-trigger > div > .rounded-full')).toBeEnabled();
    await this.page.locator(':nth-child(23) > [style="width: 12rem;"] > .relative > #dropdown-trigger > .p-4').click();
    await this.page.locator(':nth-child(' + sort + ') > .block').click();
    // await expect(this.page.locator(':nth-child(1) > .row-border-bottom > .row > .relative > #dropdown-trigger > div > .rounded-full')).toBeEnabled();
  }

  async dateRange() {
    await this.page.locator(':nth-child(2) > [aria-hidden="false"] > .rounded-full > .w-6').click();
    await this.page.locator('#dialog-title').hasText('Filter suggestions');
    await this.page.locator('#date-range-input').click();
    await this.page.locator('#date-range-input').press('ArrowDown');
    await this.page.locator('#date-range-input').press('Enter');
    await this.page.locator(':nth-child(2) > .relative > .opacity-0 > .inline-block').click();
    await expect(this.page.locator('.justify-between > div.overflow-hidden > .overflow-hidden')).toBeVisible();
    await expect(this.page.locator('.justify-between > div.overflow-hidden > .overflow-hidden')).toHaveText('Date Range: Today');
    await this.page.locator('.text-white > .w-4').click();
    // await expect(this.page.locator(':nth-child(1) > .row-border-bottom > .row > .w-full > div > .rounded-full')).toBeEnabled();
    await this.page.locator(':nth-child(2) > [aria-hidden="false"] > .rounded-full > .w-6').click();
    await this.page.locator('#date-range-input').click();
    await this.page.locator('#date-range-input').press('ArrowDown');
    await this.page.locator('#date-range-input').press('ArrowDown');
    await this.page.locator('#date-range-input').press('Enter');
    await this.page.locator(':nth-child(2) > .relative > .opacity-0 > .inline-block').click();
    await expect(this.page.locator('.justify-between > div.overflow-hidden > .overflow-hidden')).toBeVisible();
    await expect(this.page.locator('.justify-between > div.overflow-hidden > .overflow-hidden')).toHaveText('Date Range: This Week');
    await this.page.locator('.text-white > .w-4').click();
    await expect(this.page.locator(':nth-child(1) > .row-border-bottom > .row > .w-full > div > .rounded-full > .w-4')).toBeVisible();
    await this.page.locator(':nth-child(2) > div > .rounded-full > .w-6').click();
    await this.page.locator('#date-range-input').click();
    await this.page.locator('#date-range-input').press('ArrowDown');
    await this.page.locator('#date-range-input').press('ArrowDown');
    await this.page.locator('#date-range-input').press('ArrowDown');
    await this.page.locator('#date-range-input').press('Enter');
    await this.page.locator(':nth-child(2) > .relative > .opacity-0 > .inline-block').click();
    await expect(this.page.locator('.justify-between > div.overflow-hidden > .overflow-hidden')).toBeVisible();
    await expect(this.page.locator('.justify-between > div.overflow-hidden > .overflow-hidden')).toHaveText('Date Range: This Month');
    // await expect(this.page.locator(':nth-child(1) > .row-border-bottom > .row > .w-full > div > .rounded-full')).toBeEnabled();
    await this.page.locator('.focus\\:outline-none > .w-4 > path').click();
    // await expect(this.page.locator(':nth-child(1) > .row-border-bottom > .row > .w-full > div > .rounded-full')).toBeEnabled();
    await this.page.locator(':nth-child(2) > [aria-hidden="false"] > .rounded-full > .w-6').click();
    await this.page.locator('#date-range-input').click();
    await this.page.locator('#date-range-input').press('ArrowDown');
    await this.page.locator('#date-range-input').press('ArrowDown');
    await this.page.locator('#date-range-input').press('ArrowDown');
    await this.page.locator('#date-range-input').press('ArrowDown');
    await this.page.locator('#date-range-input').press('Enter');
    await this.page.locator(':nth-child(2) > .relative > .opacity-0 > .inline-block').click();
    await expect(this.page.locator('.justify-between > div.overflow-hidden > .overflow-hidden')).toBeVisible();
    await expect(this.page.locator('.justify-between > div.overflow-hidden > .overflow-hidden')).toHaveText('Date Range: This Quarter');
    // await expect(this.page.locator(':nth-child(1) > .row-border-bottom > .row > .w-full > div > .rounded-full')).toBeEnabled();
    await this.page.locator('.flex-wrap > .underline').click();
    await this.page.locator(':nth-child(2) > div > .rounded-full > .w-6').click();
    await this.page.locator('#date-range-input').click();
    await this.page.locator('#date-range-input').press('ArrowDown');
    await this.page.locator('#date-range-input').press('ArrowDown');
    await this.page.locator('#date-range-input').press('ArrowDown');
    await this.page.locator('#date-range-input').press('ArrowDown');
    await this.page.locator('#date-range-input').press('ArrowDown');
    await this.page.locator('#date-range-input').press('Enter');
    await this.page.locator(':nth-child(2) > .relative > .opacity-0').click();
    await expect(this.page.locator('.justify-between > div.overflow-hidden > .overflow-hidden')).toBeVisible();
    await expect(this.page.locator('.justify-between > div.overflow-hidden > .overflow-hidden')).toHaveText('Date Range: This Year');
    // await expect(this.page.locator(':nth-child(1) > .row-border-bottom > .row > .w-full > div > .rounded-full')).toBeEnabled();
    await this.page.locator('.flex-wrap > .underline').click();
    // await expect(this.page.locator(':nth-child(1) > .row-border-bottom > .row > .w-full > div > .rounded-full')).toBeEnabled();
  }

  async confidanceScore() {
    await this.page.locator(':nth-child(2) > [aria-hidden="false"] > .rounded-full > .w-6').click();
    await this.page.locator('#date-range-input').click();
    await this.page.locator('#date-range-input').press('Tab');
    await this.page.locator('#date-range-input').press('Enter');
    await this.page.locator('#date-range-input').press('ArrowDown');
    await this.page.locator('#date-range-input').press('Enter');
    await this.page.locator(':nth-child(2) > .relative > .opacity-0').click();
    await expect(this.page.locator('.justify-between > div.overflow-hidden > .overflow-hidden')).toHaveText('Confidence Score: <40%');
    await this.page.locator('.underline').click();
    // await expect(this.page.locator(':nth-child(1) > .row-border-bottom > .row > .w-full > div > .rounded-full')).toBeEnabled();
    await this.page.locator(':nth-child(2) > div > .rounded-full > .w-6').click();
    await this.page.locator('#date-range-input').click();
    await this.page.locator('#date-range-input').press('Tab');
    await this.page.locator('#date-range-input').press('Enter');
    await this.page.locator('#date-range-input').press('ArrowDown');
    await this.page.locator('#date-range-input').press('ArrowDown');
    await this.page.locator('#date-range-input').press('Enter');
    await this.page.locator(':nth-child(2) > .relative > .opacity-0').click();
    await expect(this.page.locator('.justify-between > div.overflow-hidden > .overflow-hidden')).toHaveText('Confidence Score: 40%-60%');
    await this.page.locator('.underline').click();
    // await expect(this.page.locator(':nth-child(1) > .row-border-bottom > .row > .w-full > div > .rounded-full')).toBeEnabled();
    await this.page.locator(':nth-child(2) > [aria-hidden="false"] > .rounded-full > .w-6').click();
    await this.page.locator('#date-range-input').click();
    await this.page.locator('#date-range-input').press('Tab');
    await this.page.locator('#date-range-input').press('Enter');
    await this.page.locator('#date-range-input').press('ArrowDown');
    await this.page.locator('#date-range-input').press('ArrowDown');
    await this.page.locator('#date-range-input').press('ArrowDown');
    await this.page.locator('#date-range-input').press('Enter');
    await this.page.locator(':nth-child(2) > .relative > .opacity-0').click();
    await expect(this.page.locator('.justify-between > div.overflow-hidden > .overflow-hidden')).toHaveText('Confidence Score: 60%-80%');
    // await expect(this.page.locator(':nth-child(1) > .row-border-bottom > .row > .w-full > div > .rounded-full')).toBeEnabled();
    await this.page.locator('.text-white > .w-4').click();
    await this.page.locator(':nth-child(2) > div > .rounded-full > .w-6').click();
    await this.page.locator('#date-range-input').click();
    await this.page.locator('#date-range-input').press('Tab');
    await this.page.locator('#date-range-input').press('Enter');
    await this.page.locator('#date-range-input').press('ArrowDown');
    await this.page.locator('#date-range-input').press('ArrowDown');
    await this.page.locator('#date-range-input').press('ArrowDown');
    await this.page.locator('#date-range-input').press('ArrowDown');
    await this.page.locator('#date-range-input').press('Enter');
    await this.page.locator(':nth-child(2) > .relative > .opacity-0').click();
    await expect(this.page.locator('.justify-between > div.overflow-hidden > .overflow-hidden')).toHaveText('Confidence Score: 80%-100%');
    // await expect(this.page.locator(':nth-child(1) > .row-border-bottom > .row > .w-full > div > .rounded-full')).toBeEnabled();
    await this.page.locator('.flex-wrap > .underline').click();
    // await expect(this.page.locator(':nth-child(1) > .row-border-bottom > .row > .w-full > div > .rounded-full')).toBeEnabled();
  }

  async stateFilter() {
    await this.page.locator(':nth-child(2) > [aria-hidden="false"] > .rounded-full > .w-6').click();
    await this.page.locator('#date-range-input').click();
    await this.page.locator('#date-range-input').press('Tab');
    await this.page.locator('#date-range-input').press('Tab');
    await this.page.locator('#date-range-input').press('Enter');
    await this.page.locator('#date-range-input').type('arizona');
    await this.page.locator('#date-range-input').press('ArrowDown');
    await this.page.locator('#date-range-input').press('Enter');
    await this.page.locator('#date-range-input').type('nevada');
    await this.page.locator('#date-range-input').press('ArrowDown');
    await this.page.locator('#date-range-input').press('Enter');
    await this.page.locator('#date-range-input').type('texas');
    await this.page.locator('#date-range-input').press('ArrowDown');
    await this.page.locator('#date-range-input').press('Enter');
    await this.page.locator('#date-range-input').type('california');
    await this.page.locator('#date-range-input').press('ArrowDown');
    await this.page.locator('#date-range-input').press('Enter');
    await this.page.locator(':nth-child(2) > .relative > .opacity-0').click();
    await expect(this.page.locator('.justify-between > div.overflow-hidden > .overflow-hidden')).toContainText('California');
    // await expect(this.page.locator(':nth-child(1) > .row-border-bottom > .row > .w-full > div > .rounded-full')).toBeEnabled();
    await this.page.locator('.flex-wrap > .underline').click();
    // await expect(this.page.locator(':nth-child(1) > .row-border-bottom > .row > .w-full > div > .rounded-full')).toBeEnabled();
  }

  async sourceLevel() {
    await this.page.locator(':nth-child(2) > [aria-hidden="false"] > .rounded-full > .w-6').click();
    await this.page.locator('#date-range-input').click();
    await this.page.locator('#date-range-input').press('Tab');
    await this.page.locator('#date-range-input').press('Tab');
    await this.page.locator('#date-range-input').press('Tab');
    await this.page.locator('#date-range-input').press('Enter');
    await this.page.locator('#date-range-input').press('ArrowDown');
    await this.page.locator('#date-range-input').press('Enter');
    await this.page.locator('#date-range-input').press('ArrowDown');
    await this.page.locator('#date-range-input').press('ArrowDown');
    await this.page.locator('#date-range-input').press('Enter');
    await this.page.locator(':nth-child(2) > .relative > .opacity-0').click();
    await expect(this.page.locator('.justify-between > div.overflow-hidden > .overflow-hidden')).toContainText('Four or more years');
    // await expect(this.page.locator(':nth-child(1) > .row-border-bottom > .row > .w-full > div > .rounded-full')).toBeEnabled();
    await this.page.locator('.flex-wrap > .underline').click();
    // await expect(this.page.locator(':nth-child(1) > .row-border-bottom > .row > .w-full > div > .rounded-full')).toBeEnabled();
  }

  async institutionFilter() {
    await this.page.locator(':nth-child(2) > [aria-hidden="false"] > .rounded-full > .w-6').click();
    await this.page.locator('#date-range-input').click();
    await this.page.locator('#date-range-input').press('Tab');
    await this.page.locator('#date-range-input').press('Tab');
    await this.page.locator('#date-range-input').press('Tab');
    await this.page.locator('#date-range-input').press('Tab');
    await this.page.locator('#date-range-input').press('Enter');
    await this.page.waitForTimeout(10000);
    await this.page.locator('#date-range-input').press('ArrowDown');
    await this.page.locator('#date-range-input').press('Enter');
    // await this.page.locator('#date-range-input').type("{enter}{downarrow}{downarrow}{enter}").type("{enter}{downarrow}{enter}")
    await this.page.locator(':nth-child(2) > .relative > .opacity-0').click();
    // await expect(this.page.locator('.justify-between > div.overflow-hidden > .overflow-hidden')).toContainText('American');
    // await expect(this.page.locator(':nth-child(1) > .row-border-bottom > .row > .w-full > div > .rounded-full')).toBeEnabled();
    await this.page.locator('.flex-wrap > .underline').click();
    // await expect(this.page.locator(':nth-child(1) > .row-border-bottom > .row > .w-full > div > .rounded-full')).toBeEnabled();
  }

  async subjectFilter() {
    await this.page.locator(':nth-child(2) > [aria-hidden="false"] > .rounded-full > .w-6').click();
    await this.page.locator('#date-range-input').click();
    await this.page.locator('#date-range-input').press('Tab');
    await this.page.locator('#date-range-input').press('Tab');
    await this.page.locator('#date-range-input').press('Tab');
    await this.page.locator('#date-range-input').press('Tab');
    await this.page.locator('#date-range-input').press('Tab');
    await this.page.locator('#date-range-input').type('EN');
    await this.page.locator(':nth-child(2) > .relative > .opacity-0').click();
    await expect(this.page.locator('.justify-between > div.overflow-hidden > .overflow-hidden')).toContainText('EN');
    // await expect(this.page.locator(':nth-child(1) > .row-border-bottom > .row > .w-full > div > .rounded-full')).toBeEnabled();
    await this.page.locator('.flex-wrap > .underline').click();
    // await expect(this.page.locator(':nth-child(1) > .row-border-bottom > .row > .w-full > div > .rounded-full')).toBeEnabled();
  }

  async numberFilter() {
    await this.page.locator(':nth-child(2) > [aria-hidden="false"] > .rounded-full > .w-6').click();
    await this.page.locator('#date-range-input').click();
    await this.page.locator('#date-range-input').press('Tab');
    await this.page.locator('#date-range-input').press('Tab');
    await this.page.locator('#date-range-input').press('Tab');
    await this.page.locator('#date-range-input').press('Tab');
    await this.page.locator('#date-range-input').press('Tab');
    await this.page.locator('#date-range-input').press('Tab');
    await this.page.locator('#date-range-input').type('10');
    await this.page.locator(':nth-child(2) > .relative > .opacity-0').click();
    await expect(this.page.locator('.justify-between > div.overflow-hidden > .overflow-hidden')).toContainText('10');
    // await expect(this.page.locator(':nth-child(1) > .row-border-bottom > .row > .w-full > div > .rounded-full')).toBeEnabled();
    await this.page.locator('.flex-wrap > .underline').click();
    // await expect(this.page.locator(':nth-child(1) > .row-border-bottom > .row > .w-full > div > .rounded-full')).toBeEnabled();
  }

  async assignSuggestion() {
    let precount = 0;
    let postcount = 0;
    //await this.page.locator('.px-4 > .relative > .opacity-0').click();
    const preCountElement = await this.page.locator('.bg-primary').textContent();
    precount = parseInt(preCountElement);

    await this.page.locator('.w-72 > :nth-child(2) > :nth-child(1) > .w-full').click();
    await this.page.locator(':nth-child(1) > .row-border-bottom > .row > .w-full > div > .rounded-full').click();
    await this.page.locator('.rounded-md > .flex-1 > .justify-center').click();
    await this.page.locator('.rounded-md > .flex-1 > .justify-center').press('ArrowDown');
    await this.page.locator('.rounded-md > .flex-1 > .justify-center').press('Enter');
    await this.page.locator(':nth-child(2) > .relative > .opacity-0').click();
    await expect(this.page.locator('text=Reassigned')).toBeVisible();
    await this.page.waitForTimeout(2000);
    //await this.page.locator('.px-4 > .relative > .opacity-0').click();
    const postCountElement = await this.page.locator('.bg-primary').textContent();
    postcount = parseInt(postCountElement);
    expect(postcount).toEqual(precount + 1);
  }

  async assignSuggestionMultiple() {
    let precount = 0;
    let postcount = 0;
    //await this.page.locator('.px-4 > .relative > .opacity-0').click();
    const preCountElement = await this.page.locator('.bg-primary').textContent();
    precount = parseInt(preCountElement);

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
    //await this.page.locator('.px-4 > .relative > .opacity-0').click();
    const postCountElement = await this.page.locator('.bg-primary').textContent();
    postcount = parseInt(postCountElement);
    expect(postcount).toEqual(precount + 3);
  }

  async acceptSuggestion() {
    let precount = 0;
    let postcount = 0;
    const preCountElement = await this.page.locator('.border-b-primary > .bg-gray-500').textContent();
    precount = parseInt(preCountElement);

    await this.page.locator(':nth-child(1) > .row-border-bottom > .row > .justify-end > :nth-child(3) > .rounded-full').click();
    await expect(this.page.locator(':nth-child(1) > .row-border-bottom > .row > .w-full > div > .rounded-full')).toBeEnabled();
    await this.page.waitForTimeout(5000);
    const postCountElement = await this.page.locator('.border-b-primary > .bg-gray-500').textContent();
    postcount = parseInt(postCountElement);
    expect(postcount).toEqual(precount - 1);
  }

  async acceptSuggestionMultiple() {
    let precount = 0;
    let postcount = 0;
    const preCountElement = await this.page.locator('.border-b-primary > .bg-gray-500').textContent();
    precount = parseInt(preCountElement);

    await this.page.locator('.min-w-max > :nth-child(1) > :nth-child(1) > .h-\\[52px\\]').click();
    await this.page.locator('.min-w-max > :nth-child(2) > :nth-child(1) > .h-\\[52px\\]').click();
    await this.page.locator('.min-w-max > :nth-child(3) > :nth-child(1) > .h-\\[52px\\]').click();
    await this.page.locator('[aria-label="Approve selected items"]').click();
    await expect(this.page.locator(':nth-child(1) > .row-border-bottom > .row > .w-full > div > .rounded-full')).toBeEnabled();
    await this.page.waitForTimeout(5000);
    const postCountElement = await this.page.locator('.border-b-primary > .bg-gray-500').textContent();
    postcount = parseInt(postCountElement);
    expect(postcount).toEqual(precount - 3);
  }

  async rejectSuggestion() {
    let precount = 0;
    let postcount = 0;
    const preCountElement = await this.page.locator('.border-b-primary > .bg-gray-500').textContent();
    precount = parseInt(preCountElement);

    await this.page.locator(':nth-child(1) > .row-border-bottom > .row > .justify-end > :nth-child(2) > .rounded-full').click();
    await this.page.locator(':nth-child(3) > .w-full > :nth-child(10)').click();
    await this.page.locator(':nth-child(2) > .relative > .opacity-0').click();
    await expect(this.page.locator('text=Rejected')).toBeVisible();
    await expect(this.page.locator(':nth-child(1) > .row-border-bottom > .row > .w-full > div > .rounded-full')).toBeEnabled();
    await this.page.waitForTimeout(5000);
    const postCountElement = await this.page.locator('.border-b-primary > .bg-gray-500').textContent();
    postcount = parseInt(postCountElement);
    expect(postcount).toEqual(precount - 1);
  }

  async rejectSuggestionMultiple() {
    let precount = 0;
    let postcount = 0;
    const preCountElement = await this.page.locator('.border-b-primary > .bg-gray-500').textContent();
    precount = parseInt(preCountElement);

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
    postcount = parseInt(postCountElement);
    expect(postcount).toEqual(precount - 3);
  }

  async suggestiontypefilter() {
    await this.page.locator(':nth-child(2) > [aria-hidden="false"] > .rounded-full > .w-6').click();
    await this.page.locator('#date-range-input').click();
    await this.page.locator('#date-range-input').press('Tab');
    await this.page.locator('#date-range-input').press('Tab');
    await this.page.locator('#date-range-input').press('Tab');
    await this.page.locator('#date-range-input').press('Tab');
    await this.page.locator('#date-range-input').press('Tab');
    await this.page.locator('#date-range-input').press('Tab');
    await this.page.locator('#date-range-input').press('Tab');
    await this.page.locator('#date-range-input').press('Tab');
    await this.page.locator('#date-range-input').press('Tab');
    await this.page.locator('#date-range-input').press('Tab');
    await this.page.locator('#date-range-input').press('Enter');
    await this.page.locator('#date-range-input').press('ArrowDown');
    await this.page.locator('#date-range-input').press('Enter');
    await this.page.locator(':nth-child(2) > .relative > .opacity-0').click();
    await expect(this.page.locator('.justify-between > div.overflow-hidden > .overflow-hidden')).toContainText('Triangulation');
    // await expect(this.page.locator("text=Random")).toBeVisible();
    // await expect(this.page.locator(':nth-child(1) > .row-border-bottom > .row > .w-full > div > .rounded-full')).toBeEnabled();
    await this.page.locator('.flex-wrap > .underline').click();
    // await expect(this.page.locator(':nth-child(1) > .row-border-bottom > .row > .w-full > div > .rounded-full')).toBeEnabled();
    await this.page.locator(':nth-child(2) > [aria-hidden="false"] > .rounded-full > .w-6').click();
    await this.page.locator('#date-range-input').click();
    await this.page.locator('#date-range-input').press('Tab');
    await this.page.locator('#date-range-input').press('Tab');
    await this.page.locator('#date-range-input').press('Tab');
    await this.page.locator('#date-range-input').press('Tab');
    await this.page.locator('#date-range-input').press('Tab');
    await this.page.locator('#date-range-input').press('Tab');
    await this.page.locator('#date-range-input').press('Tab');
    await this.page.locator('#date-range-input').press('Tab');
    await this.page.locator('#date-range-input').press('Tab');
    await this.page.locator('#date-range-input').press('Tab');
    await this.page.locator('#date-range-input').press('Enter');
    await this.page.locator('#date-range-input').press('ArrowDown');
    await this.page.locator('#date-range-input').press('ArrowDown');
    await this.page.locator('#date-range-input').press('Enter');
    await this.page.locator(':nth-child(2) > .relative > .opacity-0').click();
    await expect(this.page.locator('.justify-between > div.overflow-hidden > .overflow-hidden')).toContainText('Partner');
    // await expect(this.page.locator(':nth-child(1) > .row-border-bottom > .row > .w-full > div > .rounded-full')).toBeEnabled();
    await this.page.locator('.flex-wrap > .underline').click();
    // await expect(this.page.locator(':nth-child(1) > .row-border-bottom > .row > .w-full > div > .rounded-full')).toBeEnabled();
    await this.page.locator(':nth-child(2) > [aria-hidden="false"] > .rounded-full > .w-6').click();
    await this.page.locator('#date-range-input').click();
    await this.page.locator('#date-range-input').press('Tab');
    await this.page.locator('#date-range-input').press('Tab');
    await this.page.locator('#date-range-input').press('Tab');
    await this.page.locator('#date-range-input').press('Tab');
    await this.page.locator('#date-range-input').press('Tab');
    await this.page.locator('#date-range-input').press('Tab');
    await this.page.locator('#date-range-input').press('Tab');
    await this.page.locator('#date-range-input').press('Tab');
    await this.page.locator('#date-range-input').press('Tab');
    await this.page.locator('#date-range-input').press('Tab');
    await this.page.locator('#date-range-input').press('Enter');
    await this.page.locator('#date-range-input').press('ArrowDown');
    await this.page.locator('#date-range-input').press('ArrowDown');
    await this.page.locator('#date-range-input').press('ArrowDown');
    await this.page.locator('#date-range-input').press('Enter');
    await this.page.locator(':nth-child(2) > .relative > .opacity-0').click();
    await expect(this.page.locator('.justify-between > div.overflow-hidden > .overflow-hidden')).toContainText('Random');
    // await expect(this.page.locator(':nth-child(1) > .row-border-bottom > .row > .w-full > div > .rounded-full')).toBeEnabled();
    await this.page.locator('.flex-wrap > .underline').click();
    // await expect(this.page.locator(':nth-child(1) > .row-border-bottom > .row > .w-full > div > .rounded-full')).toBeEnabled();
  }
  async coursedetailscoursedescription1553()
  {
  await this.page.getByRole('link', { name: 'My Triangulator' }).click();
  await this.page.locator('.hover\\:opacity-60').first().click();
  await expect(this.page.getByText('Course title').first()).toBeVisible();
  //await expect(this.page.getByText('Introduction to General,')).toBeVisible();
  await expect(this.page.getByText('Course description').first()).toBeVisible();
  await this.page.getByText('A one-semester course to').click();
  await expect(this.page.getByText('A one-semester course to')).toBeVisible();
  await this.page.getByText('Course title').nth(1).click();
  await expect(this.page.getByText('PROSEMINAR')).toBeVisible();
  await expect(this.page.getByText('Emphasizes biochemical')).toBeVisible();
  await expect(this.page.getByText('No data')).not.toBeVisible();
}
async suggestionsresults1563()
{
  await this.page.getByRole('link', { name: 'My Triangulator' }).click();
  await this.page.getByRole('link', { name: 'Boost Suggestions' }).click();
  await this.page.getByRole('button', { name: 'Find Course Boost suggestions' }).click();
  await this.page.locator('.w-full > .px-2').first().click();
  await this.page.getByText('At least 2 but less than 4').click();
  await this.page.locator('div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > #dropdown-trigger > .rounded-md > .flex-1 > div').first().click();
  await this.page.getByRole('combobox', { name: 'Source state' }).fill('ca');
  await this.page.getByText('California').click();
  await this.page.getByRole('combobox', { name: 'Source institution', exact: true }).click();
  await this.page.getByRole('combobox', { name: 'Source institution', exact: true }).fill('riv');
  await this.page.getByText('American River College').click();
  await this.page.getByRole('textbox', { name: 'Enter subject' }).click();
  await this.page.getByRole('textbox', { name: 'Enter subject' }).fill('soc');
  await this.page.getByRole('textbox', { name: 'Enter course number' }).click();
  await this.page.getByRole('textbox', { name: 'Enter course number' }).fill('300');
  await this.page.locator('div:nth-child(2) > .rounded-md > .flex-1 > div').first().click();
  await this.page.getByRole('textbox', { name: 'Minimum score' }).fill('68');
  await this.page.getByRole('textbox', { name: 'Request name' }).click();
  await this.page.getByRole('textbox', { name: 'Request name' }).fill('bug test');
  await this.page.getByRole('button', { name: 'Submit' }).click();
  await this.page.goto('https://qa.creditmobility.net/app/my-triangulator/requests/boost-suggestions/summary/75fbf0e5-b722-4232-abba-d1ec244c3fd9');
  await this.page.getByRole('button', { name: 'See Suggestions' }).click();
}
async NoAPIerror1576()
{
  await this.page.getByRole('button', { name: 'Open account dropdown' }).click();
  await this.page.getByRole('button', { name: 'Sign Out' }).click();
  await this.page.getByRole('button', { name: 'Login' }).click();
  await this.page.getByRole('textbox', { name: 'Email' }).click();
  await this.page.getByRole('textbox', { name: 'Email' }).fill('creditmobility@asu.edu');
  await this.page.locator('div:nth-child(2) > div > .rounded-md > .flex-1 > div').first().click();
  await this.page.getByRole('textbox', { name: 'Password' }).fill('Triangulator!1');
  await this.page.getByRole('button', { name: 'Submit' }).click();
  await this.page.getByRole('link', { name: 'My Triangulator' }).click();
  await this.page.getByRole('button', { name: 'Filter' }).click();
  await this.page.getByRole('combobox', { name: 'Suggestion Type' }).locator('div').nth(1).click();
  await this.page.getByText('Partner institution boost').click();
  await this.page.getByRole('button', { name: 'Apply' }).click();
  await this.page.waitForLoadState('networkidle');
  await expect(this.page.getByText('PIMA COMMUNITY COLLEGE').nth(1)).toBeVisible(); // 10 seconds
}
}
module.exports  = {SuggestionsPage};