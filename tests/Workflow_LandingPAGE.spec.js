import { test, expect } from '@playwright/test';
import { loginPage } from '../base_classes/login.js';
import { WorkflowLandingPage } from '../base_classes/WorkflowConfigurationLandingPage.js';

test.describe('Workflow_LandingPAGE', () => {
    let loginPageObj;
    let WorkflowLandingPageObj;

    test.beforeEach(async ({ browser }) => {
        const context = await browser.newContext();
        const page = await context.newPage();
        loginPageObj = new loginPage(page);
        await page.goto('');
        await loginPageObj.visit(page);
        WorkflowLandingPageObj = new WorkflowLandingPage(page);
        await loginPageObj.loginuser("testtriangulator+108@gmail.com", "Triangulator!1", "Institution Admin");
        await WorkflowLandingPageObj.workflow();
    });

    test('TC1-Verify Workflow configuration page location.', async () => {
        await WorkflowLandingPageObj.workflowviewpropercontext();
    });
    // test('TC2-Verify heading text on Workflow configurations page.', async () => {
    //     await WorkflowLandingPageObj.headingtext();
    //     pending need to cover
    // });
    test('TC3-Verify the sub text of the Workflow configurations page.', async () => {
     await WorkflowLandingPageObj.subtextworkflow();
    });
     test('TC4-Verify that the See all link exists on the Workflow configurations page.', async () => {
        await WorkflowLandingPageObj.seealllink();
    });
    test('TC5-Verify the heading text on the new Workflow configurations page.', async () => {
        await WorkflowLandingPageObj.headingtextnewworkflow();
    });

     test('TC6-Verify Manage groups section existence.', async () => {
        await WorkflowLandingPageObj.Managegrpvisible();
    });
    test('TC7-Verify sub text in Manage groups section existence.', async () => {
        await WorkflowLandingPageObj.subtextmanagegrp();
    });
     test('TC8-Verify Create group button functionality.', async () => {
         await WorkflowLandingPageObj.Popupwindowoccurs();
     });

    test('TC9-Verify the chart display on Manage evaluation groups page.', async () => {
        await WorkflowLandingPageObj.Managegrpexistancelanding();
    });
    test('TC10-Verify the three dots functionality.', async () => {
        await WorkflowLandingPageObj.clickthreedotsgrp();
    });
    test('TC11-Verify Manage workflow section existence.', async () => {
        await WorkflowLandingPageObj.ManageworkflowExistance();
    });
    test('TC12,13,14,15,16-Verify sub text in Manage workflow section.', async () => {
        await WorkflowLandingPageObj.Subtextmanageworkflow();
    });
    test('TC17-Verify the View functionality.', async () => {
        await WorkflowLandingPageObj.workflownameviewbutton();
    });
     test.skip('TC-18Verify the Edit functionality.', async () => {
        await WorkflowLandingPageObj.workflownameeditbutton();
    });
     test('TC-19Verify the Delete functionality.', async () => {
        await WorkflowLandingPageObj.workflownamedelbutton();
    });

});
