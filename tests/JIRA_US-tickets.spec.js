import { test, expect } from '@playwright/test';
import { loginPage } from '../base_classes/login.js';
import { workflowconfiguration } from '../base_classes/workflowconfiguration.js';

test.describe('US_Tickets', () => {
    var loginPageObj;
    var workflowconfigurationObj;

    test.beforeEach(async ({ browser }) => {
        const context = await browser.newContext();
        const page = await context.newPage();
        loginPageObj = new loginPage(page);
        await page.goto('');
        await loginPageObj.visit(page);
       workflowconfigurationObj = new workflowconfiguration(page);
        await loginPageObj.loginuser("testtriangulator+108@gmail.com", "Triangulator!1", "Institution Admin");
        await workflowconfigurationObj.groupname();
    });

    test('US_1515- To verify users present in group should show proper validation error message while suspenidng same users', async()=>
        {
           await workflowconfigurationObj.groupnameusererrormsg();
         
        });

    test('US_1516- To verify users should proper validation which is not present in the group',async()=>
            {
               await workflowconfigurationObj.groupnameusernotinvolvederrormsg();
             
            });
       //----------------------create my own workflow------------------------------
       test.skip('TC3-To verify INstituion admin roles should navigate to account page and check groups',async()=>
    {
        await workflowconfigurationObj.useraccountinstadmin();
    })
    // test('TC4-To verify no workflow icon should be present on accout page',async()=>
    // {
    //     await workflowconfigurationObj.Noworkflowicon();
    // })
    //----------for reviewer admin----------------------
    test.skip('TC5-To verify reviewer admin roles should navigate to account page and check groups',async()=>
    {
        await workflowconfigurationObj.Reviewer_rolegrpcheck();
    })
    
//-------------------------- Jira ASU tickets------------------------------------------
 test.skip('US_1655-To verify display workflow details page',async()=>
    {
        // in progress
        await workflowconfigurationObj.Workfloedetailspage();
    })
    test.skip('US_1349-Update inst admin dashboard',async()=>
        //its working now
    {
        await workflowconfigurationObj.othersuggestionspageclick();
    })
    test.skip('US_1300-To verify allow inst admin and reviewer to include a note while reviewing',async()=>
    {
        await workflowconfigurationObj.Notewhilereviewing();
    })
    test.skip('BUG_1626-To verify display State Connect Toggle Defaults to OFF for Newly Created Users',async()=>
    {
        //for creating new user state connect toggle should be ON
        await workflowconfigurationObj.StateconnecttoggleON();
    })
});