import { GmailService } from './gmailService';

/**
 * Debug script to manually test Gmail API and verify email retrieval
 */
async function debugGmailAPI() {
  const gmailService = new GmailService();
  
  try {
    // Authenticate
    console.log('🔐 Authenticating with Gmail API...');
    await gmailService.authenticate();
    console.log('✅ Gmail API authentication successful');
    
    // Test 1: Fetch all emails to base address
    console.log('\n📧 Test 1: Fetching all emails to testtriangulatoroo@gmail.com');
    const allEmails = await gmailService.fetchEmails('to:testtriangulatoroo@gmail.com', 10);
    console.log(`✅ Found ${allEmails.length} emails to base address`);
    
    if (allEmails.length > 0) {
      console.log('\n📋 Recent emails:');
      allEmails.slice(0, 3).forEach((email, index) => {
        console.log(`\n  Email ${index + 1}:`);
        console.log(`    To: ${email.to}`);
        console.log(`    Subject: ${email.subject}`);
        console.log(`    Date: ${email.date}`);
        console.log(`    Has temp password: ${!!email.tempPassword}`);
        console.log(`    Has login URL: ${!!email.loginUrl}`);
      });
    }
    
    // Test 2: Search with subject filter
    console.log('\n\n📧 Test 2: Searching with subject filter');
    const subjectEmails = await gmailService.fetchEmails('to:testtriangulatoroo@gmail.com subject:"Welcome to Triangulator"', 10);
    console.log(`✅ Found ${subjectEmails.length} emails with subject filter`);
    
    if (subjectEmails.length > 0) {
      console.log('\n📋 Matching emails:');
      subjectEmails.slice(0, 3).forEach((email, index) => {
        console.log(`\n  Email ${index + 1}:`);
        console.log(`    To: ${email.to}`);
        console.log(`    Subject: ${email.subject}`);
        console.log(`    Temp Password: ${email.tempPassword || 'NOT FOUND'}`);
        console.log(`    Login URL: ${email.loginUrl || 'NOT FOUND'}`);
      });
    }
    
    // Test 3: Search for the specific email from the test
    console.log('\n\n📧 Test 3: Searching for specific test email');
    const testEmail = 'testtriangulatoroo+17743640877551c5xz5@gmail.com';
    const specificEmails = await gmailService.fetchEmails(`to:${testEmail}`, 5);
    console.log(`✅ Found ${specificEmails.length} emails to ${testEmail}`);
    
    if (specificEmails.length > 0) {
      console.log('\n📋 Specific email:');
      const email = specificEmails[0];
      console.log(`    To: ${email.to}`);
      console.log(`    Subject: ${email.subject}`);
      console.log(`    Temp Password: ${email.tempPassword || 'NOT FOUND'}`);
      console.log(`    Login URL: ${email.loginUrl || 'NOT FOUND'}`);
    }
    
    // Test 4: Check email body parsing
    console.log('\n\n📧 Test 4: Checking email body content');
    if (allEmails.length > 0) {
      const latestEmail = allEmails[0];
      console.log(`\n📄 Email body preview (first 500 chars):`);
      console.log(latestEmail.body.substring(0, 500));
      console.log('\n...\n');
      
      // Check for password patterns
      const passwordMatch = latestEmail.body.match(/(?:temporary|temp)\s+password[:\s]+([A-Za-z0-9!@#$%^&*]{8,})/i);
      console.log(`\n🔍 Password extraction test:`);
      console.log(`  Pattern found: ${!!passwordMatch}`);
      if (passwordMatch) {
        console.log(`  Extracted: ${passwordMatch[1]}`);
      }
      
      // Check for URL patterns
      const urlMatch = latestEmail.body.match(/https?:\/\/[^\s]+(?:login|first-login)[^\s]*/i);
      console.log(`\n🔍 URL extraction test:`);
      console.log(`  Pattern found: ${!!urlMatch}`);
      if (urlMatch) {
        console.log(`  Extracted: ${urlMatch[0]}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run the debug script
debugGmailAPI();
