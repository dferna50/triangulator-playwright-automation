# Institution Configuration - Test Plan

## Feature Overview
The Institution Configuration feature allows institution admins to set exclusion parameters so certain types of courses are not suggested by the Triangulator. When a configuration is applied (e.g., ENG 101), suggestions with that target course are filtered out from the My Triangulator tab.

**URL**: `https://qa.creditmobility.net/app/my-workspace/inst-admin/inst/settings/suggestion-configs`

**Navigation Path**: Login → My Workplace → Settings → Institution configurations → See all

---

## Configuration Types (7 total)

| # | Configuration | Form Fields | Checkbox |
|---|--------------|-------------|----------|
| 1 | **Lower Division** | Minimum value (combobox), Maximum value (combobox) | — |
| 2 | **Upper Division** | Minimum value (combobox), Maximum value (combobox) | "Do not suggest lower division courses to my upper division courses", "Exclude from boost suggestions" |
| 3 | **Developmental** | Course subject (combobox), Minimum value (text), Maximum value (text) | "Exclude from suggestions" |
| 4 | **Graduate** | Minimum value (text), Maximum value (text) | "Exclude from suggestions" |
| 5 | **Special Topic** | Course subject (combobox), Course Number (combobox) | "Exclude from boost suggestions" |
| 6 | **Inactive Courses** | Course subject (combobox), Course Number (combobox), Min course number range (text), Max course number range (text), Course title (text) | "Make course inactive" |
| 7 | **Suggestion Minimum Data** | — | Title, Description, Min/Max hours (checkboxes) |

---

## Configuration List Table Columns
- Configuration (name + count)
- Title
- Course subject
- Minimum value
- Maximum value
- Inactive min
- Inactive max
- Condition (Defined/Not Defined)

---

## Test Scenarios

### 1. Navigation Tests

#### TC1.1: Navigate to Institution Configuration Page
**Steps:**
1. Login as institution admin (`testtriangulator+108@gmail.com`)
2. Click "My Workplace" in top navigation
3. Click "Settings" in sidebar
4. Verify "Institution configurations" heading is visible
5. Click "See all" link under Institution configurations
6. Verify URL is `/app/my-workspace/inst-admin/inst/settings/suggestion-configs`
7. Verify page title "Institution configurations" is visible
8. Verify "Add Configuration" button is visible
9. Verify configuration table headers are visible

**Expected**: Page loads with configuration list and Add Configuration button

#### TC1.2: Navigate Back to Settings from Configuration Page
**Steps:**
1. Navigate to Institution Configuration page
2. Click "Return to Institution Settings" back button
3. Verify URL changes to `/app/my-workspace/inst-admin/inst/settings/`

**Expected**: User returns to Settings page

---

### 2. Add Configuration Tests

#### TC2.1: Open Add Configuration Dialog
**Steps:**
1. Navigate to Institution Configuration page
2. Click "Add Configuration" button
3. Verify dialog "Add configurations" appears
4. Verify "Configuration" dropdown is visible
5. Verify "Cancel" and "Submit" buttons are visible

**Expected**: Add configuration dialog opens with Configuration dropdown

#### TC2.2: Verify All Seven Configuration Types Available
**Steps:**
1. Open Add Configuration dialog
2. Click Configuration dropdown
3. Verify all 7 options are listed: Lower Division, Upper Division, Developmental, Graduate, Special Topic, Inactive Courses, Suggestion Minimum Data

**Expected**: All 7 configuration types are available in dropdown

#### TC2.3: Add Lower Division Configuration
**Steps:**
1. Open Add Configuration dialog
2. Select "Lower Division" from Configuration dropdown
3. Verify Minimum value and Maximum value combobox fields appear
4. Fill in Minimum value
5. Fill in Maximum value
6. Click Submit
7. Verify success toast message appears
8. Verify new configuration appears in the list

**Expected**: Lower Division configuration is added successfully

#### TC2.4: Add Developmental Configuration
**Steps:**
1. Open Add Configuration dialog
2. Select "Developmental" from Configuration dropdown
3. Verify Course subject combobox, Minimum value, Maximum value fields appear
4. Verify "Exclude from suggestions" checkbox is visible
5. Select a Course subject
6. Fill in Minimum value
7. Fill in Maximum value
8. Click Submit
9. Verify success toast message

**Expected**: Developmental configuration is added successfully

#### TC2.5: Add Special Topic Configuration
**Steps:**
1. Open Add Configuration dialog
2. Select "Special Topic" from Configuration dropdown
3. Verify Course subject combobox and Course Number combobox appear
4. Verify "Exclude from boost suggestions" checkbox is visible
5. Select a Course subject
6. Select a Course Number
7. Click Submit
8. Verify success toast message

**Expected**: Special Topic configuration is added successfully

#### TC2.6: Add Graduate Configuration
**Steps:**
1. Open Add Configuration dialog
2. Select "Graduate" from Configuration dropdown
3. Verify Minimum value and Maximum value text fields appear
4. Verify "Exclude from suggestions" checkbox is visible
5. Fill in Minimum value
6. Fill in Maximum value
7. Click Submit
8. Verify success toast message

**Expected**: Graduate configuration is added successfully

#### TC2.7: Add Upper Division Configuration
**Steps:**
1. Open Add Configuration dialog
2. Select "Upper Division" from Configuration dropdown
3. Verify Minimum value and Maximum value combobox fields appear
4. Verify "Do not suggest lower division courses to my upper division courses" checkbox
5. Verify "Exclude from boost suggestions" checkbox
6. Fill in Minimum and Maximum values
7. Click Submit
8. Verify success toast message

**Expected**: Upper Division configuration is added successfully

#### TC2.8: Add Inactive Courses Configuration
**Steps:**
1. Open Add Configuration dialog
2. Select "Inactive Courses" from Configuration dropdown
3. Verify Course subject, Course Number, Min/Max course number range, Course title fields appear
4. Verify "Make course inactive" checkbox is visible
5. Fill in required fields
6. Click Submit
7. Verify success toast message

**Expected**: Inactive Courses configuration is added successfully

#### TC2.9: Add Suggestion Minimum Data Configuration
**Steps:**
1. Open Add Configuration dialog
2. Select "Suggestion Minimum Data" from Configuration dropdown
3. Verify Title, Description, Min/Max hours checkboxes appear
4. Check desired checkboxes
5. Click Submit
6. Verify success toast message

**Expected**: Suggestion Minimum Data configuration is added successfully

---

### 3. Edit Configuration Tests

#### TC3.1: Edit Existing Configuration
**Steps:**
1. Navigate to Institution Configuration page
2. Click "Toggle drop down" button on an existing configuration row
3. Verify dropdown menu with "Edit" and "Delete" options appears
4. Click "Edit"
5. Verify edit dialog opens with pre-filled values
6. Modify a field value
7. Click Submit
8. Verify success toast message
9. Verify updated values in the list

**Expected**: Configuration is updated successfully with new values

#### TC3.2: Cancel Edit Configuration
**Steps:**
1. Open edit dialog for an existing configuration
2. Modify a field value
3. Click "Cancel"
4. Verify dialog closes
5. Verify original values remain unchanged in the list

**Expected**: Changes are discarded when Cancel is clicked

---

### 4. Delete Configuration Tests

#### TC4.1: Delete Existing Configuration
**Steps:**
1. Navigate to Institution Configuration page
2. Note the number of existing configurations
3. Click "Toggle drop down" button on a configuration row
4. Click "Delete"
5. Verify success toast "Updated settings successfully" appears
6. Verify configuration is removed from the list

**Expected**: Configuration is deleted and removed from the list

---

### 5. Dialog Behavior Tests

#### TC5.1: Close Add Configuration Dialog with X Button
**Steps:**
1. Open Add Configuration dialog
2. Click the "close" (X) button
3. Verify dialog closes
4. Verify page returns to configuration list

**Expected**: Dialog closes without saving

#### TC5.2: Submit Without Selecting Configuration Type
**Steps:**
1. Open Add Configuration dialog
2. Without selecting a configuration type, check Submit button state
3. Verify Submit button is disabled or shows validation

**Expected**: Cannot submit without selecting a configuration type

#### TC5.3: Configuration Type Changes Form Fields Dynamically
**Steps:**
1. Open Add Configuration dialog
2. Select "Lower Division" → verify Min/Max combobox fields
3. Switch to "Graduate" → verify Min/Max text fields + Exclude checkbox
4. Switch to "Special Topic" → verify Course subject + Course Number + Exclude checkbox
5. Switch to "Suggestion Minimum Data" → verify Title/Description/Min-Max hours checkboxes

**Expected**: Form fields change dynamically based on selected configuration type

---

### 6. Suggestion Filtering Tests

#### TC6.1: Verify Configuration Filters Suggestions in My Triangulator
**Steps:**
1. Navigate to My Triangulator tab
2. Note the suggestions listed
3. Navigate to Institution Configuration page
4. Add a configuration that matches a known suggestion target course
5. Navigate back to My Triangulator tab
6. Verify the matching suggestion is filtered out

**Expected**: Suggestions matching the configuration are filtered from My Triangulator

---

## Test Data

| Field | Value |
|-------|-------|
| **Login URL** | `https://qa.creditmobility.net/logged-out/login/email` |
| **Admin Email** | `testtriangulator+108@gmail.com` |
| **Password** | `#TransferTri1` |
| **Config Page URL** | `https://qa.creditmobility.net/app/my-workspace/inst-admin/inst/settings/suggestion-configs` |
| **Settings URL** | `https://qa.creditmobility.net/app/my-workspace/inst-admin/inst/settings/` |
| **Institution** | Pima Community College |

---

## Key Selectors Discovered via MCP Playwright

| Element | Selector |
|---------|----------|
| My Workplace link | `getByRole('link', { name: 'My Workplace' })` |
| Settings link | `getByRole('link', { name: 'Settings' })` |
| See all link (Institution configs) | `getByRole('link', { name: 'Open Suggestion Configurations page' })` |
| Add Configuration button | `getByRole('button', { name: 'Add Configuration' })` |
| Configuration dropdown | `getByRole('combobox', { name: 'Configuration' })` |
| Minimum value combobox | `getByRole('combobox', { name: 'Minimum value' })` |
| Maximum value combobox | `getByRole('combobox', { name: 'Maximum value' })` |
| Minimum value textbox | `getByRole('textbox', { name: 'Minimum value' })` |
| Maximum value textbox | `getByRole('textbox', { name: 'Maximum value' })` |
| Course subject combobox | `getByRole('combobox', { name: 'Course subject' })` |
| Course Number combobox | `getByRole('combobox', { name: 'Course Number' })` |
| Course title textbox | `getByRole('textbox', { name: 'Course Title' })` |
| Min course number range | `getByRole('textbox', { name: 'Minimum Course Number range' })` |
| Max course number range | `getByRole('textbox', { name: 'Maximum course Number range' })` |
| Submit button | `getByRole('button', { name: 'Submit' })` |
| Cancel button | `getByRole('button', { name: 'Cancel' })` |
| Close dialog button | `getByRole('button', { name: 'close' })` |
| Back button | `getByRole('button', { name: 'Return to Institution Settings' })` |
| Toggle drop down | `getByRole('button', { name: 'Toggle drop down' })` |
| Edit menu item | `getByRole('menuitem', { name: 'Edit' })` |
| Delete menu item | `getByRole('menuitem', { name: 'Delete' })` |
| Exclude from suggestions checkbox | `getByRole('checkbox', { name: 'Exclude from suggestions' })` |
| Exclude from boost checkbox | `getByRole('checkbox', { name: 'Exclude from boost suggestions' })` |
| Make course inactive checkbox | `getByRole('checkbox', { name: 'Make course inactive' })` |
| Title checkbox | `getByRole('checkbox', { name: 'Title' })` |
| Description checkbox | `getByRole('checkbox', { name: 'Description' })` |
| Min/Max hours checkbox | `getByRole('checkbox', { name: 'Min/Max hours' })` |
| Do not suggest lower div checkbox | `getByRole('checkbox', { name: 'Do not suggest lower division courses to my upper division courses' })` |
