import { test, expect } from '@playwright/test';
import { loginPage } from '../base_classes/login.js';
import { Filters } from '../base_classes/filters.js';


test.describe('MyWorkplace Filters', () => {
    let loginPageObj;
    let filtersObj;
   


    test.beforeEach(async ({ browser }) => {
        const context = await browser.newContext();
        const page = await context.newPage();
        loginPageObj = new loginPage(page);
        filtersObj = new Filters(page);
      


        await page.goto('');
        loginPageObj = new loginPage(page);
        await loginPageObj.visit(page);
        await loginPageObj.loginuser("testtriangulator+109@gmail.com", "Triangulator!1", "Institution Admin");
    });


    test('TC1. navigates to myWorkplace', async () => {
        // filtersObj = new Filters(page);
        await filtersObj.navigatetomyworkplace();
    });


    test('TC2. navigates to IPEDS', async () => {
        await filtersObj.navigatetomyworkplace();
        await filtersObj.navigatetoIPEDS();
    });


    test('filters the ipeds page', async () => {
        await filtersObj.navigatetomyworkplace();
        await filtersObj.navigatetoIPEDS();
        await filtersObj.ipedsFilters();
    });


    test.skip('navigates to district', async () => {
        await filtersObj.navigatetomyworkplace();
        await filtersObj.navigatetodistrict();
    });


    test.skip('filters the district page', async () => {
        await filtersObj.navigatetomyworkplace();
        await filtersObj.navigatetodistrict();
        await filtersObj.ipedsFilters();
    });
});