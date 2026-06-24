import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

export interface GmailEmailData {
  id: string;
  threadId: string;
  subject: string;
  from: string;
  to: string;
  date: string;
  body: string;
  tempPassword?: string;
  loginUrl?: string;
}

export class GmailService {
  private oauth2Client: OAuth2Client;
  private gmail: any;
  private isAuthenticated: boolean = false;

  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GMAIL_CLIENT_ID,
      process.env.GMAIL_CLIENT_SECRET,
      'https://developers.google.com/oauthplayground'
    );
  }

  /**
   * Authenticate with Gmail API using refresh token
   */
  async authenticate(): Promise<void> {
    try {
      if (!process.env.GMAIL_REFRESH_TOKEN) {
        throw new Error('GMAIL_REFRESH_TOKEN not found in environment variables');
      }

      this.oauth2Client.setCredentials({
        refresh_token: process.env.GMAIL_REFRESH_TOKEN
      });

      this.gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });
      this.isAuthenticated = true;
    } catch (error) {
      console.error('Gmail authentication failed:', error);
      throw new Error('Failed to authenticate with Gmail API');
    }
  }

  /**
   * Fetch emails from Gmail inbox
   */
  async fetchEmails(query: string = '', maxResults: number = 10): Promise<GmailEmailData[]> {
    if (!this.isAuthenticated) {
      await this.authenticate();
    }

    try {
      console.log(`🔍 Gmail API query: "${query}" (maxResults: ${maxResults})`);
      
      const response = await this.gmail.users.messages.list({
        userId: 'me',
        q: query,
        maxResults: maxResults
      });

      const messageCount = response.data.messages?.length || 0;
      console.log(`📊 Gmail API returned ${messageCount} messages`);

      if (!response.data.messages) {
        console.log(`⚠️ No messages found for query: "${query}"`);
        return [];
      }

      const emails: GmailEmailData[] = [];

      for (const messageRef of response.data.messages) {
        const email = await this.fetchEmailDetails(messageRef.id);
        if (email) {
          emails.push(email);
          console.log(`  ✓ Processed email: ${email.subject} (to: ${email.to})`);
        }
      }

      console.log(`✅ Successfully fetched ${emails.length} emails`);
      return emails;
    } catch (error) {
      console.error('❌ Failed to fetch emails:', error);
      throw new Error('Failed to fetch emails from Gmail');
    }
  }

  /**
   * Fetch detailed email content
   */
  private async fetchEmailDetails(messageId: string): Promise<GmailEmailData | null> {
    try {
      const response = await this.gmail.users.messages.get({
        userId: 'me',
        id: messageId,
        format: 'full'
      });

      const message = response.data;
      const headers = message.payload.headers;
      
      const subject = headers.find((h: any) => h.name === 'Subject')?.value || '';
      const from = headers.find((h: any) => h.name === 'From')?.value || '';
      const to = headers.find((h: any) => h.name === 'To')?.value || '';
      const date = headers.find((h: any) => h.name === 'Date')?.value || '';

      // Extract email body
      const body = this.extractEmailBody(message.payload);

      // Extract temporary password and login URL
      const { tempPassword, loginUrl } = this.extractEmailContent(body);

      return {
        id: message.id,
        threadId: message.threadId,
        subject,
        from,
        to,
        date,
        body,
        tempPassword,
        loginUrl
      };
    } catch (error) {
      console.error(`Failed to fetch email details for ${messageId}:`, error);
      return null;
    }
  }

  /**
   * Extract email body from message payload
   */
  private extractEmailBody(payload: any): string {
    let body = '';

    if (payload.body.data) {
      body = Buffer.from(payload.body.data, 'base64').toString();
    } else if (payload.parts) {
      // Try text/plain first, then text/html
      for (const part of payload.parts) {
        if (part.mimeType === 'text/plain' && part.body.data) {
          body = Buffer.from(part.body.data, 'base64').toString();
          break;
        }
      }
      
      // If no text/plain found, try text/html
      if (!body) {
        for (const part of payload.parts) {
          if (part.mimeType === 'text/html' && part.body.data) {
            let htmlBody = Buffer.from(part.body.data, 'base64').toString();
            // Strip HTML tags for easier parsing
            body = htmlBody.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
            break;
          }
        }
      }
    }

    return body;
  }

  /**
   * Decode HTML entities in text (e.g., &amp; -> &, &lt; -> <, &gt; -> >)
   */
  private decodeHtmlEntities(text: string): string {
    const entities: Record<string, string> = {
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&#39;': "'",
      '&nbsp;': ' '
    };
    
    return text.replace(/&(?:amp|lt|gt|quot|#39|nbsp);/g, match => entities[match] || match);
  }

  /**
   * Extract temporary password and login URL from email body
   */
  private extractEmailContent(body: string): { tempPassword?: string; loginUrl?: string } {
    const result: { tempPassword?: string; loginUrl?: string } = {};

    // Log first 500 chars of body for debugging
    console.log(`📄 Email body preview: ${body.substring(0, 500)}`);

    // Extract temporary password - try multiple patterns based on actual email format
    // Actual format: "Here is your unique password for activating your account: 3_jHw3rp17-SAEbWVi"
    let tempPasswordMatch = body.match(/password\s+for\s+activating\s+your\s+account[:\s]+([^\s<>]+)/i);
    
    // Pattern 2: "unique password: XYZ" or "temporary password: XYZ"
    if (!tempPasswordMatch) {
      tempPasswordMatch = body.match(/(?:unique|temporary|temp)\s+password[:\s]+([^\s<>]+)/i);
    }
    
    // Pattern 3: Generic "password: XYZ" or "password XYZ"
    if (!tempPasswordMatch) {
      tempPasswordMatch = body.match(/password[:\s]+([A-Za-z0-9_\-\.!@#$%^&*]{8,})/i);
    }

    if (tempPasswordMatch) {
      // Decode HTML entities (e.g., &amp; -> &)
      result.tempPassword = this.decodeHtmlEntities(tempPasswordMatch[1]);
      console.log(`✅ Extracted password: ${result.tempPassword.substring(0, 3)}***`);
    } else {
      console.log(`❌ No password found in email body`);
    }

    // Extract login URL - look for URLs containing login, first-login, or accept-invite
    const urlMatch = body.match(/https?:\/\/[^\s<>"]+(?:login|first-login|accept-invite)[^\s<>"]*/i);
    if (urlMatch) {
      result.loginUrl = urlMatch[0];
      console.log(`✅ Extracted URL: ${urlMatch[0].substring(0, 50)}...`);
    } else {
      console.log(`❌ No login URL found in email body`);
    }

    return result;
  }

  /**
   * Get temporary password from most recent email
   */
  async getTempPassword(emailAddress: string): Promise<string> {
    // Extract base email for Gmail + aliases
    const emailParts = emailAddress.split('@');
    const localPart = emailParts[0].split('+')[0];
    const domain = emailParts[1];
    const baseEmail = `${localPart}@${domain}`;
    
    const query = `to:${baseEmail} subject:(activate Triangulator account)`;
    const emails = await this.fetchEmails(query, 5);

    if (emails.length === 0) {
      throw new Error(`No welcome email found for ${emailAddress}`);
    }

    const latestEmail = emails[0]; // Gmail returns most recent first

    if (!latestEmail.tempPassword) {
      throw new Error('Temporary password not found in email');
    }

    return latestEmail.tempPassword;
  }

  /**
   * Get login URL from most recent email
   */
  async getLoginLink(emailAddress: string): Promise<string> {
    // Extract base email for Gmail + aliases
    const emailParts = emailAddress.split('@');
    const localPart = emailParts[0].split('+')[0];
    const domain = emailParts[1];
    const baseEmail = `${localPart}@${domain}`;
    
    const query = `to:${baseEmail} subject:(activate Triangulator account)`;
    const emails = await this.fetchEmails(query, 5);

    if (emails.length === 0) {
      throw new Error(`No welcome email found for ${emailAddress}`);
    }

    const latestEmail = emails[0];

    if (!latestEmail.loginUrl) {
      throw new Error('Login URL not found in email');
    }

    return latestEmail.loginUrl;
  }

  /**
   * Wait for email to arrive
   * Gmail treats all + alias variants (e.g., user+tag@gmail.com) as the same inbox
   * So we search for the base address which will catch all variants
   */
  async waitForEmail(emailAddress: string, timeout: number = 30000): Promise<GmailEmailData> {
    const startTime = Date.now();
    
    // Extract base email address (before the + sign for Gmail aliases)
    const emailParts = emailAddress.split('@');
    const localPart = emailParts[0].split('+')[0]; // Get part before + if it exists
    const domain = emailParts[1];
    const baseEmail = `${localPart}@${domain}`;
    
    console.log(`🔍 Searching for emails to base address: ${baseEmail} (original: ${emailAddress})`);
    
    // Search for emails to the base address (handles Gmail + aliases)
    // Gmail will return emails sent to user@domain.com, user+tag@domain.com, etc.
    // Use Gmail query to match actual email subject
    const query = `to:${baseEmail} subject:(activate Triangulator account)`;

    while (Date.now() - startTime < timeout) {
      try {
        const emails = await this.fetchEmails(query, 1);
        
        if (emails.length > 0) {
          console.log(`✅ Found ${emails.length} email(s) for ${baseEmail}`);
          // Return the most recent email
          return emails[0];
        }

        const elapsedSeconds = Math.round((Date.now() - startTime) / 1000);
        console.log(`⏳ Waiting for email to ${baseEmail}... (${elapsedSeconds}s/${Math.round(timeout / 1000)}s)`);
        await this.delay(3000);
      } catch (error) {
        console.error(`❌ Error fetching emails: ${error}`);
        await this.delay(3000);
      }
    }

    throw new Error(`Email not received for ${emailAddress} within ${timeout}ms`);
  }

  /**
   * Mark email as read
   */
  async markAsRead(messageId: string): Promise<void> {
    if (!this.isAuthenticated) {
      await this.authenticate();
    }

    await this.gmail.users.messages.modify({
      userId: 'me',
      id: messageId,
      requestBody: {
        removeLabelIds: ['UNREAD']
      }
    });
  }

  /**
   * Delete email
   */
  async deleteEmail(messageId: string): Promise<void> {
    if (!this.isAuthenticated) {
      await this.authenticate();
    }

    await this.gmail.users.messages.trash({
      userId: 'me',
      id: messageId
    });
  }

  /**
   * Search for emails with custom query
   */
  async searchEmails(query: string, maxResults: number = 10): Promise<GmailEmailData[]> {
    return this.fetchEmails(query, maxResults);
  }

  /**
   * Get email count for specific query
   */
  async getEmailCount(query: string): Promise<number> {
    if (!this.isAuthenticated) {
      await this.authenticate();
    }

    try {
      const response = await this.gmail.users.messages.list({
        userId: 'me',
        q: query
      });

      return response.data.resultSizeEstimate || 0;
    } catch (error) {
      console.error('Failed to get email count:', error);
      return 0;
    }
  }

  /**
   * Delay utility method
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Check if Gmail API is properly configured
   */
  static isConfigured(): boolean {
    return !!(process.env.GMAIL_CLIENT_ID && 
              process.env.GMAIL_CLIENT_SECRET && 
              process.env.GMAIL_REFRESH_TOKEN);
  }

  /**
   * Test Gmail API connection
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.authenticate();
      const profile = await this.gmail.users.getProfile({ userId: 'me' });
      return !!profile.data.emailAddress;
    } catch (error) {
      console.error('Gmail API connection test failed:', error);
      return false;
    }
  }
}
