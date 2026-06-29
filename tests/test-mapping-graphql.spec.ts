import { test, expect } from '../fixtures/test';

test('Listen to GraphQL requests during Institution Mapping dialog', async ({ page, loginPage, institutionMappingsPage }) => {
  const triAdminEmail = process.env.TRI_ADMIN_EMAIL ?? 'creditmobility@asu.edu';
  const triAdminPassword = process.env.TRI_ADMIN_PASSWORD ?? 'Triangulator!1';

  page.on('request', req => {
    if (req.url().includes('graphql')) {
      console.log(`GraphQL Request: ${req.postData()}`);
    }
  });

  page.on('response', async res => {
    if (res.url().includes('graphql')) {
      try {
        const body = await res.json();
        console.log(`GraphQL Response: ${res.status()} ${JSON.stringify(body).substring(0, 300)}`);
      } catch (err) {
        console.log(`GraphQL Response Parse Error: ${err}`);
      }
    }
  });

  await page.goto('');
  await loginPage.visit();
  await loginPage.loginUser(triAdminEmail, triAdminPassword);
  
  await page.waitForURL('**/app/dashboard');
  await institutionMappingsPage.navigateToMyWorkplace();
  await institutionMappingsPage.navigateToInstitutionMappings();
  await institutionMappingsPage.clickAddMapping();

  // Wait 3 seconds
  await page.waitForTimeout(3000);

  console.log('--- Clicking organization combobox in mapping dialog ---');
  await institutionMappingsPage.organizationCombobox.click();
  await page.waitForTimeout(2000);

  console.log('Options in mapping dialog:', await page.getByRole('option').allTextContents().catch(() => []));

  await page.screenshot({ path: 'scratch/dialog_mapping_inspect.png' });
});
