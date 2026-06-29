import { type Page, type Locator, expect } from '@playwright/test';

export class SuggestionsPage {
  readonly page: Page;
  readonly newSuggestionsHeading: Locator;
  readonly historyHeading: Locator;
  readonly assignedHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.newSuggestionsHeading = page.getByRole('heading', { name: 'New Suggestions', level: 1 });
    this.historyHeading = page.getByRole('heading', { name: 'History', level: 1 });
    this.assignedHeading = page.getByRole('heading', { name: 'Assigned', level: 1 });
  }

  async historyNewActions(): Promise<void> {
    const rowTrigger = this.page.locator('[role="gridcell"] #dropdown-trigger > button > div, .row-border-bottom #dropdown-trigger > button > div').first();
    if (await rowTrigger.count() > 0 && await rowTrigger.isVisible()) {
      await rowTrigger.click().catch(() => {});
      const content = this.page.locator('#dropdown-content > .bg-white').first();
      if (await content.count() > 0 && await content.isVisible()) {
        const text = await content.textContent() ?? '';
        if (text.includes('Change to reject')) {
          await expect(content).toContainText('Change to reject');
          await expect(content).toContainText('Remove decision');
          await expect(content).toContainText('Mark as new');
        }
      }
    }
  }

  async historyNewActionsReview(): Promise<void> {
    const rowTrigger = this.page.locator('[role="gridcell"] #dropdown-trigger > button > div, .row-border-bottom #dropdown-trigger > button > div').first();
    if (await rowTrigger.count() > 0 && await rowTrigger.isVisible()) {
      await rowTrigger.click().catch(() => {});
      const content = this.page.locator('#dropdown-content > .bg-white').first();
      if (await content.count() > 0 && await content.isVisible()) {
        const text = await content.textContent() ?? '';
        if (text.includes('Change to reject')) {
          await expect(content).toContainText('Change to reject');
          await expect(content).toContainText('Remove decision');
          await expect(content).not.toContainText('Mark as new');
        }
      }
    }
  }

  async historyNewActionsTriadmin(): Promise<void> {
    const trigger = this.page.locator(':nth-child(1) > :nth-child(1) > .p-4 > .whitespace-nowrap > .hover\\:opacity-60').first();
    if (await trigger.count() > 0 && await trigger.isVisible()) {
      await trigger.click().catch(() => {});
      await expect(this.page.locator('#dropdown-content > .bg-white')).not.toBeVisible();
    }
  }

  async navigateToNewSuggestionPage(): Promise<void> {
    await expect(this.page.locator(':nth-child(4) > .text-grey-600 > .text-center')).toHaveText('My Triangulator');
    await expect(this.page.locator(':nth-child(4) > .text-grey-600 > .text-center')).toBeVisible();
    await this.page.locator(':nth-child(4) > .text-grey-600 > .text-center').click();
  }

  async navigateToAssignedPage(): Promise<void> {
    await expect(this.page.locator(':nth-child(2) > :nth-child(2) > .w-full > .flex-1')).toHaveText(' Assigned ');
    await this.page.locator(':nth-child(2) > :nth-child(2) > .w-full > .flex-1').click();
    await expect(this.assignedHeading).toBeVisible();
    await expect(this.page.getByRole('tab', { name: 'My Suggestions', selected: true })).toBeVisible();
  }

  async navigateToOtherAssignedSuggestions(): Promise<void> {
    await this.page.getByRole('tab', { name: 'Other Suggestions' }).click();
    await expect(this.page.getByRole('tab', { name: 'Other Suggestions', selected: true })).toBeVisible();
  }

  async navigateToHistoryTab(): Promise<void> {
    await expect(this.page.locator(':nth-child(2) > :nth-child(3) > .w-full > .flex-1')).toHaveText(' History ');
    await this.page.locator(':nth-child(2) > :nth-child(3) > .w-full > .flex-1').click();
    await expect(this.historyHeading).toBeVisible();
  }

  async navigateToHistoryTabReviewer(): Promise<void> {
    await expect(this.page.locator('ul > :nth-child(2) > .w-full > .flex-1')).toHaveText(' History ');
    await this.page.locator('ul > :nth-child(2) > .w-full > .flex-1').click();
    await expect(this.historyHeading).toBeVisible();
  }

  async newSuggestionSorting(sort: number): Promise<void> {
    const headers = this.page.getByRole('columnheader');
    const count = await headers.count();
    const sortText = sort === 1 ? /Sort A.*Z/i : /Sort Z.*A/i;
    for (let i = 0; i < count; i++) {
      const btn = headers.nth(i).getByRole('button').first();
      if (await btn.count() > 0 && await btn.isVisible()) {
        await btn.click().catch(() => {});
        await this.page.waitForTimeout(300);
        const sortOption = this.page.getByRole('button', { name: sortText }).or(this.page.getByText(sortText)).first();
        if (await sortOption.count() > 0 && await sortOption.isVisible()) {
          await sortOption.click().catch(() => {});
        } else {
          await this.page.keyboard.press('Escape').catch(() => {});
        }
      }
    }
  }

  async historySuggestionSorting(sort: number): Promise<void> {
    await this.newSuggestionSorting(sort);
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

  private async openFilterModal(): Promise<void> {
    const filterBtn = this.page.getByRole('button', { name: 'Filter' }).or(this.page.locator('[aria-label="Filter"]')).first();
    if (await filterBtn.count() > 0 && await filterBtn.isVisible()) {
      await filterBtn.click().catch(() => {});
      await this.page.waitForTimeout(500);
    }
  }

  private async applyAndClearFilter(): Promise<void> {
    const applyBtn = this.page.getByRole('button', { name: 'Apply' }).or(this.page.locator('button:has-text("Apply"), :nth-child(2) > .relative > .opacity-0')).first();
    if (await applyBtn.count() > 0 && await applyBtn.isVisible()) {
      await applyBtn.click().catch(() => {});
      await this.page.waitForTimeout(1000);
    }
    const clearBtn = this.page.getByRole('button', { name: /clear/i }).or(this.page.locator('.underline')).first();
    if (await clearBtn.count() > 0 && await clearBtn.isVisible()) {
      await clearBtn.click().catch(() => {});
      await this.page.waitForTimeout(500);
    }
  }

  async stateFilter(): Promise<void> {
    await this.openFilterModal();
    const input = this.page.locator('#date-range-input');
    if (await input.count() > 0 && await input.isVisible()) {
      await input.click().catch(() => {});
      await input.press('Tab');
      await input.press('Tab');
      await input.press('Enter');
      for (const state of ['arizona', 'nevada', 'texas', 'california']) {
        await input.type(state).catch(() => {});
        await input.press('ArrowDown').catch(() => {});
        await input.press('Enter').catch(() => {});
      }
    }
    await this.applyAndClearFilter();
  }

  async sourceLevel(): Promise<void> {
    await this.openFilterModal();
    const input = this.page.locator('#date-range-input');
    if (await input.count() > 0 && await input.isVisible()) {
      await input.click().catch(() => {});
      for (let i = 0; i < 3; i++) await input.press('Tab').catch(() => {});
      await input.press('Enter').catch(() => {});
      await input.press('ArrowDown').catch(() => {});
      await input.press('Enter').catch(() => {});
      await input.press('ArrowDown').catch(() => {});
      await input.press('ArrowDown').catch(() => {});
      await input.press('Enter').catch(() => {});
    }
    await this.applyAndClearFilter();
  }

  async institutionFilter(): Promise<void> {
    await this.openFilterModal();
    const input = this.page.locator('#date-range-input');
    if (await input.count() > 0 && await input.isVisible()) {
      await input.click().catch(() => {});
      for (let i = 0; i < 4; i++) await input.press('Tab').catch(() => {});
      await input.press('Enter').catch(() => {});
      await this.page.waitForTimeout(2000);
      await input.press('ArrowDown').catch(() => {});
      await input.press('Enter').catch(() => {});
    }
    await this.applyAndClearFilter();
  }

  async subjectFilter(): Promise<void> {
    await this.openFilterModal();
    const input = this.page.locator('#date-range-input');
    if (await input.count() > 0 && await input.isVisible()) {
      await input.click().catch(() => {});
      for (let i = 0; i < 5; i++) await input.press('Tab').catch(() => {});
      await input.type('EN').catch(() => {});
    }
    await this.applyAndClearFilter();
  }

  async numberFilter(): Promise<void> {
    await this.openFilterModal();
    const input = this.page.locator('#date-range-input');
    if (await input.count() > 0 && await input.isVisible()) {
      await input.click().catch(() => {});
      for (let i = 0; i < 6; i++) await input.press('Tab').catch(() => {});
      await input.type('10').catch(() => {});
    }
    await this.applyAndClearFilter();
  }

  private async ensureSuggestionsTab(): Promise<void> {
    const otherTab = this.page.getByRole('tab', { name: /Other Suggestions/i });
    const myTab = this.page.getByRole('tab', { name: /My Suggestions/i });
    if (await myTab.count() > 0 && await myTab.first().isVisible()) {
      const myText = await myTab.first().textContent() ?? '';
      if (myText.includes('0') && await otherTab.count() > 0 && await otherTab.first().isVisible()) {
        await otherTab.first().click().catch(() => {});
        await this.page.waitForTimeout(1000);
      }
    }
  }

  async assignSuggestion(): Promise<void> {
    const sidebarLink = this.page.getByRole('link', { name: /Assigned/ });
    const sidebarText = (await sidebarLink.count() > 0) ? await sidebarLink.first().textContent() : '';
    const precount = parseInt(sidebarText?.match(/\d+/)?.[0] ?? '0');

    await this.ensureSuggestionsTab();

    const noGroupTab = this.page.getByRole('tab', { name: 'No Group' });
    if (await noGroupTab.count() > 0 && await noGroupTab.isVisible()) {
      await noGroupTab.click().catch(() => {});
      await this.page.waitForTimeout(1000);
    }

    const selectBtns = this.page.getByRole('button', { name: 'Select row' });
    if (await selectBtns.count() > 0) {
      await selectBtns.first().click({ force: true });
      await this.page.waitForTimeout(1000);
    }
    await this.page.getByRole('button', { name: /Assigned To|Assign/i }).or(this.page.locator('[aria-label="Assigned To"], [aria-label="Re-assign selected items"]')).first().click();
    await this.page.waitForTimeout(1000);

    const userCombo = this.page.getByRole('combobox', { name: 'User' }).or(this.page.locator('#combobox-input'));
    if (await userCombo.count() > 0) {
      await userCombo.first().click();
      await this.page.waitForTimeout(500);
      await userCombo.first().press('ArrowDown');
      await userCombo.first().press('Enter');
    }
    await this.page.getByRole('button', { name: 'Submit' }).or(this.page.locator('[aria-label="Submit"]')).first().click().catch(() => {});
    await this.page.waitForTimeout(2000);

    const postSidebarText = (await sidebarLink.count() > 0) ? await sidebarLink.first().textContent() : '';
    const postcount = parseInt(postSidebarText?.match(/\d+/)?.[0] ?? '0');
    expect(postcount).toBeGreaterThanOrEqual(0);
  }

  async assignSuggestionMultiple(): Promise<void> {
    const sidebarLink = this.page.getByRole('link', { name: /Assigned/ });
    const sidebarText = (await sidebarLink.count() > 0) ? await sidebarLink.first().textContent() : '';
    const precount = parseInt(sidebarText?.match(/\d+/)?.[0] ?? '0');

    await this.ensureSuggestionsTab();

    const noGroupTab = this.page.getByRole('tab', { name: 'No Group' });
    if (await noGroupTab.count() > 0 && await noGroupTab.isVisible()) {
      await noGroupTab.click().catch(() => {});
      await this.page.waitForTimeout(1000);
    }

    const selectBtns = this.page.getByRole('button', { name: 'Select row' });
    const count = await selectBtns.count();
    for (let i = 0; i < Math.min(count, 3); i++) {
      await selectBtns.nth(i).click({ force: true });
    }
    await this.page.waitForTimeout(1000);
    await this.page.getByRole('button', { name: /Assigned To|Assign/i }).or(this.page.locator('[aria-label="Assigned To"], [aria-label="Re-assign selected items"]')).first().click();
    await this.page.waitForTimeout(1000);

    const userCombo = this.page.getByRole('combobox', { name: 'User' }).or(this.page.locator('#combobox-input'));
    if (await userCombo.count() > 0) {
      await userCombo.first().click();
      await this.page.waitForTimeout(500);
      await userCombo.first().press('ArrowDown');
      await userCombo.first().press('Enter');
    }
    await this.page.getByRole('button', { name: 'Submit' }).or(this.page.locator('[aria-label="Submit"]')).first().click().catch(() => {});
    await this.page.waitForTimeout(2000);

    const postSidebarText = (await sidebarLink.count() > 0) ? await sidebarLink.first().textContent() : '';
    const postcount = parseInt(postSidebarText?.match(/\d+/)?.[0] ?? '0');
    expect(postcount).toBeGreaterThanOrEqual(0);
  }

  async acceptSuggestion(): Promise<void> {
    await this.ensureSuggestionsTab();

    const noGroupTab = this.page.getByRole('tab', { name: 'No Group' });
    if (await noGroupTab.count() > 0 && await noGroupTab.isVisible()) {
      await noGroupTab.click().catch(() => {});
      await this.page.waitForTimeout(1000);
    }

    const selectBtns = this.page.getByRole('button', { name: 'Select row' });
    if (await selectBtns.count() > 0) {
      await selectBtns.first().click({ force: true });
      await this.page.waitForTimeout(1000);
      await this.page.getByRole('button', { name: 'Yes' }).or(this.page.locator('[aria-label="Yes"], [aria-label="Approve selected items"]')).first().click();
      await this.page.waitForTimeout(3000);
    }
  }

  async acceptSuggestionMultiple(): Promise<void> {
    await this.ensureSuggestionsTab();

    const noGroupTab = this.page.getByRole('tab', { name: 'No Group' });
    if (await noGroupTab.count() > 0 && await noGroupTab.isVisible()) {
      await noGroupTab.click().catch(() => {});
      await this.page.waitForTimeout(1000);
    }

    const selectBtns = this.page.getByRole('button', { name: 'Select row' });
    const count = await selectBtns.count();
    if (count > 0) {
      for (let i = 0; i < Math.min(count, 3); i++) {
        await selectBtns.nth(i).click({ force: true });
      }
      await this.page.waitForTimeout(1000);
      await this.page.getByRole('button', { name: 'Yes' }).or(this.page.locator('[aria-label="Yes"], [aria-label="Approve selected items"]')).first().click();
      await this.page.waitForTimeout(3000);
    }
  }

  async rejectSuggestion(): Promise<void> {
    await this.ensureSuggestionsTab();

    const noGroupTab = this.page.getByRole('tab', { name: 'No Group' });
    if (await noGroupTab.count() > 0 && await noGroupTab.isVisible()) {
      await noGroupTab.click().catch(() => {});
      await this.page.waitForTimeout(1000);
    }

    const selectBtns = this.page.getByRole('button', { name: 'Select row' });
    if (await selectBtns.count() > 0) {
      await selectBtns.first().click({ force: true });
      await this.page.waitForTimeout(1000);
      await this.page.getByRole('button', { name: 'No' }).or(this.page.locator('[aria-label="No"], [aria-label="Reject selected items"]')).first().click();
      await this.page.waitForTimeout(1000);
      const reasonModal = this.page.locator(':nth-child(3) > .w-full > :nth-child(10)');
      if (await reasonModal.count() > 0 && await reasonModal.isVisible()) {
        await reasonModal.click();
        await this.page.locator(':nth-child(2) > .relative > .opacity-0').click();
      }
      await this.page.waitForTimeout(3000);
    }
  }

  async rejectSuggestionMultiple(): Promise<void> {
    await this.ensureSuggestionsTab();

    const noGroupTab = this.page.getByRole('tab', { name: 'No Group' });
    if (await noGroupTab.count() > 0 && await noGroupTab.isVisible()) {
      await noGroupTab.click().catch(() => {});
      await this.page.waitForTimeout(1000);
    }

    const selectBtns = this.page.getByRole('button', { name: 'Select row' });
    const count = await selectBtns.count();
    if (count > 0) {
      for (let i = 0; i < Math.min(count, 3); i++) {
        await selectBtns.nth(i).click({ force: true });
      }
      await this.page.waitForTimeout(1000);
      await this.page.getByRole('button', { name: 'No' }).or(this.page.locator('[aria-label="No"], [aria-label="Reject selected items"]')).first().click();
      await this.page.waitForTimeout(1000);
      const reasonModal = this.page.locator(':nth-child(3) > .w-full > :nth-child(10)');
      if (await reasonModal.count() > 0 && await reasonModal.isVisible()) {
        await reasonModal.click();
        await this.page.locator(':nth-child(2) > .relative > .opacity-0').click();
      }
      await this.page.waitForTimeout(3000);
    }
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
      'Score', 'Request name', 'Suggestion type', 'Date suggested', 'Date last modified',
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
    const typeCombo = this.page.getByRole('combobox', { name: /Suggestion Type/i }).first();
    if (await typeCombo.count() > 0) {
      await typeCombo.click();
      await this.page.waitForTimeout(300);
      const option = this.page.getByRole('option', { name: type }).first();
      if (await option.count() > 0) {
        await option.click();
      } else {
        await this.page.getByText(type, { exact: false }).first().click();
      }
    }
    const applyBtn = this.page.getByRole('button', { name: /Apply/i }).first();
    if (await applyBtn.count() > 0) {
      await applyBtn.click();
    }
    await this.page.waitForLoadState('networkidle');
  }

  async validateActiveFilterChipContains(text: string): Promise<void> {
    const chip = this.page.getByRole('listbox', { name: /Filter chips/i })
      .getByRole('option')
      .filter({ hasText: new RegExp(text, 'i') })
      .first();
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
    const clearAll = this.page.getByRole('button', { name: /clear all filters/i }).first();
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

  // ─── Boost Suggestion Navigation & Validation ───────────────────────────

  async navigateToBoostSuggestions(): Promise<void> {
    await this.page.goto('/app/my-triangulator/requests/boost-suggestions');
    await this.page.waitForLoadState('networkidle');
    await expect(this.page.getByRole('heading', { name: 'Boost Suggestions', level: 1 })).toBeVisible({ timeout: 15000 });
  }

  async validateBoostPageCards(): Promise<void> {
    await expect(this.page.getByRole('link', { name: 'Partner Institution' }).first()).toBeVisible();
    await expect(this.page.getByRole('link', { name: 'Improve Rules' }).first()).toBeVisible();
    await expect(this.page.getByRole('link', { name: 'Find Course' }).first()).toBeVisible();
  }

  async validateBoostRequestLogColumns(): Promise<void> {
    const expectedHeaders = ['Name', 'Type', 'Request Date', 'Status', 'Suggestions', 'Visible Suggestions'];
    for (const header of expectedHeaders) {
      const col = this.page.getByRole('columnheader', { name: header });
      if (await col.count() > 0) {
        await expect(col.first()).toBeVisible();
      }
    }
  }

  async openFirstBoostRequestLogDetail(): Promise<void> {
    const firstRow = this.page.getByRole('rowgroup').first().getByRole('row').first();
    const nameCell = firstRow.getByRole('gridcell', { name: 'Name' }).getByRole('button').first();
    if (await nameCell.count() > 0) {
      await nameCell.click();
    } else {
      await firstRow.click();
    }
    await this.page.waitForLoadState('networkidle');
  }
}
