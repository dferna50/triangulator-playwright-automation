# Peer Groups - Test Plan

## Feature Overview
The Peer Groups page allows institution admins to create, edit, and delete peer groups. Each peer group consists of 3-10 institutions and a match threshold. Peer groups are used to receive alignment-generated suggestions.

**URL**: `/app/my-workspace/inst-admin/inst/settings/peer-groups`

**Navigation**: Dashboard → My Workplace → Settings → "Receive align suggestions" → See all

---

## 1. Navigation Tests

### 1.1 Navigate to Peer Groups Page via Settings
**Steps:**
1. Login as institution admin
2. Click "My Workplace" in top nav
3. Click "Settings" in sidebar
4. Locate "Receive align suggestions" section
5. Click "See all" link under "Receive align suggestions"

**Expected:**
- URL contains `/peer-groups`
- Page title "Peer groups" is visible
- "Create peer group" button is visible
- Table headers (Name, State, Match threshold) are visible

### 1.2 Navigate to Peer Groups Page via Direct URL
**Steps:**
1. Login as institution admin
2. Navigate directly to peer groups URL

**Expected:**
- Page loads with peer groups content
- "Create peer group" button is visible

### 1.3 Navigate Back to Settings
**Steps:**
1. Navigate to Peer Groups page
2. Click "Back" / "Return to Institution Settings" button

**Expected:**
- URL changes to settings page
- Settings page content is visible

---

## 2. Create Peer Group Tests

### 2.1 Create Peer Group - Happy Path
**Steps:**
1. Navigate to Peer Groups page
2. Click "Create peer group" button
3. Verify dialog opens with "Step 1: Add institutions"
4. Search and select 3 institutions
5. Close dropdown, click "Next"
6. Enter peer group name in Step 2
7. Verify match threshold defaults to "3 peers" in Step 3
8. Verify "Review details" shows selected institutions
9. Click "Submit"

**Expected:**
- Success toast appears
- New peer group appears in the list

### 2.2 Create Peer Group - Verify Minimum 3 Institutions Required
**Steps:**
1. Open Create peer group dialog
2. Select only 1 institution
3. Verify "Next" button is disabled
4. Verify message "Must select at least 3 institutions"
5. Select a 2nd institution
6. Verify "Next" still disabled
7. Select a 3rd institution
8. Verify "Next" becomes enabled

**Expected:**
- Next button disabled until 3 institutions selected
- Counter shows "X/10 institutions selected"

### 2.3 Create Peer Group - Verify Maximum 10 Institutions
**Steps:**
1. Open Create peer group dialog
2. Select 10 institutions
3. Verify counter shows "10/10 institutions selected"

**Expected:**
- Counter shows 10/10
- Cannot select more than 10

### 2.4 Create Peer Group - Submit Without Name (Validation)
**Steps:**
1. Open Create peer group dialog
2. Select 3 institutions, click Next
3. Leave peer group name empty
4. Verify Submit button is disabled
5. Verify tooltip "Must add a peer group name"

**Expected:**
- Submit button remains disabled without a name

### 2.5 Create Peer Group - Name Character Limit (60 chars)
**Steps:**
1. Open Create peer group dialog
2. Select 3 institutions, click Next
3. Type a name with exactly 60 characters
4. Verify counter shows "60 / 60"

**Expected:**
- Character counter updates as user types
- Name field respects 60 character limit

### 2.6 Create Peer Group - Cancel Dialog
**Steps:**
1. Open Create peer group dialog
2. Select institutions
3. Click "Cancel"

**Expected:**
- Dialog closes
- No peer group created

### 2.7 Create Peer Group - Close Dialog with X
**Steps:**
1. Open Create peer group dialog
2. Click close (X) button

**Expected:**
- Dialog closes

### 2.8 Create Peer Group - Back Button from Step 2
**Steps:**
1. Open Create peer group dialog
2. Select 3 institutions, click Next
3. Click "Back" button

**Expected:**
- Returns to Step 1 with institutions still selected

### 2.9 Create Peer Group - Remove Institution from Selection
**Steps:**
1. Open Create peer group dialog
2. Select 3 institutions
3. Click Remove button on one institution
4. Verify count decreases
5. Verify Next button becomes disabled (only 2 left)

**Expected:**
- Institution removed from list
- Counter updates
- Next disabled when below 3

### 2.10 Create Peer Group - Search Institution
**Steps:**
1. Open Create peer group dialog
2. Type institution name in search box
3. Verify filtered results appear

**Expected:**
- Dropdown filters to matching institutions

---

## 3. Edit Peer Group Tests

### 3.1 Edit Peer Group - Open Edit Dialog
**Steps:**
1. Navigate to Peer Groups page
2. Click "Toggle see more" on existing peer group
3. Click "Edit"

**Expected:**
- Edit dialog opens with "Edit peer group" title
- Existing institutions are pre-populated

### 3.2 Edit Peer Group - Modify Name
**Steps:**
1. Open Edit dialog for existing peer group
2. Click Next to go to Step 2
3. Clear and enter new name
4. Click Submit

**Expected:**
- Success toast appears
- Peer group name updated in list

---

## 4. Delete Peer Group Tests

### 4.1 Delete Peer Group
**Steps:**
1. Create a temporary peer group for deletion
2. Click "Toggle see more" on the new peer group
3. Click "Delete"

**Expected:**
- Success toast appears
- Peer group removed from list

---

## 5. Page Element Verification Tests

### 5.1 Verify Existing Peer Group Display
**Steps:**
1. Navigate to Peer Groups page
2. Verify existing peer group row shows name, peer count, and toggle button

**Expected:**
- Peer group data displayed correctly

### 5.2 Verify Page Description Text
**Steps:**
1. Navigate to Peer Groups page
2. Verify "Manage peer groups" heading
3. Verify description text about picking up to 10 peer groups

**Expected:**
- All descriptive text visible and correct
