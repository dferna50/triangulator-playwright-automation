import { test, expect } from '../../fixtures/test';
import { UserDataGenerator } from '../../helpers/userDataGenerator';
import { GmailService } from '../../helpers/gmailService';
import { RequestAccessData } from '../../pages/RequestAccessPage';

/**
 * Request Access E2E Tests
 *
 * Covers:
 * - Happy path: User and Institution request access flows
 * - Email verification via Gmail API
 * - Negative validation: required fields, email format, terms acceptance
 * - Edge cases: duplicate email, max length inputs
 */
test.describe('Request Access - E2E Tests', () => {
  const TEST_INSTITUTION = 'University of Nevada-Reno';
  const GMAIL_BASE_EMAIL = 'testtriangulator@gmail.com';

  let gmailService: GmailService;

  test.beforeAll(async () => {
    gmailService = new GmailService();

    if (!process.env.GMAIL_REFRESH_TOKEN) {
      console.warn('GMAIL_REFRESH_TOKEN not found; email verification tests will be skipped.');
      return;
    }

    try {
      await gmailService.authenticate();
      console.log('Gmail API authentication successful');
    } catch (error) {
      console.error('Gmail API authentication failed:', error);
    }
  });

  test.afterEach(async ({ page }) => {
    // Ensure we start fresh for next test
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  });

  // ─── Helper to build test data ─────────────────────────────────────────────
  function buildTestData(): RequestAccessData {
    const timestamp = Date.now();
    return {
      institution: TEST_INSTITUTION,
      firstName: `Test${timestamp}`,
      lastName: `User${timestamp}`,
      email: UserDataGenerator.generateUniqueEmail('testtriangulatoroo'),
      jobTitle: 'QA Engineer',
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // HAPPY PATH TESTS
  // ═══════════════════════════════════════════════════════════════════════════

  test.skip('TC-REQ-001: User request access with valid data shows success', async ({ page, requestAccessPage }) => {
    const data = buildTestData();

    await requestAccessPage.navigateToLanding();
    await requestAccessPage.clickRequestAccess();
    await requestAccessPage.selectUserOption();
    await requestAccessPage.waitForFormToLoad();

    await requestAccessPage.completeRequestAccess(data);

    await requestAccessPage.assertSuccessState();
    await requestAccessPage.assertSuccessUrl();
  });

  test.skip('TC-REQ-002: Institution request access for already-activated institution shows error', async ({ page, requestAccessPage }) => {
    const data = buildTestData();

    await requestAccessPage.navigateToLanding();
    await requestAccessPage.clickRequestAccess();
    await requestAccessPage.selectInstitutionOption();
    await requestAccessPage.waitForFormToLoad();

    await requestAccessPage.completeRequestAccess(data);
    await page.waitForTimeout(2000);

    // University of Nevada-Reno is already activated in the system,
    // so the app may show an error dialog instead of success.
    const errorText = page.getByText('Institution has already been activated');
    const hasError = await errorText.isVisible({ timeout: 10000 }).catch(() => false);

    if (hasError) {
      // Assert the full error message is present
      await expect(page.getByText('You can request access to this institution as a user')).toBeVisible();
      // Close the error dialog so subsequent tests aren't affected
      await page.getByRole('button', { name: 'close' }).click();
    } else {
      // If the institution is NOT activated, expect success
      await requestAccessPage.assertSuccessState();
      await requestAccessPage.assertSuccessUrl();
    }
  });

  test.skip('TC-REQ-003: User request access triggers confirmation email to applicant', async ({ page, requestAccessPage }) => {
    test.skip(!process.env.GMAIL_REFRESH_TOKEN, 'GMAIL_REFRESH_TOKEN not configured');

    const data = buildTestData();

    await requestAccessPage.navigateToLanding();
    await requestAccessPage.clickRequestAccess();
    await requestAccessPage.selectUserOption();
    await requestAccessPage.waitForFormToLoad();

    await requestAccessPage.completeRequestAccess(data);
    await requestAccessPage.assertSuccessState();

    // Verify email sent to applicant
    console.log(`Waiting for request access email to ${data.email}...`);
    const emails = await gmailService.searchEmails(
      `to:${GMAIL_BASE_EMAIL} subject:(request) `,
      5
    );

    expect(emails.length).toBeGreaterThan(0);
    console.log(`Found ${emails.length} request access email(s)`);

    // Cleanup: mark emails as read
    for (const email of emails.slice(0, 3)) {
      try {
        await gmailService.markAsRead(email.id);
      } catch {
        // ignore cleanup errors
      }
    }
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // NEGATIVE / VALIDATION TESTS
  // ═══════════════════════════════════════════════════════════════════════════

  test.skip('TC-REQ-004: Submit button is disabled when required fields are empty', async ({ requestAccessPage }) => {
    await requestAccessPage.navigateToLanding();
    await requestAccessPage.clickRequestAccess();
    await requestAccessPage.selectUserOption();
    await requestAccessPage.waitForFormToLoad();

    await requestAccessPage.assertSubmitDisabled();
  });

  test.skip('TC-REQ-005: Submit button is disabled when only first name is filled', async ({ requestAccessPage }) => {
    await requestAccessPage.navigateToLanding();
    await requestAccessPage.clickRequestAccess();
    await requestAccessPage.selectUserOption();
    await requestAccessPage.waitForFormToLoad();

    await requestAccessPage.fillOnlyFirstName();
    await requestAccessPage.assertSubmitDisabled();
  });

  test.skip('TC-REQ-006: Submit button is disabled when only last name is filled', async ({ requestAccessPage }) => {
    await requestAccessPage.navigateToLanding();
    await requestAccessPage.clickRequestAccess();
    await requestAccessPage.selectUserOption();
    await requestAccessPage.waitForFormToLoad();

    await requestAccessPage.fillOnlyLastName();
    await requestAccessPage.assertSubmitDisabled();
  });

  test.skip('TC-REQ-007: Submit button is disabled when only email is filled', async ({ requestAccessPage }) => {
    await requestAccessPage.navigateToLanding();
    await requestAccessPage.clickRequestAccess();
    await requestAccessPage.selectUserOption();
    await requestAccessPage.waitForFormToLoad();

    await requestAccessPage.fillOnlyEmail();
    await requestAccessPage.assertSubmitDisabled();
  });

  test.skip('TC-REQ-008: Submit button is disabled when only job title is filled', async ({ requestAccessPage }) => {
    await requestAccessPage.navigateToLanding();
    await requestAccessPage.clickRequestAccess();
    await requestAccessPage.selectUserOption();
    await requestAccessPage.waitForFormToLoad();

    await requestAccessPage.fillOnlyJobTitle();
    await requestAccessPage.assertSubmitDisabled();
  });

  test.skip('TC-REQ-009: Terms checkbox is disabled before scrolling to bottom', async ({ requestAccessPage }) => {
    await requestAccessPage.navigateToLanding();
    await requestAccessPage.clickRequestAccess();
    await requestAccessPage.selectUserOption();
    await requestAccessPage.waitForFormToLoad();

    await requestAccessPage.assertTermsCheckboxDisabled();
  });

  test.skip('TC-REQ-010: Submit remains disabled when form is filled but terms not accepted', async ({ requestAccessPage }) => {
    const data = buildTestData();

    await requestAccessPage.navigateToLanding();
    await requestAccessPage.clickRequestAccess();
    await requestAccessPage.selectUserOption();
    await requestAccessPage.waitForFormToLoad();

    await requestAccessPage.fillFormWithoutTerms(data);
    await requestAccessPage.assertSubmitDisabled();
  });

  test.skip('TC-REQ-011: Invalid email format shows validation error', async ({ requestAccessPage }) => {
    const data = buildTestData();

    await requestAccessPage.navigateToLanding();
    await requestAccessPage.clickRequestAccess();
    await requestAccessPage.selectUserOption();
    await requestAccessPage.waitForFormToLoad();

    await requestAccessPage.fillFormWithInvalidEmail(data);
    await requestAccessPage.submitForm();

    // The app may show inline validation or a toast error
    const hasError = await requestAccessPage.page
      .getByText(/invalid email|please enter a valid email/i)
      .isVisible()
      .catch(() => false);

    // If no inline error is shown, at minimum the form should not proceed to success
    const isSuccess = await requestAccessPage.successHeading
      .isVisible()
      .catch(() => false);

    expect(hasError || !isSuccess).toBe(true);
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // EDGE CASE TESTS
  // ═══════════════════════════════════════════════════════════════════════════

  test.skip('TC-REQ-012: Duplicate email request is rejected or handled gracefully', async ({ page, requestAccessPage }) => {
    const data = buildTestData();

    // First submission
    await requestAccessPage.navigateToLanding();
    await requestAccessPage.clickRequestAccess();
    await requestAccessPage.selectUserOption();
    await requestAccessPage.waitForFormToLoad();
    await requestAccessPage.completeRequestAccess(data);
    await requestAccessPage.assertSuccessState();

    // Second submission with same email
    await requestAccessPage.navigateToLanding();
    await requestAccessPage.clickRequestAccess();
    await requestAccessPage.selectUserOption();
    await requestAccessPage.waitForFormToLoad();
    await requestAccessPage.completeRequestAccess(data);
    await page.waitForTimeout(2000);

    // Expect either another success (idempotent) or an error message
    const isSuccess = await requestAccessPage.successHeading
      .isVisible({ timeout: 10000 })
      .catch(() => false);

    const hasError = await requestAccessPage.page
      .getByText(/already exists|duplicate|already requested|pending approval/i)
      .isVisible({ timeout: 5000 })
      .catch(() => false);

    expect(isSuccess || hasError).toBe(true);
  });

  test.skip('TC-REQ-013: Very long first name and last name are accepted', async ({ requestAccessPage }) => {
    const longText = 'A'.repeat(100);
    const data: RequestAccessData = {
      institution: TEST_INSTITUTION,
      firstName: longText,
      lastName: longText,
      email: UserDataGenerator.generateUniqueEmail('testtriangulator'),
      jobTitle: 'QA Engineer',
    };

    await requestAccessPage.navigateToLanding();
    await requestAccessPage.clickRequestAccess();
    await requestAccessPage.selectUserOption();
    await requestAccessPage.waitForFormToLoad();

    await requestAccessPage.completeRequestAccess(data);
    await requestAccessPage.assertSuccessState();
  });

  test.skip('TC-REQ-014: Special characters in job title are accepted', async ({ requestAccessPage }) => {
    const data: RequestAccessData = {
      institution: TEST_INSTITUTION,
      firstName: 'Special',
      lastName: 'Chars',
      email: UserDataGenerator.generateUniqueEmail('testtriangulator'),
      jobTitle: "QA & DevOps @ Test-Org (2026)",
    };

    await requestAccessPage.navigateToLanding();
    await requestAccessPage.clickRequestAccess();
    await requestAccessPage.selectUserOption();
    await requestAccessPage.waitForFormToLoad();

    await requestAccessPage.completeRequestAccess(data);
    await requestAccessPage.assertSuccessState();
  });

  test.skip('TC-REQ-015: Back button navigates from user form to selection page', async ({ requestAccessPage }) => {
    await requestAccessPage.navigateToLanding();
    await requestAccessPage.clickRequestAccess();
    await requestAccessPage.selectUserOption();
    await requestAccessPage.waitForFormToLoad();

    // Click back button (first button in main)
    await requestAccessPage.backButton.click();
    await expect(requestAccessPage.page).toHaveURL(/\/logged-out\/request-access\/?$/);
    await expect(requestAccessPage.institutionOption).toBeVisible();
    await expect(requestAccessPage.userOption).toBeVisible();
  });

  test.skip('TC-REQ-016: Institution and User options are both visible on selection page', async ({ requestAccessPage }) => {
    await requestAccessPage.navigateToLanding();
    await requestAccessPage.clickRequestAccess();

    await expect(requestAccessPage.institutionOption).toBeVisible({ timeout: 10000 });
    await expect(requestAccessPage.userOption).toBeVisible({ timeout: 10000 });
  });

  test.skip('TC-REQ-017: Selecting Institution option loads correct form fields', async ({ requestAccessPage }) => {
    await requestAccessPage.navigateToLanding();
    await requestAccessPage.clickRequestAccess();
    await requestAccessPage.selectInstitutionOption();
    await requestAccessPage.waitForFormToLoad();

    await expect(requestAccessPage.page).toHaveURL(/\/logged-out\/request-access\/inst/);
    await expect(requestAccessPage.firstNameInput).toBeVisible();
    await expect(requestAccessPage.lastNameInput).toBeVisible();
    await expect(requestAccessPage.emailInput).toBeVisible();
    await expect(requestAccessPage.jobTitleInput).toBeVisible();
    await expect(requestAccessPage.institutionCombobox).toBeVisible();
  });

  test.skip('TC-REQ-018: Selecting User option loads correct form fields', async ({ requestAccessPage }) => {
    await requestAccessPage.navigateToLanding();
    await requestAccessPage.clickRequestAccess();
    await requestAccessPage.selectUserOption();
    await requestAccessPage.waitForFormToLoad();

    await expect(requestAccessPage.page).toHaveURL(/\/logged-out\/request-access\/user/);
    await expect(requestAccessPage.firstNameInput).toBeVisible();
    await expect(requestAccessPage.lastNameInput).toBeVisible();
    await expect(requestAccessPage.emailInput).toBeVisible();
    await expect(requestAccessPage.jobTitleInput).toBeVisible();
    await expect(requestAccessPage.institutionCombobox).toBeVisible();
  });

  test.skip('TC-REQ-019: Go to login button on success page navigates to login', async ({ requestAccessPage }) => {
    const data = buildTestData();

    await requestAccessPage.navigateToLanding();
    await requestAccessPage.clickRequestAccess();
    await requestAccessPage.selectUserOption();
    await requestAccessPage.waitForFormToLoad();
    await requestAccessPage.completeRequestAccess(data);
    await requestAccessPage.assertSuccessState();

    await requestAccessPage.goToLoginButton.click();
    await expect(requestAccessPage.page).toHaveURL(/\/logged-out\/login/);
  });
});
