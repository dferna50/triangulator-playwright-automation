const { test, expect } = require('@playwright/test');
const {Search} = require('../base_classes/search.js');

let search, searchdata;
  

  test.beforeEach(async ({ page }) => {
    await page.goto('');
    search = new Search(page);
    searchdata = require('../test_data/searchResources.json');
  });

  test('Attempt to click on search without selecting from and to institution', async ({ page }) => {
    await search.searchExploreAllEquivalencies(page);
    await search.searchExploreAllEquivalenciesSearch(page);
  });

  test('Attempt to click on search without selecting To institution', async ({ page }) => {
    await search.searchExploreAllEquivalencies(page);
    await search.searchExploreAllEquivalenciesWithoutTo(page);
    await search.searchExploreAllEquivalenciesSearch(page);
  });

  test('Attempt to click on search without selecting from institution', async ({ page }) => {
    await search.searchExploreAllEquivalencies(page);
    await search.searchExploreAllEquivalenciesWithoutFrom(page);
    await search.searchExploreAllEquivalenciesSearch(page);
  });

  test("Attempt to click on 'Anywhere' for both search options", async ({ page }) => {
    await search.searchExploreAllEquivalencies(page);
    await search.searchExploreAllEquivalenciesAssertAnywhere(page);
  });

  test("Explore equivalencies with to 'Anywhere' search option", async ({ page }) => {
    await search.searchExploreAllEquivalencies(page);
    await search.searchExploreAllEquivalenciesFrom(page);
  });

  test("Explore equivalencies with from 'Anywhere' search option", async ({ page }) => {
    await search.searchExploreAllEquivalencies(page);
    await search.searchExploreAllEquivalenciesTo(page);
  });

  test('Explore equivalencies with individual institutions', async ({ page }) => {
    await search.searchExploreAllEquivalencies(page);
    await search.searchExploreAllEquivalenciesInstitutions(page);
  });

  test.skip('Explore equivalencies pagination', async ({ page }) => {
    await search.searchExploreAllEquivalencies(page);
    await search.searchExploreAllEquivalenciesFrom(page);
    await search.searchExploreAllEquivalenciesNavigate(page);
  });

  test.skip('Explore equivalencies filter state', async ({ page }) => {
    await search.searchExploreAllEquivalencies(page);
    await search.searchExploreAllEquivalenciesFrom(page);
    await search.exploreAllStateFilter(page, searchdata.Institution[1].state);
    await page.click('text=Apply');
    await expect(page.locator('text=Filters applied')).toBeVisible();
    await expect(page.locator('text=States:')).toBeVisible();
    await expect(page.locator(':nth-child(1) > .justify-end > .chevron-button > .rounded-full')).toBeVisible();
    await page.click(':nth-child(1) > .justify-end > .chevron-button > .rounded-full');
    await expect(page.locator(':nth-child(2) > .details-root > .text-base')).toBeVisible();
  });

  test.skip('Explore equivalencies - distance+ZIP filter', async ({ page }) => {
    await search.searchExploreAllEquivalencies(page);
    await search.searchExploreAllEquivalenciesFrom(page);
    await search.exploreAllDistanceAndZipCodeFilter(page, searchdata.Institution[1].zipCode);
    await page.click('text=Apply');
    await expect(page.locator('text=Filters applied')).toBeVisible();
    await expect(page.locator('text=Less than')).toBeVisible();
    await expect(page.locator(':nth-child(1) > .justify-end > .chevron-button > .rounded-full')).toBeVisible();
    await page.click(':nth-child(1) > .justify-end > .chevron-button > .rounded-full');
    await expect(page.locator(':nth-child(2) > .details-root > .text-base')).toBeVisible();
  });

  test.skip('Explore equivalencies sort - Transfer From A-Z', async ({ page }) => {
    await search.searchExploreAllEquivalencies(page);
    await search.searchExploreAllEquivalenciesFrom(page);
    await search.sortBy(page, 'Transfer From A-Z');
    await expect(page.locator('text=Transfer From A-Z')).toBeVisible();
    await expect(page.locator(':nth-child(1) > .justify-end > .chevron-button > .rounded-full')).toBeVisible();
    await page.click(':nth-child(1) > .justify-end > .chevron-button > .rounded-full');
    await expect(page.locator(':nth-child(2) > .details-root > .text-base')).toBeVisible();
  });

  test.skip('Explore equivalencies sort - Transfer From Z-A', async ({ page }) => {
    await search.searchExploreAllEquivalencies(page);
    await search.searchExploreAllEquivalenciesFrom(page);
    await search.sortBy(page, 'Transfer From Z-A');
    await expect(page.locator('text=Transfer From Z-A')).toBeVisible();
    await expect(page.locator(':nth-child(1) > .justify-end > .chevron-button > .rounded-full')).toBeVisible();
    await page.click(':nth-child(1) > .justify-end > .chevron-button > .rounded-full');
    await expect(page.locator(':nth-child(2) > .details-root > .text-base')).toBeVisible();
  });

  test.skip('Explore equivalencies sort - Transfer To A-Z', async ({ page }) => {
    await search.searchExploreAllEquivalencies(page);
    await search.searchExploreAllEquivalenciesFrom(page);
    await search.sortBy(page, 'Transfer To A-Z');
    await expect(page.locator('text=Transfer To A-Z')).toBeVisible();
    await expect(page.locator(':nth-child(1) > .justify-end > .chevron-button > .rounded-full')).toBeVisible();
    await page.click(':nth-child(1) > .justify-end > .chevron-button > .rounded-full');
    await expect(page.locator(':nth-child(2) > .details-root > .text-base')).toBeVisible();
  });

  test.skip('Explore equivalencies sort - Transfer To Z-A', async ({ page }) => {
    await search.searchExploreAllEquivalencies(page);
    await search.searchExploreAllEquivalenciesFrom(page);
    await search.sortBy(page, 'Transfer To Z-A');
    await expect(page.locator('text=Transfer To Z-A')).toBeVisible();
    await expect(page.locator(':nth-child(1) > .justify-end > .chevron-button > .rounded-full')).toBeVisible();
    await page.click(':nth-child(1) > .justify-end > .chevron-button > .rounded-full');
    await expect(page.locator(':nth-child(2) > .details-root > .text-base')).toBeVisible();
  });