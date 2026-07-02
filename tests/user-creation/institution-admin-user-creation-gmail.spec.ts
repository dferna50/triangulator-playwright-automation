import { test, expect } from '../../fixtures/test';
import { UserDataGenerator } from '../../helpers/userDataGenerator';
import { GmailService } from '../../helpers/gmailService';

/**
 * Institution Admin User Creation Tests with Real Gmail API Integration
 * 
 * These tests use the real Gmail API to verify email receiving and password extraction.
 * Requires GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, and GMAIL_REFRESH_TOKEN in .env
 */
test.describe('Institution Admin User Creation - Gmail API Integration', () => {
  const instAdminEmail = process.env.INST_ADMIN_EMAIL || 'testtriangulator+109@gmail.com';
  const instAdminPassword = process.env.INST_ADMIN_PASSWORD || '#TransferTri1';
  const newPassword = 'TestPassword123!';
  const testEmailAddress = 'testtriangulatoroo@gmail.com'; // Gmail account for receiving test emails

  let gmailService: GmailService;

  test.beforeAll(async () => {
    // Initialize Gmail service
    gmailService = new GmailService();

    // Verify Gmail credentials are available
    if (!process.env.GMAIL_REFRESH_TOKEN) {
      throw new Error('GMAIL_REFRESH_TOKEN not found in environment variables. Gmail API integration tests cannot run.');
    }

    // Authenticate with Gmail API
    try {
      await gmailService.authenticate();
      console.log('✅ Gmail API authentication successful');
    } catch (error) {
      throw new Error(`Failed to authenticate with Gmail API: ${error}`);
    }
  });

  test.describe('TC-INST-ADMIN-GMAIL-001: Create Institution Admin with Real Email Verification', () => {
    test.skip('should create institution admin user and verify email via Gmail API', async ({
      page,
      loginPage,
      userManagementPage,
      createUserPage,
      emailVerificationPage
    }) => {
      // Generate unique test email with + addressing (Gmail treats all variants as same inbox)
      const testEmail = UserDataGenerator.generateUniqueEmail();
      const institution = 'University Of Nevada Reno';
      const userData = UserDataGenerator.generateUserData('institution_admin', institution, testEmail);

      console.log(`📧 Testing with email: ${testEmail}`);

      // Login as Institution Admin
      await page.goto('');
      await loginPage.loginUser(instAdminEmail, instAdminPassword);

      // Navigate to user creation
      await userManagementPage.navigateToAllUsers();
      await userManagementPage.clickAddUser();

      // Fill user creation form
      await createUserPage.waitForFormToLoad();
      await createUserPage.createUser(userData);

      console.log('✅ User created in system');

      // Wait for email to arrive in Gmail inbox
      console.log('⏳ Waiting for email to arrive in Gmail...');
      let tempPassword: string;
      let loginUrl: string;

      try {
        // Wait for email with timeout - use the newly created user's email address
        const emailData = await gmailService.waitForEmail(testEmail, 60000);

        if (!emailData.tempPassword) {
          throw new Error('Temporary password not found in email');
        }
        if (!emailData.loginUrl) {
          throw new Error('Login URL not found in email');
        }

        tempPassword = emailData.tempPassword;
        loginUrl = emailData.loginUrl;

        console.log('✅ Email received and parsed successfully');
        console.log(`🔐 Extracted temp password: ${tempPassword.substring(0, 3)}***`);
        console.log(`🔗 Extracted login URL: ${loginUrl.substring(0, 50)}...`);

      } catch (error) {
        throw new Error(`Failed to retrieve email from Gmail: ${error}`);
      }

      // Verify email content
      expect(tempPassword).toBeTruthy();
      expect(loginUrl).toContain('first-login');

      // Complete first-time login
      console.log('🔐 Attempting first-time login with temp password...');
      await emailVerificationPage.navigateToLoginFromEmail(loginUrl);
      await emailVerificationPage.completeFirstTimeLogin(testEmail, tempPassword, newPassword);

      console.log('✅ First-time login and password change successful');

      // Verify user appears in user list
      await userManagementPage.navigateToAllUsers();
      await userManagementPage.waitForUserCreation(testEmailAddress);

      const userExists = await userManagementPage.verifyUserExists(testEmailAddress);
      expect(userExists).toBe(true);

      // Verify user role and institution
      const userRole = await userManagementPage.getUserRole(testEmailAddress);
      const userInstitution = await userManagementPage.getUserInstitution(testEmailAddress);

      expect(userRole).toBe('Institution Admin');
      expect(userInstitution).toBe(institution);

      console.log('✅ User verified in system with correct role and institution');

      // Mark email as read for cleanup
      try {
        const emails = await gmailService.fetchEmails(`to:${testEmailAddress} subject:"Welcome to Triangulator"`, 1);
        if (emails.length > 0) {
          await gmailService.markAsRead(emails[0].id);
          console.log('✅ Email marked as read');
        }
      } catch (error) {
        console.warn('⚠️ Could not mark email as read:', error);
      }
    });

    test.skip('should create reviewer user and verify email via Gmail API', async ({
      page,
      loginPage,
      userManagementPage,
      createUserPage,
      emailVerificationPage
    }) => {
      // Generate test user data
      const testEmail = UserDataGenerator.generateUniqueEmail();
      const institution = 'University Of Nevada Reno';
      const userData = UserDataGenerator.generateUserData('reviewer', institution, testEmail);

      console.log(`📧 Testing reviewer user with email: ${testEmail}`);

      // Login as Institution Admin
      await page.goto('');
      await loginPage.loginUser(instAdminEmail, instAdminPassword);

      // Navigate to user creation
      await userManagementPage.navigateToAllUsers();
      await userManagementPage.clickAddUser();

      // Fill user creation form
      await createUserPage.waitForFormToLoad();
      await createUserPage.createUser(userData);

      console.log('✅ Reviewer user created in system');

      // Wait for email to arrive in Gmail inbox
      console.log('⏳ Waiting for email to arrive in Gmail...');
      let tempPassword: string;
      let loginUrl: string;

      try {
        const emailData = await gmailService.waitForEmail(testEmailAddress, 60000);

        if (!emailData.tempPassword) {
          throw new Error('Temporary password not found in email');
        }
        if (!emailData.loginUrl) {
          throw new Error('Login URL not found in email');
        }

        tempPassword = emailData.tempPassword;
        loginUrl = emailData.loginUrl;

        console.log('✅ Email received and parsed successfully');

      } catch (error) {
        throw new Error(`Failed to retrieve email from Gmail: ${error}`);
      }

      // Complete first-time login
      await emailVerificationPage.navigateToLoginFromEmail(loginUrl);
      await emailVerificationPage.completeFirstTimeLogin(testEmailAddress, tempPassword, newPassword);

      console.log('✅ Reviewer first-time login successful');

      // Verify user appears in user list
      await userManagementPage.navigateToAllUsers();
      await userManagementPage.waitForUserCreation(testEmailAddress);

      const userExists = await userManagementPage.verifyUserExists(testEmailAddress);
      expect(userExists).toBe(true);

      // Verify user role
      const userRole = await userManagementPage.getUserRole(testEmailAddress);
      expect(userRole).toBe('Reviewer');

      console.log('✅ Reviewer user verified in system');
    });
  });

  test.describe('TC-INST-ADMIN-GMAIL-002: Email Verification Reliability', () => {
    test.skip('should handle email timeout gracefully', async ({
      page,
      loginPage,
      userManagementPage,
      createUserPage
    }) => {
      // Generate test user data with non-existent email
      const testEmail = UserDataGenerator.generateUniqueEmail();
      const userData = UserDataGenerator.generateUserData('institution_admin', 'University Of Nevada Reno', testEmail);

      console.log(`📧 Testing timeout with email: ${testEmail}`);

      // Login as Institution Admin
      await page.goto('');
      await loginPage.loginUser(instAdminEmail, instAdminPassword);

      // Navigate to user creation
      await userManagementPage.navigateToAllUsers();
      await userManagementPage.clickAddUser();

      // Fill user creation form
      await createUserPage.waitForFormToLoad();
      await createUserPage.createUser(userData);

      console.log('✅ User created in system');

      // Try to wait for email with short timeout (should fail gracefully)
      console.log('⏳ Testing email timeout handling...');

      try {
        // Use a very short timeout to test error handling
        await gmailService.waitForEmail(testEmail, 5000);
        throw new Error('Should have timed out waiting for email');
      } catch (error) {
        if (error instanceof Error && error.message.includes('Email not received')) {
          console.log('✅ Timeout handled correctly');
          expect(error.message).toContain('Email not received');
        } else {
          throw error;
        }
      }
    });

    test.skip('should verify email content structure', async () => {
      console.log('🧪 Testing email content structure...');

      try {
        // Fetch recent emails
        const emails = await gmailService.fetchEmails(`to:${testEmailAddress}`, 5);

        if (emails.length === 0) {
          console.log('⚠️ No emails found for structure test');
          return;
        }

        const latestEmail = emails[0];

        // Verify all required fields exist
        expect(latestEmail.id).toBeTruthy();
        expect(latestEmail.subject).toBeTruthy();
        expect(latestEmail.from).toBeTruthy();
        expect(latestEmail.to).toBeTruthy();
        expect(latestEmail.date).toBeTruthy();
        expect(latestEmail.body).toBeTruthy();

        console.log('✅ Email structure verified');
        console.log(`   Subject: ${latestEmail.subject}`);
        console.log(`   From: ${latestEmail.from}`);
        console.log(`   To: ${latestEmail.to}`);

      } catch (error) {
        console.error('❌ Email structure test failed:', error);
        throw error;
      }
    });

    test.skip('should extract and validate password format', async () => {
      console.log('🧪 Testing password format validation...');

      try {
        // Fetch recent emails
        const emails = await gmailService.fetchEmails(`to:${testEmailAddress} subject:"Welcome to Triangulator"`, 5);

        if (emails.length === 0) {
          console.log('⚠️ No emails found for password validation test');
          return;
        }

        const latestEmail = emails[0];

        if (!latestEmail.tempPassword) {
          console.log('⚠️ No temp password found in email');
          return;
        }

        // Validate password format (should be alphanumeric with special chars, 8+ chars)
        expect(latestEmail.tempPassword).toMatch(/^[A-Za-z0-9!@#$%^&*]{8,}$/);

        console.log('✅ Password format validated');
        console.log(`   Length: ${latestEmail.tempPassword.length} characters`);
        console.log(`   Format: ${latestEmail.tempPassword.substring(0, 3)}***`);

      } catch (error) {
        console.error('❌ Password validation test failed:', error);
        throw error;
      }
    });
  });
});
