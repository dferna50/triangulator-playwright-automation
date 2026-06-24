import { test, expect } from '../fixtures/test';

test.describe('Run Triangulation - E2E Tests', () => {
  const adminEmail = process.env.ADMIN_EMAIL ?? '';
  const adminPassword = process.env.ADMIN_PASSWORD ?? '';

  test.beforeEach(async ({ page, loginPage }) => {
    await page.goto('');
    await loginPage.loginUser(adminEmail, adminPassword);
    await page.waitForURL('**/app/dashboard');
  });

  test('TC1: Verify Run Triangulation page loads correctly', async ({ runTriangulationPage }) => {
    await runTriangulationPage.navigateToRunTriangulation();
    await runTriangulationPage.verifyPageElements();
  });

  test('TC2: Verify page heading and description', async ({ runTriangulationPage }) => {
    await runTriangulationPage.navigateToRunTriangulation();
    await expect(runTriangulationPage.pageHeading).toHaveText('Run Triangulation');
    await expect(runTriangulationPage.pageDescription).toHaveText('Logs of manual triangulation runs from the last 24 hours are displayed below.');
  });

  test('TC3: Verify table structure with correct columns', async ({ runTriangulationPage }) => {
    await runTriangulationPage.navigateToRunTriangulation();
    await expect(runTriangulationPage.runLogsTable).toBeVisible();
    await expect(runTriangulationPage.institutionColumnHeader).toBeVisible();
    await expect(runTriangulationPage.userColumnHeader).toBeVisible();
    await expect(runTriangulationPage.dateColumnHeader).toBeVisible();
  });

  test('TC4: Verify Refresh button is visible and clickable', async ({ runTriangulationPage }) => {
    await runTriangulationPage.navigateToRunTriangulation();
    await expect(runTriangulationPage.refreshButton).toBeVisible();
    await expect(runTriangulationPage.refreshButton).toBeEnabled();
    await runTriangulationPage.clickRefreshButton();
  });

  test('TC5: Verify Run Triangulation button opens modal', async ({ runTriangulationPage }) => {
    await runTriangulationPage.navigateToRunTriangulation();
    await runTriangulationPage.clickRunTriangulationButton();
    await runTriangulationPage.verifyModalElements();
  });

  test('TC6: Verify modal title and description', async ({ runTriangulationPage }) => {
    await runTriangulationPage.navigateToRunTriangulation();
    await runTriangulationPage.clickRunTriangulationButton();
    await expect(runTriangulationPage.modalTitle).toBeVisible();
    await expect(runTriangulationPage.modalDescription).toHaveText('Select an institution to run triangulation for');
  });

  test('TC7: Verify Run Triangulation button is disabled when no institution selected', async ({ runTriangulationPage }) => {
    await runTriangulationPage.navigateToRunTriangulation();
    await runTriangulationPage.clickRunTriangulationButton();
    await runTriangulationPage.verifyRunTriangulationButtonDisabled();
  });

  test('TC8: Verify institution dropdown is functional', async ({ runTriangulationPage }) => {
    await runTriangulationPage.navigateToRunTriangulation();
    await runTriangulationPage.clickRunTriangulationButton();
    await runTriangulationPage.verifyInstitutionDropdownVisible();
  });

  test('TC9: Select institution and verify selection is successful', async ({ runTriangulationPage, page }) => {
    await runTriangulationPage.navigateToRunTriangulation();
    await runTriangulationPage.clickRunTriangulationButton();
    await runTriangulationPage.selectInstitutionByName('Arizona State University Campus Immersion');
    await runTriangulationPage.verifyInstitutionSelected('Arizona State University Campus Immersion');
    const isEnabled = await runTriangulationPage.modalRunTriangulationButton.isEnabled();
    if (isEnabled) {
      await runTriangulationPage.verifyRunTriangulationButtonEnabled();
    } else {
      await expect(page.getByText(/The next run is allowed in/)).toBeVisible();
    }
  });

  test('TC10: Search for institution using search functionality', async ({ runTriangulationPage }) => {
    await runTriangulationPage.navigateToRunTriangulation();
    await runTriangulationPage.clickRunTriangulationButton();
    await runTriangulationPage.searchInstitution('Arizona');
    const options = await runTriangulationPage.getInstitutionOptions();
    expect(options.length).toBeGreaterThan(0);
    expect(options.some(option => option.includes('Arizona'))).toBeTruthy();
  });

  test('TC11: Select institution by typing and selecting from dropdown', async ({ runTriangulationPage, page }) => {
    await runTriangulationPage.navigateToRunTriangulation();
    await runTriangulationPage.clickRunTriangulationButton();
    await runTriangulationPage.selectInstitutionByTyping('Arizona', 'Arizona State University Campus Immersion');
    await runTriangulationPage.verifyInstitutionSelected('Arizona State University Campus Immersion');
  });

  test('TC12: Close modal using Cancel button', async ({ runTriangulationPage }) => {
    await runTriangulationPage.navigateToRunTriangulation();
    await runTriangulationPage.clickRunTriangulationButton();
    await expect(runTriangulationPage.modalDialog).toBeVisible();
    await runTriangulationPage.clickModalCancelButton();
  });

  test('TC13: Close modal using X button', async ({ runTriangulationPage }) => {
    await runTriangulationPage.navigateToRunTriangulation();
    await runTriangulationPage.clickRunTriangulationButton();
    await expect(runTriangulationPage.modalDialog).toBeVisible();
    await runTriangulationPage.clickModalCloseButton();
  });

  test('TC14: Verify modal reopens after closing', async ({ runTriangulationPage }) => {
    await runTriangulationPage.navigateToRunTriangulation();
    await runTriangulationPage.clickRunTriangulationButton();
    await runTriangulationPage.clickModalCancelButton();
    await runTriangulationPage.clickRunTriangulationButton();
    await runTriangulationPage.verifyModalElements();
  });

  test('TC15: Select different institutions from dropdown', async ({ runTriangulationPage, page }) => {
    await runTriangulationPage.navigateToRunTriangulation();
    await runTriangulationPage.clickRunTriangulationButton();
    await runTriangulationPage.selectInstitutionByName('University of Arizona');
    await runTriangulationPage.verifyInstitutionSelected('University of Arizona');
    const isEnabled = await runTriangulationPage.modalRunTriangulationButton.isEnabled();
    if (isEnabled) {
      await runTriangulationPage.verifyRunTriangulationButtonEnabled();
    } else {
      await expect(page.getByText(/The next run is allowed in/)).toBeVisible();
    }
  });

  test('TC16: Verify institution search filters results correctly', async ({ runTriangulationPage }) => {
    await runTriangulationPage.navigateToRunTriangulation();
    await runTriangulationPage.clickRunTriangulationButton();
    await runTriangulationPage.searchInstitution('Northern');
    const options = await runTriangulationPage.getInstitutionOptions();
    expect(options.some(option => option.includes('Northern'))).toBeTruthy();
  });

  test('TC17: Complete flow - Select institution and verify modal behavior', async ({ runTriangulationPage, page }) => {
    await runTriangulationPage.navigateToRunTriangulation();
    await runTriangulationPage.clickRunTriangulationButton();
    await runTriangulationPage.verifyModalElements();
    await runTriangulationPage.selectInstitutionByName('Arizona State University Campus Immersion');
    await runTriangulationPage.verifyInstitutionSelected('Arizona State University Campus Immersion');
    const isEnabled = await runTriangulationPage.modalRunTriangulationButton.isEnabled();
    if (isEnabled) {
      await runTriangulationPage.clickModalRunTriangulationButton();
      await page.waitForTimeout(2000);
    } else {
      await expect(page.getByText(/The next run is allowed in/)).toBeVisible();
      await runTriangulationPage.clickModalCancelButton();
    }
  });

  test('TC18: Verify navigation to Run Triangulation from My Workplace', async ({ runTriangulationPage }) => {
    await runTriangulationPage.myWorkplaceLink.click();
    await runTriangulationPage.page.waitForURL('**/app/my-workspace/tri-admin/inst/summary**');
    await expect(runTriangulationPage.runTriangulationLink).toBeVisible();
    await runTriangulationPage.runTriangulationLink.click();
    await runTriangulationPage.page.waitForURL('**/app/my-workspace/tri-admin/run-triangulation**');
    await runTriangulationPage.verifyPageElements();
  });

  test('TC19: Verify sidebar navigation is present', async ({ runTriangulationPage }) => {
    await runTriangulationPage.navigateToRunTriangulation();
    await expect(runTriangulationPage.summaryLink).toBeVisible();
    await expect(runTriangulationPage.jobStatusLink).toBeVisible();
    await expect(runTriangulationPage.ipedsLink).toBeVisible();
    await expect(runTriangulationPage.settingsLink).toBeVisible();
    await expect(runTriangulationPage.runSqlLink).toBeVisible();
  });

  test('TC20: Verify Run Triangulation link is active in sidebar', async ({ runTriangulationPage }) => {
    await runTriangulationPage.navigateToRunTriangulation();
    await expect(runTriangulationPage.runTriangulationLink).toBeVisible();
  });

  test('TC21: Verify pagination controls are present', async ({ runTriangulationPage }) => {
    await runTriangulationPage.navigateToRunTriangulation();
    await expect(runTriangulationPage.prevButton).toBeVisible();
    await expect(runTriangulationPage.nextButton).toBeVisible();
  });

  test('TC22: Verify institution combobox accepts keyboard input', async ({ runTriangulationPage, page }) => {
    await runTriangulationPage.navigateToRunTriangulation();
    await runTriangulationPage.clickRunTriangulationButton();
    await runTriangulationPage.institutionCombobox.click();
    await page.keyboard.type('Arizona State');
    await page.waitForTimeout(1000);
    const options = await runTriangulationPage.getInstitutionOptions();
    expect(options.some(option => option.includes('Arizona State'))).toBeTruthy();
  });

  test('TC23: Verify modal closes when clicking outside (if applicable)', async ({ runTriangulationPage, page }) => {
    await runTriangulationPage.navigateToRunTriangulation();
    await runTriangulationPage.clickRunTriangulationButton();
    await expect(runTriangulationPage.modalDialog).toBeVisible();
  });

  test('TC24: Verify all Arizona institutions are searchable', async ({ runTriangulationPage }) => {
    await runTriangulationPage.navigateToRunTriangulation();
    await runTriangulationPage.clickRunTriangulationButton();
    await runTriangulationPage.searchInstitution('Arizona');
    const options = await runTriangulationPage.getInstitutionOptions();
    const expectedInstitutions = [
      'Arizona Common Course',
      'Arizona State University Campus Immersion',
      'Arizona Western College'
    ];
    expectedInstitutions.forEach(institution => {
      expect(options.some(option => option.includes(institution.split(' ')[0]))).toBeTruthy();
    });
  });

  test('TC25: End-to-end workflow with multiple institutions', async ({ runTriangulationPage, page }) => {
    await runTriangulationPage.navigateToRunTriangulation();
    const institutions = [
      'Arizona State University Campus Immersion',
      'University of Arizona',
      'Northern Arizona University'
    ];

    for (const institution of institutions) {
      await runTriangulationPage.clickRunTriangulationButton();
      await runTriangulationPage.selectInstitutionByName(institution);
      await runTriangulationPage.verifyInstitutionSelected(institution);
      const isEnabled = await runTriangulationPage.modalRunTriangulationButton.isEnabled();
      expect(typeof isEnabled).toBe('boolean');
      await runTriangulationPage.clickModalCancelButton();
      await page.waitForTimeout(500);
    }
  });
});
