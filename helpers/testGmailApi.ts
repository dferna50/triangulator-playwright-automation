import * as dotenv from 'dotenv';
dotenv.config();

import { GmailService } from './gmailService';

async function main() {
  const gmailService = new GmailService();

  console.log('1. Authenticating...');
  await gmailService.authenticate();
  console.log('   OK');

  console.log('2. Fetching emails with subject:(activate Triangulator account)...');
  const emails = await gmailService.fetchEmails('to:testtriangulatoroo@gmail.com subject:(activate Triangulator account)', 3);
  console.log(`   Found ${emails.length} emails`);

  if (emails.length > 0) {
    const e = emails[0];
    console.log(`   Subject: ${e.subject}`);
    console.log(`   To: ${e.to}`);
    console.log(`   From: ${e.from}`);
    console.log(`   Body (first 800 chars):`);
    console.log(e.body.substring(0, 800));
    console.log(`   ---`);
    console.log(`   tempPassword: ${e.tempPassword ?? 'NOT FOUND'}`);
    console.log(`   loginUrl: ${e.loginUrl ?? 'NOT FOUND'}`);
  }

  console.log('\n3. Fetching ALL recent emails (no subject filter)...');
  const allEmails = await gmailService.fetchEmails('to:testtriangulatoroo@gmail.com', 5);
  console.log(`   Found ${allEmails.length} emails`);
  for (const e of allEmails.slice(0, 5)) {
    console.log(`   - Subject: "${e.subject}" | To: ${e.to}`);
  }
}

main().catch(console.error);
