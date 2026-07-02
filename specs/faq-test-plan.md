# FAQ Functionality Test Plan

## Overview
This test plan covers the FAQ (Frequently Asked Questions) functionality in the Triangulator application. The FAQ feature allows Triangulator administrators to set a custom FAQ link that appears in the top navigation bar for all users (both logged in and logged out).

---

## Test Environment
- **Base URL**: https://qa.creditmobility.net/
- **Admin Login URL**: https://qa.creditmobility.net/logged-out/login/email
- **Admin Credentials**: 
  - Email: creditmobility@asu.edu
  - Password: #TransferTri1

---

## User Roles
1. **Triangulator Admin**: Can configure the FAQ link in settings
2. **Logged In User**: Can access FAQ link from top navigation
3. **Logged Out User**: Can access FAQ link from top navigation

---

## Test Scenarios

### 1. FAQ Admin Configuration Tests

#### 1.1 Navigate to FAQ Settings
**Objective**: Verify admin can navigate to FAQ settings page

**Prerequisites**:
- User is logged in as Triangulator admin

**Steps**:
1. Login at https://qa.creditmobility.net/logged-out/login/email with admin credentials
2. Click on "My Workplace" in navigation
3. Click on "Settings" in the sidebar
4. Click on "FAQ" link in the secondary sidebar

**Expected Results**:
- FAQ settings page loads successfully
- FAQ link input field is visible
- Save/Update button is visible

**Test Data**: N/A

---

#### 1.2 Set FAQ Link with Valid URL
**Objective**: Verify admin can set a valid FAQ link

**Prerequisites**:
- User is on FAQ settings page

**Steps**:
1. Navigate to FAQ settings page
2. Enter a valid URL in the FAQ link field (e.g., "https://help.example.com/faq")
3. Click Save/Submit button
4. Wait for success confirmation

**Expected Results**:
- FAQ link is saved successfully
- Success message appears
- Entered URL is retained in the field

**Test Data**:
- Valid URL: https://help.example.com/faq

---

#### 1.3 Update Existing FAQ Link
**Objective**: Verify admin can update an existing FAQ link

**Prerequisites**:
- FAQ link is already configured

**Steps**:
1. Navigate to FAQ settings page
2. Verify existing FAQ link is displayed
3. Update the FAQ link with a new valid URL
4. Click Save/Submit button
5. Wait for success confirmation

**Expected Results**:
- FAQ link is updated successfully
- Success message appears
- New URL is retained in the field

**Test Data**:
- New URL: https://support.example.com/help

---

#### 1.4 Set FAQ Link with Empty Value
**Objective**: Verify validation for empty FAQ link

**Prerequisites**:
- User is on FAQ settings page

**Steps**:
1. Navigate to FAQ settings page
2. Clear the FAQ link field (leave it empty)
3. Click Save/Submit button

**Expected Results**:
- Appropriate validation message appears OR
- Empty value is saved (allowing FAQ link to be disabled)

**Test Data**: N/A

---

#### 1.5 Set FAQ Link with Invalid URL Format
**Objective**: Verify validation for invalid URL format

**Prerequisites**:
- User is on FAQ settings page

**Steps**:
1. Navigate to FAQ settings page
2. Enter an invalid URL format (e.g., "not-a-valid-url")
3. Click Save/Submit button

**Expected Results**:
- Validation error message appears
- FAQ link is not saved
- Field highlights the error

**Test Data**:
- Invalid URLs: "not-a-url", "htp://wrong.com", "javascript:alert(1)"

---

#### 1.6 Set FAQ Link with Special Characters
**Objective**: Verify FAQ link handles URLs with special characters

**Prerequisites**:
- User is on FAQ settings page

**Steps**:
1. Navigate to FAQ settings page
2. Enter a URL with query parameters and special characters
3. Click Save/Submit button

**Expected Results**:
- FAQ link with special characters is saved successfully
- URL is properly encoded and stored

**Test Data**:
- URL: https://help.example.com/faq?category=general&lang=en

---

### 2. FAQ Navigation Tests (Logged In Users)

#### 2.1 Verify FAQ Link Appears in Top Navigation (Logged In)
**Objective**: Verify FAQ link is visible in top navigation for logged-in users

**Prerequisites**:
- FAQ link has been configured by admin
- User is logged in

**Steps**:
1. Login as any user (not necessarily admin)
2. Navigate to dashboard or any page
3. Look for FAQ link in the top navigation bar

**Expected Results**:
- FAQ link is visible in top navigation
- FAQ link text/icon is clear and identifiable

**Test Data**: N/A

---

#### 2.2 Click FAQ Link (Logged In User)
**Objective**: Verify FAQ link navigates to correct URL for logged-in users

**Prerequisites**:
- FAQ link is set to "https://help.example.com/faq"
- User is logged in

**Steps**:
1. Login as any user
2. Locate FAQ link in top navigation
3. Click on FAQ link
4. Verify navigation

**Expected Results**:
- Browser navigates to the configured FAQ URL
- New tab/window opens with FAQ URL OR same tab navigates to FAQ URL
- URL matches the configured FAQ link

**Test Data**:
- Expected URL: https://help.example.com/faq

---

#### 2.3 FAQ Link Persists Across Pages (Logged In)
**Objective**: Verify FAQ link remains accessible across different pages

**Prerequisites**:
- FAQ link is configured
- User is logged in

**Steps**:
1. Login as any user
2. Navigate to different pages (Dashboard, Suggestions, Reports, etc.)
3. Verify FAQ link presence on each page

**Expected Results**:
- FAQ link is consistently visible on all pages
- FAQ link functionality works from all pages

**Test Data**: N/A

---

### 3. FAQ Navigation Tests (Logged Out Users)

#### 3.1 Verify FAQ Link Appears in Top Navigation (Logged Out)
**Objective**: Verify FAQ link is visible for logged-out users

**Prerequisites**:
- FAQ link has been configured by admin
- User is not logged in

**Steps**:
1. Navigate to https://qa.creditmobility.net/ (logged out state)
2. Look for FAQ link in the top navigation bar

**Expected Results**:
- FAQ link is visible in top navigation for logged-out users
- FAQ link text/icon is clear and identifiable

**Test Data**: N/A

---

#### 3.2 Click FAQ Link (Logged Out User)
**Objective**: Verify FAQ link navigates to correct URL for logged-out users

**Prerequisites**:
- FAQ link is set to "https://help.example.com/faq"
- User is not logged in

**Steps**:
1. Navigate to homepage (logged out)
2. Locate FAQ link in top navigation
3. Click on FAQ link
4. Verify navigation

**Expected Results**:
- Browser navigates to the configured FAQ URL
- URL matches the configured FAQ link
- No login prompt appears

**Test Data**:
- Expected URL: https://help.example.com/faq

---

#### 3.3 FAQ Link on Login Page
**Objective**: Verify FAQ link is accessible on login page

**Prerequisites**:
- FAQ link is configured

**Steps**:
1. Navigate to login page
2. Verify FAQ link presence in navigation
3. Click FAQ link

**Expected Results**:
- FAQ link is visible on login page
- Clicking FAQ link navigates to configured URL

**Test Data**: N/A

---

### 4. FAQ Link Update Propagation Tests

#### 4.1 FAQ Link Updates Reflect Immediately (Logged In)
**Objective**: Verify updated FAQ link is immediately available to logged-in users

**Prerequisites**:
- Initial FAQ link is configured

**Steps**:
1. Note the current FAQ URL
2. As admin, update FAQ link to a new URL
3. As logged-in user (different browser/session), click FAQ link
4. Verify navigation goes to new URL

**Expected Results**:
- FAQ link updates are immediately reflected
- Users see the new FAQ URL without needing to logout/login

**Test Data**:
- Old URL: https://help.example.com/faq
- New URL: https://support.example.com/help

---

#### 4.2 FAQ Link Updates Reflect Immediately (Logged Out)
**Objective**: Verify updated FAQ link is immediately available to logged-out users

**Prerequisites**:
- Initial FAQ link is configured

**Steps**:
1. Note the current FAQ URL
2. As admin, update FAQ link to a new URL
3. As logged-out user (different browser), refresh page
4. Click FAQ link
5. Verify navigation goes to new URL

**Expected Results**:
- FAQ link updates are immediately reflected for logged-out users
- New FAQ URL is accessible without cache issues

**Test Data**:
- Old URL: https://help.example.com/faq
- New URL: https://support.example.com/help

---

### 5. Edge Cases and Error Handling

#### 5.1 FAQ Link Not Configured
**Objective**: Verify behavior when FAQ link is not set

**Prerequisites**:
- FAQ link is not configured or cleared

**Steps**:
1. As admin, clear/remove FAQ link
2. Navigate to homepage (logged in and logged out)
3. Check top navigation

**Expected Results**:
- FAQ link is either hidden OR
- FAQ link shows disabled state OR
- FAQ link shows default placeholder

**Test Data**: N/A

---

#### 5.2 FAQ Link Points to Invalid URL
**Objective**: Verify behavior when FAQ link points to non-existent URL

**Prerequisites**:
- FAQ link is set to a URL that returns 404

**Steps**:
1. As admin, set FAQ link to non-existent URL
2. As user, click FAQ link

**Expected Results**:
- Browser navigates to the URL
- Browser shows 404 error page
- Application does not crash

**Test Data**:
- Invalid URL: https://example.com/nonexistent-page

---

#### 5.3 Very Long FAQ URL
**Objective**: Verify system handles very long URLs

**Prerequisites**:
- User is on FAQ settings page

**Steps**:
1. Navigate to FAQ settings page
2. Enter a very long valid URL (1000+ characters)
3. Click Save/Submit button

**Expected Results**:
- System either accepts the long URL OR
- Shows appropriate validation message for max length

**Test Data**:
- Long URL with multiple query parameters

---

#### 5.4 FAQ Link with HTTPS Protocol
**Objective**: Verify HTTPS URLs are handled correctly

**Prerequisites**:
- User is on FAQ settings page

**Steps**:
1. Set FAQ link with HTTPS URL
2. Verify link is saved
3. Click FAQ link as user

**Expected Results**:
- HTTPS URL is saved and works correctly
- Browser navigates to HTTPS URL without security warnings

**Test Data**:
- URL: https://secure.example.com/faq

---

#### 5.5 FAQ Link with HTTP Protocol
**Objective**: Verify HTTP URLs are handled correctly

**Prerequisites**:
- User is on FAQ settings page

**Steps**:
1. Set FAQ link with HTTP URL
2. Verify link is saved
3. Click FAQ link as user

**Expected Results**:
- HTTP URL is saved OR validation requires HTTPS
- If saved, browser navigates to HTTP URL

**Test Data**:
- URL: http://example.com/faq

---

### 6. Permission and Security Tests

#### 6.1 Non-Admin Cannot Access FAQ Settings
**Objective**: Verify only admin can access FAQ settings

**Prerequisites**:
- User is logged in as non-admin

**Steps**:
1. Login as regular user (not admin)
2. Try to navigate to FAQ settings page directly
3. Check if Settings > FAQ option is visible

**Expected Results**:
- Non-admin users cannot access FAQ settings
- FAQ settings option is hidden OR access is denied
- Appropriate permission error is shown

**Test Data**:
- Regular user credentials: testtriangulator+108@gmail.com / #TransferTri1

---

#### 6.2 XSS Prevention in FAQ Link
**Objective**: Verify FAQ link input is sanitized against XSS

**Prerequisites**:
- User is on FAQ settings page

**Steps**:
1. Navigate to FAQ settings page
2. Enter XSS payload in FAQ link field
3. Attempt to save

**Expected Results**:
- XSS payload is rejected OR sanitized
- No script execution occurs
- Appropriate validation error appears

**Test Data**:
- XSS payload: javascript:alert('XSS')
- XSS payload: <script>alert('XSS')</script>

---

### 7. UI/UX Tests

#### 7.1 FAQ Link Styling and Visibility
**Objective**: Verify FAQ link has proper styling and is easily visible

**Prerequisites**:
- FAQ link is configured

**Steps**:
1. Login as user and observe FAQ link
2. Logout and observe FAQ link
3. Check color, size, and position

**Expected Results**:
- FAQ link is clearly visible
- Styling is consistent with other navigation links
- Link is accessible and meets contrast requirements

**Test Data**: N/A

---

#### 7.2 FAQ Link Hover State
**Objective**: Verify FAQ link shows proper hover interaction

**Prerequisites**:
- FAQ link is configured

**Steps**:
1. Navigate to any page with FAQ link
2. Hover mouse over FAQ link
3. Observe visual feedback

**Expected Results**:
- FAQ link shows hover state (color change, underline, etc.)
- Cursor changes to pointer
- Hover effect is smooth and responsive

**Test Data**: N/A

---

#### 7.3 FAQ Settings Page Layout
**Objective**: Verify FAQ settings page has proper layout

**Prerequisites**:
- User is logged in as admin

**Steps**:
1. Navigate to FAQ settings page
2. Observe page layout, labels, and inputs

**Expected Results**:
- Page layout is clean and organized
- Input field has clear label
- Save button is prominently displayed
- Help text or instructions are visible (if applicable)

**Test Data**: N/A

---

#### 7.4 FAQ Link Tooltip or Label
**Objective**: Verify FAQ link has appropriate tooltip or accessible label

**Prerequisites**:
- FAQ link is configured

**Steps**:
1. Navigate to any page with FAQ link
2. Hover over FAQ link to check for tooltip
3. Inspect for ARIA labels

**Expected Results**:
- FAQ link has tooltip showing "FAQ" or "Help"
- Accessible labels are present for screen readers

**Test Data**: N/A

---

### 8. Mobile Responsiveness Tests

#### 8.1 FAQ Link on Mobile View (Logged In)
**Objective**: Verify FAQ link is accessible on mobile devices

**Prerequisites**:
- FAQ link is configured
- User is logged in

**Steps**:
1. Resize browser to mobile viewport (375x667)
2. Check for FAQ link in navigation
3. Click FAQ link

**Expected Results**:
- FAQ link is accessible in mobile menu
- Link works correctly on mobile
- Navigation is smooth

**Test Data**: N/A

---

#### 8.2 FAQ Link on Mobile View (Logged Out)
**Objective**: Verify FAQ link is accessible on mobile for logged-out users

**Prerequisites**:
- FAQ link is configured

**Steps**:
1. Logout
2. Resize browser to mobile viewport
3. Check for FAQ link in navigation
4. Click FAQ link

**Expected Results**:
- FAQ link is accessible in mobile menu for logged-out users
- Link works correctly

**Test Data**: N/A

---

#### 8.3 FAQ Settings Page on Mobile
**Objective**: Verify FAQ settings page is usable on mobile

**Prerequisites**:
- User is logged in as admin

**Steps**:
1. Resize browser to mobile viewport
2. Navigate to FAQ settings page
3. Try to update FAQ link

**Expected Results**:
- FAQ settings page is responsive
- Input field is accessible and usable
- Save button is reachable

**Test Data**: N/A

---

## Test Data Summary

### Valid URLs
- https://help.example.com/faq
- https://support.example.com/help
- https://docs.example.com/frequently-asked-questions
- https://help.example.com/faq?category=general&lang=en

### Invalid URLs
- not-a-url
- htp://wrong.com
- javascript:alert(1)
- <script>alert('XSS')</script>

### User Credentials
- **Admin**: creditmobility@asu.edu / #TransferTri1
- **Regular User**: testtriangulator+108@gmail.com / #TransferTri1

---

## Success Criteria

1. ✅ Admin can successfully set and update FAQ link
2. ✅ FAQ link appears in top navigation for logged-in users
3. ✅ FAQ link appears in top navigation for logged-out users
4. ✅ Clicking FAQ link navigates to configured URL
5. ✅ FAQ link updates are immediately reflected
6. ✅ Non-admin users cannot access FAQ settings
7. ✅ Invalid URLs are properly validated
8. ✅ FAQ link works on mobile devices
9. ✅ XSS and security vulnerabilities are prevented

---

## Test Execution Priority

### Priority 1 (Critical)
- 1.1, 1.2, 2.2, 3.2 (Core functionality)

### Priority 2 (High)
- 1.3, 2.1, 3.1, 4.1, 4.2, 6.1 (Updates and permissions)

### Priority 3 (Medium)
- 1.4, 1.5, 5.1, 5.2, 6.2 (Validation and edge cases)

### Priority 4 (Low)
- 7.1-7.4, 8.1-8.3 (UI/UX and mobile)

---

## Notes
- Tests should be run in a clean test environment
- FAQ link should be reset between test runs where applicable
- Consider using different browsers for cross-browser testing
- Document any deviations from expected behavior

---

**Document Version**: 1.0  
**Date**: February 2, 2026  
**Total Test Scenarios**: 33
