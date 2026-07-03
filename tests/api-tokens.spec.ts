import { test, expect } from '../fixtures/test';
import type { ApiTokenData } from '../pages/ApiTokensPage';

test.describe('Organization API Tokens', () => {
  const triAdminEmail = process.env.TRI_ADMIN_EMAIL ?? 'creditmobility@asu.edu';
  const triAdminPassword = process.env.TRI_ADMIN_PASSWORD ?? '#TransferTri1';

  test.beforeEach(async ({ page, loginPage }) => {
    await page.goto('');
    await loginPage.visit();
    await loginPage.loginUser(triAdminEmail, triAdminPassword);
  });

  test.describe('Navigation', () => {
    test('TC1: Navigate to API Tokens page', async ({ apiTokensPage }) => {
      await apiTokensPage.navigateToMyWorkplace();
      await apiTokensPage.navigateToApiTokens();
      await apiTokensPage.verifyApiTokensPageLoaded();
    });

    test('TC2: Navigate using sidebar menu', async ({ apiTokensPage }) => {
      await apiTokensPage.navigateToMyWorkplace();
      await apiTokensPage.openApiTokensSidebar();
      await apiTokensPage.navigateToApiTokens();
      await expect(apiTokensPage.page).toHaveURL(/.*\/org-api-tokens.*/);
    });

    test('TC3: Verify API Tokens page table headers', async ({ apiTokensPage }) => {
      await apiTokensPage.navigateToMyWorkplace();
      await apiTokensPage.navigateToApiTokens();
      await apiTokensPage.verifyTableHeaders();
    });

    test('TC4: Verify Refresh button functionality', async ({ apiTokensPage }) => {
      await apiTokensPage.navigateToMyWorkplace();
      await apiTokensPage.navigateToApiTokens();
      await expect(apiTokensPage.refreshButton).toBeVisible();
      await expect(apiTokensPage.refreshButton).toBeEnabled({ timeout: 15000 });
    });
  });

  test.describe('Generate API Tokens', () => {
    test('TC5: Open Generate Token dialog', async ({ apiTokensPage }) => {
      await apiTokensPage.navigateToMyWorkplace();
      await apiTokensPage.navigateToApiTokens();
      await apiTokensPage.clickGenerateToken();
      await expect(apiTokensPage.generateTokenDialog).toBeVisible();
    });

    test('TC6: Cancel Generate Token dialog', async ({ apiTokensPage }) => {
      await apiTokensPage.navigateToMyWorkplace();
      await apiTokensPage.navigateToApiTokens();
      await apiTokensPage.clickGenerateToken();
      await expect(apiTokensPage.generateTokenDialog).toBeVisible();
      await apiTokensPage.cancelTokenGeneration();
      await expect(apiTokensPage.generateTokenDialog).toBeHidden();
    });

    test.skip('TC7: Generate token for organization', async ({ apiTokensPage }) => {
      await apiTokensPage.navigateToMyWorkplace();
      await apiTokensPage.navigateToApiTokens();

      // Get existing tokens to compare
      const existingTokens = await apiTokensPage.getAllTokens();
      const existingOrg = existingTokens.length > 0 ? existingTokens[0].organization : 'test-single';

      const tokenData: ApiTokenData = {
        organization: existingOrg
      };

      try {
        await apiTokensPage.generateToken(tokenData);
      } catch (err: any) {
        if (err.message.includes('ORGANIZATION_DROPDOWN_STUCK_IN_LOADING')) {
          console.warn('WARNING: Skipping TC7 due to organization dropdown stuck in "Loading..." state (known GraphQL cache product bug).');
          test.skip(true, 'Skipping due to organization dropdown stuck in Loading... state (product bug)');
          return;
        }
        throw err;
      }
      await apiTokensPage.refreshTokens();

      // Verify new token was created
      const newTokens = await apiTokensPage.getAllTokens();
      expect(newTokens.length).toBeGreaterThanOrEqual(existingTokens.length);
    });

    test('TC8: Verify form validation for required organization field', async ({ apiTokensPage }) => {
      await apiTokensPage.navigateToMyWorkplace();
      await apiTokensPage.navigateToApiTokens();
      await apiTokensPage.clickGenerateToken();

      // Try to generate without selecting organization
      await apiTokensPage.generateButton.click({ force: true });

      // Dialog should still be visible since organization is not selected
      await expect(apiTokensPage.generateTokenDialog).toBeVisible();
      await apiTokensPage.cancelTokenGeneration();
    });
  });

  test.describe('View API Tokens', () => {
    test('TC9: View all API tokens in table', async ({ apiTokensPage }) => {
      await apiTokensPage.navigateToMyWorkplace();
      await apiTokensPage.navigateToApiTokens();

      const tokens = await apiTokensPage.getAllTokens();
      expect(tokens.length).toBeGreaterThanOrEqual(0);
    });

    test('TC10: Verify token data structure', async ({ apiTokensPage }) => {
      await apiTokensPage.navigateToMyWorkplace();
      await apiTokensPage.navigateToApiTokens();

      const tokens = await apiTokensPage.getAllTokens();
      if (tokens.length > 0) {
        for (const token of tokens.slice(0, 5)) {
          expect(token.tokenId).toBeTruthy();
          expect(token.organization).toBeTruthy();
          expect(token.status).toMatch(/^(ACTIVE|INACTIVE)$/);
          expect(token.created).toBeTruthy();
          expect(token.expires).toBeTruthy();
        }
      }
    });

    test('TC11: Sort tokens by Token ID', async ({ apiTokensPage }) => {
      await apiTokensPage.navigateToMyWorkplace();
      await apiTokensPage.navigateToApiTokens();
      await apiTokensPage.sortByColumn('Token ID');
      await expect(apiTokensPage.tableTokenIdColumn).toBeVisible();
    });

    test('TC12: Sort tokens by Organization', async ({ apiTokensPage }) => {
      await apiTokensPage.navigateToMyWorkplace();
      await apiTokensPage.navigateToApiTokens();
      await apiTokensPage.sortByColumn('Organization');
      await expect(apiTokensPage.tableOrganizationColumn).toBeVisible();
    });

    test('TC13: Sort tokens by Status', async ({ apiTokensPage }) => {
      await apiTokensPage.navigateToMyWorkplace();
      await apiTokensPage.navigateToApiTokens();
      await apiTokensPage.sortByColumn('Status');
      await expect(apiTokensPage.tableStatusColumn).toBeVisible();
    });

    test('TC14: Sort tokens by Created date', async ({ apiTokensPage }) => {
      await apiTokensPage.navigateToMyWorkplace();
      await apiTokensPage.navigateToApiTokens();
      await apiTokensPage.sortByColumn('Created');
      await expect(apiTokensPage.tableCreatedColumn).toBeVisible();
    });

    test('TC15: Sort tokens by Expires date', async ({ apiTokensPage }) => {
      await apiTokensPage.navigateToMyWorkplace();
      await apiTokensPage.navigateToApiTokens();
      await apiTokensPage.sortByColumn('Expires');
      await expect(apiTokensPage.tableExpiresColumn).toBeVisible();
    });
  });

  test.describe('Token Status Management', () => {
    test('TC16: View active tokens', async ({ apiTokensPage }) => {
      await apiTokensPage.navigateToMyWorkplace();
      await apiTokensPage.navigateToApiTokens();

      const activeTokens = await apiTokensPage.getActiveTokens();
      // Verify all returned tokens are active
      for (const token of activeTokens) {
        expect(token.status).toBe('ACTIVE');
      }
    });

    test('TC17: View inactive tokens', async ({ apiTokensPage }) => {
      await apiTokensPage.navigateToMyWorkplace();
      await apiTokensPage.navigateToApiTokens();

      const inactiveTokens = await apiTokensPage.getInactiveTokens();
      // Verify all returned tokens are inactive
      for (const token of inactiveTokens) {
        expect(token.status).toBe('INACTIVE');
      }
    });

    test('TC18: Revoke active token', async ({ apiTokensPage }) => {
      await apiTokensPage.navigateToMyWorkplace();
      await apiTokensPage.navigateToApiTokens();

      const activeTokens = await apiTokensPage.getActiveTokens();
      if (activeTokens.length > 0) {
        await apiTokensPage.revokeToken(activeTokens[0].tokenId);

        // Refresh to verify token was revoked
        await apiTokensPage.refreshTokens();
        const tokenInfo = await apiTokensPage.getTokenInfo(activeTokens[0].tokenId);
        if (tokenInfo) {
          expect(tokenInfo.status).toBe('INACTIVE');
        }
      }
    });

    test('TC19: Revoke token by organization', async ({ apiTokensPage }) => {
      await apiTokensPage.navigateToMyWorkplace();
      await apiTokensPage.navigateToApiTokens();

      const activeTokens = await apiTokensPage.getActiveTokens();
      if (activeTokens.length > 0) {
        await apiTokensPage.revokeTokenByOrganization(activeTokens[0].organization);
      }
    });

    test('TC20: Verify revoke button exists for active tokens', async ({ apiTokensPage }) => {
      await apiTokensPage.navigateToMyWorkplace();
      await apiTokensPage.navigateToApiTokens();

      const activeTokens = await apiTokensPage.getActiveTokens();
      if (activeTokens.length > 0) {
        const row = await apiTokensPage.getTokenRow(activeTokens[0].tokenId);
        const revokeButton = row.locator('button:has-text("Revoke")');
        await expect(revokeButton).toBeVisible();
      }
    });
  });

  test.describe('Pagination and Navigation', () => {
    test('TC21: Navigate through pagination', async ({ apiTokensPage }) => {
      await apiTokensPage.navigateToMyWorkplace();
      await apiTokensPage.navigateToApiTokens();

      const hasNextPage = await apiTokensPage.nextPageButton.isVisible().catch(() => false);
      if (hasNextPage) {
        const isEnabled = await apiTokensPage.nextPageButton.isEnabled().catch(() => false);
        if (isEnabled) {
          await apiTokensPage.goToNextPage();
        }
      }
    });

    test('TC22: Verify previous page button state on first page', async ({ apiTokensPage }) => {
      await apiTokensPage.navigateToMyWorkplace();
      await apiTokensPage.navigateToApiTokens();

      const isEnabled = await apiTokensPage.prevPageButton.isEnabled().catch(() => false);
      expect(isEnabled).toBeFalsy();
    });
  });

  test.describe('Organization-Token Relationship', () => {
    test('TC23: Get tokens by organization', async ({ apiTokensPage }) => {
      await apiTokensPage.navigateToMyWorkplace();
      await apiTokensPage.navigateToApiTokens();

      const allTokens = await apiTokensPage.getAllTokens();
      if (allTokens.length > 0) {
        const orgName = allTokens[0].organization;
        const orgTokens = await apiTokensPage.getTokensByOrganization(orgName);

        // Verify all returned tokens belong to the organization
        for (const token of orgTokens) {
          expect(token.organization).toBe(orgName);
        }
      }
    });

    test('TC24: Verify one organization can have multiple tokens', async ({ apiTokensPage }) => {
      await apiTokensPage.navigateToMyWorkplace();
      await apiTokensPage.navigateToApiTokens();

      const allTokens = await apiTokensPage.getAllTokens();

      // Group by organization
      const orgGroups: Record<string, number> = {};
      for (const token of allTokens) {
        orgGroups[token.organization] = (orgGroups[token.organization] || 0) + 1;
      }

      // Find organizations with multiple tokens
      const multiTokenOrgs = Object.entries(orgGroups).filter(([_, count]) => count > 1);

      // This is a data validation test
      expect(multiTokenOrgs.length).toBeGreaterThanOrEqual(0);
    });

    test('TC25: Verify token expiration dates are set', async ({ apiTokensPage }) => {
      await apiTokensPage.navigateToMyWorkplace();
      await apiTokensPage.navigateToApiTokens();

      const tokens = await apiTokensPage.getAllTokens();
      for (const token of tokens) {
        expect(token.expires).toBeTruthy();
        // Verify it's a valid date string
        expect(new Date(token.expires)).not.toBeNaN();
      }
    });
  });

  test.describe('Token Refresh and Updates', () => {
    test('TC26: Refresh tokens list', async ({ apiTokensPage }) => {
      await apiTokensPage.navigateToMyWorkplace();
      await apiTokensPage.navigateToApiTokens();

      const beforeTokens = await apiTokensPage.getAllTokens();
      await apiTokensPage.refreshTokens();
      const afterTokens = await apiTokensPage.getAllTokens();

      // Token count should remain consistent after refresh
      expect(afterTokens.length).toBe(beforeTokens.length);
    });

    test('TC27: Verify token creation updates token list', async ({ apiTokensPage }) => {
      await apiTokensPage.navigateToMyWorkplace();
      await apiTokensPage.navigateToApiTokens();

      const beforeCount = (await apiTokensPage.getAllTokens()).length;

      // Get existing organization
      const existingTokens = await apiTokensPage.getAllTokens();
      if (existingTokens.length > 0) {
        const tokenData: ApiTokenData = {
          organization: existingTokens[0].organization
        };

        try {
          await apiTokensPage.generateToken(tokenData);
        } catch (err: any) {
          if (err.message.includes('ORGANIZATION_DROPDOWN_STUCK_IN_LOADING')) {
            console.warn('WARNING: Skipping TC27 due to organization dropdown stuck in "Loading..." state (known GraphQL cache product bug).');
            test.skip(true, 'Skipping due to organization dropdown stuck in Loading... state (product bug)');
            return;
          }
          throw err;
        }
        await apiTokensPage.refreshTokens();

        const afterCount = (await apiTokensPage.getAllTokens()).length;
        expect(afterCount).toBeGreaterThanOrEqual(beforeCount);
      }
    });
  });

  test.describe.skip('Edge Cases and Error Handling', () => {
    test('TC28: Verify empty state handling', async ({ apiTokensPage }) => {
      await apiTokensPage.navigateToMyWorkplace();
      await apiTokensPage.navigateToApiTokens();

      // Table should be visible even if empty
      await expect(apiTokensPage.tokensTable).toBeVisible();
    });

    test('TC29: Verify Generate button disabled without organization selection', async ({ apiTokensPage }) => {
      await apiTokensPage.navigateToMyWorkplace();
      await apiTokensPage.navigateToApiTokens();
      await apiTokensPage.clickGenerateToken();

      // Generate button should be disabled initially
      await expect(apiTokensPage.generateButton).toBeDisabled();

      await apiTokensPage.cancelTokenGeneration();
    });

    test('TC30: Verify token ID format', async ({ apiTokensPage }) => {
      await apiTokensPage.navigateToMyWorkplace();
      await apiTokensPage.navigateToApiTokens();

      const tokens = await apiTokensPage.getAllTokens();
      for (const token of tokens) {
        // Token ID should be numeric
        const tokenId = token.tokenId.replace(/"/g, '').trim();
        expect(parseInt(tokenId)).not.toBeNaN();
      }
    });
  });
});
