import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { BoostRequestPage } from '../pages/BoostRequestPage';

const pimaadmin = 'testtriangulator+108@gmail.com';
const password = 'Triangulator!1';

test('debug dropdown close', async ({ page }) => {
  await page.goto('');
  const login = new LoginPage(page);
  await login.loginUser(pimaadmin, password);
  const boost = new BoostRequestPage(page);
  await boost.navigateToBoostSuggestions();
  await boost.clickPartnerInstitutionCard();
  await page.waitForTimeout(2000);

  // Use BoostRequestPage methods with exact matching
  await boost.selectSourceInstitutionLevel('At least 2 but less than 4 years');
  await boost.selectSourceState('Arizona');
  await boost.selectSourceInstitution('Central Arizona College');

  // Check if minimum score is enabled
  const minScore = page.getByRole('textbox', { name: 'Minimum score', exact: true });
  const enabled = await minScore.isEnabled().catch(() => false);
  console.log('minScoreEnabled:', enabled);

  await page.screenshot({ path: 'dropdown-debug-fixed.png' });

  expect(enabled).toBe(true);
});
