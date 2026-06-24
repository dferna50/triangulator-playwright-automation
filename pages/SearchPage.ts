import { type Page, type Locator } from '@playwright/test';

export class SearchPage {
  readonly page: Page;
  readonly publicSearchButton: Locator;
  readonly searchCourseByCourseIcon: Locator;
  readonly addSchoolnameComboBox: Locator;
  readonly sortByComboBox: Locator;
  readonly addSubjectTextbox: Locator;
  readonly addPlusIcon: Locator;
  readonly addPlusIconDisabled: Locator;
  readonly searchButton: Locator;
  readonly filtersButton: Locator;
  readonly stateFilter: Locator;
  readonly zipCodeFilter: Locator;
  readonly exploreAllEquivalenciesButton: Locator;
  readonly transferFromComboBox: Locator;
  readonly transferToComboBox: Locator;
  readonly anywhereContain: Locator;
  readonly bodyElement: Locator;
  readonly chevronButton: Locator;
  readonly searchFromCombobox: Locator;
  readonly searchToCombobox: Locator;
  readonly myCoursesTab: Locator;
  readonly deleteCourseButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.publicSearchButton = page.getByRole('link', { name: 'Search' });
    this.searchCourseByCourseIcon = page.getByRole('link', { name: 'Search course by course' });
    this.addSchoolnameComboBox = page.getByRole('combobox', { name: 'School name' });
    this.sortByComboBox = page.locator('.item-center');
    this.addSubjectTextbox = page.locator(':nth-child(3) .rounded-md');
    this.addPlusIcon = page.getByRole('button', { name: 'Add course' });
    this.addPlusIconDisabled = page.locator(':nth-child(2) .rounded-full');
    this.searchButton = page.locator('.justify-end .relative .opacity-0');
    this.filtersButton = page.locator('.justify-end .ring-offset-1 .opacity-0');
    this.stateFilter = page.locator(':nth-child(3) #dropdown-trigger .rounded-md .relative .justify-center .px-2 .items-center .flex-1 #combobox-input');
    this.zipCodeFilter = page.getByRole('textbox', { name: 'Zip code' });
    this.exploreAllEquivalenciesButton = page.getByRole('link', { name: 'Explore all equivalencies' });
    this.transferFromComboBox = page.locator(':nth-child(1)[class="w-full flex-1"]');
    this.transferToComboBox = page.locator(':nth-child(2)[class="w-full flex-1"]');
    this.anywhereContain = page.locator('[role="listbox"]').getByText('Anywhere', { exact: true }).first();
    this.bodyElement = page.locator('body');
    this.chevronButton = page.locator('div.flex.justify-end.items-center.pr-5.w-20.pt-4 > div > button').first();
    this.searchFromCombobox = page.locator('div').filter({ hasText: /^Where are you transferring from\?$/ }).getByPlaceholder('Search and select a school');
    this.searchToCombobox = page.locator('div').filter({ hasText: /^Where are you transferring to\?$/ }).getByPlaceholder('Search and select a school');
    this.myCoursesTab = page.getByText('My courses');
    this.deleteCourseButton = page.getByRole('button', { name: 'Delete course' });
  }

  async searchExploreAllEquivalenciesWithoutFrom(): Promise<void> {
    await this.searchToCombobox.click();
    await this.searchToCombobox.press('ArrowDown');
    await this.searchToCombobox.press('Enter');
  }

  async searchExploreAllEquivalenciesWithoutTo(): Promise<void> {
    await this.searchFromCombobox.click();
    await this.page.keyboard.press('ArrowDown');
    await this.page.keyboard.press('Enter');
  }

  async searchExploreAllEquivalencies(): Promise<void> {
    await this.publicSearchButton.click();
    await this.exploreAllEquivalenciesButton.click();
  }

  async searchExploreAllEquivalenciesSearch(): Promise<void> {
    // Assertion kept in test file — this is a navigation helper
  }

  async searchExploreAllEquivalenciesAssertAnywhere(): Promise<void> {
    await this.searchExploreAllEquivalenciesWithoutFrom();
    await this.searchFromCombobox.click();
    await this.page.keyboard.press('ArrowDown');
    await this.anywhereContain.hover();
    await this.bodyElement.hover({ position: { x: 0, y: 0 } });
  }

  async searchExploreAllEquivalenciesFrom(): Promise<void> {
    await this.searchExploreAllEquivalenciesWithoutFrom();
    await this.searchFromCombobox.click();
    await this.searchFromCombobox.type('Allan Hancock College');
    await this.page.getByText('Allan Hancock College').click();
    await this.searchButton.click();
    await this.chevronButton.click();
  }

  async searchExploreAllEquivalenciesInstitutions(): Promise<void> {
    await this.searchToCombobox.click();
    await this.searchToCombobox.type('Nevada-Reno');
    await this.page.getByText('University of Nevada-Reno').click();
    await this.searchFromCombobox.click();
    await this.searchFromCombobox.type('Allan Hancock College');
    await this.page.getByText('Allan Hancock College').click();
    await this.searchButton.click();
    await this.chevronButton.click();
  }

  private async scrollContainer(direction: 'top' | 'bottom'): Promise<void> {
    const container = this.page.locator('.overflow-y-scroll');
    if (direction === 'bottom') {
      await container.evaluate((el) => el.scrollTo(0, el.scrollHeight));
    } else {
      await container.evaluate((el) => el.scrollTo(0, 0));
    }
  }

  async searchExploreAllEquivalenciesNavigate(): Promise<void> {
    await this.scrollContainer('bottom');
    await this.page.getByText('Next').click();
    await this.scrollContainer('top');
    await this.chevronButton.click();
    await this.scrollContainer('bottom');
    await this.page.locator('.rounded-2xl').click();
    await this.scrollContainer('top');
    await this.chevronButton.click();
    await this.scrollContainer('bottom');
    await this.page.getByText('Prev').click();
    await this.scrollContainer('top');
    await this.chevronButton.click();
  }

  async searchExploreAllEquivalenciesTo(): Promise<void> {
    await this.searchExploreAllEquivalenciesWithoutTo();
    await this.searchToCombobox.click();
    await this.searchToCombobox.type('Nevada-Reno');
    await this.page.getByText('University of Nevada-Reno').click();
    await this.searchButton.click();
    await this.chevronButton.click();
  }

  async searchCourseByCourseValid(
    institutionName: string,
    courseSubject: string,
    courseNumber: string
  ): Promise<void> {
    await this.addInstitutionName(institutionName);
    await this.addCourseSubject(courseSubject);
    await this.addCourseNumber(courseNumber);
    await this.addPlusIcon.click();
    await this.searchButton.click();
  }

  async searchCourseByCourse(): Promise<void> {
    await this.publicSearchButton.click();
    await this.searchCourseByCourseIcon.click();
  }

  async searchCourseByCourseInvalidSearch(): Promise<void> {
    // Assertion kept in test file
  }

  async assertWithEmptyFields(): Promise<void> {
    await this.bodyElement.hover({ position: { x: 0, y: 0 } });
    await this.addPlusIcon.hover();
  }

  async addInstitutionName(institutionName: string): Promise<void> {
    await this.addSchoolnameComboBox.click();
    await this.addSchoolnameComboBox.fill(institutionName);
    await this.page.waitForTimeout(2000);
    await this.page.keyboard.press('ArrowDown');
    await this.page.keyboard.press('Enter');
  }

  async addCourseSubject(courseSubject: string): Promise<void> {
    const subjectCombobox = this.page.getByRole('combobox', { name: 'Subject' });
    await subjectCombobox.click();
    await subjectCombobox.fill(courseSubject);
    await this.page.getByRole('option', { name: courseSubject, exact: true }).click();
  }

  async addCourseNumber(courseNumber: string): Promise<void> {
    const courseNumberCombobox = this.page.getByRole('combobox', { name: 'Course number' });
    await courseNumberCombobox.click();
    await courseNumberCombobox.fill(courseNumber);
    await this.page.getByRole('option', { name: courseNumber, exact: true }).click();
  }

  async clickPlusButton(): Promise<void> {
    await this.addPlusIcon.click();
  }

  async clickSearchButton(): Promise<void> {
    await this.searchButton.click();
  }

  async stateFilterSearch(state: string): Promise<void> {
    await this.filtersButton.click();
    await this.stateFilter.type(state);
    await this.page.keyboard.press('ArrowDown');
    await this.page.keyboard.press('Enter');
  }

  async exploreAllStateFilter(state: string): Promise<void> {
    await this.filtersButton.click();
    await this.page.locator(':nth-child(1) :nth-child(4) #dropdown-trigger .rounded-md .relative .justify-center .px-2 .items-center .flex-1 #combobox-input').type(state);
    await this.page.keyboard.press('ArrowDown');
    await this.page.keyboard.press('Enter');
  }

  async distanceAndZipCodeFilter(zipCode: string): Promise<void> {
    await this.filtersButton.click();
    await this.page.getByText('Distance').click({ force: true });
    await this.page.waitForTimeout(5000);
    await this.page.keyboard.press('ArrowDown');
    await this.page.keyboard.press('ArrowDown');
    await this.page.keyboard.press('Enter');
    await this.zipCodeFilter.type(zipCode);
  }

  async exploreAllDistanceAndZipCodeFilter(zipCode: string): Promise<void> {
    await this.filtersButton.click();
    await this.page.getByText('Distance').click({ force: true });
    await this.page.waitForTimeout(5000);
    await this.page.keyboard.press('ArrowDown');
    await this.page.keyboard.press('ArrowDown');
    await this.page.keyboard.press('Enter');
    await this.page.locator(':nth-child(1) :nth-child(2) .gap-2 .rounded-md .flex-1 .justify-center').type(zipCode);
  }

  async sortBy(option: string): Promise<void> {
    await this.sortByComboBox.click();
    await this.page.locator(`text=${option}`).click();
  }

  async compareResults(): Promise<string[]> {
    const numberOfItems = await this.page.locator(':nth-child(n) .gap-6 :nth-child(1) .text-lg').count();
    const resolvedInstitutions: string[] = [];
    for (let i = 1; i <= numberOfItems; i++) {
      const selector = `:nth-child(${i}) .gap-6 :nth-child(1) .text-lg`;
      const institution = await this.page.locator(selector).textContent();
      resolvedInstitutions.push(institution ?? '');
    }
    return resolvedInstitutions;
  }

  // Helper methods for getting locators (used in assertions)
  getErrorMessageLocator(message: string): Locator {
    return this.page.getByText(message);
  }

  getDuplicateCourseAddedError(): Locator {
    return this.page.getByText('A duplicate course was added. This will not affect the number of evaluations found.');
  }

  getInstitutionLocator(institutionName: string): Locator {
    return this.page.locator(`text=${institutionName}`);
  }

  getCourseItemLocator(courseSubject: string, courseNumber: string): Locator {
    return this.page.locator(`text=${courseSubject} ${courseNumber}`);
  }

  async clickMyCoursesTab(): Promise<void> {
    await this.myCoursesTab.click();
  }

  async clickDeleteCourseButton(index: number = 0): Promise<void> {
    await this.deleteCourseButton.nth(index).click();
  }

  async pressTab(): Promise<void> {
    await this.page.keyboard.press('Tab');
  }
}
