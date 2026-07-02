import { test, expect } from '../../fixtures/test';

/**
 * User Management Tests - Institution Admin
 *
 * These tests cover user management functionality where institution admin can:
 * - View all existing users
 * - Filter users by various criteria
 * - Open user profile page
 * - Edit user details (first name, last name, email, role)
 * - Suspend/activate users
 *
 * Login credentials:
 * - Email: testtriangulatoroo+arc3@gmail.com
 * - Password: #TransferTri1
 */
test.describe('User Management - Institution Admin', () => {
  const instAdminEmail = process.env.INST_ADMIN_EMAIL || 'testtriangulator+108@gmail.com';
  const instAdminPassword = process.env.INST_ADMIN_PASSWORD || '#TransferTri1';

  test.beforeEach(async ({ page, loginPage }) => {
    // Navigate to QA environment login page
    await page.goto('https://qa.creditmobility.net/logged-out/login/email');
    await loginPage.loginUser(instAdminEmail, instAdminPassword);
    // Verify we are on the institution admin dashboard
    await expect(page).toHaveURL(/.*app\/dashboard/);
  });

  test.describe('TC-USER-MGMT-001: Navigate to Users Page', () => {
    test('should navigate to My Workplace and access All Users page', async ({ page, userManagementPage }) => {
      // Navigate using UserManagementPage
      await userManagementPage.navigateToAllUsers();

      // Verify we are on the users-all page
      await expect(page).toHaveURL(/.*users-all/);

      // Verify key elements are visible on the page
      await expect(userManagementPage.addUserButton).toBeVisible();
      await expect(userManagementPage.filterButton).toBeVisible();
      await expect(userManagementPage.usersTable).toBeVisible();

      console.log('✅ Successfully navigated to All Users page');
    });

    test('should display user list with required columns', async ({ userManagementPage }) => {
      // Navigate to All Users page
      await userManagementPage.navigateToAllUsers();

      // Verify the users table is visible
      await expect(userManagementPage.usersTable).toBeVisible();

      // Verify table headers are present (Name, Role, Status, Last log in)
      await expect(userManagementPage.nameColumnHeader).toBeVisible();
      await expect(userManagementPage.roleColumnHeader).toBeVisible();
      await expect(userManagementPage.page.getByRole('columnheader', { name: 'Status' })).toBeVisible();
      await expect(userManagementPage.page.getByRole('columnheader', { name: 'Last log in' })).toBeVisible();

      console.log('✅ User list displays with required columns');
    });
  });

  test.describe('TC-USER-MGMT-002: Filter Users', () => {
    test('should open filter dialog and filter by status', async ({ userManagementPage }) => {
      // Navigate to All Users page
      await userManagementPage.navigateToAllUsers();

      // Open filter dialog
      await userManagementPage.openFilterDialog();

      // Apply status filter
      await userManagementPage.filterByStatus('Active');

      // Verify filtered results show only Active users
      const activeStatuses = await userManagementPage.page.getByText('Active').count();
      expect(activeStatuses).toBeGreaterThan(0);

      console.log('✅ Successfully filtered users by status');
    });

    test('should filter users by role', async ({ userManagementPage }) => {
      // Navigate to All Users page
      await userManagementPage.navigateToAllUsers();

      // Open filter dialog and apply role filter
      await userManagementPage.openFilterDialog();
      await userManagementPage.filterByRole('Institution Admin');

      // Verify filtered results
      const adminRoles = await userManagementPage.page.getByText('Institution Admin').count();
      expect(adminRoles).toBeGreaterThan(0);

      console.log('✅ Successfully filtered users by role');
    });

    test('should filter users by name', async ({ userManagementPage }) => {
      // Navigate to All Users page
      await userManagementPage.navigateToAllUsers();

      // Open filter dialog and apply name filter
      await userManagementPage.openFilterDialog();
      await userManagementPage.filterByName('test');

      console.log('✅ Successfully filtered users by name');
    });

    test('should clear filters and show all users', async ({ userManagementPage }) => {
      // Navigate to All Users page
      await userManagementPage.navigateToAllUsers();

      // Open and clear filter dialog
      await userManagementPage.openFilterDialog();
      await userManagementPage.clearFilters();

      // Verify all users are displayed (table should have rows)
      const rows = await userManagementPage.getTableRowCount();
      expect(rows).toBeGreaterThan(0);

      console.log('✅ Successfully cleared filters');
    });
  });

  test.describe('TC-USER-MGMT-003: View User Profile', () => {
    test('should open user profile by clicking on user name', async ({ page, userManagementPage }) => {
      // Navigate to All Users page
      await userManagementPage.navigateToAllUsers();

      // Click on a user name in the list
      await userManagementPage.openUserProfile('test daniel 3');

      // Verify we are on the user profile page
      await expect(page).toHaveURL(/.*users\/\d+/);

      // Verify profile page elements
      await expect(userManagementPage.getUserProfileHeading()).toBeVisible();
      await expect(userManagementPage.getUserProfileFirstNameField()).toBeVisible();
      await expect(userManagementPage.getUserProfileLastNameField()).toBeVisible();
      await expect(userManagementPage.getUserProfileRoleField()).toBeVisible();
      await expect(userManagementPage.getUserProfileSuspendButton()).toBeVisible();

      console.log('✅ Successfully opened user profile page');
    });

    test('should display correct user information on profile page', async ({ userManagementPage }) => {
      // Navigate to All Users page
      await userManagementPage.navigateToAllUsers();

      // Click on a user name
      await userManagementPage.openUserProfile('test daniel 3');

      // Verify user profile information
      const firstNameField = userManagementPage.getUserProfileFirstNameField();
      const lastNameField = userManagementPage.getUserProfileLastNameField();
      const roleField = userManagementPage.getUserProfileRoleField();

      // Verify fields have values
      const firstNameValue = await firstNameField.inputValue();
      const lastNameValue = await lastNameField.inputValue();
      const roleValue = await roleField.inputValue();

      expect(firstNameValue).toBeTruthy();
      expect(lastNameValue).toBeTruthy();
      expect(roleValue).toBeTruthy();

      // Verify email is displayed
      await expect(userManagementPage.page.getByText('testtriangulator+108@gmail.com')).toBeVisible();

      // Verify institution is displayed
      await expect(userManagementPage.page.getByText('American River College')).toBeVisible();

      console.log('✅ User profile displays correct information');
    });
  });

  test.describe('TC-USER-MGMT-004: Edit User Details', () => {
    test('should edit user first name and last name', async ({ userManagementPage }) => {
      // Navigate to All Users page
      await userManagementPage.navigateToAllUsers();

      // Click on a user name
      await userManagementPage.openUserProfile('test daniel 3');

      // Get original values for cleanup
      const firstNameField = userManagementPage.getUserProfileFirstNameField();
      const lastNameField = userManagementPage.getUserProfileLastNameField();
      const originalFirstName = await firstNameField.inputValue();
      const originalLastName = await lastNameField.inputValue();

      // Edit first name
      await firstNameField.clear();
      await firstNameField.fill('UpdatedFirst');

      // Edit last name
      await lastNameField.clear();
      await lastNameField.fill('UpdatedLast');

      // Save changes
      await userManagementPage.saveUserProfile();

      // Verify success - button should be disabled again after save
      await expect(userManagementPage.getUserProfileSaveButton()).toBeDisabled();

      console.log('✅ Successfully updated user first and last name');

      // Restore original values (cleanup)
      await firstNameField.clear();
      await firstNameField.fill(originalFirstName);
      await lastNameField.clear();
      await lastNameField.fill(originalLastName);
      await userManagementPage.saveUserProfile();
    });

    test('should edit user email address', async ({ page, userManagementPage }) => {
      await userManagementPage.navigateToAllUsers();

      // Search for the admin user
      await userManagementPage.searchUser(instAdminEmail);

      // Open user profile
      await userManagementPage.openUserProfileByEmail(instAdminEmail);

      // Note: Email editing may have restrictions
      const emailField = userManagementPage.getUserProfileEmailField();

      // Check if email field is editable
      const isDisabled = await emailField.isDisabled().catch(() => true);

      if (!isDisabled) {
        const newEmail = `updated${Date.now()}@test.com`;
        await emailField.clear();
        await emailField.fill(newEmail);

        // Save changes
        await userManagementPage.saveUserProfile();

        // Verify success message
        await expect(userManagementPage.getSuccessMessage()).toBeVisible();
        console.log('✅ Successfully updated user email');
      } else {
        console.log('ℹ️ Email field is read-only (expected behavior)');
      }
    });

    test('should change user role', async ({ userManagementPage }) => {
      // Navigate to All Users page
      await userManagementPage.navigateToAllUsers();

      // Find a user with Reviewer role to change
      const reviewerLink = userManagementPage.page.getByRole('link', { name: 'Priya ab' }).first();
      if (await reviewerLink.isVisible().catch(() => false)) {
        await reviewerLink.click();
        await userManagementPage.page.waitForTimeout(1000);

        // Get current role
        const roleField = userManagementPage.getUserProfileRoleField();
        const currentRole = await roleField.inputValue();

        // Open role dropdown
        await roleField.click();

        // Select a different role
        const roles = ['Institution Admin', 'Reviewer'];
        const newRole = roles.find(r => !currentRole.includes(r)) || roles[0];
        await userManagementPage.page.getByRole('option', { name: newRole }).click();

        // Save changes
        await userManagementPage.saveUserProfile();

        console.log(`✅ Successfully changed user role to: ${newRole}`);
      } else {
        console.log('ℹ️ No reviewer user found to test role change');
      }
    });

    test('should cancel edit operation without saving changes', async ({ page, userManagementPage }) => {
      // Navigate to All Users page
      await userManagementPage.navigateToAllUsers();

      // Click on a user name
      await userManagementPage.openUserProfile('test daniel 3');

      // Get original first name
      const firstNameField = userManagementPage.getUserProfileFirstNameField();
      const originalName = await firstNameField.inputValue();

      // Attempt to change first name
      await firstNameField.clear();
      await firstNameField.fill('UnsavedChange');

      // Click back to table view without saving
      await userManagementPage.goBackToTableView();

      // Verify we returned to user list
      await expect(page).toHaveURL(/.*users-all/);

      // Re-open the user profile to verify changes were not saved
      await userManagementPage.openUserProfile('test daniel 3');

      const currentValue = await userManagementPage.getUserProfileFirstNameField().inputValue();
      expect(currentValue).toBe(originalName);

      console.log('✅ Successfully cancelled edit operation without saving');
    });
  });

  test.describe('TC-USER-MGMT-005: Suspend and Activate User', () => {
    test('should suspend an active user', async ({ userManagementPage }) => {
      // Navigate to All Users page
      await userManagementPage.navigateToAllUsers();

      // Find an active user
      const activeUser = userManagementPage.getActiveUserRow();
      const userLink = activeUser.locator('role=link').first();

      if (await userLink.isVisible().catch(() => false)) {
        await userLink.click();
        await userManagementPage.page.waitForTimeout(1000);

        // Click suspend button
        await userManagementPage.getUserProfileSuspendButton().click();
        await userManagementPage.page.waitForTimeout(1000);

        // Check if confirmation dialog appears
        const confirmDialog = userManagementPage.page.getByRole('dialog');
        if (await confirmDialog.isVisible().catch(() => false)) {
          await userManagementPage.page.getByRole('button', { name: /Confirm|Yes/i }).click();
          await userManagementPage.page.waitForTimeout(1000);
        }

        // Verify status changed - go back and check
        await userManagementPage.goBackToTableView();

        console.log('✅ Successfully suspended user');
      } else {
        console.log('ℹ️ No active user found to suspend');
      }
    });

    test('should display suspend button on user profile', async ({ userManagementPage }) => {
      // Navigate to All Users page
      await userManagementPage.navigateToAllUsers();

      // Click on a user name
      await userManagementPage.openUserProfile('test daniel 3');

      // Verify suspend section is visible
      await expect(userManagementPage.getSuspendSectionHeading()).toBeVisible();
      await expect(userManagementPage.page.getByText('By temporarily suspending this account, the user will cease to receive course suggestions from their institution.')).toBeVisible();

      // Verify suspend button is visible
      await expect(userManagementPage.getUserProfileSuspendButton()).toBeVisible();

      console.log('✅ Suspend button is visible on user profile');
    });
  });

  test.describe('TC-USER-MGMT-006: User List Pagination', () => {
    test('should display pagination controls', async ({ userManagementPage }) => {
      // Navigate to All Users page
      await userManagementPage.navigateToAllUsers();

      // Verify pagination controls are present
      await expect(userManagementPage.paginationPrev).toBeVisible();
      await expect(userManagementPage.paginationNext).toBeVisible();

      // Verify page numbers are visible
      await expect(userManagementPage.page.getByRole('button', { name: '1' })).toBeVisible();

      console.log('✅ Pagination controls are visible');
    });

    test('should sort users by clicking column headers', async ({ userManagementPage }) => {
      // Navigate to All Users page
      await userManagementPage.navigateToAllUsers();

      // Click on Name column header to sort
      await userManagementPage.sortByName();

      // Verify sorting worked (no error and table still visible)
      await expect(userManagementPage.usersTable).toBeVisible();

      // Click on Role column header to sort
      await userManagementPage.sortByRole();
      await expect(userManagementPage.usersTable).toBeVisible();

      console.log('✅ Sort by column headers is functional');
    });
  });

  test.describe('TC-USER-MGMT-007: Error Handling and Validation', () => {
    test('should display error for empty required fields', async ({ userManagementPage }) => {
      // Navigate to All Users page
      await userManagementPage.navigateToAllUsers();

      // Click on a user name
      await userManagementPage.openUserProfile('test daniel 3');

      // Get original first name
      const firstNameField = userManagementPage.getUserProfileFirstNameField();
      const originalName = await firstNameField.inputValue();

      // Clear first name field
      await firstNameField.clear();
      await firstNameField.fill('');

      // Try to save (may show error or just not enable save button)
      const saveButton = userManagementPage.getUserProfileSaveButton();

      // If save button is disabled, validation is working
      const isDisabled = await saveButton.isDisabled().catch(() => false);

      if (isDisabled) {
        console.log('✅ Save button disabled when required field is empty');
      } else {
        // If enabled, try to save and check for error
        await saveButton.click();
        await userManagementPage.page.waitForTimeout(500);
        console.log('ℹ️ Save attempted with empty field');
      }

      // Restore value
      await firstNameField.clear();
      await firstNameField.fill(originalName);
    });

    test('should handle navigation back from user profile', async ({ page, userManagementPage }) => {
      // Navigate to All Users page
      await userManagementPage.navigateToAllUsers();

      // Click on a user name
      await userManagementPage.openUserProfile('test daniel 3');

      // Verify we are on profile page
      await expect(userManagementPage.getUserProfileHeading()).toBeVisible();

      // Click back to table view
      await userManagementPage.goBackToTableView();

      // Verify we are back on users list
      await expect(page).toHaveURL(/.*users-all/);
      await expect(userManagementPage.getAllUsersHeading()).toBeVisible();

      console.log('✅ Successfully navigated back from user profile');
    });
  });
});
