const { test, expect } = require('@playwright/test');
 const {Search} = require('../base_classes/search.js');
let searchInstance ; 
const searchdata = require('../test_data/searchResources.json');

    test.beforeEach(async ({ browser }) => {
        const context = await browser.newContext();
        const page = await context.newPage();
        searchInstance = new Search(page);
        await page.goto('');
         // Replace cy.fixture with direct JSON import
    });

    test('Search Course by course - Attempt to add search without adding course.', async () => {
        await searchInstance.searchCourseByCourse();
        await searchInstance.searchCourseByCourseInvalidSearch();
    });

    test('Search Course by course - Attempt to add a course with all empty fields.', async () => {
        await searchInstance.searchCourseByCourse();
        await searchInstance.assertWithEmptyFields();
        await expect(searchInstance.page.getByText('School is missing')).toBeVisible();
    });

    test('Search Course by course - Attempt to add a course with only institution name', async () => {
        test.setTimeout(120000);
        await searchInstance.searchCourseByCourse();
        await searchInstance.page.getByText('My courses').click();
        await searchInstance.addInstitutionName("Arizona State");
        await searchInstance.assertWithEmptyFields();
        await expect(searchInstance.page.getByText('Course subject prefix is missing')).toBeVisible();
    });

    test('Search Course by course - Attempt to add a course without course number', async () => {
        await searchInstance.searchCourseByCourse();
        await searchInstance.addInstitutionName( searchdata.Institution[0].institutionName, searchdata.Institution[0].ipedState);
        await searchInstance.addCourseSubject( searchdata.Courses[0].courseSubject);
        await searchInstance.assertWithEmptyFields();
        await expect(searchInstance.page.getByText('Course number is missing')).toBeVisible();
    });

    test('Search Course by course - Add duplicate course', async () => {
        await searchInstance.searchCourseByCourse();
        await searchInstance.addInstitutionName(searchdata.Institution[0].institutionName, searchdata.Institution[0].ipedState);
        for (let i = 0; i < 2; i++) {
            await searchInstance.addCourseSubject( searchdata.Courses[0].courseSubject);
            await searchInstance.addCourseNumber( searchdata.Courses[0].courseNumber);
            await searchInstance.clickPlusButton();
        }
        await expect(searchInstance.page.getByText('A duplicate course was added. This will not affect the number of evaluations found.')).toBeVisible();
    });

    test('Search Course by course - Remove a previously added course', async () => {
        test.setTimeout(60000);
        await searchInstance.searchCourseByCourse();
        for (let i = 0; i < 2; i++) {
            await searchInstance.addInstitutionName( searchdata.Institution[i].institutionName, searchdata.Institution[i].ipedState);
            await searchInstance.addCourseSubject( searchdata.Courses[i].courseSubject);
            await searchInstance.addCourseNumber( searchdata.Courses[i].courseNumber);
            await searchInstance.clickPlusButton();
        }
        await searchInstance.page.locator(`text=${searchdata.Courses[0].courseSubject} ${searchdata.Courses[0].courseNumber}`).click();
        await searchInstance.page.keyboard.press('Tab');
        //await searchInstance.page.locator(`text=${searchdata.Courses[0].courseSubject} ${searchdata.Courses[0].courseNumber}`).click();
        await searchInstance.page.getByRole('button', { name: 'Delete course' }).nth(1).click();
        await expect(searchInstance.page.locator(`text=${searchdata.Courses[0].courseSubject} ${searchdata.Courses[0].courseNumber}`)).not.toBeVisible();
    });

    test('Search Course by course - Add multiple courses and view the search result', async () => {
        test.setTimeout(60000)
        await searchInstance.searchCourseByCourse();
        for (let i = 0; i < 3; i++) {
            await searchInstance.addInstitutionName( searchdata.Institution[i].institutionName, searchdata.Institution[i].ipedState);
            for (let j = 0; j < 10; j++) {
                await searchInstance.addCourseSubject( searchdata.Courses[j].courseSubject);
                await searchInstance.addCourseNumber( searchdata.Courses[j].courseNumber);
                await searchInstance.clickPlusButton();
            }
        }
        await searchInstance.clickSearchButton();
    });

    test('Search Course by Course - single course with no filters.', async () => {
        await searchInstance.searchCourseByCourse();
        await searchInstance.searchCourseByCourseValid(searchdata.Institution[0].institutionName, searchdata.Courses[0].courseSubject, searchdata.Courses[0].courseNumber, searchdata.Institution[0].ipedState);
        await expect(searchInstance.page.locator(`text=${searchdata.Institution[0].institutionName}`)).toBeVisible();
        await expect(searchInstance.page.locator(`text=${searchdata.Courses[0].courseSubject} ${searchdata.Courses[0].courseNumber}`)).toBeVisible();
    });

    test.skip('Search Course by Course - State filter', async () => {
        await searchInstance.searchCourseByCourse();
        await searchInstance.searchCourseByCourseValid( searchdata.Institution[0].institutionName, searchdata.Courses[0].courseSubject, searchdata.Courses[0].courseNumber, searchdata.Institution[0].ipedState);
        await expect(searchInstance.page.locator('.rounded-xl > :nth-child(1)')).toBeVisible();
        await searchInstance.stateFilterSearch( searchdata.Institution[0].state);
        await searchInstance.page.click('text=Apply');
        await expect(searchInstance.page.getByText('Filters applied')).toBeVisible();
        await expect(searchInstance.page.getByText('States:')).toBeVisible();
    });

    test.skip('Search Course by Course - distance+ZIP filter', async () => {
        await searchInstance.searchCourseByCourse();
        await searchInstance.searchCourseByCourseValid(searchdata.Institution[0].institutionName, searchdata.Courses[0].courseSubject, searchdata.Courses[0].courseNumber, searchdata.Institution[0].ipedState);
        await searchInstance.distanceAndZipeCodeFilter( searchdata.Institution[1].zipCode);
        await searchInstance.page.getByText('Apply').click();
        await expect(searchInstance.page.getByText('Filters applied')).toBeVisible();
        await expect(searchInstance.page.getByText('Less than')).toBeVisible();
    });

    test.skip('Search Course by Course - Approved courses percentage(lowest to highest)', async () => {
        await searchInstance.searchCourseByCourse();
        for (let i = 0; i < 3; i++) {
            await searchInstance.addInstitutionName( searchdata.Institution[i].institutionName, searchdata.Institution[i].ipedState);
            await searchInstance.addCourseSubject( searchdata.Courses[i].courseSubject);
            await searchInstance.addCourseNumber( searchdata.Courses[i].courseNumber);
            await searchInstance.clickPlusButton();
        }
        await searchInstance.clickSearchButton();
        await searchInstance.sortBy( 'Approved course % (lowest to highest)');
        await expect(searchInstance.page.getByText('Approved course % (lowest to highest)')).toBeVisible();
    });

    test.skip('Search Course by Course - Approved courses percentage(highest to lowest)', async () => {
        await searchInstance.searchCourseByCourse();
        for (let i = 0; i < 3; i++) {
            await searchInstance.addInstitutionName( searchdata.Institution[i].institutionName, searchdata.Institution[i].ipedState);
            await searchInstance.addCourseSubject( searchdata.Courses[i].courseSubject);
            await searchInstance.addCourseNumber( searchdata.Courses[i].courseNumber);
            await searchInstance.clickPlusButton();
        }
        await searchInstance.clickSearchButton();
        await searchInstance.sortBy( 'Approved course % (highest to lowest)');
        await expect(searchInstance.page.getByText('Approved course % (highest to lowest)')).toBeVisible();
    });
