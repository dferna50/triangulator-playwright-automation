import { test, expect } from '@playwright/test';
import { loginPage } from '../base_classes/login.js';
import { Filters } from '../base_classes/filters.js';
import { SuggestionsPage } from '../base_classes/suggestions.js';
import BoostRequest from '../base_classes/Boostrequest.js';
//import { fileURLToPath } from 'url';
import { Upload } from '../base_classes/upload.js';



test.describe('MyWorkplace Filters', () => {
    let loginPageObj;
    let filtersObj;
    let Boostrequestobj;
    let SuggestionsPagesobj;
    let uploadobj;

    test.beforeEach(async ({ browser }) => {
        const context = await browser.newContext();
        const page = await context.newPage();
        loginPageObj = new loginPage(page);
        filtersObj = new Filters(page);
       SuggestionsPagesobj=new SuggestionsPage(page);
       Boostrequestobj=new BoostRequest(page);
       uploadobj=new Upload(page);
  


        await page.goto('');
        loginPageObj = new loginPage(page);
        await loginPageObj.visit(page);
        await loginPageObj.loginuser("testtriangulator+109@gmail.com", "Triangulator!1", "Institution Admin");
    });

    test('1.BUG ID:1608-IPEDS Information Not Visible After User Creation', async () => 
        {
        await filtersObj.IPEDfiltersearch1608();
    });
    test('2.BUG ID:1610-Boost results details page changing', async () => 
        {
           await filtersObj.boostrequestlogpartnerinst1610()
        });
        
    test('3.BUG ID:1550-Common Courses Not Visible in Course Search', async () => 
            {
               await filtersObj.coursebycoursesearchNotvisible1550()
            });
    test('4.BUG ID:1536-Page filter not applied correctly',async()=>
        {
             await filtersObj.PagefiltersonStatealign1536()
        });
    test('5.BUG ID-1595-Hide districts for Traingulator admin',async()=>
         {
         await loginPageObj.DistrictHidesforTraingulatorAdmin1595()
         //pending is need to validate even for reviewer login and admission login
});
    test.skip('6.BUG ID-1553 Boost course details missing',async()=>
         {
         await SuggestionsPagesobj.coursedetailscoursedescription1553()
          });
    test('7.BUG ID-1537-Failed to Fetch Error When Requesting Partner Boost',async()=>
         {                                                                                                                                                                                          
          await filtersObj.RequestPatnerboost1537()
          //random name should generate that is pedning
         });
    test('8.BUG ID-1619-Suggest list page column and filter removals', async()=>
    {
       await filtersObj.columnfiltersremoval1619()
    }); 
    test('9.BUG ID-1562 Issues with next Triangulation',async()=>
    {
       await filtersObj.Pastfuturedatecomparision1562()
    });   
    test('10.Bug ID-1580 IPEDS upload fails', async()=>
    {
        await uploadobj.IPEDSuploadfails1580()
        //yet to create object 
    })
    test('11.BUG ID-1597 Unable to upload state connect course data', async()=>
    {
      await uploadobj.Connectcoursecatelog1597()
       //yet to create object 
    });
    test('13.BUG ID-1551 Catalog File Upload Status Stuck in Processing',async()=>
    {
       uploadobj.uploadstatus1551()
          //yet to create object 
    });
    test('14.BUG ID-1568 Rules upload process fails',async()=>
    {
      uploadobj.Rulesuploadprocessfails1568()
         //yet to create object 
    });
    test('15.BUG ID-1555 Missing data in external search pages',async()=>
    {
          await filtersObj.Missingdatasearchpage1555()
    });
    test('16.BUG ID-1564-Issue with submitting find a source course boost request for specific institution',async()=>
    {
        await filtersObj.Instadmin1564()
    });
    test('17.BUG ID-1577-Filter alignment and out of alignment error message',async()=>
    {
        await filtersObj.alignmenterrormessage1577()
    });
    test('18.BUG ID 1563-Suggestions results not returned from OS find source Boost',async()=>
    {
        await SuggestionsPagesobj.suggestionsresults1563()

    });
    test('19.BUG ID 1579-suggestions not checking against existing rules',async()=>
    {
        await SuggestionsPagesobj.sugeesion1578()
        //not yet started
    });
    test('20.BUG ID-1576-Issue with Sia API returning NaN values-triangulator admin-suggestion while loading should not get any api error',async()=>
        {
await SuggestionsPagesobj.NoAPIerror1576()
        })


});
