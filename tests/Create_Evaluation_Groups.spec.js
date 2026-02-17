import { test, expect } from '@playwright/test';
import { loginPage } from '../base_classes/login.js';
import { Filters } from '../base_classes/filters.js';
import { CreateUser } from '../base_classes/CreateUser.js';

test.describe('Create workflow configeration', () => {
    let loginPageObj;
    let filtersObj;
    let CreateUserObj;

    test.beforeEach(async ({ browser }) => {
        const context = await browser.newContext();
        const page = await context.newPage();
        loginPageObj = new loginPage(page);
        filtersObj = new Filters(page);
        await page.goto('');
        loginPageObj = new loginPage(page);
        CreateUserObj = new CreateUser(page);
        await loginPageObj.visit(page);
        await loginPageObj.loginuser("testtriangulator+109@gmail.com", "Triangulator!1", "Institution Admin");
        await CreateUserObj.CreateUserbuttonview();
    });

    test('TC1-Verify user selection dropdown content and order ', async () => {

        await CreateUserObj.createuservalidationerrormsg();
    });
    test('TC2-Verify user deletion functionality in Step', async () => {
        await CreateUserObj.deleteicon();
    });
    test('TC3-Verify zero user selection throws error', async () => {
        await CreateUserObj.Zerousersthrowserror();
    });
    //  test('TC4-Verify user selection dropdown content and order.',async()=>
    //  {
    //    await CreateUserObj.Alphabeticalorder();
    //  });
    test('TC5-Verify all active users can be added to a group.', async () => {
        await CreateUserObj.AllActiveusers();
    })
    test('TC6-Verify error message if the user attempts to create a group with a name that already exists (case sensitive check).', async () => {
        await CreateUserObj.enternumberforcreategrp();
    })
    test('TC7-validate error message upto 250 character lenegh', async () => {
        await CreateUserObj.description250chrlenght();

    });

    test('TC8-Verify that if the user abandons changes, the same error messaging is leveraged for discarding changes.', async () => {
        await CreateUserObj.disacardchanges();




    })
    test.skip('TC9-Verify that the group is saved and visible on the chart on the Workflow configurations page.', async () => {
        await CreateUserObj.workflowgroupview();
        //this should randomly add grp data combinations
        //grp name and droup should not be repeated

    });
    test.skip('TC10-Verify that Step 2 requires a unique group name (not case-sensitive).', async () => {
        await CreateUserObj.uniquegrpname();
    });


});
