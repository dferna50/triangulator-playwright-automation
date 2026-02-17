const { expect, test } = require('@playwright/test');

class Search {
  constructor(page) {
    this.page = page;
    this.publicSearchButton = page.getByRole('link', { name: 'Search' });
    this.searchCourseByCourseIcon = page.getByRole('button', { name: 'Search course by course If' });
    this.addSchoolnameComboBox = page.locator('.relative.w-full #dropdown-trigger .rounded-md .flex-1').first();
    this.sortByComboBox = page.locator('.item-center');
    this.addSubjectTextbox = page.locator(':nth-child(3) .rounded-md');
    this.addPlusIcon = page.getByRole('button', { name: 'Add course' });
    this.addPlusIconDisabled = page.locator(':nth-child(2) .rounded-full');
    this.searchButton = page.locator('.justify-end .relative .opacity-0');
    this.filtersButton = page.locator('.justify-end .ring-offset-1 .opacity-0');
    this.stateFilter = page.locator(':nth-child(3) #dropdown-trigger .rounded-md .relative .justify-center .px-2 .items-center .flex-1 #combobox-input');
    this.zipCodeFilter = page.getByRole('textbox', { name: 'Zip code' });
    this.exploreAllEquivalenciesbutton = page.getByRole('button', { name: 'Explore all equivalencies If' });
    this.transferFromComboBox = page.locator(':nth-child(1)[class="w-full flex-1"]');
    this.transferToComboBox = page.locator(':nth-child(2)[class="w-full flex-1"]');
    this.anywhereContain = page.getByText('Anywhere', { exact: true });
    this.bodyElement = page.locator('body');
    this.chevronButton = page.locator("div.flex.justify-end.items-center.pr-5.w-20.pt-4 > div > button").first();
    this.searchFromCombobox = page.locator('div').filter({ hasText: /^Where are you transferring from\?$/ }).getByPlaceholder('Search and select a school')
    this.searchToCombobox = page.locator('div').filter({ hasText: /^Where are you transferring to\?$/ }).getByPlaceholder('Search and select a school');
  }


  async searchExploreAllEquivalenciesWithoutFrom() {
    await this.searchToCombobox.click();
    await this.searchToCombobox.press('ArrowDown');
    await this.searchToCombobox.press('Enter');
  }

  async searchExploreAllEquivalenciesWithoutTo() {
   await this.searchFromCombobox.click();
   //await this.page.keyboard.press('Enter');
   await this.page.keyboard.press('ArrowDown');
   await this.page.keyboard.press('Enter');
  }

  async searchExploreAllEquivalencies() {
    await this.publicSearchButton.click();
    await this.exploreAllEquivalenciesbutton.click();
  }

  async searchExploreAllEquivalenciesSearch() {
    await expect(this.searchButton).toHaveCSS('pointer-events', 'none');
  }

  async searchExploreAllEquivalenciesAssertAnywhere() {
    await this.searchExploreAllEquivalenciesWithoutFrom();
    await this.searchFromCombobox.click();
    await this.page.keyboard.press('ArrowDown');
    await this.anywhereContain.hover();
    await expect(this.page.getByText('Only one anywhere option can be selected at a time')).toBeVisible();
    await this.bodyElement.hover({ position: { x: 0, y: 0 } });
  }

  async searchExploreAllEquivalenciesFrom() {
    await this.searchExploreAllEquivalenciesWithoutFrom();
    await this.searchFromCombobox.click();
    await this.searchFromCombobox.type('Allan Hancock College');
    await this.page.getByText('Allan Hancock College').click();
    await this.searchButton.click();
    await expect(this.page.getByText('Equivalency results')).toBeVisible();
    await expect(this.page.getByText('Below are results of all equivalencies that match your search criteria.')).toBeVisible();
    await expect(this.page.getByText('Error while searching')).not.toBeVisible();
    await this.chevronButton.click();
    await expect(this.page.locator(':nth-child(2) .details-root .text-base').first()).toBeVisible();
  }

  async searchExploreAllEquivalenciesInstitutions() {
    await this.searchToCombobox.click();
    await this.searchToCombobox.type('Nevada-Reno');
    await this.page.getByText('University of Nevada-Reno').click();
    await this.searchFromCombobox.click();
    await this.searchFromCombobox.type('Allan Hancock College');
    await this.page.getByText('Allan Hancock College').click();
    await this.searchButton.click();
    await expect(this.page.getByText('Equivalency results')).toBeVisible();
    await expect(this.page.getByText('Below are results of all equivalencies that match your search criteria.')).toBeVisible();
    await expect(this.page.getByText('Error while searching')).not.toBeVisible();
    await this.chevronButton.click();
    await expect(this.page.locator(':nth-child(2) .details-root .text-base').first()).toBeVisible();
  }

  async searchExploreAllEquivalenciesnavigate() {
    await this.page.locator('.overflow-y-scroll').scrollTo('bottom');
    await expect(this.page.getByText('Prev')).toBeDisabled();
    await expect(this.page.getByText('Next')).toBeEnabled();
    await this.page.getByText('Next').click();
    await expect(this.page.getByText('Prev')).toBeEnabled();
    await expect(this.page.getByText('Next')).toBeEnabled();
    await this.page.locator('.overflow-y-scroll').scrollTo('top');
    await this.chevronButton.click();
    await expect(this.page.locator(':nth-child(2) .details-root .text-base').first()).toBeVisible();
    await this.page.locator('.overflow-y-scroll').scrollTo('bottom');
    await expect(this.page.locator('.py-2.justify-center .relative :nth-child(1)')).toBeVisible();
    await this.page.locator('.rounded-2xl').click();
    await expect(this.page.getByText('Next')).toBeDisabled();
    await this.page.locator('.overflow-y-scroll').scrollTo('top');
    await this.chevronButton.click();
    await expect(this.page.locator(':nth-child(2) .details-root .text-base').first()).toBeVisible();
    await this.page.locator('.overflow-y-scroll').scrollTo('bottom');
    await expect(this.page.getByText('Prev')).toBeEnabled();
    await this.page.getByText('Prev').click();
    await expect(this.page.getByText('Prev')).toBeEnabled();
    await expect(this.page.getByText('Next')).toBeEnabled();
    await this.page.locator('.overflow-y-scroll').scrollTo('top');
    await this.chevronButton.click();
    await expect(this.page.locator(':nth-child(2) .details-root .text-base').first()).toBeVisible();
  }

  async searchExploreAllEquivalenciesTo() {
    await this.searchExploreAllEquivalenciesWithoutTo();
    await this.searchToCombobox.click();
    await this.searchToCombobox.type('Allan Hancock College');
    await this.page.getByText('Allan Hancock College').click();
    await this.searchButton.click();
    await expect(this.page.getByText('Equivalency results')).toBeVisible();
    await expect(this.page.getByText('Below are results of all equivalencies that match your search criteria.')).toBeVisible();
    await expect(this.page.getByText('Error while searching')).not.toBeVisible();
    await this.chevronButton.click();
    await expect(this.page.locator(':nth-child(2) .details-root .text-base').first()).toBeVisible();
  }

  async searchCourseByCourseValid(institutionName, courseSubject, courseNumber) {
    await this.addSchoolnameComboBox.click();
    await this.page.keyboard.press('Tab');
    await this.page.keyboard.press('Backspace');
    await this.page.keyboard.type(institutionName);
    await this.page.waitForTimeout(5000);
    await this.page.keyboard.press('ArrowDown');
    await this.page.keyboard.press('Enter');
    await this.addSubjectTextbox.type(courseSubject);
    await this.page.keyboard.press('Tab');
    await this.page.keyboard.type(courseNumber);
    await this.addPlusIcon.click();
    await this.searchButton.click();
    //await expect(this.page).toHaveURL('public-searchcourse-by-courseresults');
    await expect(this.page.getByText('Triangulator Search')).toBeVisible();
    await expect(this.page.getByText('Course search results')).toBeVisible();
    await expect(this.page.getByText('Below are results of all approved equivalencies that match your search criteria.')).toBeVisible();
  }

  async searchCourseByCourse() {
    await this.publicSearchButton.click();
    await this.searchCourseByCourseIcon.click();
  }

  async searchCourseByCourseInvalidSearch() {
    await expect(this.searchButton).toHaveCSS('pointer-events', 'none');
  }

  async assertWithEmptyFields() {
    await this.bodyElement.hover({ position: { x: 0, y: 0 } });
    await this.addPlusIcon.hover();
  }

  async addInstitutionName(institutionName) {
    await this.bodyElement.hover({ position: { x: 0, y: 0 } });
    await this.addSchoolnameComboBox.click();
    await this.page.keyboard.press('Tab');
    await this.page.keyboard.press('Backspace');
    await this.page.keyboard.type(institutionName);
    await this.page.waitForTimeout(5000);
    await this.page.keyboard.press('ArrowDown');
    await this.page.keyboard.press('Enter');
  }

  async addCourseSubject(courseSubject) {
    await this.addSubjectTextbox.type(courseSubject);
  }

  async addCourseNumber(courseNumber) {
    await this.page.keyboard.press('Tab');
    await this.page.keyboard.type(courseNumber);
  }

  async clickPlusButton() {
    await this.addPlusIcon.click();
  }

  async clickSearchButton() {
    await this.searchButton.click();
    await expect(this.page).toHaveURL(/.*\/results$/);
  }

  async stateFilterSearch(state) {
    //await this.page.waitForTimeout(25000);
    const firstElement = this.page.locator('.w-32 .font-bold').first();
    await expect(firstElement).toContainText('100', { timeout: 200000 });
    await this.filtersButton.click();
    await this.stateFilter.type(state);
    await this.page.keyboard.press('ArrowDown');
    await this.page.keyboard.press('Enter');
  }

  async exploreAllStateFilter(state) {
    await this.filtersButton.click();
    await this.page.locator(':nth-child(1) :nth-child(4) #dropdown-trigger .rounded-md .relative .justify-center .px-2 .items-center .flex-1 #combobox-input').type(state);
    await this.page.keyboard.press('ArrowDown');
    await this.page.keyboard.press('Enter');
  }

  async distanceAndZipeCodeFilter(zipCode) {
    await this.filtersButton.click();
    await this.page.getByText('Distance').click({ force: true });
    await this.page.waitForTimeout(5000);
    await this.page.keyboard.press('ArrowDown');
    await this.page.keyboard.press('ArrowDown');
    await this.page.keyboard.press('Enter');
    await this.zipCodeFilter.type(zipCode);
  }

  async exploreAlldistanceAndZipeCodeFilter(zipCode) {
    await this.filtersButton.click();
    await this.page.getByText('Distance').click({ force: true });
    await this.page.waitForTimeout(5000);
    await this.page.keyboard.press('ArrowDown');
    await this.page.keyboard.press('ArrowDown');
    await this.page.keyboard.press('Enter');
    await this.page.locator(':nth-child(1) :nth-child(2) .gap-2 .rounded-md .flex-1 .justify-center').type(zipCode);
  }

  async sortBy(option) {
    await this.sortByComboBox.click();
    await this.page.locator(`text=${option}`).click();
  }

  async compareResults() {
    const numberOfItems = await this.page.locator(':nth-child(n) .gap-6 :nth-child(1) .text-lg').count();
    expect(numberOfItems).toBeGreaterThan(0);
    const resolvedInstitutions = [];
    for (let i = 1; i <= numberOfItems; i++) {
      const selector = `:nth-child(${i}) .gap-6 :nth-child(1) .text-lg`;
      const institution = await this.page.locator(selector).textContent();
      resolvedInstitutions.push(institution);
    }
    for (let i = 1; i < numberOfItems; i++) {
      const currentInstitution = resolvedInstitutions[i - 1];
      const nextInstitution = resolvedInstitutions[i];
      expect(currentInstitution.localeCompare(nextInstitution)).toBeLessThan(0);
    }
  }
}

module.exports = { Search };
