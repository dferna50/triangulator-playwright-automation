# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## About This Project

Playwright end-to-end test automation suite for the **Triangulator** platform (`creditmobility.net`) — a credit mobility/course equivalency evaluation system for higher education institutions. Tests cover three user roles: **Triangulator Admin**, **Institution Admin**, and **Reviewer**.

## Commands

```bash
# Run all tests
npx playwright test

# Run a specific test file
npx playwright test tests/peer-groups.spec.ts

# Run tests matching a name pattern (test ID)
npx playwright test --grep "TC1.1"

# Run in headed mode (see the browser)
npx playwright test --headed

# Run with UI mode (interactive debugging/selector picker)
npx playwright test --ui

# Run a single test file with debug output
npx playwright test tests/peer-groups.spec.ts --debug

# Show HTML report from last run
npx playwright show-report

# Type-check without running tests
npx tsc --noEmit
```

## Environment Setup

Create a `.env` file in the project root (never commit it):

```
BASE_URL=https://qa.creditmobility.net
ADMIN_EMAIL=creditmobility@asu.edu
ADMIN_PASSWORD=...
INST_ADMIN_EMAIL=testtriangulator+109@gmail.com
INST_ADMIN_PASSWORD=...

# Required only for user-creation tests that verify welcome emails
GMAIL_CLIENT_ID=...
GMAIL_CLIENT_SECRET=...
GMAIL_REFRESH_TOKEN=...
```

Login credentials and institution-to-admin mappings are also stored in `test_data/logindata.json`.

## Architecture

### Page Object Model (POM)

All UI interactions live in `pages/` as TypeScript classes. Each page class:
- Declares `Locator` properties in the constructor using Playwright's `page.getByRole()`, `page.locator()`, etc.
- Exposes async action methods (e.g., `loginUser`, `navigateToPeerGroupsPage`, `fillPeerGroupName`)
- Is never instantiated directly in tests — use fixtures instead

### Custom Fixtures (`fixtures/test.ts`)

**Critical:** All tests must import `test` and `expect` from `../fixtures/test`, not from `@playwright/test`. The custom fixture pre-instantiates every page object so tests receive them via destructuring:

```ts
import { test, expect } from '../fixtures/test';

test('example', async ({ page, loginPage, peerGroupsPage }) => { ... });
```

Adding a new page to the fixture requires: creating the page class in `pages/`, importing it in `fixtures/test.ts`, adding its type to `PageFixtures`, and adding the fixture definition.

### Helpers (`helpers/`)

- `gmailService.ts` — Gmail OAuth2 integration for reading welcome emails during user-creation tests. Searches for `subject:(activate Triangulator account)` and extracts temporary passwords and login URLs from email bodies. Requires `GMAIL_*` env vars.
- `userDataGenerator.ts` — Generates unique test user data using Gmail plus-addressing (`base+timestamp@gmail.com`) to avoid email conflicts across runs.
- `csv-validator.ts` — Validates CSV file structure for upload tests.
- `emailServiceMock.ts` — Mock email service for tests that don't need real email delivery.
- `GraphQLHelper.ts` — GraphQL API helper for direct backend operations.

### Page Objects (`pages/`)

Page classes follow a consistent structure:
- Named with `Page` suffix (e.g., `LoginPage`, `CreateUserPage`, `SearchResourcesPage`)
- Constructor accepts `Page` object and stores it as `this.page`
- Declares locators as class properties in constructor
- Exposes async action methods for UI interactions
- Never instantiated directly — always use fixtures

### Test Data (`test_data/`)

- `logindata.json` — Credential map keyed by institution role (e.g., `triadmin`, `nevadaadmin`)
- `searchResources.json`, `userCreationData.json` — Fixture data for specific test suites
- `api_data/` — JSON variable files for API-level test scenarios
- `uploadRules/` — CSV files for upload rule validation tests

### Test Organization

Tests under `tests/` are grouped by feature area. Key patterns:

- **Serial mode**: Tests that depend on prior steps use `test.describe.configure({ mode: 'serial' })`. This is required for tests that create data and then verify it in subsequent steps.
- **Parallel mode**: The default `fullyParallel: true` runs independent tests concurrently. Tests that modify shared data (like institutional settings or users) should use serial mode.
- **Test naming**: Two patterns are used:
  - `TC<category>.<number>` (e.g., `TC1.1`, `TC2.3`) - Used in most test files
  - `TC-<Feature>-<number>` (e.g., `TC-USER-MGMT-001`) - Used in newer test suites like user-management
- **Folder structure**:
  - `tests/user-creation/` - User creation workflows with mock and Gmail integration options
  - `tests/user-management/` - Institution admin user management tests
  - `tests/request-access/` - Access request workflows
  - `tests/*.spec.ts` - Feature-specific tests at root level (searchResources, peer-groups, FAQ, etc.)

### Configuration Notes (`playwright.config.ts`)

- Global timeout: 300 seconds per test
- Single worker (`workers: 1`) both locally and CI to avoid state conflicts
- Chromium only (Firefox/WebKit commented out)
- Screenshots always captured; traces always recorded
- HTML reporter

## Test Execution Patterns

### Choosing Serial vs Parallel
- Use serial mode for tests that create users, modify institution settings, or have data dependencies
- Use parallel mode for read-only tests or tests that operate on independent data
- Serial tests in a file: `test.describe.configure({ mode: 'serial' })` at the top of the describe block

### Environment-Specific Behavior
- Tests use `process.env.BASE_URL` from `.env`, falling back to QA environment
- Gmail integration tests require credentials and are slower; mock email tests are faster for CI
