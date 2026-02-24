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
import { CreateUserPage } from '../pages/CreateUserPage';
import { DeleteUserPage } from '../pages/DeleteUserPage';
import { EditUserPage } from '../pages/EditUserPage';
import { WorkflowLandingPage } from '../pages/WorkflowLandingPage';

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
});

export { expect } from '@playwright/test';
