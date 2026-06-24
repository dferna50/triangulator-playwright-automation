export interface EmailData {
  to: string;
  tempPassword: string;
  loginUrl: string;
  subject: string;
  timestamp: number;
}

export class EmailServiceMock {
  private static emailDatabase: Map<string, EmailData> = new Map();
  private static baseUrl: string = 'https://qa.creditmobility.net';

  /**
   * Mock sending user creation email
   * In real implementation, this would be called by the application
   * For testing, we simulate the email being sent
   */
  static async sendUserCreationEmail(email: string, tempPassword: string): Promise<void> {
    const loginUrl = `${this.baseUrl}/first-login?token=${this.generateMockToken()}&email=${encodeURIComponent(email)}`;
    
    const emailData: EmailData = {
      to: email,
      tempPassword: tempPassword,
      loginUrl: loginUrl,
      subject: 'Welcome to Triangulator - Your Account Details',
      timestamp: Date.now()
    };

    this.emailDatabase.set(email, emailData);
    
    // Simulate email delivery delay
    await this.delay(1000);
  }

  /**
   * Get temporary password from mock email
   */
  static async getTempPassword(email: string): Promise<string> {
    const emailData = await this.waitForEmail(email, 30000);
    if (!emailData) {
      throw new Error(`No email found for ${email} within timeout period`);
    }
    return emailData.tempPassword;
  }

  /**
   * Get login URL from mock email
   */
  static async getLoginLink(email: string): Promise<string> {
    const emailData = await this.waitForEmail(email, 30000);
    if (!emailData) {
      throw new Error(`No email found for ${email} within timeout period`);
    }
    return emailData.loginUrl;
  }

  /**
   * Wait for email to arrive in mock inbox
   */
  static async waitForEmail(email: string, timeout: number = 30000): Promise<EmailData | null> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      const emailData = this.emailDatabase.get(email);
      if (emailData) {
        return emailData;
      }
      await this.delay(2000);
    }
    
    return null;
  }

  /**
   * Check if email exists in mock inbox
   */
  static async emailExists(email: string): Promise<boolean> {
    return this.emailDatabase.has(email);
  }

  /**
   * Get all emails for a user
   */
  static async getAllEmailsForUser(email: string): Promise<EmailData[]> {
    const emails: EmailData[] = [];
    const emailData = this.emailDatabase.get(email);
    if (emailData) {
      emails.push(emailData);
    }
    return emails;
  }

  /**
   * Clear mock email database (for test cleanup)
   */
  static clearEmailDatabase(): void {
    this.emailDatabase.clear();
  }

  /**
   * Clear specific email from database
   */
  static clearEmail(email: string): void {
    this.emailDatabase.delete(email);
  }

  /**
   * Generate mock temporary password
   */
  static generateMockTempPassword(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  /**
   * Generate mock token for login URL
   */
  private static generateMockToken(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  /**
   * Simulate email delivery delay
   */
  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Mock email content extraction (simulates parsing email body)
   */
  static async extractEmailContent(email: string): Promise<{
    tempPassword: string;
    loginUrl: string;
    expirationTime: string;
  }> {
    const emailData = await this.waitForEmail(email, 30000);
    if (!emailData) {
      throw new Error(`No email found for ${email}`);
    }

    // Simulate extracting content from email body
    return {
      tempPassword: emailData.tempPassword,
      loginUrl: emailData.loginUrl,
      expirationTime: new Date(emailData.timestamp + 24 * 60 * 60 * 1000).toISOString() // 24 hours
    };
  }

  /**
   * Validate if temporary password is still valid (not expired)
   */
  static isTempPasswordValid(email: string): boolean {
    const emailData = this.emailDatabase.get(email);
    if (!emailData) {
      return false;
    }
    
    const expirationTime = emailData.timestamp + (24 * 60 * 60 * 1000); // 24 hours
    return Date.now() < expirationTime;
  }

  /**
   * Get email timestamp
   */
  static getEmailTimestamp(email: string): number | null {
    const emailData = this.emailDatabase.get(email);
    return emailData ? emailData.timestamp : null;
  }

  /**
   * Simulate expired temporary password
   */
  static expireTempPassword(email: string): void {
    const emailData = this.emailDatabase.get(email);
    if (emailData) {
      // Set timestamp to past to simulate expiration
      emailData.timestamp = Date.now() - (25 * 60 * 60 * 1000); // 25 hours ago
    }
  }

  /**
   * Debug method to see all emails in database
   */
  static debugGetAllEmails(): Map<string, EmailData> {
    return new Map(this.emailDatabase);
  }
}
