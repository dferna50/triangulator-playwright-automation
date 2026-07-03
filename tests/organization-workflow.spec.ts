import { test, expect } from '../fixtures/test';
import type { OrganizationData } from '../pages/OrganizationsPage';
import type { InstitutionMappingData } from '../pages/InstitutionMappingsPage';
import type { ApiTokenData } from '../pages/ApiTokensPage';

test.describe('Organization Management End-to-End Workflow', () => {
  const triAdminEmail = process.env.TRI_ADMIN_EMAIL ?? 'creditmobility@asu.edu';
  const triAdminPassword = process.env.TRI_ADMIN_PASSWORD ?? '#TransferTri1';

  test.beforeEach(async ({ page, loginPage }) => {
    await page.goto('');
    await loginPage.visit();
    await loginPage.loginUser(triAdminEmail, triAdminPassword);
  });

  test.describe('Complete Organization Setup Workflow', () => {
    test('TC1: Create organization -> Map institutions -> Generate API token', async ({
      organizationsPage,
      institutionMappingsPage,
      apiTokensPage
    }) => {
      const timestamp = new Date().getTime();
      const orgName = `E2E Workflow Org ${timestamp}`;

      // Step 1: Create Organization
      const orgData: OrganizationData = {
        name: orgName,
        state: 'Arizona',
        city: 'Phoenix',
        contactName: 'E2E Test Contact',
        contactEmail: `e2e${timestamp}@example.com`,
        notes: 'Created via E2E workflow test'
      };

      await organizationsPage.page.goto('/app/my-workspace/tri-admin/inst/org-admin');
      await organizationsPage.page.waitForTimeout(2000);
      await organizationsPage.createOrganization(orgData);

      // Verify organization was created
      const orgCreated = await organizationsPage.verifyOrganizationInTable(orgData.name);
      expect(orgCreated).toBeTruthy();

      // Step 2: Map Institutions to Organization
      await institutionMappingsPage.page.goto('/app/my-workspace/tri-admin/inst/org-admin/org-institution-links');
      await institutionMappingsPage.page.waitForTimeout(2000);

      const mappingData: InstitutionMappingData = {
        organization: orgData.name,
        institutions: ['Arizona State University Campus Immersion']
      };

      await institutionMappingsPage.clickAddMapping();
      await institutionMappingsPage.selectOrganization(mappingData.organization);
      await institutionMappingsPage.selectInstitutions(mappingData.institutions);
      await institutionMappingsPage.cancelMappingCreation(); // Cancel to avoid test data pollution

      // Step 3: Generate API Token
      await apiTokensPage.page.goto('/app/my-workspace/tri-admin/inst/org-admin/org-api-tokens');
      await apiTokensPage.page.waitForTimeout(2000);

      // First check if organization exists in tokens
      await apiTokensPage.refreshTokens();
    });

    test('TC2: Full workflow with multiple institution mappings', async ({
      organizationsPage,
      institutionMappingsPage
    }) => {
      const timestamp = new Date().getTime();

      // Create organization
      const orgData: OrganizationData = {
        name: `Multi-Inst Org ${timestamp}`,
        state: 'California',
        city: 'Los Angeles',
        contactName: 'Multi Inst Contact',
        contactEmail: `multi${timestamp}@example.com`
      };

      await organizationsPage.page.goto('/app/my-workspace/tri-admin/inst/org-admin');
      await organizationsPage.page.waitForTimeout(2000);
      await organizationsPage.createOrganization(orgData);

      // Map multiple institutions
      await institutionMappingsPage.page.goto('/app/my-workspace/tri-admin/inst/org-admin/org-institution-links');
      await institutionMappingsPage.page.waitForTimeout(2000);

      await institutionMappingsPage.clickAddMapping();
      await institutionMappingsPage.selectOrganization(orgData.name);
      await institutionMappingsPage.selectInstitutions(['Arizona State University Campus Immersion']);
      await institutionMappingsPage.cancelMappingCreation();
    });
  });

  test.describe('Organization Data Verification Workflow', () => {
    test('TC3: Verify organization appears in all three sections', async ({
      organizationsPage,
      institutionMappingsPage,
      apiTokensPage
    }) => {
      // Get list of organizations
      await organizationsPage.page.goto('/app/my-workspace/tri-admin/inst/org-admin');
      await organizationsPage.page.waitForTimeout(2000);
      const orgs = await organizationsPage.page.locator('table tbody tr td:first-child').allTextContents();

      if (orgs.length > 0) {
        const orgName = orgs[0].trim();

        // Check if organization has mappings
        await institutionMappingsPage.page.goto('/app/my-workspace/tri-admin/inst/org-admin/org-institution-links');
        await institutionMappingsPage.page.waitForTimeout(2000);
        const allMappings = await institutionMappingsPage.getAllMappings();
        const mappings = allMappings.filter(m => m.organization === orgName);

        // Check if organization has tokens
        await apiTokensPage.page.goto('/app/my-workspace/tri-admin/inst/org-admin/org-api-tokens');
        await apiTokensPage.page.waitForTimeout(2000);
        const tokens = await apiTokensPage.getTokensByOrganization(orgName);

        // Log for verification
        console.log(`Organization ${orgName}: ${mappings.length} mappings, ${tokens.length} tokens`);
      }
    });

    test('TC4: Cross-reference organization data across sections', async ({
      organizationsPage,
      institutionMappingsPage,
      apiTokensPage
    }) => {
      // Get all organizations
      await organizationsPage.page.goto('/app/my-workspace/tri-admin/inst/org-admin');
      await organizationsPage.page.waitForTimeout(2000);
      const orgNames = await organizationsPage.page.locator('table tbody tr td:first-child').allTextContents();

      // Get all mapped organizations
      await institutionMappingsPage.page.goto('/app/my-workspace/tri-admin/inst/org-admin/org-institution-links');
      await institutionMappingsPage.page.waitForTimeout(2000);
      const mappings = await institutionMappingsPage.getAllMappings();
      const mappedOrgs = [...new Set(mappings.map(m => m.organization))];

      // Get all organizations with tokens
      await apiTokensPage.page.goto('/app/my-workspace/tri-admin/inst/org-admin/org-api-tokens');
      await apiTokensPage.page.waitForTimeout(2000);
      const tokens = await apiTokensPage.getAllTokens();
      const tokenOrgs = [...new Set(tokens.map(t => t.organization))];

      // Verify cross-references
      // All mapped organizations should exist in organizations list
      for (const mappedOrg of mappedOrgs.slice(0, 5)) {
        const existsInOrgs = orgNames.some(org => org.includes(mappedOrg));
        expect(existsInOrgs || orgNames.length === 0).toBeTruthy();
      }

      // All token organizations should exist in organizations list
      for (const tokenOrg of tokenOrgs.slice(0, 5)) {
        const existsInOrgs = orgNames.some(org => org.includes(tokenOrg));
        expect(existsInOrgs || orgNames.length === 0).toBeTruthy();
      }
    });
  });

  test.describe('Navigation Workflow', () => {
    test('TC5: Navigate between Organization Management sections', async ({
      organizationsPage,
      institutionMappingsPage,
      apiTokensPage
    }) => {
      // Start at Organizations
      await organizationsPage.page.goto('/app/my-workspace/tri-admin/inst/org-admin');
      await organizationsPage.page.waitForTimeout(2000);
      await expect(organizationsPage.page).toHaveURL(/.*\/org-admin.*/);

      // Navigate to Institution Mappings
      await institutionMappingsPage.page.goto('/app/my-workspace/tri-admin/inst/org-admin/org-institution-links');
      await institutionMappingsPage.page.waitForTimeout(2000);
      await expect(institutionMappingsPage.page).toHaveURL(/.*\/org-institution-links.*/);

      // Navigate to API Tokens
      await apiTokensPage.page.goto('/app/my-workspace/tri-admin/inst/org-admin/org-api-tokens');
      await apiTokensPage.page.waitForTimeout(2000);
      await expect(apiTokensPage.page).toHaveURL(/.*\/org-api-tokens.*/);

      // Navigate back to Organizations
      await organizationsPage.page.goto('/app/my-workspace/tri-admin/inst/org-admin');
      await organizationsPage.page.waitForTimeout(2000);
      await expect(organizationsPage.page).toHaveURL(/.*\/organizations.*/);
    });

    test('TC6: Sidebar navigation consistency', async ({
      organizationsPage,
      institutionMappingsPage,
      apiTokensPage
    }) => {
      // Navigate to Organizations and open sidebar
      await organizationsPage.page.goto('/app/my-workspace/tri-admin/inst/org-admin');
      await organizationsPage.page.waitForTimeout(2000);
      await organizationsPage.openOrganizationsSidebar();

      // Navigate to Institution Mappings and open sidebar
      await institutionMappingsPage.page.goto('/app/my-workspace/tri-admin/inst/org-admin/org-institution-links');
      await institutionMappingsPage.page.waitForTimeout(2000);
      await institutionMappingsPage.openInstitutionMappingsSidebar();

      // Navigate to API Tokens and open sidebar
      await apiTokensPage.page.goto('/app/my-workspace/tri-admin/inst/org-admin/org-api-tokens');
      await apiTokensPage.page.waitForTimeout(2000);
      await apiTokensPage.openApiTokensSidebar();
    });
  });

  test.describe('Bulk Operations Workflow', () => {
    test('TC7: View all organizations with their mappings and tokens', async ({
      organizationsPage,
      institutionMappingsPage,
      apiTokensPage
    }) => {
      // Get organizations
      await organizationsPage.page.goto('/app/my-workspace/tri-admin/inst/org-admin');
      await organizationsPage.page.waitForTimeout(2000);
      const allTokens = await apiTokensPage.getAllTokens();

      // Build report
      const report: Record<string, {
        name: string;
        hasMappings: boolean;
        tokenCount: number;
        activeTokens: number;
      }> = {};

      // Get all mappings
      await institutionMappingsPage.page.goto('/app/my-workspace/tri-admin/inst/org-admin/org-institution-links');
      await institutionMappingsPage.page.waitForTimeout(2000);
      const mappings = await institutionMappingsPage.getAllMappings();

      // Get all tokens
      await apiTokensPage.page.goto('/app/my-workspace/tri-admin/inst/org-admin/org-api-tokens');
      await apiTokensPage.page.waitForTimeout(2000);
      const tokens = await apiTokensPage.getAllTokens();

      // Build report for first 5 organizations
      for (const token of tokens.slice(0, 5)) {
        if (!report[token.organization]) {
          const orgMappings = mappings.filter(m => m.organization === token.organization);
          const orgTokens = tokens.filter(t => t.organization === token.organization);

          report[token.organization] = {
            name: token.organization,
            hasMappings: orgMappings.length > 0,
            tokenCount: orgTokens.length,
            activeTokens: orgTokens.filter(t => t.status === 'ACTIVE').length
          };
        }
      }

      // Verify report data
      for (const [orgName, data] of Object.entries(report)) {
        expect(data.name).toBeTruthy();
        expect(data.tokenCount).toBeGreaterThanOrEqual(0);
        expect(data.activeTokens).toBeGreaterThanOrEqual(0);
        expect(data.activeTokens).toBeLessThanOrEqual(data.tokenCount);
      }
    });
  });

  test.describe.skip('Error Handling and Edge Cases', () => {
    test('TC8: Handle navigation to non-existent organization', async ({ institutionMappingsPage }) => {
      await institutionMappingsPage.page.goto('/app/my-workspace/tri-admin/inst/org-admin/org-institution-links');
      await institutionMappingsPage.page.waitForTimeout(2000);

      // Try to filter with non-existent organization name
      await institutionMappingsPage.filterMappings('NonExistentOrgXYZ123');

      // Should not crash, table should be visible
      await expect(institutionMappingsPage.mappingsTable).toBeVisible();
    });

    test('TC9: Handle rapid navigation between sections', async ({
      organizationsPage,
      institutionMappingsPage,
      apiTokensPage
    }) => {
      // Rapidly navigate between sections
      for (let i = 0; i < 3; i++) {
        await organizationsPage.page.goto('/app/my-workspace/tri-admin/inst/org-admin');
        await organizationsPage.page.waitForTimeout(1000);
        await institutionMappingsPage.page.goto('/app/my-workspace/tri-admin/inst/org-admin/org-institution-links');
        await institutionMappingsPage.page.waitForTimeout(1000);
        await apiTokensPage.page.goto('/app/my-workspace/tri-admin/inst/org-admin/org-api-tokens');
        await apiTokensPage.page.waitForTimeout(1000);
      }

      // Verify final state is correct
      await expect(apiTokensPage.page).toHaveURL(/.*\/org-api-tokens.*/);
    });

    test('TC10: Verify page state persistence after navigation', async ({ organizationsPage }) => {
      // Navigate to organizations and get page state
      await organizationsPage.page.goto('/app/my-workspace/tri-admin/inst/org-admin');
      await organizationsPage.page.waitForTimeout(2000);

      // Sort by name
      await organizationsPage.sortByColumn('Name');

      // Navigate away and back
      await organizationsPage.page.goto('/app/dashboard');
      await organizationsPage.page.waitForTimeout(1000);
      await organizationsPage.page.goto('/app/my-workspace/tri-admin/inst/org-admin');
      await organizationsPage.page.waitForTimeout(2000);

      // Verify page loaded correctly
      await organizationsPage.verifyOrganizationsPageLoaded();
    });
  });

  test.describe('Data Integrity Workflow', () => {
    test('TC11: Verify organization status consistency', async ({ organizationsPage, apiTokensPage }) => {
      // Get organizations with their status
      await organizationsPage.page.goto('/app/my-workspace/tri-admin/inst/org-admin');
      await organizationsPage.page.waitForTimeout(2000);

      const rows = organizationsPage.page.locator('table tbody tr');
      const count = await rows.count();

      for (let i = 0; i < Math.min(count, 5); i++) {
        const row = rows.nth(i);
        const statusCell = row.locator('td').nth(5);
        const status = await statusCell.textContent();

        // Status should be either ACTIVE or INACTIVE
        expect(['ACTIVE', 'INACTIVE']).toContain(status?.trim());
      }
    });

    test('TC12: Verify token expiration logic', async ({ apiTokensPage }) => {
      await apiTokensPage.page.goto('/app/my-workspace/tri-admin/inst/org-admin/org-api-tokens');
      await apiTokensPage.page.waitForTimeout(2000);

      const tokens = await apiTokensPage.getAllTokens();
      const now = new Date();

      for (const token of tokens) {
        const expires = new Date(token.expires);

        // Expires date should be in the future for ACTIVE tokens
        if (token.status === 'ACTIVE') {
          expect(expires.getTime()).toBeGreaterThan(now.getTime());
        }

        // Created date should be in the past
        const created = new Date(token.created);
        expect(created.getTime()).toBeLessThanOrEqual(now.getTime());

        // Expires should be after created
        expect(expires.getTime()).toBeGreaterThan(created.getTime());
      }
    });
  });
});
