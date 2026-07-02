# User Creation E2E Tests

This directory contains comprehensive end-to-end tests for the Triangulator user creation functionality, with support for both mock email service and real Gmail API integration.

## Test Files

### Mock Email Service Tests (Recommended for CI/CD)
- **triangulator-admin-user-creation.spec.ts** - Triangulator admin user creation tests using mock email service
- **institution-admin-user-creation.spec.ts** - Institution admin user creation tests using mock email service

**Advantages:**
- ✅ No external dependencies
- ✅ Fast execution (no API calls)
- ✅ Reliable and predictable
- ✅ No rate limiting concerns
- ✅ Works offline

### Gmail API Integration Tests (Real Email Verification)
- **triangulator-admin-user-creation-gmail.spec.ts** - Triangulator admin tests with real Gmail integration
- **institution-admin-user-creation-gmail.spec.ts** - Institution admin tests with real Gmail integration

**Advantages:**
- ✅ Real email verification
- ✅ Tests actual email delivery
- ✅ Password extraction from real emails
- ✅ Complete end-to-end validation
- ✅ Production-like testing

**Requirements:**
- GMAIL_CLIENT_ID in .env
- GMAIL_CLIENT_SECRET in .env
- GMAIL_REFRESH_TOKEN in .env

## Running Tests

### Run All Tests (Mock Email Service)
```bash
npx playwright test tests/user-creation/
```

### Run Specific Test File
```bash
# Triangulator admin tests
npx playwright test tests/user-creation/triangulator-admin-user-creation.spec.ts

# Institution admin tests
npx playwright test tests/user-creation/institution-admin-user-creation.spec.ts
```

### Run Gmail Integration Tests Only
```bash
# Requires Gmail credentials in .env
npx playwright test tests/user-creation/*-gmail.spec.ts
```

### Run with UI Mode (Interactive Debugging)
```bash
npx playwright test tests/user-creation/ --ui
```

### Run in Headed Mode (See Browser)
```bash
npx playwright test tests/user-creation/ --headed
```

### Run with Verbose Logging
```bash
npx playwright test tests/user-creation/ --debug
```

### Run Single Test
```bash
npx playwright test tests/user-creation/triangulator-admin-user-creation.spec.ts -g "should create triangulator admin user successfully"
```

## Test Coverage

### Triangulator Admin Tests
- ✅ Create triangulator admin user successfully
- ✅ Validate required fields
- ✅ Validate email format
- ✅ Handle duplicate emails
- ✅ Handle expired temporary passwords
- ✅ Handle invalid temporary passwords
- ✅ Data-driven test scenarios
- ✅ Complete workflow validation
- ✅ User session maintenance after password change

### Institution Admin Tests
- ✅ Create institution admin user for own institution
- ✅ Create reviewer user for own institution
- ✅ Validate password change during first-time login
- ✅ Restrict institution admin to own institution only
- ✅ Prevent triangulator admin creation by institution admins
- ✅ Allow institution admin and reviewer roles
- ✅ Handle duplicate email creation attempts
- ✅ Handle expired temporary passwords
- ✅ Handle invalid temporary passwords
- ✅ Complete workflow validation
- ✅ User session maintenance after password change

## Environment Variables

### Required for All Tests
```bash
BASE_URL=https://qa.creditmobility.net/
ADMIN_EMAIL=creditmobility@asu.edu
ADMIN_PASSWORD=#TransferTri1
INST_ADMIN_EMAIL=testtriangulator+109@gmail.com
INST_ADMIN_PASSWORD=#TransferTri1
```

### Required for Gmail Integration Tests
```bash
GMAIL_CLIENT_ID=your_client_id
GMAIL_CLIENT_SECRET=your_client_secret
GMAIL_REFRESH_TOKEN=your_refresh_token
```

## Test Architecture

### Page Objects
- **LoginPage** - Handles user authentication
- **UserManagementPage** - Manages user list navigation and verification
- **CreateUserPage** - Handles user creation form interaction
- **EmailVerificationPage** - Handles first-time login and password change

### Email Services
- **EmailServiceMock** - Mock email service for testing without external dependencies
- **GmailService** - Real Gmail API integration for production-like testing

### Test Data
- **UserDataGenerator** - Generates unique test data with plus addressing
- **userCreationData.json** - Structured test scenarios and configuration

## Complete E2E Flow

```
1. LOGIN
   ├─ Navigate to login page
   ├─ Enter credentials
   └─ Verify dashboard access

2. USER CREATION
   ├─ Navigate to All Users
   ├─ Click Add User
   ├─ Fill form (name, email, institution, role)
   └─ Submit

3. EMAIL HANDLING
   ├─ Mock email sent (or real Gmail)
   ├─ Extract temp password
   ├─ Get login URL
   └─ Verify email content

4. FIRST-TIME LOGIN
   ├─ Navigate to login link
   ├─ Enter email + temp password
   ├─ Redirect to password change
   └─ Set new password

5. VERIFICATION
   ├─ Verify user in All Users list
   ├─ Verify user role
   ├─ Verify user institution
   └─ Confirm successful creation
```

## Troubleshooting

### Gmail Tests Failing
1. Verify GMAIL_REFRESH_TOKEN is valid
2. Check Gmail API is enabled in Google Cloud Console
3. Ensure test email account has Gmail API access
4. Check email hasn't been deleted from inbox

### Email Not Arriving
1. Check email address is correct in test
2. Verify application is sending emails
3. Check Gmail spam folder
4. Verify email subject matches query pattern

### Locator Issues
1. Run tests with `--headed` to see actual UI
2. Use `--debug` mode to inspect elements
3. Check if UI has changed from verified locators
4. Update locators in page objects if needed

### Password Extraction Failing
1. Verify email body contains password
2. Check password format matches regex pattern
3. Inspect actual email content in Gmail
4. Update extraction regex if email format changed

## Best Practices

1. **Use Mock Service for CI/CD** - Faster, more reliable, no external dependencies
2. **Use Gmail Tests for Validation** - Real email verification before production
3. **Run Tests in Parallel** - Use Playwright's parallel execution for speed
4. **Clean Up Test Data** - Mark emails as read/delete after tests
5. **Monitor Email Quota** - Gmail API has rate limits
6. **Use Unique Emails** - Plus addressing ensures no conflicts

## Performance

### Mock Email Service
- Average test duration: 2-3 minutes per test
- No external API calls
- Instant email delivery simulation

### Gmail API Service
- Average test duration: 3-5 minutes per test
- Includes real Gmail API calls
- Email delivery time varies (usually 1-5 seconds)

## CI/CD Integration

### GitHub Actions Example
```yaml
- name: Run User Creation Tests
  run: npx playwright test tests/user-creation/
  env:
    BASE_URL: https://qa.creditmobility.net/
    ADMIN_EMAIL: ${{ secrets.ADMIN_EMAIL }}
    ADMIN_PASSWORD: ${{ secrets.ADMIN_PASSWORD }}
```

### Jenkins Example
```groovy
stage('User Creation Tests') {
  steps {
    sh 'npx playwright test tests/user-creation/'
  }
}
```

## Support

For issues or questions:
1. Check test logs: `npx playwright test --debug`
2. Review page object implementations
3. Verify environment variables
4. Check application UI for locator changes
5. Inspect email content in Gmail
