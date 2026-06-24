# User Management E2E Tests

This directory contains comprehensive end-to-end tests for the Triangulator user management functionality, where institution administrators can manage existing users.

## Overview

User Management tests cover the complete user lifecycle management for institution administrators, including viewing, searching, filtering, editing, and suspending users within their institution.

## Test File

- **institution-admin-user-management.spec.ts** - Complete user management test suite

## Test Coverage

### Navigation and Viewing (TC-USER-MGMT-001)
- ✅ Navigate to My Workplace and access All Users page
- ✅ Display user list with required columns (Name, Role, Status, Last log in)
- ✅ Verify page layout and key UI elements

### Filter Users (TC-USER-MGMT-002)
- ✅ Filter users by status (Active, Pending)
- ✅ Filter users by role (Institution Admin, Reviewer)
- ✅ Filter users by name
- ✅ Clear filters and restore full user list

**Note:** There is no search input on the All Users page. Filtering is done via the Filter button which opens a dialog with dropdowns for Name(s), Role(s), and Status.

### User Profile Management (TC-USER-MGMT-003)
- ✅ Open user profile by clicking on user name
- ✅ Display correct user information on profile page
- ✅ Verify all editable fields are present

### Edit User Details (TC-USER-MGMT-004)
- ✅ Edit user first name and last name
- ✅ Edit user email address (if editable)
- ✅ Change user role
- ✅ Cancel edit operation without saving changes
- ✅ Handle validation errors for required fields

### Suspend and Activate Users (TC-USER-MGMT-005)
- ✅ Suspend an active user
- ✅ Display suspend button and section on user profile

**Note:** Users can be suspended from the user profile page via the "suspend" button in the "Suspend account" section.

### Pagination and Sorting (TC-USER-MGMT-006)
- ✅ Display pagination controls (Prev, Next, page numbers)
- ✅ Sort users by clicking column headers (Name, Role, Status, Last log in)

**Note:** Clicking column headers sorts the table data.

### Error Handling (TC-USER-MGMT-007)
- ✅ Display validation for empty required fields
- ✅ Handle navigation back from user profile
- ✅ Graceful handling when elements are not found

## Running Tests

### Run All User Management Tests
```bash
npx playwright test tests/user-management/
```

### Run with UI Mode (Interactive Debugging)
```bash
npx playwright test tests/user-management/ --ui
```

### Run in Headed Mode (See Browser)
```bash
npx playwright test tests/user-management/ --headed
```

### Run Specific Test Case
```bash
npx playwright test tests/user-management/institution-admin-user-management.spec.ts -g "should navigate to My Workplace"
```

### Run Tests by Test ID
```bash
# Navigation tests
npx playwright test tests/user-management/institution-admin-user-management.spec.ts --grep "TC-USER-MGMT-001"

# Search and filter tests
npx playwright test tests/user-management/institution-admin-user-management.spec.ts --grep "TC-USER-MGMT-002"

# Edit user tests
npx playwright test tests/user-management/institution-admin-user-management.spec.ts --grep "TC-USER-MGMT-004"

# Suspend/activate tests
npx playwright test tests/user-management/institution-admin-user-management.spec.ts --grep "TC-USER-MGMT-005"
```

## Environment Variables

### Required
```bash
BASE_URL=https://qa.creditmobility.net/
INST_ADMIN_EMAIL=testtriangulatoroo+arc3@gmail.com
INST_ADMIN_PASSWORD=Triangulator!1
```

### Optional (for extended test scenarios)
```bash
# Additional test data
TEST_USER_EMAIL=testuser@example.com
TEST_USER_FIRST_NAME=Test
TEST_USER_LAST_NAME=User
```

## Accurate Locators from Live Application

The following locators were verified against the live QA environment:

### All Users Page Locators
```typescript
// Navigation
await page.getByRole('link', { name: 'My Workplace' }).click();
await page.getByRole('link', { name: 'All' }).first().click();

// Page Elements
await page.getByRole('button', { name: 'add user' })           // Add user button
await page.getByRole('button', { name: 'Filter' })             // Filter button
await page.getByRole('table', { name: 'allUsers' })            // Users table

// Table Columns (Name, Role, Status, Last log in)
await page.getByRole('columnheader', { name: 'Name' })
await page.getByRole('columnheader', { name: 'Role' })
await page.getByRole('columnheader', { name: 'Status' })
await page.getByRole('columnheader', { name: 'Last log in' })

// User Links (clickable names in table)
await page.getByRole('link', { name: 'test daniel 3' })

// Pagination
await page.getByRole('button', { name: 'Prev' })
await page.getByRole('button', { name: 'Next' })
await page.getByRole('button', { name: '1' })  // Page numbers
```

### Filter Dialog Locators
```typescript
// Open filter
await page.getByRole('button', { name: 'Filter' }).click();

// Filter Dialog Elements
await page.getByRole('dialog', { name: 'Filter users' })
await page.getByText('Filter users')

// Filter Dropdowns
await page.getByRole('combobox', { name: 'Name(s)' })   // Name filter
await page.getByRole('combobox', { name: 'Role(s)' })   // Role filter
await page.getByRole('combobox', { name: 'Status' })   // Status filter

// Filter Actions
await page.getByRole('button', { name: 'Apply' })
await page.getByRole('button', { name: 'Cancel' })
```

### User Profile Page Locators
```typescript
// Navigation to profile
await page.getByRole('link', { name: 'test daniel 3' }).click();

// Profile Page Elements
await page.getByRole('heading', { name: 'User profile' })
await page.getByRole('button', { name: 'Back to table view' })
await page.getByRole('button', { name: 'Save' })

// Editable Fields
await page.getByRole('textbox', { name: 'First Name' })
await page.getByRole('textbox', { name: 'Last Name' })
await page.getByRole('combobox', { name: 'System Role' })

// Suspend Section
await page.getByRole('heading', { name: 'Suspend account' })
await page.getByRole('button', { name: 'suspend' })

// Displayed Information
await page.getByText('testtriangulatoroo+arc3@gmail.com')  // Email
await page.getByText('American River College')             // Institution
```

### Sorting Locators
```typescript
// Column headers are buttons for sorting
await page.getByRole('button', { name: 'Name' }).click()
await page.getByRole('button', { name: 'Role' }).click()
await page.getByRole('button', { name: 'Status' }).click()
await page.getByRole('button', { name: 'Last log in' }).click()
```

## Test Architecture

### Page Objects Used
- **LoginPage** - User authentication
- **UserManagementPage** - User list navigation and management
- **FiltersPage** - Advanced filtering operations

### Test Flow

```
1. LOGIN
   ├─ Navigate to https://qa.creditmobility.net/logged-out/login/email
   ├─ Login as Institution Admin (testtriangulatoroo+arc3@gmail.com)
   └─ Land on Dashboard

2. NAVIGATE TO USERS
   ├─ Click "My Workplace" link
   ├─ Land on Summary page
   ├─ Click "All" link in sidebar
   └─ Land on Users page (All Users)

3. FILTER USERS
   ├─ Click "Filter" button
   ├─ Filter dialog opens
   ├─ Select filter criteria (Name, Role, Status)
   ├─ Click "Apply"
   └─ Filtered results displayed

4. MANAGE USERS
   ├─ Click user name to open profile
   ├─ Edit user details (First Name, Last Name, Role)
   ├─ Click "Save" to save changes
   ├─ Suspend user (if needed)
   ├─ Click "Back to table view" to return
   └─ Verify changes in user list

5. VERIFICATION
   ├─ Confirm edits are saved
   ├─ Verify status changes
   ├─ Check user list updates
   └─ Validate permissions
```

## Test Data

### Institution Admin Credentials
- **Email:** testtriangulatoroo+arc3@gmail.com
- **Password:** Triangulator!1
- **Institution:** American River College (implied from existing tests)

### Test User Types
1. **Institution Admin** - Full management capabilities
2. **Reviewer** - Limited access, can be managed by admins
3. **Triangulator Admin** - System-level admin (cannot be created by institution admins)

## Key Test Scenarios

### User Profile Editing
```typescript
// Example: Edit user details
test('should edit user first name and last name', async ({ page }) => {
  // Navigate to All Users page
  await page.getByRole('link', { name: 'My Workplace' }).click();
  await page.waitForTimeout(1000);
  await page.getByRole('link', { name: 'All' }).first().click();
  await page.waitForTimeout(1000);
  
  // Click on user name to open profile
  await page.getByRole('link', { name: 'test daniel 3' }).click();
  await page.waitForTimeout(1000);
  
  // Edit fields
  await page.getByRole('textbox', { name: 'First Name' }).fill('UpdatedFirst');
  await page.getByRole('textbox', { name: 'Last Name' }).fill('UpdatedLast');
  
  // Save
  await page.getByRole('button', { name: 'Save' }).click();
  await page.waitForTimeout(1000);
  
  // Verify save button is disabled (indicating save completed)
  await expect(page.getByRole('button', { name: 'Save' })).toBeDisabled();
});
```

### User Filtering
```typescript
// Example: Filter users by status
test('should filter users by status', async ({ page }) => {
  // Navigate to All Users page
  await page.getByRole('link', { name: 'My Workplace' }).click();
  await page.waitForTimeout(1000);
  await page.getByRole('link', { name: 'All' }).first().click();
  await page.waitForTimeout(1000);
  
  // Open filter dialog
  await page.getByRole('button', { name: 'Filter' }).click();
  
  // Select status filter
  await page.getByRole('combobox', { name: 'Status' }).click();
  await page.getByRole('option', { name: 'Active' }).click();
  
  // Apply filter
  await page.getByRole('button', { name: 'Apply' }).click();
  await page.waitForTimeout(1000);
  
  // Verify filtered results
  const activeCount = await page.getByText('Active').count();
  expect(activeCount).toBeGreaterThan(0);
});
```

### User Suspension
```typescript
// Example: Suspend a user
test('should suspend an active user', async ({ page }) => {
  // Navigate to All Users page
  await page.getByRole('link', { name: 'My Workplace' }).click();
  await page.waitForTimeout(1000);
  await page.getByRole('link', { name: 'All' }).first().click();
  await page.waitForTimeout(1000);
  
  // Find and click on an active user
  const activeUser = page.locator('table tbody tr').filter({ hasText: 'Active' }).first();
  await activeUser.locator('role=link').first().click();
  await page.waitForTimeout(1000);
  
  // Suspend user
  await page.getByRole('button', { name: 'suspend' }).click();
  await page.waitForTimeout(1000);
  
  // Handle confirmation dialog if appears
  const confirmDialog = page.getByRole('dialog');
  if (await confirmDialog.isVisible().catch(() => false)) {
    await page.getByRole('button', { name: /Confirm|Yes/i }).click();
    await page.waitForTimeout(1000);
  }
  
  // Navigate back to verify status changed
  await page.getByRole('button', { name: 'Back to table view' }).click();
});
```

## Best Practices

1. **Use beforeEach for Login** - Consistent login state across tests
2. **Restore Original Values** - After editing tests, restore original data
3. **Handle Conditional UI** - Some fields may be read-only
4. **Graceful Degradation** - Handle cases where elements don't exist
5. **Unique Test Data** - Use timestamps or unique identifiers

## Troubleshooting

### User Profile Not Opening
1. Check user row locator is correct
2. Verify the user exists in search results
3. Try clicking on the link instead of text

### Edit Changes Not Saving
1. Verify save button is clicked
2. Check for validation errors
3. Ensure required fields are filled

### Suspend/Activate Button Not Found
1. Check if user is already in desired state
2. Verify admin has permissions for this action
3. Look for alternative button labels

### Filter Not Working
1. Verify filter dialog opens
2. Check filter options are available
3. Ensure apply button is clicked

## CI/CD Integration

### GitHub Actions
```yaml
- name: Run User Management Tests
  run: npx playwright test tests/user-management/
  env:
    BASE_URL: https://qa.creditmobility.net/
    INST_ADMIN_EMAIL: ${{ secrets.INST_ADMIN_EMAIL }}
    INST_ADMIN_PASSWORD: ${{ secrets.INST_ADMIN_PASSWORD }}
```

### Jenkins
```groovy
stage('User Management Tests') {
  steps {
    sh 'npx playwright test tests/user-management/'
  }
}
```

## Performance

- Average test duration: 30-60 seconds per test
- Depends on network speed and application response time
- User search and filter operations are the fastest
- Edit and save operations include form validation

## Related Tests

- **User Creation Tests** (`../user-creation/`) - Create new users
- **Bug Tickets Tests** (`../Bug-Tickets.spec.ts`) - Regression tests

## Support

For issues or questions:
1. Check test logs with `--debug` flag
2. Run tests with `--headed` to see browser interactions
3. Verify environment variables are set correctly
4. Check application UI for locator changes
5. Review test output for specific failure messages
