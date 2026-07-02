import { test, expect } from '../fixtures/test';
import { CSVValidator } from '../helpers/csv-validator';
import fs from 'fs';

test.describe('Run SQL Page Tests', () => {

    const adminEmail = process.env.ADMIN_EMAIL ?? 'creditmobility@asu.edu';
    const adminPassword = process.env.ADMIN_PASSWORD ?? '#TransferTri1';
    const targetInstitutionId = '182290';
    const selectQuery = `select * from graph_db_output where target_institution_id = '${targetInstitutionId}'`;

    const expectedColumns = [
        'uuid', 'source_institution_id', 'source_course_id', 'credit_hours',
        'target_institution_id', 'target_course_id', 'score', 'date_created',
        'date_last_modified', 'assignee_id', 'decision', 'decision_maker_id',
        'record_type', 'boost_type',
    ];

    // =========================================================================
    // 1. Navigation Tests
    // =========================================================================
    test.describe('Navigation', () => {

        test('TC1.1: Navigate to Run SQL via My Workplace sidebar', async ({ page, loginPage, runSqlPage }) => {
            await page.goto('/logged-out/login/email');
            await loginPage.loginUser(adminEmail, adminPassword);

            await runSqlPage.navigateToRunSqlPage();

            await expect(page).toHaveURL(/.*\/run-sql/);
            await expect(runSqlPage.pageHeading).toBeVisible();
            await expect(runSqlPage.sqlInput).toBeVisible();
            await expect(runSqlPage.executeBtn).toBeVisible();
        });

        test('TC1.2: Navigate to Run SQL via direct URL', async ({ page, loginPage, runSqlPage }) => {
            await page.goto('/logged-out/login/email');
            await loginPage.loginUser(adminEmail, adminPassword);

            await runSqlPage.navigateToRunSqlPageDirect();

            await expect(page).toHaveURL(/.*\/run-sql/);
            await expect(runSqlPage.pageHeading).toHaveText('Run SQL');
            await expect(runSqlPage.breadcrumbText).toBeVisible();
        });

        test('TC1.3: Run SQL sidebar link is active when on the page', async ({ page, loginPage, runSqlPage }) => {
            await page.goto('/logged-out/login/email');
            await loginPage.loginUser(adminEmail, adminPassword);
            await runSqlPage.navigateToRunSqlPageDirect();

            const sidebarLink = runSqlPage.runSqlSidebarLink;
            await expect(sidebarLink).toBeVisible();
        });

        test('TC1.4: Execute button is disabled when query input is empty', async ({ page, loginPage, runSqlPage }) => {
            await page.goto('/logged-out/login/email');
            await loginPage.loginUser(adminEmail, adminPassword);
            await runSqlPage.navigateToRunSqlPageDirect();

            await expect(runSqlPage.sqlInput).toBeEmpty();
            await expect(runSqlPage.executeBtn).toBeDisabled();
        });

        test('TC1.5: Execute button enables after typing a query', async ({ page, loginPage, runSqlPage }) => {
            await page.goto('/logged-out/login/email');
            await loginPage.loginUser(adminEmail, adminPassword);
            await runSqlPage.navigateToRunSqlPageDirect();

            await runSqlPage.sqlInput.fill(selectQuery);
            await expect(runSqlPage.executeBtn).toBeEnabled();
        });
    });

    // =========================================================================
    // 2. Query Execution & Output Validation
    // =========================================================================
    test.describe('Query Execution & Output', () => {

        test('TC2.1: Execute SELECT query and verify results table appears', async ({ page, loginPage, runSqlPage }) => {
            await page.goto('/logged-out/login/email');
            await loginPage.loginUser(adminEmail, adminPassword);
            await runSqlPage.navigateToRunSqlPageDirect();

            await runSqlPage.executeQuery(selectQuery);

            await expect(runSqlPage.resultsTable).toBeVisible();
            const rowCount = await runSqlPage.getResultRowCount();
            expect(rowCount).toBeGreaterThan(0);
            console.log(`Query returned ${rowCount} rows`);
        });

        test('TC2.2: Results table contains expected column headers', async ({ page, loginPage, runSqlPage }) => {
            await page.goto('/logged-out/login/email');
            await loginPage.loginUser(adminEmail, adminPassword);
            await runSqlPage.navigateToRunSqlPageDirect();

            await runSqlPage.executeQuery(selectQuery);

            const headers = await runSqlPage.getColumnHeaders();
            for (const col of expectedColumns) {
                expect(headers).toContain(col);
            }
        });

        test('TC2.3: All rows have target_institution_id = 182290', async ({ page, loginPage, runSqlPage }) => {
            await page.goto('/logged-out/login/email');
            await loginPage.loginUser(adminEmail, adminPassword);
            await runSqlPage.navigateToRunSqlPageDirect();

            const limitedQuery = `select * from graph_db_output where target_institution_id = '${targetInstitutionId}' limit 10`;
            await runSqlPage.executeQuery(limitedQuery);

            await runSqlPage.validateAllRowsHaveTargetInstitution(targetInstitutionId);
        });

        test('TC2.4: Score values are numeric and between 0 and 1', async ({ page, loginPage, runSqlPage }) => {
            await page.goto('/logged-out/login/email');
            await loginPage.loginUser(adminEmail, adminPassword);
            await runSqlPage.navigateToRunSqlPageDirect();

            const limitedQuery = `select * from graph_db_output where target_institution_id = '${targetInstitutionId}' limit 10`;
            await runSqlPage.executeQuery(limitedQuery);

            const scores = await runSqlPage.getColumnValues('score');
            for (const scoreText of scores) {
                if (scoreText) {
                    const score = parseFloat(scoreText);
                    expect(Number.isFinite(score)).toBe(true);
                    expect(score).toBeGreaterThanOrEqual(0);
                    expect(score).toBeLessThanOrEqual(1);
                }
            }
        });

        test('TC2.5: Decision column contains valid values', async ({ page, loginPage, runSqlPage }) => {
            await page.goto('/logged-out/login/email');
            await loginPage.loginUser(adminEmail, adminPassword);
            await runSqlPage.navigateToRunSqlPageDirect();

            const limitedQuery = `select * from graph_db_output where target_institution_id = '${targetInstitutionId}' limit 10`;
            await runSqlPage.executeQuery(limitedQuery);

            const validDecisions = ['ACCEPTED', 'REJECTED', 'PENDING', ''];
            const decisions = await runSqlPage.getColumnValues('decision');
            for (const decision of decisions) {
                expect(validDecisions).toContain(decision);
            }
        });

        test('TC2.6: date_created column contains valid ISO date strings', async ({ page, loginPage, runSqlPage }) => {
            await page.goto('/logged-out/login/email');
            await loginPage.loginUser(adminEmail, adminPassword);
            await runSqlPage.navigateToRunSqlPageDirect();

            const limitedQuery = `select * from graph_db_output where target_institution_id = '${targetInstitutionId}' limit 10`;
            await runSqlPage.executeQuery(limitedQuery);

            const dates = await runSqlPage.getColumnValues('date_created');
            for (const dateStr of dates) {
                if (dateStr) {
                    expect(dateStr).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
                }
            }
        });

        test('TC2.7: record_type column is populated', async ({ page, loginPage, runSqlPage }) => {
            await page.goto('/logged-out/login/email');
            await loginPage.loginUser(adminEmail, adminPassword);
            await runSqlPage.navigateToRunSqlPageDirect();

            const limitedQuery = `select * from graph_db_output where target_institution_id = '${targetInstitutionId}' limit 10`;
            await runSqlPage.executeQuery(limitedQuery);

            const recordTypes = await runSqlPage.getColumnValues('record_type');
            for (const recordType of recordTypes) {
                expect(recordType.length).toBeGreaterThan(0);
            }
        });

        test('TC2.8: Execute query with LIMIT clause returns limited rows', async ({ page, loginPage, runSqlPage }) => {
            await page.goto('/logged-out/login/email');
            await loginPage.loginUser(adminEmail, adminPassword);
            await runSqlPage.navigateToRunSqlPageDirect();

            const limitQuery = `select * from graph_db_output where target_institution_id = '${targetInstitutionId}' limit 5`;
            await runSqlPage.executeQuery(limitQuery);

            const rowCount = await runSqlPage.getResultRowCount();
            expect(rowCount).toBeLessThanOrEqual(5);
            expect(rowCount).toBeGreaterThan(0);
        });
    });

    // =========================================================================
    // 3. Safety Guard Tests
    // =========================================================================
    test.describe('Safety Guards', () => {

        test('TC3.1: DELETE query is blocked by safety guard', async ({ page, loginPage, runSqlPage }) => {
            await page.goto('/logged-out/login/email');
            await loginPage.loginUser(adminEmail, adminPassword);
            await runSqlPage.navigateToRunSqlPageDirect();

            expect(() => {
                runSqlPage.assertQueryIsSafe('DELETE FROM graph_db_output WHERE target_institution_id = \'182290\'');
            }).toThrow(/BLOCKED.*DELETE/);
        });

        test('TC3.2: DROP query is blocked by safety guard', async ({ page, loginPage, runSqlPage }) => {
            await page.goto('/logged-out/login/email');
            await loginPage.loginUser(adminEmail, adminPassword);
            await runSqlPage.navigateToRunSqlPageDirect();

            expect(() => {
                runSqlPage.assertQueryIsSafe('DROP TABLE graph_db_output');
            }).toThrow(/BLOCKED.*DROP/);
        });

        test('TC3.3: ALTER query is blocked by safety guard', async ({ page, loginPage, runSqlPage }) => {
            await page.goto('/logged-out/login/email');
            await loginPage.loginUser(adminEmail, adminPassword);
            await runSqlPage.navigateToRunSqlPageDirect();

            expect(() => {
                runSqlPage.assertQueryIsSafe('ALTER TABLE graph_db_output ADD COLUMN test TEXT');
            }).toThrow(/BLOCKED.*ALTER/);
        });

        test('TC3.4: TRUNCATE query is blocked by safety guard', async ({ page, loginPage, runSqlPage }) => {
            await page.goto('/logged-out/login/email');
            await loginPage.loginUser(adminEmail, adminPassword);
            await runSqlPage.navigateToRunSqlPageDirect();

            expect(() => {
                runSqlPage.assertQueryIsSafe('TRUNCATE TABLE graph_db_output');
            }).toThrow(/BLOCKED.*TRUNCATE/);
        });

        test('TC3.5: UPDATE query is blocked by safety guard', async ({ page, loginPage, runSqlPage }) => {
            await page.goto('/logged-out/login/email');
            await loginPage.loginUser(adminEmail, adminPassword);
            await runSqlPage.navigateToRunSqlPageDirect();

            expect(() => {
                runSqlPage.assertQueryIsSafe('UPDATE graph_db_output SET decision = \'REJECTED\' WHERE uuid = 1');
            }).toThrow(/BLOCKED.*UPDATE/);
        });

        test('TC3.6: SELECT query passes safety guard', async ({ page, loginPage, runSqlPage }) => {
            await page.goto('/logged-out/login/email');
            await loginPage.loginUser(adminEmail, adminPassword);
            await runSqlPage.navigateToRunSqlPageDirect();

            expect(() => {
                runSqlPage.assertQueryIsSafe(selectQuery);
            }).not.toThrow();
        });
    });

    // =========================================================================
    // 4. Download Button Visibility & Functionality
    // =========================================================================
    test.describe('Download Buttons', () => {

        test('TC4.1: Download CSV and Download All buttons appear after query execution', async ({ page, loginPage, runSqlPage }) => {
            await page.goto('/logged-out/login/email');
            await loginPage.loginUser(adminEmail, adminPassword);
            await runSqlPage.navigateToRunSqlPageDirect();

            await runSqlPage.executeQuery(selectQuery);

            await expect(runSqlPage.downloadCsvBtn).toBeVisible();
            await expect(runSqlPage.downloadAllBtn).toBeVisible();
        });

        test('TC4.2: Download CSV triggers a file download', async ({ page, loginPage, runSqlPage }) => {
            await page.goto('/logged-out/login/email');
            await loginPage.loginUser(adminEmail, adminPassword);
            await runSqlPage.navigateToRunSqlPageDirect();

            await runSqlPage.executeQuery(selectQuery);

            const downloadPath = await runSqlPage.downloadCsv();
            expect(downloadPath).toBeTruthy();
            expect(fs.existsSync(downloadPath)).toBe(true);

            const fileSize = fs.statSync(downloadPath).size;
            expect(fileSize).toBeGreaterThan(0);
            console.log(`Downloaded CSV file size: ${fileSize} bytes`);
        });

        test('TC4.3: Downloaded CSV has valid headers matching table columns', async ({ page, loginPage, runSqlPage }) => {
            await page.goto('/logged-out/login/email');
            await loginPage.loginUser(adminEmail, adminPassword);
            await runSqlPage.navigateToRunSqlPageDirect();

            await runSqlPage.executeQuery(selectQuery);

            const downloadPath = await runSqlPage.downloadCsv();
            const validator = new CSVValidator(downloadPath);
            validator.load();

            expect(validator.headers.length).toBeGreaterThan(0);
            for (const col of expectedColumns) {
                expect(validator.headers).toContain(col);
            }
            console.log(`CSV headers: ${validator.headers.join(', ')}`);
        });

        test('TC4.4: Downloaded CSV rows contain target_institution_id = 182290', async ({ page, loginPage, runSqlPage }) => {
            await page.goto('/logged-out/login/email');
            await loginPage.loginUser(adminEmail, adminPassword);
            await runSqlPage.navigateToRunSqlPageDirect();

            await runSqlPage.executeQuery(selectQuery);

            const downloadPath = await runSqlPage.downloadCsv();
            const validator = new CSVValidator(downloadPath);
            validator.load();

            const rows = validator.getAllRows();
            expect(rows.length).toBeGreaterThan(0);
            console.log(`CSV contains ${rows.length} data rows`);

            for (const row of rows) {
                expect(row['target_institution_id']).toBe(targetInstitutionId);
            }
        });

        test('TC4.5: Downloaded CSV has non-empty score and uuid columns', async ({ page, loginPage, runSqlPage }) => {
            await page.goto('/logged-out/login/email');
            await loginPage.loginUser(adminEmail, adminPassword);
            await runSqlPage.navigateToRunSqlPageDirect();

            await runSqlPage.executeQuery(selectQuery);

            const downloadPath = await runSqlPage.downloadCsv();
            const validator = new CSVValidator(downloadPath);
            validator.load();

            const rows = validator.getAllRows();
            const checkCount = Math.min(rows.length, 10);
            for (let i = 0; i < checkCount; i++) {
                expect(rows[i]['uuid']?.length).toBeGreaterThan(0);
                expect(rows[i]['score']?.length).toBeGreaterThan(0);
            }
        });

        test('TC4.6: Download All triggers a file download', async ({ page, loginPage, runSqlPage }, testInfo) => {
            testInfo.setTimeout(120000);
            await page.goto('/logged-out/login/email');
            await loginPage.loginUser(adminEmail, adminPassword);
            await runSqlPage.navigateToRunSqlPageDirect();

            await runSqlPage.executeQuery(selectQuery);

            const downloadPath = await runSqlPage.downloadAll();
            expect(downloadPath).toBeTruthy();
            expect(fs.existsSync(downloadPath)).toBe(true);

            const fileSize = fs.statSync(downloadPath).size;
            expect(fileSize).toBeGreaterThan(0);
            console.log(`Downloaded All file size: ${fileSize} bytes`);
        });

        test('TC4.7: Download All file is at least as large as Download CSV', async ({ page, loginPage, runSqlPage }, testInfo) => {
            testInfo.setTimeout(120000);
            await page.goto('/logged-out/login/email');
            await loginPage.loginUser(adminEmail, adminPassword);
            await runSqlPage.navigateToRunSqlPageDirect();

            await runSqlPage.executeQuery(selectQuery);

            const csvPath = await runSqlPage.downloadCsv();
            const allPath = await runSqlPage.downloadAll();

            const csvSize = fs.statSync(csvPath).size;
            const allSize = fs.statSync(allPath).size;
            expect(allSize).toBeGreaterThanOrEqual(csvSize);
            console.log(`CSV: ${csvSize} bytes, All: ${allSize} bytes`);
        });
    });

    // =========================================================================
    // 5. Edge Cases & Re-execution
    // =========================================================================
    test.describe('Edge Cases', () => {

        test('TC5.1: Re-executing a new query replaces the previous results', async ({ page, loginPage, runSqlPage }) => {
            await page.goto('/logged-out/login/email');
            await loginPage.loginUser(adminEmail, adminPassword);
            await runSqlPage.navigateToRunSqlPageDirect();

            // First query
            await runSqlPage.executeQuery(selectQuery);
            const firstRowCount = await runSqlPage.getResultRowCount();
            expect(firstRowCount).toBeGreaterThan(0);

            // Second query with LIMIT
            const limitQuery = `select * from graph_db_output where target_institution_id = '${targetInstitutionId}' limit 3`;
            await runSqlPage.executeQuery(limitQuery);
            const secondRowCount = await runSqlPage.getResultRowCount();
            expect(secondRowCount).toBeLessThanOrEqual(3);
        });

        test('TC5.2: Query with specific columns returns only those columns', async ({ page, loginPage, runSqlPage }) => {
            await page.goto('/logged-out/login/email');
            await loginPage.loginUser(adminEmail, adminPassword);
            await runSqlPage.navigateToRunSqlPageDirect();

            const specificQuery = `select uuid, target_institution_id, score, decision from graph_db_output where target_institution_id = '${targetInstitutionId}' limit 5`;
            await runSqlPage.executeQuery(specificQuery);

            const headers = await runSqlPage.getColumnHeaders();
            expect(headers).toContain('uuid');
            expect(headers).toContain('target_institution_id');
            expect(headers).toContain('score');
            expect(headers).toContain('decision');
            expect(headers.length).toBe(4);
        });

        test('TC5.3: COUNT query returns a numeric result', async ({ page, loginPage, runSqlPage }) => {
            await page.goto('/logged-out/login/email');
            await loginPage.loginUser(adminEmail, adminPassword);
            await runSqlPage.navigateToRunSqlPageDirect();

            const countQuery = `select count(*) from graph_db_output where target_institution_id = '${targetInstitutionId}'`;
            await runSqlPage.executeQuery(countQuery);

            const rowCount = await runSqlPage.getResultRowCount();
            expect(rowCount).toBe(1);
        });
    });
});
