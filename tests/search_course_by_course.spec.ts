import { test, expect } from '../fixtures/test';
import searchdata from '../test_data/searchResources.json';

test.describe('Search Course by Course', () => {

    test.beforeEach(async ({ page, searchPage }) => {
        await page.goto('');
    });

    test('Search Course by course - Attempt to add search without adding course.', async ({ searchPage }) => {
        await searchPage.searchCourseByCourse();
        await searchPage.searchCourseByCourseInvalidSearch();
    });

    test('Search Course by course - Attempt to add a course with all empty fields.', async ({ searchPage }) => {
        await searchPage.searchCourseByCourse();
        await searchPage.assertWithEmptyFields();
        await expect(searchPage.page.getByText('School is missing')).toBeVisible();
    });

    test('Search Course by course - Attempt to add a course with only institution name', async ({ searchPage }) => {
        test.setTimeout(120000);
        await searchPage.searchCourseByCourse();
        await searchPage.clickMyCoursesTab();
        await searchPage.addInstitutionName('Arizona State');
        await searchPage.assertWithEmptyFields();
        await expect(searchPage.getErrorMessageLocator('Course subject is missing')).toBeVisible();
    });

    test('Search Course by course - Attempt to add a course without course number', async ({ searchPage }) => {
        await searchPage.searchCourseByCourse();
        await searchPage.addInstitutionName(searchdata.Institution[0].institutionName);
        await searchPage.addCourseSubject(searchdata.Courses[0].courseSubject);
        await searchPage.assertWithEmptyFields();
        await expect(searchPage.getErrorMessageLocator('Course number is missing')).toBeVisible();
    });

    test('Search Course by course - Add duplicate course', async ({ searchPage }) => {
        await searchPage.searchCourseByCourse();
        await searchPage.addInstitutionName(searchdata.Institution[0].institutionName);
        for (let i = 0; i < 2; i++) {
            await searchPage.addCourseSubject(searchdata.Courses[0].courseSubject);
            await searchPage.addCourseNumber(searchdata.Courses[0].courseNumber);
            await searchPage.clickPlusButton();
        }
        await expect(searchPage.getDuplicateCourseAddedError()).toBeVisible();
    });

    test('Search Course by course - Remove a previously added course', async ({ searchPage }) => {
        test.setTimeout(60000);
        await searchPage.searchCourseByCourse();
        for (let i = 0; i < 2; i++) {
            await searchPage.addInstitutionName(searchdata.Institution[i].institutionName);
            await searchPage.addCourseSubject(searchdata.Courses[i].courseSubject);
            await searchPage.addCourseNumber(searchdata.Courses[i].courseNumber);
            await searchPage.clickPlusButton();
        }
        await searchPage.getCourseItemLocator(searchdata.Courses[0].courseSubject, searchdata.Courses[0].courseNumber).click();
        await searchPage.pressTab();
        await searchPage.clickDeleteCourseButton(1);
        await expect(searchPage.getCourseItemLocator(searchdata.Courses[0].courseSubject, searchdata.Courses[0].courseNumber)).not.toBeVisible();
    });

    test('Search Course by course - Add multiple courses and view the search result', async ({ searchPage }) => {
        test.setTimeout(60000);
        await searchPage.searchCourseByCourse();
        await searchPage.addInstitutionName(searchdata.Institution[0].institutionName);
        for (let j = 0; j < 2; j++) {
            await searchPage.addCourseSubject(searchdata.Courses[j].courseSubject);
            await searchPage.addCourseNumber(searchdata.Courses[j].courseNumber);
            await searchPage.clickPlusButton();
        }
        await searchPage.clickSearchButton();
    });

    test('Search Course by Course - single course with no filters.', async ({ searchPage }) => {
        await searchPage.searchCourseByCourse();
        await searchPage.searchCourseByCourseValid(
            searchdata.Institution[0].institutionName,
            searchdata.Courses[0].courseSubject,
            searchdata.Courses[0].courseNumber
        );
        await expect(searchPage.getInstitutionLocator(searchdata.Institution[0].institutionName)).toBeVisible();
        await expect(searchPage.getCourseItemLocator(searchdata.Courses[0].courseSubject, searchdata.Courses[0].courseNumber)).toBeVisible();
    });

    test.skip('Search Course by Course - State filter', async ({ searchPage }) => {
        await searchPage.searchCourseByCourse();
        await searchPage.searchCourseByCourseValid(
            searchdata.Institution[0].institutionName,
            searchdata.Courses[0].courseSubject,
            searchdata.Courses[0].courseNumber
        );
        await expect(searchPage.page.locator('.rounded-xl > :nth-child(1)')).toBeVisible();
        await searchPage.stateFilterSearch(searchdata.Institution[0].state);
        await searchPage.clickSearchButton();
        await expect(searchPage.getErrorMessageLocator('Filters applied')).toBeVisible();
        await expect(searchPage.getErrorMessageLocator('States:')).toBeVisible();
    });

    test.skip('Search Course by Course - distance+ZIP filter', async ({ searchPage }) => {
        await searchPage.searchCourseByCourse();
        await searchPage.searchCourseByCourseValid(
            searchdata.Institution[0].institutionName,
            searchdata.Courses[0].courseSubject,
            searchdata.Courses[0].courseNumber
        );
        await searchPage.distanceAndZipCodeFilter(searchdata.Institution[1].zipCode);
        await searchPage.clickSearchButton();
        await expect(searchPage.getErrorMessageLocator('Filters applied')).toBeVisible();
        await expect(searchPage.getErrorMessageLocator('Less than')).toBeVisible();
    });

    test.skip('Search Course by Course - Approved courses percentage(lowest to highest)', async ({ searchPage }) => {
        await searchPage.searchCourseByCourse();
        for (let i = 0; i < 3; i++) {
            await searchPage.addInstitutionName(searchdata.Institution[i].institutionName);
            await searchPage.addCourseSubject(searchdata.Courses[i].courseSubject);
            await searchPage.addCourseNumber(searchdata.Courses[i].courseNumber);
            await searchPage.clickPlusButton();
        }
        await searchPage.clickSearchButton();
        await searchPage.sortBy('Approved course % (lowest to highest)');
        await expect(searchPage.getErrorMessageLocator('Approved course % (lowest to highest)')).toBeVisible();
    });

    test.skip('Search Course by Course - Approved courses percentage(highest to lowest)', async ({ searchPage }) => {
        await searchPage.searchCourseByCourse();
        for (let i = 0; i < 3; i++) {
            await searchPage.addInstitutionName(searchdata.Institution[i].institutionName);
            await searchPage.addCourseSubject(searchdata.Courses[i].courseSubject);
            await searchPage.addCourseNumber(searchdata.Courses[i].courseNumber);
            await searchPage.clickPlusButton();
        }
        await searchPage.clickSearchButton();
        await searchPage.sortBy('Approved course % (highest to lowest)');
        await expect(searchPage.getErrorMessageLocator('Approved course % (highest to lowest)')).toBeVisible();
    });
});
