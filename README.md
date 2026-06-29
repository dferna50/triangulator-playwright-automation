# Triangulator Playwright Automation Test Suite

This repository contains automated UI and API tests (~600+ tests) built with [Playwright](https://playwright.dev/) for verifying the Triangulator platform client environments.

## 🧪 Running Automated Tests

### 1. Local Setup
1. Clone the repository and install dependencies:
   ```bash
   npm install
   npx playwright install chromium
   ```
2. Copy the example environment file and set your credentials:
   ```bash
   cp .env.example .env
   ```
3. Update `.env` with your dedicated QA account credentials. **Never commit `.env` to Git.**

### 2. Local Execution Modes

- **Run all standard tests (Headed / Interactive):**
  ```bash
  npx playwright test --headed
  ```
- **Run isolated smoke tests:**
  ```bash
  npx playwright test --grep "@smoke"
  ```
- **Run tests excluding third-party quota/external systems (Default CI mode):**
  ```bash
  npx playwright test --grep-invert "@quota|@external|@client-sys"
  ```
- **Debug a specific test file:**
  ```bash
  npx playwright test tests/Create_Evaluation_Groups.spec.ts --debug
  ```

### 3. CI Execution & Safeguards
- **Scheduled Weekly Runs:** The automated regression suite runs automatically every Sunday at 02:00 UTC via GitHub Actions.
- **Quota Protection:** By default, CI automatically skips any tests annotated with `@quota`, `@external`, or `@client-sys` to protect third-party API balances and shared database resources.
- **Manual Triggering:** You can manually trigger runs via the **Actions** tab on GitHub using `workflow_dispatch`, with options to specify custom tags or enable external quota tests explicitly.
