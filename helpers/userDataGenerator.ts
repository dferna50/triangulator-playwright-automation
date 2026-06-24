import { UserData } from '../pages/CreateUserPage';

export interface UserCreationScenario {
  id: string;
  creatorType: 'triangulator_admin' | 'institution_admin';
  userType: 'triangulator_admin' | 'institution_admin' | 'reviewer';
  creatorEmail: string;
  creatorPassword: string;
  testEmailTemplate: string;
  firstName: string;
  lastName: string;
  institution?: string;
  role: string;
  expectedStatus: 'Active' | 'Pending';
}

export class UserDataGenerator {
  private static readonly BASE_EMAIL = 'testtriangulatoroo';
  private static readonly EMAIL_DOMAIN = 'gmail.com';
  private static readonly INSTITUTIONS = [
    'Arizona State University',
    'University Of Nevada Reno',
    'California One',
    'Rutgers University',
    'Pima Community College',
    'American River College',
    'ART Institute',
    'ARU',
    'Nebraska',
    'Alverno College',
    'Aaniiih'
  ];

  private static readonly ROLES = {
    triangulator_admin: 'Triangulator Admin',
    institution_admin: 'Institution Admin',
    reviewer: 'Reviewer'
  };

  private static readonly FIRST_NAMES = [
    'Test', 'Demo', 'Sample', 'Auto', 'QA', 'Temp', 'Mock', 'E2E', 'Integration', 'Regression'
  ];

  private static readonly LAST_NAMES = [
    'User', 'Account', 'Test', 'Demo', 'Sample', 'Auto', 'QA', 'Temp', 'Mock', 'Verification'
  ];

  /**
   * Generate unique test email using plus addressing
   */
  static generateUniqueEmail(baseEmail?: string): string {
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const emailBase = baseEmail || this.BASE_EMAIL;
    return `${emailBase}+${timestamp}${randomSuffix}@${this.EMAIL_DOMAIN}`;
  }

  /**
   * Generate random first name
   */
  static generateFirstName(): string {
    const randomIndex = Math.floor(Math.random() * this.FIRST_NAMES.length);
    return this.FIRST_NAMES[randomIndex];
  }

  /**
   * Generate random last name
   */
  static generateLastName(): string {
    const randomIndex = Math.floor(Math.random() * this.LAST_NAMES.length);
    return this.LAST_NAMES[randomIndex];
  }

  /**
   * Get available institutions
   */
  static getInstitutions(): string[] {
    return [...this.INSTITUTIONS];
  }

  /**
   * Get role display name
   */
  static getRoleName(roleType: 'triangulator_admin' | 'institution_admin' | 'reviewer'): string {
    return this.ROLES[roleType];
  }

  /**
   * Generate user data for testing
   */
  static generateUserData(
    userType: 'triangulator_admin' | 'institution_admin' | 'reviewer',
    institution?: string,
    customEmail?: string
  ): UserData {
    const email = customEmail || this.generateUniqueEmail();
    const firstName = this.generateFirstName();
    const lastName = this.generateLastName();
    const role = this.getRoleName(userType);
    const selectedInstitution = institution || this.getRandomInstitution();

    return {
      email,
      firstName,
      lastName,
      institution: selectedInstitution,
      role
    };
  }

  /**
   * Get random institution from list
   */
  static getRandomInstitution(): string {
    const randomIndex = Math.floor(Math.random() * this.INSTITUTIONS.length);
    return this.INSTITUTIONS[randomIndex];
  }

  /**
   * Generate user creation scenarios
   */
  static generateUserCreationScenarios(): UserCreationScenario[] {
    const scenarios: UserCreationScenario[] = [];

    // Triangulator Admin creating users
    scenarios.push({
      id: 'TC-TRI-ADMIN-001',
      creatorType: 'triangulator_admin',
      userType: 'triangulator_admin',
      creatorEmail: process.env.ADMIN_EMAIL || 'creditmobility@asu.edu',
      creatorPassword: process.env.ADMIN_PASSWORD || 'Triangulator!1',
      testEmailTemplate: this.generateUniqueEmail(),
      firstName: this.generateFirstName(),
      lastName: this.generateLastName(),
      institution: 'Arizona State University',
      role: this.getRoleName('triangulator_admin'),
      expectedStatus: 'Active'
    });

    scenarios.push({
      id: 'TC-TRI-ADMIN-002',
      creatorType: 'triangulator_admin',
      userType: 'institution_admin',
      creatorEmail: process.env.ADMIN_EMAIL || 'creditmobility@asu.edu',
      creatorPassword: process.env.ADMIN_PASSWORD || 'Triangulator!1',
      testEmailTemplate: this.generateUniqueEmail(),
      firstName: this.generateFirstName(),
      lastName: this.generateLastName(),
      institution: this.getRandomInstitution(),
      role: this.getRoleName('institution_admin'),
      expectedStatus: 'Active'
    });

    scenarios.push({
      id: 'TC-TRI-ADMIN-003',
      creatorType: 'triangulator_admin',
      userType: 'reviewer',
      creatorEmail: process.env.ADMIN_EMAIL || 'creditmobility@asu.edu',
      creatorPassword: process.env.ADMIN_PASSWORD || 'Triangulator!1',
      testEmailTemplate: this.generateUniqueEmail(),
      firstName: this.generateFirstName(),
      lastName: this.generateLastName(),
      institution: this.getRandomInstitution(),
      role: this.getRoleName('reviewer'),
      expectedStatus: 'Active'
    });

    // Institution Admin creating users
    scenarios.push({
      id: 'TC-INST-ADMIN-001',
      creatorType: 'institution_admin',
      userType: 'institution_admin',
      creatorEmail: process.env.INST_ADMIN_EMAIL || 'testtriangulator+109@gmail.com',
      creatorPassword: process.env.INST_ADMIN_PASSWORD || 'Triangulator!1',
      testEmailTemplate: this.generateUniqueEmail(),
      firstName: this.generateFirstName(),
      lastName: this.generateLastName(),
      institution: 'University Of Nevada Reno', // Same as creator's institution
      role: this.getRoleName('institution_admin'),
      expectedStatus: 'Active'
    });

    scenarios.push({
      id: 'TC-INST-ADMIN-002',
      creatorType: 'institution_admin',
      userType: 'reviewer',
      creatorEmail: process.env.INST_ADMIN_EMAIL || 'testtriangulator+109@gmail.com',
      creatorPassword: process.env.INST_ADMIN_PASSWORD || 'Triangulator!1',
      testEmailTemplate: this.generateUniqueEmail(),
      firstName: this.generateFirstName(),
      lastName: this.generateLastName(),
      institution: 'University Of Nevada Reno', // Same as creator's institution
      role: this.getRoleName('reviewer'),
      expectedStatus: 'Active'
    });

    return scenarios;
  }

  /**
   * Generate test data for specific scenario
   */
  static generateScenarioData(scenarioId: string): UserCreationScenario | null {
    const scenarios = this.generateUserCreationScenarios();
    return scenarios.find(s => s.id === scenarioId) || null;
  }

  /**
   * Generate batch of test users
   */
  static generateBatchOfUsers(count: number, userType: string, institution?: string): UserData[] {
    const users: UserData[] = [];
    
    for (let i = 0; i < count; i++) {
      const user = this.generateUserData(
        userType as 'triangulator_admin' | 'institution_admin' | 'reviewer',
        institution
      );
      users.push(user);
    }

    return users;
  }

  /**
   * Generate unique password for testing
   */
  static generateTestPassword(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  /**
   * Extract email base from plus addressing
   */
  static extractEmailBase(fullEmail: string): string {
    const atIndex = fullEmail.indexOf('@');
    if (atIndex === -1) return fullEmail;
    
    const localPart = fullEmail.substring(0, atIndex);
    const plusIndex = localPart.indexOf('+');
    
    if (plusIndex === -1) return fullEmail;
    
    return localPart.substring(0, plusIndex) + fullEmail.substring(atIndex);
  }

  /**
   * Validate email format
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Get timestamp from plus addressing email
   */
  static extractTimestampFromEmail(email: string): number | null {
    const match = email.match(/\+(\d+)/);
    return match ? parseInt(match[1]) : null;
  }

  /**
   * Generate cleanup data for test users
   */
  static generateCleanupData(testEmails: string[]): Array<{ email: string; timestamp: number }> {
    return testEmails.map(email => ({
      email,
      timestamp: this.extractTimestampFromEmail(email) || Date.now()
    }));
  }
}
