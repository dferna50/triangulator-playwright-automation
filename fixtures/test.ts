import { test as base, type Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { FaqPage } from '../pages/FaqPage';
import { SearchPage } from '../pages/SearchPage';
import { FiltersPage } from '../pages/FiltersPage';
import { UploadPage } from '../pages/UploadPage';
import { SuggestionsPage } from '../pages/SuggestionsPage';
import { InstitutionConfigPage } from '../pages/InstitutionConfigPage';
import { PeerGroupsPage } from '../pages/PeerGroupsPage';
import { BoostRequestPage } from '../pages/BoostRequestPage';
import { CreateUserPage, UserData } from '../pages/CreateUserPage';
import { DeleteUserPage } from '../pages/DeleteUserPage';
import { EditUserPage } from '../pages/EditUserPage';
import { WorkflowLandingPage } from '../pages/WorkflowLandingPage';
import { RunSqlPage } from '../pages/RunSqlPage';
import { RunTriangulationPage } from '../pages/RunTriangulationPage';
import { WorkflowConfigurationsPage } from '../pages/WorkflowConfigurationsPage';
import { UserManagementPage } from '../pages/UserManagementPage';
import { EmailVerificationPage } from '../pages/EmailVerificationPage';
import { InstitutionSettingsPage } from '../pages/InstitutionSettingsPage';
import { OrganizationsPage } from '../pages/OrganizationsPage';
import { InstitutionMappingsPage } from '../pages/InstitutionMappingsPage';
import { ApiTokensPage } from '../pages/ApiTokensPage';
import { EquivalencyDownloadPage } from '../pages/EquivalencyDownloadPage';
import { RequestAccessPage } from '../pages/RequestAccessPage';

/**
 * Custom fixture type definitions for all page objects.
 */
type PageFixtures = {
  loginPage: LoginPage;
  faqPage: FaqPage;
  searchPage: SearchPage;
  filtersPage: FiltersPage;
  uploadPage: UploadPage;
  suggestionsPage: SuggestionsPage;
  institutionConfigPage: InstitutionConfigPage;
  peerGroupsPage: PeerGroupsPage;
  boostRequestPage: BoostRequestPage;
  createUserPage: CreateUserPage;
  deleteUserPage: DeleteUserPage;
  editUserPage: EditUserPage;
  workflowLandingPage: WorkflowLandingPage;
  runSqlPage: RunSqlPage;
  runTriangulationPage: RunTriangulationPage;
  workflowConfigurationsPage: WorkflowConfigurationsPage;
  userManagementPage: UserManagementPage;
  emailVerificationPage: EmailVerificationPage;
  institutionSettingsPage: InstitutionSettingsPage;
  organizationsPage: OrganizationsPage;
  institutionMappingsPage: InstitutionMappingsPage;
  apiTokensPage: ApiTokensPage;
  equivalencyDownloadPage: EquivalencyDownloadPage;
  requestAccessPage: RequestAccessPage;
};

/**
 * Extended test object with all page object fixtures pre-instantiated.
 * Import { test, expect } from this file instead of '@playwright/test'.
 */
export const test = base.extend<PageFixtures>({
  loginPage: async ({ page }: { page: Page }, use: (r: LoginPage) => Promise<void>) => {
    await use(new LoginPage(page));
  },
  faqPage: async ({ page }: { page: Page }, use: (r: FaqPage) => Promise<void>) => {
    await use(new FaqPage(page));
  },
  searchPage: async ({ page }: { page: Page }, use: (r: SearchPage) => Promise<void>) => {
    await use(new SearchPage(page));
  },
  filtersPage: async ({ page }: { page: Page }, use: (r: FiltersPage) => Promise<void>) => {
    await use(new FiltersPage(page));
  },
  uploadPage: async ({ page }: { page: Page }, use: (r: UploadPage) => Promise<void>) => {
    await use(new UploadPage(page));
  },
  suggestionsPage: async ({ page }: { page: Page }, use: (r: SuggestionsPage) => Promise<void>) => {
    await use(new SuggestionsPage(page));
  },
  institutionConfigPage: async ({ page }: { page: Page }, use: (r: InstitutionConfigPage) => Promise<void>) => {
    await use(new InstitutionConfigPage(page));
  },
  peerGroupsPage: async ({ page }: { page: Page }, use: (r: PeerGroupsPage) => Promise<void>) => {
    await use(new PeerGroupsPage(page));
  },
  boostRequestPage: async ({ page }: { page: Page }, use: (r: BoostRequestPage) => Promise<void>) => {
    await use(new BoostRequestPage(page));
  },
  createUserPage: async ({ page }: { page: Page }, use: (r: CreateUserPage) => Promise<void>) => {
    await use(new CreateUserPage(page));
  },
  deleteUserPage: async ({ page }: { page: Page }, use: (r: DeleteUserPage) => Promise<void>) => {
    await use(new DeleteUserPage(page));
  },
  editUserPage: async ({ page }: { page: Page }, use: (r: EditUserPage) => Promise<void>) => {
    await use(new EditUserPage(page));
  },
  workflowLandingPage: async ({ page }: { page: Page }, use: (r: WorkflowLandingPage) => Promise<void>) => {
    await use(new WorkflowLandingPage(page));
  },
  runSqlPage: async ({ page }: { page: Page }, use: (r: RunSqlPage) => Promise<void>) => {
    await use(new RunSqlPage(page));
  },
  runTriangulationPage: async ({ page }: { page: Page }, use: (r: RunTriangulationPage) => Promise<void>) => {
    await use(new RunTriangulationPage(page));
  },
  workflowConfigurationsPage: async ({ page }: { page: Page }, use: (r: WorkflowConfigurationsPage) => Promise<void>) => {
    await use(new WorkflowConfigurationsPage(page));
  },
  userManagementPage: async ({ page }: { page: Page }, use: (r: UserManagementPage) => Promise<void>) => {
    await use(new UserManagementPage(page));
  },
  emailVerificationPage: async ({ page }: { page: Page }, use: (r: EmailVerificationPage) => Promise<void>) => {
    await use(new EmailVerificationPage(page));
  },
  institutionSettingsPage: async ({ page }: { page: Page }, use: (r: InstitutionSettingsPage) => Promise<void>) => {
    await use(new InstitutionSettingsPage(page));
  },
  organizationsPage: async ({ page }: { page: Page }, use: (r: OrganizationsPage) => Promise<void>) => {
    await use(new OrganizationsPage(page));
  },
  institutionMappingsPage: async ({ page }: { page: Page }, use: (r: InstitutionMappingsPage) => Promise<void>) => {
    await use(new InstitutionMappingsPage(page));
  },
  apiTokensPage: async ({ page }: { page: Page }, use: (r: ApiTokensPage) => Promise<void>) => {
    await use(new ApiTokensPage(page));
  },
  equivalencyDownloadPage: async ({ page }: { page: Page }, use: (r: EquivalencyDownloadPage) => Promise<void>) => {
    await use(new EquivalencyDownloadPage(page));
  },
  requestAccessPage: async ({ page }: { page: Page }, use: (r: RequestAccessPage) => Promise<void>) => {
    await use(new RequestAccessPage(page));
  },
});

export { expect } from '@playwright/test';
