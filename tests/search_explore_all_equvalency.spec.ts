import { test, expect } from '../fixtures/test';
import searchdata from '../test_data/searchResources.json';

test.describe('Explore All Equivalencies', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('');
    });

    test('Attempt to click on search without selecting from and to institution', async ({ searchPage }) => {
        await searchPage.searchExploreAllEquivalencies();
        await searchPage.searchExploreAllEquivalenciesSearch();
    });

    test('Attempt to click on search without selecting To institution', async ({ searchPage }) => {
        await searchPage.searchExploreAllEquivalencies();
        await searchPage.searchExploreAllEquivalenciesWithoutTo();
        await searchPage.searchExploreAllEquivalenciesSearch();
    });

    test('Attempt to click on search without selecting from institution', async ({ searchPage }) => {
        await searchPage.searchExploreAllEquivalencies();
        await searchPage.searchExploreAllEquivalenciesWithoutFrom();
        await searchPage.searchExploreAllEquivalenciesSearch();
    });

    test("Attempt to click on 'Anywhere' for both search options", async ({ searchPage }) => {
        await searchPage.searchExploreAllEquivalencies();
        await searchPage.searchExploreAllEquivalenciesAssertAnywhere();
    });

    test("Explore equivalencies with to 'Anywhere' search option", async ({ searchPage }) => {
        await searchPage.searchExploreAllEquivalencies();
        await searchPage.searchExploreAllEquivalenciesFrom();
    });

    test("Explore equivalencies with from 'Anywhere' search option", async ({ searchPage }) => {
        await searchPage.searchExploreAllEquivalencies();
        await searchPage.searchExploreAllEquivalenciesTo();
    });

    test('Explore equivalencies with individual institutions', async ({ searchPage }) => {
        await searchPage.searchExploreAllEquivalencies();
        await searchPage.searchExploreAllEquivalenciesInstitutions();
    });

    test.skip('Explore equivalencies pagination', async ({ searchPage }) => {
        await searchPage.searchExploreAllEquivalencies();
        await searchPage.searchExploreAllEquivalenciesFrom();
        await searchPage.searchExploreAllEquivalenciesNavigate();
    });

    test.skip('Explore equivalencies filter state', async ({ page, searchPage }) => {
        await searchPage.searchExploreAllEquivalencies();
        await searchPage.searchExploreAllEquivalenciesFrom();
        await searchPage.exploreAllStateFilter(searchdata.Institution[1].state);
        await page.click('text=Apply');
        await expect(page.locator('text=Filters applied')).toBeVisible();
        await expect(page.locator('text=States:')).toBeVisible();
    });

    test.skip('Explore equivalencies - distance+ZIP filter', async ({ page, searchPage }) => {
        await searchPage.searchExploreAllEquivalencies();
        await searchPage.searchExploreAllEquivalenciesFrom();
        await searchPage.exploreAllDistanceAndZipCodeFilter(searchdata.Institution[1].zipCode);
        await page.click('text=Apply');
        await expect(page.locator('text=Filters applied')).toBeVisible();
        await expect(page.locator('text=Less than')).toBeVisible();
    });

    test.skip('Explore equivalencies sort - Transfer From A-Z', async ({ page, searchPage }) => {
        await searchPage.searchExploreAllEquivalencies();
        await searchPage.searchExploreAllEquivalenciesFrom();
        await searchPage.sortBy('Transfer From A-Z');
        await expect(page.locator('text=Transfer From A-Z')).toBeVisible();
    });

    test.skip('Explore equivalencies sort - Transfer From Z-A', async ({ page, searchPage }) => {
        await searchPage.searchExploreAllEquivalencies();
        await searchPage.searchExploreAllEquivalenciesFrom();
        await searchPage.sortBy('Transfer From Z-A');
        await expect(page.locator('text=Transfer From Z-A')).toBeVisible();
    });

    test.skip('Explore equivalencies sort - Transfer To A-Z', async ({ page, searchPage }) => {
        await searchPage.searchExploreAllEquivalencies();
        await searchPage.searchExploreAllEquivalenciesFrom();
        await searchPage.sortBy('Transfer To A-Z');
        await expect(page.locator('text=Transfer To A-Z')).toBeVisible();
    });

    test.skip('Explore equivalencies sort - Transfer To Z-A', async ({ page, searchPage }) => {
        await searchPage.searchExploreAllEquivalencies();
        await searchPage.searchExploreAllEquivalenciesFrom();
        await searchPage.sortBy('Transfer To Z-A');
        await expect(page.locator('text=Transfer To Z-A')).toBeVisible();
    });
});
