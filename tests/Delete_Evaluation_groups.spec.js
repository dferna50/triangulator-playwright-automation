import { test, expect } from '@playwright/test';
import { loginPage } from '../base_classes/login.js';
import{DeleteUser} from'../base_classes/DeleteUser.js';
test.describe('Delete workflow configeration', () => {
    var loginPageObj;
    var DeleteUserObj;

    test.beforeEach(async ({ browser }) => {
        const context = await browser.newContext();
        const page = await context.newPage();
        loginPageObj = new loginPage(page);
        await page.goto('');
        DeleteUserObj=new DeleteUser(page);
        await loginPageObj.visit(page);
        await loginPageObj.loginuser("testtriangulator+107@gmail.com", "Triangulator!12", "Institution Admin");
       await DeleteUserObj.Deleteworkflowconfiguration();
    });
    test('TC1-Verify delete group option access for Inst Admin',async()=>
        {
           await DeleteUserObj.Deleticonvisible();
    
        });
    test('TC2-Verify pop-up when deleting a group that is part of a workflow.',async()=>
    {  
       await DeleteUserObj.Deletepopup();
    });
    test('TC3-Verify cancel deletion of a group that is part of workflow using cancel button.',async()=>
        {  
           await DeleteUserObj.deletecancelbutton();
        });
    test('TC4-Verify cancel deletion of a group that is part of workflow using X button.',async()=>
       {  
           await DeleteUserObj.deleteXbutton();
        });
    test('TC5-Verify confirmation pop-up when deleting a group that is not part of a workflow.',async()=>
        {  
           await DeleteUserObj.Deletegrppopupforever();
        });
    test.skip('TC6-Verify successful deletion of a group that is not part of a workflow.',async()=>
        {  
            await DeleteUserObj.Deletesuccessfully();
        });
    test.skip('TC7-Verify group is removed from New Account page after deletion.',async()=>
      {  
          await DeleteUserObj.DelGrpNotVisible();
             });
});