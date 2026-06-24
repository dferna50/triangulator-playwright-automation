import { test, expect } from '../../fixtures/test';
import { UserDataGenerator } from '../../helpers/userDataGenerator';
import { GmailService } from '../../helpers/gmailService';

/**
 * Triangulator Admin User Creation Tests with Real Gmail API Integration
 * 
 * These tests use the real Gmail API to verify email receiving and password extraction.
 * Requires GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, and GMAIL_REFRESH_TOKEN in .env
 */
test.describe('Triangulator Admin User Creation - Gmail API Integration', () => {
  const adminEmail = process.env.ADMIN_EMAIL || 'creditmobility@asu.edu';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Triangulator!1';
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

  test.describe('TC-TRI-ADMIN-GMAIL-001: Create Triangulator Admin with Real Email Verification', () => {
    test('should create triangulator admin user and verify email via Gmail API', async ({
      page,
      loginPage, 
      userManagementPage, 
      createUserPage, 
      emailVerificationPage 
    }) => {
      // Generate unique test email with + addressing (Gmail treats all variants as same inbox)
      const testEmail = UserDataGenerator.generateUniqueEmail();
      const institution = 'American River College';
      const userData = UserDataGenerator.generateUserData('institution_admin', institution, testEmail);

      console.log(`📧 Testing with email: ${testEmail}`);

      // Login as Triangulator Admin
      await page.goto('');
      await loginPage.loginUser(adminEmail, adminPassword);

      // Navigate to user creation
      await userManagementPage.navigateToAllUsers();
      await userManagementPage.clickAddUser();

      // Fill user creation form
      await createUserPage.waitForFormToLoad();
      await createUserPage.createUser(userData);

      console.log('✅ User created in system');

      // Wait 5 seconds for email to be delivered before checking
      console.log('⏳ Waiting 5 seconds for email delivery...');
      await page.waitForTimeout(5000);

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
      expect(loginUrl).toContain('accept-invite');

      // Complete first-time login
      console.log('🔐 Attempting first-time login with temp password...');
      await emailVerificationPage.navigateToLoginFromEmail(loginUrl);
      await emailVerificationPage.completeFirstTimeLogin(testEmail, tempPassword, newPassword);

    //   console.log('✅ First-time login and password change successful');

    //   // Verify user appears in user list
    //   await userManagementPage.navigateToAllUsers();
    //   await userManagementPage.waitForUserCreation(testEmail);
      
    //   const userRole = await userManagementPage.getUserRole(testEmail);
    //   expect(userRole).toBe('Reviewer');
      
    //   const userInstitution = await userManagementPage.getUserInstitution(testEmail);
    //   expect(userInstitution).toBe('American River College');

    //   console.log('✅ Reviewer user verified in system');

    //   // Mark email as read for cleanup
    //   try {
    //     const emails = await gmailService.fetchEmails(`to:${testEmail} subject:(activate Triangulator account)`, 1);
    //     if (emails.length > 0) {
    //       await gmailService.markAsRead(emails[0].id);
    //       console.log('✅ Email marked as read');
    //     }
    //   } catch (error) {
    //     console.warn('⚠️ Could not mark email as read:', error);
    //   }
     });

    test.skip('should handle email timeout gracefully', async ({ 
      page,
      loginPage, 
      userManagementPage, 
      createUserPage 
    }) => {
      // Use a fake email that will never receive emails (different domain)
      const fakeEmail = `test${Date.now()}@fake-domain-that-does-not-exist.com`;
      const userData = UserDataGenerator.generateUserData('triangulator_admin', 'American River College', fakeEmail);

      console.log(`📧 Testing timeout with fake email: ${fakeEmail}`);

      // Login as Triangulator Admin
      await page.goto('');
      await loginPage.loginUser(adminEmail, adminPassword);

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
        await gmailService.waitForEmail(fakeEmail, 5000);
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

    test('should extract password from email correctly', async () => {
      console.log('🧪 Testing password extraction from Gmail...');

      try {
        // Fetch recent emails - use correct Gmail query syntax
        const emails = await gmailService.fetchEmails(`to:${testEmailAddress} subject:(activate Triangulator account)`, 5);
        
        if (emails.length === 0) {
          console.log('⚠️ No emails found for password extraction test');
          return;
        }

        const latestEmail = emails[0];
        
        expect(latestEmail.tempPassword).toBeTruthy();
        // Password can contain letters, numbers, underscores, hyphens, plus, and special chars
        expect(latestEmail.tempPassword).toMatch(/^[A-Za-z0-9!@#$%^&*_\-\.+]+$/);
        
        console.log('✅ Password extracted and validated');
        console.log(`✅ Password format: ${latestEmail.tempPassword?.substring(0, 3)}***`);

      } catch (error) {
        console.error('❌ Password extraction test failed:', error);
        throw error;
      }
    });

    test('should extract login URL from email correctly', async () => {
      console.log('🧪 Testing login URL extraction from Gmail...');

      try {
        // Fetch recent emails - use correct Gmail query syntax
        const emails = await gmailService.fetchEmails(`to:${testEmailAddress} subject:(activate Triangulator account)`, 5);
        
        if (emails.length === 0) {
          console.log('⚠️ No emails found for URL extraction test');
          return;
        }

        const latestEmail = emails[0];
        
        expect(latestEmail.loginUrl).toBeTruthy();
        expect(latestEmail.loginUrl).toMatch(/https?:\/\/.+/);
        expect(latestEmail.loginUrl).toContain('accept-invite');
        
        console.log('✅ Login URL extracted and validated');
        console.log(`✅ URL format: ${latestEmail.loginUrl?.substring(0, 50)}...`);

      } catch (error) {
        console.error('❌ URL extraction test failed:', error);
        throw error;
      }
    });
  });

  test.describe('TC-TRI-ADMIN-GMAIL-002: Email Service Reliability', () => {
    test('should handle multiple emails correctly', async () => {
      console.log('🧪 Testing multiple email handling...');

      try {
        // Fetch multiple emails
        const emails = await gmailService.fetchEmails(`to:${testEmailAddress}`, 10);
        
        console.log(`✅ Retrieved ${emails.length} emails from Gmail`);
        
        // Verify email structure
        for (const email of emails.slice(0, 3)) {
          expect(email.id).toBeTruthy();
          expect(email.subject).toBeTruthy();
          expect(email.from).toBeTruthy();
          expect(email.to).toBeTruthy();
          expect(email.date).toBeTruthy();
          expect(email.body).toBeTruthy();
        }

        console.log('✅ All emails have correct structure');

      } catch (error) {
        console.error('❌ Multiple email handling test failed:', error);
        throw error;
      }
    });

    test('should handle email deletion correctly', async () => {
      console.log('🧪 Testing email deletion...');

      try {
        // Fetch an email to delete
        const emails = await gmailService.fetchEmails(`to:${testEmailAddress}`, 1);
        
        if (emails.length === 0) {
          console.log('⚠️ No emails found for deletion test');
          return;
        }

        const emailToDelete = emails[0];
        
        // Delete the email
        await gmailService.deleteEmail(emailToDelete.id);
        
        console.log('✅ Email deleted successfully');

      } catch (error) {
        console.error('❌ Email deletion test failed:', error);
        throw error;
      }
    });
  });
});
