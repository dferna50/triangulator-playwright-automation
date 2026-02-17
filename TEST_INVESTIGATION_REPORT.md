# Test Investigation Report
**Date:** January 23, 2026  
**Test Suite:** Triangulator_Priya Playwright Tests

## Executive Summary
The test suite contains **14 test files** with a significant number of **skipped tests** and **failing tests** based on recent execution.

---

## 📊 Skipped Tests Analysis

### Total Skipped Tests: **24**

### 1. `upload_rules.spec.js` - **7 skipped tests**
- **TC_05:** Uploads rules add function with no errors
- **TC_10:** Uploads rules Update function with critical error "MissingCourseNumber"
- **TC_11:** Uploads rules add function with critical error "Missing Institution Name"
- **TC_12:** Uploads rules add function with critical error "Missing Rules"
- **TC_13:** Uploads rules add function with critical error "Missing Source Course"
- **TC_14:** Uploads rules add function with critical error "Missing Target Course"
- **TC_15:** Uploads rules add function with critical error "Wrong Source Identifier"
- **TC_16:** Uploads rules add function with critical error "Wrong Target Identifier"

**Reason:** These tests appear to be skipped during development/testing phase. They test error handling scenarios for rule uploads.

---

### 2. `upload_course_catalog.spec.js` - **11 skipped tests**
- **TC_05:** Uploads catalog add function with no errors
- Uploads catalog add function with Invalid active course error
- Uploads catalog add function with Invalid Course Department name Error
- Uploads catalog add function with Invalid Course Credit Units Error
- Uploads catalog add function with Invalid effective year error
- Uploads catalog add function with Invalid expiration year error
- Uploads catalog add function with incorrect institution error
- Uploads catalog add function with missing course credit max value error
- Uploads catalog add function with missing course credit min value error
- Uploads catalog add function with missing course long title error
- Uploads catalog update function new courses without any errors
- Uploads catalog replace function new courses without any errors

**Reason:** Various catalog upload validation scenarios are currently skipped, likely due to test data or environment issues.

---

### 3. `search_explore_all_equvalency.spec.js` - **6 skipped tests**
- Explore equivalencies pagination
- Explore equivalencies filter state
- Explore equivalencies - distance+ZIP filter
- Explore equivalencies sort - Transfer From A-Z
- Explore equivalencies sort - Transfer From Z-A
- Explore equivalencies sort - Transfer To A-Z
- Explore equivalencies sort - Transfer To Z-A

**Reason:** Filtering and sorting functionality tests are skipped, possibly due to UI changes or incomplete implementation.

---

### 4. `search_course_by_course.spec.js` - **4 skipped tests**
- Search Course by Course - State filter
- Search Course by Course - distance+ZIP filter
- Search Course by Course - Approved courses percentage (lowest to highest)
- Search Course by Course - Approved courses percentage (highest to lowest)

**Reason:** Filter and sorting features for course-by-course search are not currently tested.

---

### 5. `Workflow_LandingPAGE.spec.js` - **1 skipped test**
- **TC-18:** Verify the Edit functionality

**Reason:** Edit functionality for workflow is skipped, possibly due to implementation changes.

---

### 6. `Bug-Tickets.spec.js` - **1 skipped test**
- **6. BUG ID-1553:** Boost course details missing

**Reason:** Bug fix test is skipped, may need validation or rework.

---

### 7. `Create_Evaluation_Groups.spec.js` - **2 skipped tests**
- **TC9:** Verify that the group is saved and visible on the chart on the Workflow configurations page
- **TC10:** Verify that Step 2 requires a unique group name (not case-sensitive)

**Reason:** Tests need random data generation implementation (noted in comments).

---

### 8. `Edit_Evaluation_Groups.spec.js` - **1 skipped test**
- **TC18:** Verify that the system displays a warning to the admin when attempting to remove minimum members required from a group

**Reason:** Warning message validation is currently skipped.

---

## ❌ Failing Tests Analysis

Based on test execution output, the following categories of tests are **FAILING**:

### Critical Failures:

1. **Upload Tests (upload_rules.spec.js & upload_course_catalog.spec.js)**
   - TC_01: Upload rule/catalog file with incorrect format (non CSV file)
   - TC_02: Upload file with spaces in the file name
   - TC_03: Attempt to press submit without checking acknowledgement checkbox
   - TC_04: Upload file and click cancel on upload summary page
   - TC_06-TC_09: Various critical error handling tests
   
   **Common Issues:**
   - Login credentials may be invalid/expired
   - File paths may be incorrect
   - UI selectors may have changed
   - Timeout issues (150s timeout configured)

2. **Workflow Tests (Workflow_LandingPAGE.spec.js)**
   - TC1: Verify Workflow configuration page location
   - TC3: Verify the sub text of the Workflow configurations page
   
   **Potential Issues:**
   - Navigation issues after login
   - Element locators may be outdated
   - Page structure changes

3. **Test Execution Issues:**
   - Multiple retries observed (retry #1 in output)
   - Tests running with 4 workers in parallel may cause race conditions
   - BaseURL configured: `https://qa.creditmobility.net/`

---

## 🔍 Common Patterns Identified

### 1. **Login Dependencies**
All test files use `loginPage` class with beforeEach hooks. Multiple credential sets used:
- `nevadaadmin`
- `californiaoneadmin`
- `rutgersadmin`
- `pimaadmin`
- `nebraskaadmin`
- `testtriangulator+108@gmail.com`
- `testtriangulator+109@gmail.com`

**Risk:** Credential changes or account issues will cause widespread failures.

### 2. **File Path Issues**
Tests reference files like:
- `test_data/uploadRules/182290_FileWithNoError.csv`
- Hard-coded paths in some tests (e.g., `C:\Automation\...` in comments)

**Risk:** Relative path issues or missing test data files.

### 3. **Selector Brittleness**
Tests use various locator strategies:
- Text-based: `getByText('Submit')`
- CSS selectors: `:nth-child(1) > .justify-end`
- Role-based: `getByRole('button', { name: 'Submit' })`

**Risk:** UI changes break multiple tests.

### 4. **Timeout Configuration**
- Global timeout: 150000ms (2.5 minutes)
- Some tests override with `test.setTimeout(120000)`
- Retries: 1 retry configured

---

## 📋 Recommendations

### Immediate Actions:

1. **Verify Credentials**
   - Check all login credentials in `test_data/logindata.json`
   - Ensure accounts are active in QA environment

2. **Validate Test Data Files**
   - Confirm all CSV files exist in `test_data/uploadRules/`
   - Check file permissions and paths

3. **Update Selectors**
   - Review failing tests for outdated element selectors
   - Consider using more stable locators (data-testid attributes)

4. **Re-enable Skipped Tests Gradually**
   - Start with simpler skipped tests (filters, sorting)
   - Fix underlying issues before re-enabling complex scenarios

### Long-term Improvements:

1. **Test Data Management**
   - Implement dynamic test data generation
   - Avoid hardcoded absolute paths
   - Use environment variables for file paths

2. **Page Object Pattern Enhancement**
   - Centralize selectors in page objects
   - Add retry logic for flaky elements
   - Implement better wait strategies

3. **CI/CD Integration**
   - Run tests in isolated environments
   - Reduce parallelization (4 workers → 2) for stability
   - Implement proper test data cleanup

4. **Monitoring & Reporting**
   - Set up automated test reporting
   - Track test flakiness metrics
   - Create failure notification system

---

## 🎯 Priority Actions

### High Priority:
1. Fix login credential issues
2. Validate file paths and test data
3. Update Workflow_LandingPAGE.spec.js selectors

### Medium Priority:
1. Re-enable and fix upload test skips
2. Fix search filter tests
3. Address timeout issues

### Low Priority:
1. Re-enable evaluation group tests (TC9, TC10)
2. Complete bug ticket tests
3. Implement random data generation

---

## Test File Summary

| Test File | Total Tests | Skipped | Status |
|-----------|-------------|---------|--------|
| upload_rules.spec.js | 16 | 7 | Mixed |
| upload_course_catalog.spec.js | 15+ | 11 | Multiple Failures |
| search_explore_all_equvalency.spec.js | 14 | 6 | Partial Pass |
| search_course_by_course.spec.js | 13 | 4 | Partial Pass |
| Workflow_LandingPAGE.spec.js | 14 | 1 | Failures |
| Bug-Tickets.spec.js | 20 | 1 | Unknown |
| suggestions.spec.js | 19 | 0 | Unknown |
| Create_Evaluation_Groups.spec.js | 8 | 2 | Unknown |
| Edit_Evaluation_Groups.spec.js | 13 | 1 | Unknown |
| DataMistatch_CourseID.spec.js | 6 | 0 | Unknown |
| Delete_Evaluation_groups.spec.js | 5 | 0 | Unknown |
| SuggestionsHistoryChange.spec.js | 4 | 0 | Unknown |
| JIRA_US-tickets.spec.js | 3 | 0 | Unknown |
| My_Workplace.spec.js | 3 | 0 | Unknown |

---

## Next Steps

1. Run individual test files to isolate failures
2. Check test execution logs for specific error messages
3. Verify QA environment availability and data state
4. Update this report after fixes are implemented
