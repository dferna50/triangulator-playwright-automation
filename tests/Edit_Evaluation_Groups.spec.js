import { test, expect } from '@playwright/test';
import { loginPage } from '../base_classes/login.js';
import { Filters } from '../base_classes/filters.js';
import{EditUser} from'../base_classes/EditUser.js';

    test.describe('Edit workflow configeration', () => {
        var loginPageObj;
        var filtersObj;
      // let CreateUserObj;
        var EditUserObj;
    
        test.beforeEach(async ({ browser }) => {
            const context = await browser.newContext();
            const page = await context.newPage();
            loginPageObj = new loginPage(page);
            filtersObj = new Filters(page);
            await page.goto('');
            loginPageObj = new loginPage(page);
            EditUserObj=new EditUser(page);
            await loginPageObj.visit(page);
            await loginPageObj.loginuser("testtriangulator+109@gmail.com", "Triangulator!1", "Institution Admin");
             // await CreateUserObj.CreateUserbuttonview();
            await EditUserObj.EditUserbuttonview();
        });

test('TC1- Verify access to workflow configurations page.',async()=>
    {
       await EditUserObj.editworkflow();
       //close button is not working

    });
    test('TC2-Verify chart presence on manage groups page TC3-Verify context menu display on group interaction TC4-Verify navigation to edit group page.',async()=>
        {
        await EditUserObj.chartdisplayedit();
        });
        //TC 2,3,4 completed in same TC

    test('TC5-Verify UI consistency with edit peer group',async()=>
    {
   await EditUserObj.comparegrpandeditgroupUsers();
   //close button is not working
    })  ;  
    test('TC7-Verify minimum group member constraint.',async()=>
    {
        await EditUserObj.errormsgforeditusers();
    })
    test('TC8-Verify no maximum group member constraint.',async()=>
    {
        await EditUserObj.NOmaximummember();
    });
    test('TC9-Verify active user availability in dropdown.',async()=>
    {
        await EditUserObj.allactiveusersispresent();
    });
    test('TC10-Verify group name editing ability.TC12-Verify group name allows numbers.',async()=>
    {
    await EditUserObj.editexistinggroup();
    });
    test('TC11-Verify group name uniqueness (case-insensitive).',async()=>
    {
        await EditUserObj.samegroupnameerroemsg();
    });
    test('TC13-Verify group description adding ability.',async()=>
    {
        await EditUserObj.Addgroupdescription();
    });
    test('TC14-Verify group description character limit.',async()=>
    {
      await EditUserObj.editcharlengthforgrpdescription();

    });
    test('TC15-Verify group description with special characters should allow to submit',async()=>
    {
        await EditUserObj.specialchrforgrpdescription();
    });
    test('TC16-Verify special characters in group name field',async()=>
    {
        await EditUserObj.cleargroupnamevalidateerroemsg();
    });
    //not working foe clear group name

    test('TC17-Verify Cancel Functionality on Edit Group Page',async()=>
    {
     await EditUserObj.editgroupcancelbutton();
    });
    test.skip('TC18-Verify that the system displays a warning to the admin when attempting to remove minimum members required from a group',async()=>
    {
     await EditUserObj.Warningmsgremoveingalusers();
    });
});