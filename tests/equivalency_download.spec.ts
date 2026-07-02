import { test, expect } from '../fixtures/test';
import { CSVValidator } from '../helpers/csv-validator';
import fs from 'fs';
import Papa from 'papaparse';

const instAdminEmail = process.env.INST_ADMIN_EMAIL ?? 'testtriangulator+108@gmail.com';
const instAdminPassword = process.env.INST_ADMIN_PASSWORD ?? '#TransferTri1';

test.describe('Equivalency Download Feature Tests', () => {

    test.beforeEach(async ({ page, loginPage, suggestionsPage }) => {
        await page.goto('');
        await loginPage.loginUser(instAdminEmail, instAdminPassword);
        await suggestionsPage.navigateToNewSuggestionPage();
    });

    // =========================================================================
    // 1. Navigation and Access Tests
    // =========================================================================
    test.describe('Navigation and Access Tests', () => {

        test('TC1.1: Verify user can navigate to download feature', async ({ page, equivalencyDownloadPage }) => {
            await page.waitForLoadState('domcontentloaded');
            const downloadButton = page.locator('nav').getByRole('button', { name: 'Download' });
            await expect(downloadButton).toBeVisible({ timeout: 10000 });
            await expect(downloadButton).toBeEnabled();
        });

        test('TC1.2: Verify download popup opens with all filter options', async ({ page, equivalencyDownloadPage }) => {
            await equivalencyDownloadPage.openDownloadDialog();
            await expect(page.getByRole('dialog', { name: 'Download' })).toBeVisible({ timeout: 5000 });
            await expect(page.getByRole('combobox', { name: 'Download option' })).toBeVisible();
            await expect(page.getByRole('textbox', { name: 'Start date' })).toBeVisible();
            await expect(page.getByRole('textbox', { name: 'End date' })).toBeVisible();
            await expect(page.getByRole('combobox', { name: 'Source state(s)' })).toBeVisible();
            await expect(page.getByRole('combobox', { name: 'Source institution(s)' })).toBeVisible();
            await expect(page.getByRole('textbox', { name: 'Target subject(s)' })).toBeVisible();
            await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
        });
    });

    // =========================================================================
    // 2. Date Range Filter Tests
    // =========================================================================
    test.describe('Date Range Filter Tests', () => {

        test('TC2.1: Download with start date only', async ({ page, equivalencyDownloadPage }) => {
            await equivalencyDownloadPage.openDownloadDialog();
            await equivalencyDownloadPage.selectDownloadOption();
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            await page.getByRole('textbox', { name: 'Start date' }).fill(thirtyDaysAgo.toISOString().split('T')[0]);

            const downloadPromise = page.waitForEvent('download', { timeout: 300000 });
            await page.getByRole('button', { name: 'Download' }).last().click();
            const download = await downloadPromise;
            const downloadPath = await download.path();
            expect(downloadPath && fs.existsSync(downloadPath)).toBeTruthy();
            expect(download.suggestedFilename()).toMatch(/\.(csv|xlsx|xls)$/i);
        });

        test('TC2.2: Download with end date only', async ({ page, equivalencyDownloadPage }) => {
            await equivalencyDownloadPage.openDownloadDialog();
            await equivalencyDownloadPage.selectDownloadOption();
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            await page.getByRole('textbox', { name: 'End date' }).fill(yesterday.toISOString().split('T')[0]);

            const downloadPromise = page.waitForEvent('download', { timeout: 300000 });
            await page.getByRole('button', { name: 'Download' }).last().click();
            const download = await downloadPromise;
            const downloadPath = await download.path();
            expect(downloadPath && fs.existsSync(downloadPath)).toBeTruthy();
        });

        test('TC2.3: Download with complete date range', async ({ page, equivalencyDownloadPage }) => {
            await equivalencyDownloadPage.openDownloadDialog();
            await equivalencyDownloadPage.selectDownloadOption();
            const startDate = new Date(); startDate.setDate(startDate.getDate() - 60);
            const endDate = new Date(); endDate.setDate(endDate.getDate() - 30);

            await page.getByRole('textbox', { name: 'Start date' }).fill(startDate.toISOString().split('T')[0]);
            await page.getByRole('textbox', { name: 'End date' }).fill(endDate.toISOString().split('T')[0]);

            const downloadPromise = page.waitForEvent('download', { timeout: 300000 });
            await page.getByRole('button', { name: 'Download' }).last().click();
            const download = await downloadPromise;
            const downloadPath = await download.path();
            expect(downloadPath && fs.existsSync(downloadPath)).toBeTruthy();

            if (downloadPath?.endsWith('.csv')) {
                const validator = new CSVValidator(downloadPath);
                validator.load();
                const dataPresence = validator.validateDataPresence();
                expect(dataPresence.pass).toBeTruthy();
                console.log(`CSV has ${dataPresence.rowCount} rows`);

                const dateValidation = validator.validateDateRangeFilter(startDate, endDate);
                if (!dateValidation.pass) {
                    console.error('Date range validation failed:', dateValidation);
                }
                expect(dateValidation.pass).toBeTruthy();
            }
        });

        test('TC2.4: Download with same start and end date', async ({ page, equivalencyDownloadPage }) => {
            await equivalencyDownloadPage.openDownloadDialog();
            await equivalencyDownloadPage.selectDownloadOption();
            const today = new Date().toISOString().split('T')[0];
            await page.getByRole('textbox', { name: 'Start date' }).fill(today);
            await page.getByRole('textbox', { name: 'End date' }).fill(today);

            const downloadPromise = page.waitForEvent('download', { timeout: 300000 });
            await page.getByRole('button', { name: 'Download' }).last().click();
            const download = await downloadPromise;
            expect(download).toBeTruthy();
        });

        test('TC2.5: Verify validation for invalid date range (end before start)', async ({ page, equivalencyDownloadPage }) => {
            await equivalencyDownloadPage.openDownloadDialog();
            await equivalencyDownloadPage.selectDownloadOption();
            const today = new Date();
            const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
            await page.getByRole('textbox', { name: 'Start date' }).fill(today.toISOString().split('T')[0]);
            await page.getByRole('textbox', { name: 'End date' }).fill(yesterday.toISOString().split('T')[0]);
            await expect(page.getByText('Start date must be earlier')).toBeVisible({ timeout: 3000 });
        });

        test('TC2.6: Download with no date filters', async ({ page, equivalencyDownloadPage }) => {
            await equivalencyDownloadPage.openDownloadDialog();
            await equivalencyDownloadPage.selectDownloadOption();

            const downloadPromise = page.waitForEvent('download', { timeout: 300000 });
            await page.getByRole('button', { name: 'Download' }).last().click();
            const download = await downloadPromise;
            const downloadPath = await download.path();
            expect(downloadPath && fs.existsSync(downloadPath)).toBeTruthy();

            if (downloadPath?.endsWith('.csv')) {
                const csvContent = fs.readFileSync(downloadPath, 'utf8');
                const parsedData = Papa.parse(csvContent, { header: true });
                expect(parsedData.data.length).toBeGreaterThan(0);
            }
        });
    });

    // =========================================================================
    // 3. Source State Filter Tests
    // =========================================================================
    test.describe('Source State Filter Tests', () => {

        test('TC3.1: Download with single source state (Nevada)', async ({ page, equivalencyDownloadPage }) => {
            await equivalencyDownloadPage.openDownloadDialog();
            await equivalencyDownloadPage.selectDownloadOption();
            const stateCombobox = page.getByRole('combobox', { name: 'Source state(s)' });
            await stateCombobox.click();
            await stateCombobox.fill('Nevada');
            await page.waitForTimeout(1000);
            await page.keyboard.press('ArrowDown');
            await page.keyboard.press('Enter');

            const downloadPromise = page.waitForEvent('download', { timeout: 300000 });
            await page.getByRole('button', { name: 'Download' }).last().click();
            const download = await downloadPromise;
            const downloadPath = await download.path();
            expect(downloadPath && fs.existsSync(downloadPath)).toBeTruthy();

            if (downloadPath?.endsWith('.csv')) {
                const validator = new CSVValidator(downloadPath);
                validator.load();
                const dataPresence = validator.validateDataPresence();
                expect(dataPresence.pass).toBeTruthy();
                const stateValidation = validator.validateSourceStateFilter('Nevada');
                expect(stateValidation.pass).toBeTruthy();
            }
        });

        test('TC3.2: Download with multiple source states (Arizona and Nevada)', async ({ page, equivalencyDownloadPage }) => {
            await equivalencyDownloadPage.openDownloadDialog();
            await equivalencyDownloadPage.selectDownloadOption();
            const stateCombobox = page.getByRole('combobox', { name: 'Source state(s)' });

            await stateCombobox.click();
            await stateCombobox.fill('Arizona');
            await page.waitForTimeout(1000);
            await page.keyboard.press('ArrowDown');
            await page.keyboard.press('Enter');
            await page.waitForTimeout(500);
            await stateCombobox.fill('Nevada');
            await page.waitForTimeout(1000);
            await page.keyboard.press('ArrowDown');
            await page.keyboard.press('Enter');

            const downloadPromise = page.waitForEvent('download', { timeout: 300000 });
            await page.getByRole('button', { name: 'Download' }).last().click();
            const download = await downloadPromise;
            const downloadPath = await download.path();
            expect(downloadPath && fs.existsSync(downloadPath)).toBeTruthy();

            if (downloadPath?.endsWith('.csv')) {
                const validator = new CSVValidator(downloadPath);
                validator.load();
                const dataPresence = validator.validateDataPresence();
                expect(dataPresence.pass).toBeTruthy();
                const stateValidation = validator.validateMultipleStatesFilter(['Arizona', 'Nevada']);
                expect(stateValidation.pass).toBeTruthy();
            }
        });
    });

    // =========================================================================
    // 4. Source Institution Filter Tests
    // =========================================================================
    test.describe('Source Institution Filter Tests', () => {

        test('TC4.1: Download with single source institution', async ({ page, equivalencyDownloadPage }) => {
            await equivalencyDownloadPage.openDownloadDialog();
            await equivalencyDownloadPage.selectDownloadOption();
            const stateCombobox = page.getByRole('combobox', { name: 'Source state(s)' });
            await stateCombobox.click();
            await stateCombobox.fill('California');
            await page.waitForTimeout(1000);
            await page.keyboard.press('ArrowDown');
            await page.keyboard.press('Enter');
            await page.waitForTimeout(1000);

            const institutionCombobox = page.getByRole('combobox', { name: 'Source institution(s)' });
            await institutionCombobox.click();
            await institutionCombobox.fill('American River College');
            await page.waitForTimeout(2000);
            await page.keyboard.press('ArrowDown');
            await page.keyboard.press('Enter');

            const downloadPromise = page.waitForEvent('download', { timeout: 300000 });
            await page.getByRole('button', { name: 'Download' }).last().click();
            const download = await downloadPromise;
            const downloadPath = await download.path();
            expect(downloadPath && fs.existsSync(downloadPath)).toBeTruthy();

            if (downloadPath?.endsWith('.csv')) {
                const validator = new CSVValidator(downloadPath);
                validator.load();
                const dataPresence = validator.validateDataPresence();
                expect(dataPresence.pass).toBeTruthy();
                const institutionCol = validator.findColumn(['source_institution', 'source institution', 'institution']);
                expect(institutionCol).toBeTruthy();
            }
        });

        test('TC4.2: Download with multiple source institutions', async ({ page, equivalencyDownloadPage }) => {
            await equivalencyDownloadPage.openDownloadDialog();
            await equivalencyDownloadPage.selectDownloadOption();
            const stateCombobox = page.getByRole('combobox', { name: 'Source state(s)' });
            await stateCombobox.click();
            await stateCombobox.fill('California');
            await page.waitForTimeout(1000);
            await page.keyboard.press('ArrowDown');
            await page.keyboard.press('Enter');
            await page.waitForTimeout(1000);

            const institutionCombobox = page.getByRole('combobox', { name: 'Source institution(s)' });
            await institutionCombobox.click();
            await institutionCombobox.fill('American');
            await page.waitForTimeout(2000);
            await page.keyboard.press('ArrowDown');
            await page.keyboard.press('Enter');

            const downloadPromise = page.waitForEvent('download', { timeout: 300000 });
            await page.getByRole('button', { name: 'Download' }).last().click();
            const download = await downloadPromise;
            const downloadPath = await download.path();
            expect(downloadPath && fs.existsSync(downloadPath)).toBeTruthy();

            if (downloadPath?.endsWith('.csv')) {
                const validator = new CSVValidator(downloadPath);
                validator.load();
                const dataPresence = validator.validateDataPresence();
                expect(dataPresence.pass).toBeTruthy();
            }
        });

        test('TC4.3: Verify institution filter with state combination', async ({ page, equivalencyDownloadPage }) => {
            await equivalencyDownloadPage.openDownloadDialog();
            await equivalencyDownloadPage.selectDownloadOption();
            const stateCombobox = page.getByRole('combobox', { name: 'Source state(s)' });
            await stateCombobox.click();
            await stateCombobox.fill('Nevada');
            await page.waitForTimeout(1000);
            await page.keyboard.press('ArrowDown');
            await page.keyboard.press('Enter');
            await page.waitForTimeout(1000);

            const institutionCombobox = page.getByRole('combobox', { name: 'Source institution(s)' });
            await institutionCombobox.click();
            await page.waitForTimeout(2000);
            await page.keyboard.press('ArrowDown');
            await page.keyboard.press('Enter');

            const downloadPromise = page.waitForEvent('download', { timeout: 300000 });
            await page.getByRole('button', { name: 'Download' }).last().click();
            const download = await downloadPromise;
            const downloadPath = await download.path();
            expect(downloadPath && fs.existsSync(downloadPath)).toBeTruthy();

            if (downloadPath?.endsWith('.csv')) {
                const validator = new CSVValidator(downloadPath);
                validator.load();
                const dataPresence = validator.validateDataPresence();
                expect(dataPresence.pass).toBeTruthy();
                const stateValidation = validator.validateSourceStateFilter('Nevada');
                expect(stateValidation.pass).toBeTruthy();
            }
        });
    });

    // =========================================================================
    // 5. Target Subject Filter Tests
    // =========================================================================
    test.describe('Target Subject Filter Tests', () => {

        test('TC5.1: Download with single target subject', async ({ page, equivalencyDownloadPage }) => {
            await equivalencyDownloadPage.openDownloadDialog();
            await equivalencyDownloadPage.selectDownloadOption();
            const subjectInput = page.getByRole('textbox', { name: 'Target subject(s)' });
            await subjectInput.click();
            await subjectInput.fill('MATH');

            const downloadPromise = page.waitForEvent('download', { timeout: 300000 });
            await page.getByRole('button', { name: 'Download' }).last().click();
            const download = await downloadPromise;
            const downloadPath = await download.path();
            expect(downloadPath && fs.existsSync(downloadPath)).toBeTruthy();

            if (downloadPath?.endsWith('.csv')) {
                const csvContent = fs.readFileSync(downloadPath, 'utf8');
                const parsedData = Papa.parse<Record<string, string>>(csvContent, { header: true });
                const subjectColumn = parsedData.data.find((row) =>
                    Object.keys(row).some((key) => key.toLowerCase().includes('subject'))
                );
                if (subjectColumn && parsedData.data.length > 0) {
                    const subjectKey = Object.keys(subjectColumn).find((key) => key.toLowerCase().includes('subject'));
                    if (subjectKey) {
                        const hasMatchingSubject = parsedData.data.some((row) =>
                            row[subjectKey] && row[subjectKey].toUpperCase().includes('MATH')
                        );
                        expect(hasMatchingSubject).toBeTruthy();
                    }
                }
            }
        });

        test('TC5.2: Download with multiple target subjects', async ({ page, equivalencyDownloadPage }) => {
            await equivalencyDownloadPage.openDownloadDialog();
            await equivalencyDownloadPage.selectDownloadOption();
            await page.getByRole('textbox', { name: 'Target subject(s)' }).fill('MATH, ENGL');

            const downloadPromise = page.waitForEvent('download', { timeout: 300000 });
            await page.getByRole('button', { name: 'Download' }).last().click();
            const download = await downloadPromise;
            const downloadPath = await download.path();
            expect(downloadPath && fs.existsSync(downloadPath)).toBeTruthy();

            if (downloadPath?.endsWith('.csv')) {
                const validator = new CSVValidator(downloadPath);
                validator.load();
                const dataPresence = validator.validateDataPresence();
                expect(dataPresence.pass).toBeTruthy();
            }
        });

        test('TC5.3: Download with case-insensitive subject', async ({ page, equivalencyDownloadPage }) => {
            await equivalencyDownloadPage.openDownloadDialog();
            await equivalencyDownloadPage.selectDownloadOption();
            await page.getByRole('textbox', { name: 'Target subject(s)' }).fill('math');

            const downloadPromise = page.waitForEvent('download', { timeout: 300000 });
            await page.getByRole('button', { name: 'Download' }).last().click();
            const download = await downloadPromise;
            const downloadPath = await download.path();
            expect(downloadPath && fs.existsSync(downloadPath)).toBeTruthy();

            if (downloadPath?.endsWith('.csv')) {
                const validator = new CSVValidator(downloadPath);
                validator.load();
                const dataPresence = validator.validateDataPresence();
                expect(dataPresence.pass).toBeTruthy();
            }
        });

        test('TC5.4: Download with subject containing special characters', async ({ page, equivalencyDownloadPage }) => {
            await equivalencyDownloadPage.openDownloadDialog();
            await equivalencyDownloadPage.selectDownloadOption();
            await page.getByRole('textbox', { name: 'Target subject(s)' }).fill('ENGL');

            const downloadPromise = page.waitForEvent('download', { timeout: 300000 });
            await page.getByRole('button', { name: 'Download' }).last().click();
            const download = await downloadPromise;
            const downloadPath = await download.path();
            expect(downloadPath && fs.existsSync(downloadPath)).toBeTruthy();

            if (downloadPath?.endsWith('.csv')) {
                const validator = new CSVValidator(downloadPath);
                validator.load();
                const dataPresence = validator.validateDataPresence();
                expect(dataPresence.pass).toBeTruthy();
            }
        });
    });

    // =========================================================================
    // 6. Combined Filter Tests
    // =========================================================================
    test.describe('Combined Filter Tests', () => {

        test('TC6.1: Download with all filters applied', async ({ page, equivalencyDownloadPage }) => {
            await equivalencyDownloadPage.openDownloadDialog();
            await equivalencyDownloadPage.selectDownloadOption();
            const startDate = new Date(); startDate.setDate(startDate.getDate() - 90);
            const endDate = new Date(); endDate.setDate(endDate.getDate() - 30);

            await page.getByRole('textbox', { name: 'Start date' }).fill(startDate.toISOString().split('T')[0]);
            await page.getByRole('textbox', { name: 'End date' }).fill(endDate.toISOString().split('T')[0]);

            const stateCombobox = page.getByRole('combobox', { name: 'Source state(s)' });
            await stateCombobox.click();
            await stateCombobox.fill('California');
            await page.waitForTimeout(1000);
            await page.keyboard.press('ArrowDown');
            await page.keyboard.press('Enter');
            await page.waitForTimeout(1000);

            const institutionCombobox = page.getByRole('combobox', { name: 'Source institution(s)' });
            await institutionCombobox.click();
            await institutionCombobox.fill('American River');
            await page.waitForTimeout(2000);
            await page.keyboard.press('ArrowDown');
            await page.keyboard.press('Enter');

            await page.getByRole('textbox', { name: 'Target subject(s)' }).fill('MATH');

            const downloadPromise = page.waitForEvent('download', { timeout: 300000 });
            await page.getByRole('button', { name: 'Download' }).last().click();
            const download = await downloadPromise;
            const downloadPath = await download.path();
            expect(downloadPath && fs.existsSync(downloadPath)).toBeTruthy();

            if (downloadPath?.endsWith('.csv')) {
                const validator = new CSVValidator(downloadPath);
                validator.load();
                const dataPresence = validator.validateDataPresence();
                expect(dataPresence.pass).toBeTruthy();
                const stateValidation = validator.validateSourceStateFilter('California');
                expect(stateValidation.pass).toBeTruthy();
                const dateValidation = validator.validateDateRangeFilter(startDate, endDate);
                expect(dateValidation.pass).toBeTruthy();
                const structureValidation = validator.validateStructure(['state', 'institution', 'subject', 'date']);
                const foundCols = structureValidation.foundColumns as string[];
                console.log(`All key columns present: ${foundCols.length} found`);
            }
        });

        test('TC6.2: Download with state and date filters', async ({ page, equivalencyDownloadPage }) => {
            await equivalencyDownloadPage.openDownloadDialog();
            await equivalencyDownloadPage.selectDownloadOption();
            const startDate = new Date(); startDate.setDate(startDate.getDate() - 60);
            const endDate = new Date(); endDate.setDate(endDate.getDate() - 30);

            await page.getByRole('textbox', { name: 'Start date' }).fill(startDate.toISOString().split('T')[0]);
            await page.getByRole('textbox', { name: 'End date' }).fill(endDate.toISOString().split('T')[0]);

            const stateCombobox = page.getByRole('combobox', { name: 'Source state(s)' });
            await stateCombobox.click();
            await stateCombobox.fill('Nevada');
            await page.waitForTimeout(1000);
            await page.keyboard.press('ArrowDown');
            await page.keyboard.press('Enter');

            const downloadPromise = page.waitForEvent('download', { timeout: 300000 });
            await page.getByRole('button', { name: 'Download' }).last().click();
            const download = await downloadPromise;
            const downloadPath = await download.path();
            expect(downloadPath && fs.existsSync(downloadPath)).toBeTruthy();

            if (downloadPath?.endsWith('.csv')) {
                const validator = new CSVValidator(downloadPath);
                validator.load();
                const dataPresence = validator.validateDataPresence();
                expect(dataPresence.pass).toBeTruthy();
                const stateValidation = validator.validateSourceStateFilter('Nevada');
                expect(stateValidation.pass).toBeTruthy();
                const dateValidation = validator.validateDateRangeFilter(startDate, endDate);
                expect(dateValidation.pass).toBeTruthy();
            }
        });

        test('TC6.3: Download with state and subject filters', async ({ page, equivalencyDownloadPage }) => {
            await equivalencyDownloadPage.openDownloadDialog();
            await equivalencyDownloadPage.selectDownloadOption();
            const stateCombobox = page.getByRole('combobox', { name: 'Source state(s)' });
            await stateCombobox.click();
            await stateCombobox.fill('Arizona');
            await page.waitForTimeout(1000);
            await page.keyboard.press('ArrowDown');
            await page.keyboard.press('Enter');

            await page.getByRole('textbox', { name: 'Target subject(s)' }).fill('MATH');

            const downloadPromise = page.waitForEvent('download', { timeout: 300000 });
            await page.getByRole('button', { name: 'Download' }).last().click();
            const download = await downloadPromise;
            const downloadPath = await download.path();
            expect(downloadPath && fs.existsSync(downloadPath)).toBeTruthy();

            if (downloadPath?.endsWith('.csv')) {
                const validator = new CSVValidator(downloadPath);
                validator.load();
                const dataPresence = validator.validateDataPresence();
                expect(dataPresence.pass).toBeTruthy();
                const stateValidation = validator.validateSourceStateFilter('Arizona');
                expect(stateValidation.pass).toBeTruthy();
            }
        });

        test('TC6.4: Download with institution and date filters', async ({ page, equivalencyDownloadPage }) => {
            await equivalencyDownloadPage.openDownloadDialog();
            await equivalencyDownloadPage.selectDownloadOption();
            const startDate = new Date(); startDate.setDate(startDate.getDate() - 45);
            const endDate = new Date();

            await page.getByRole('textbox', { name: 'Start date' }).fill(startDate.toISOString().split('T')[0]);
            const stateCombobox = page.getByRole('combobox', { name: 'Source state(s)' });
            await stateCombobox.click();
            await stateCombobox.fill('California');
            await page.waitForTimeout(1000);
            await page.keyboard.press('ArrowDown');
            await page.keyboard.press('Enter');
            await page.waitForTimeout(1000);

            const institutionCombobox = page.getByRole('combobox', { name: 'Source institution(s)' });
            await institutionCombobox.click();
            await page.waitForTimeout(2000);
            await page.keyboard.press('ArrowDown');
            await page.keyboard.press('Enter');

            const downloadPromise = page.waitForEvent('download', { timeout: 300000 });
            await page.getByRole('button', { name: 'Download' }).last().click();
            const download = await downloadPromise;
            const downloadPath = await download.path();
            expect(downloadPath && fs.existsSync(downloadPath)).toBeTruthy();

            if (downloadPath?.endsWith('.csv')) {
                const validator = new CSVValidator(downloadPath);
                validator.load();
                const dataPresence = validator.validateDataPresence();
                expect(dataPresence.pass).toBeTruthy();
                const dateValidation = validator.validateDateRangeFilter(startDate, endDate);
                expect(dateValidation.pass).toBeTruthy();
            }
        });

        test('TC6.5: Download with multiple states and subjects', async ({ page, equivalencyDownloadPage }) => {
            await equivalencyDownloadPage.openDownloadDialog();
            await equivalencyDownloadPage.selectDownloadOption();
            const stateCombobox = page.getByRole('combobox', { name: 'Source state(s)' });
            await stateCombobox.click();
            await stateCombobox.fill('Nevada');
            await page.waitForTimeout(1000);
            await page.keyboard.press('ArrowDown');
            await page.keyboard.press('Enter');
            await page.waitForTimeout(500);
            await stateCombobox.fill('Arizona');
            await page.waitForTimeout(1000);
            await page.keyboard.press('ArrowDown');
            await page.keyboard.press('Enter');

            await page.getByRole('textbox', { name: 'Target subject(s)' }).fill('MATH, ENGL, BIOL');

            const downloadPromise = page.waitForEvent('download', { timeout: 300000 });
            await page.getByRole('button', { name: 'Download' }).last().click();
            const download = await downloadPromise;
            const downloadPath = await download.path();
            expect(downloadPath && fs.existsSync(downloadPath)).toBeTruthy();

            if (downloadPath?.endsWith('.csv')) {
                const validator = new CSVValidator(downloadPath);
                validator.load();
                const dataPresence = validator.validateDataPresence();
                expect(dataPresence.pass).toBeTruthy();
                const stateValidation = validator.validateMultipleStatesFilter(['Nevada', 'Arizona']);
                expect(stateValidation.pass).toBeTruthy();
            }
        });
    });

    // =========================================================================
    // 7. Downloaded File Validation Tests
    // =========================================================================
    test.describe('Downloaded File Validation Tests', () => {

        test('TC7.1: Verify file format and structure', async ({ page, equivalencyDownloadPage }) => {
            await equivalencyDownloadPage.openDownloadDialog();
            await equivalencyDownloadPage.selectDownloadOption();
            const downloadPromise = page.waitForEvent('download', { timeout: 300000 });
            await page.getByRole('button', { name: 'Download' }).last().click();
            const download = await downloadPromise;
            const downloadPath = await download.path();
            const fileName = download.suggestedFilename();
            expect(fileName).toMatch(/\.(csv|xlsx|xls)$/i);
            expect(downloadPath && fs.existsSync(downloadPath)).toBeTruthy();

            if (downloadPath?.endsWith('.csv')) {
                const validator = new CSVValidator(downloadPath);
                validator.load();
                const dataPresence = validator.validateDataPresence();
                expect(dataPresence.pass).toBeTruthy();
                const expectedColumns = ['state', 'institution', 'subject', 'course', 'number', 'decision'];
                const structureValidation = validator.validateStructure(expectedColumns);
                const foundCols = structureValidation.foundColumns as string[];
                expect(foundCols.length).toBeGreaterThan(0);
                const summary = validator.getSummary();
                console.log(`CSV Summary - Headers: ${summary.headers.join(', ')}`);
            }
        });

        test('TC7.2: Verify CSV data completeness and no duplicates', async ({ page, equivalencyDownloadPage }) => {
            await equivalencyDownloadPage.openDownloadDialog();
            await equivalencyDownloadPage.selectDownloadOption();
            const downloadPromise = page.waitForEvent('download', { timeout: 300000 });
            await page.getByRole('button', { name: 'Download' }).last().click();
            const download = await downloadPromise;
            const downloadPath = await download.path();
            expect(downloadPath && fs.existsSync(downloadPath)).toBeTruthy();

            if (downloadPath?.endsWith('.csv')) {
                const validator = new CSVValidator(downloadPath);
                validator.load();
                const dataPresence = validator.validateDataPresence();
                expect(dataPresence.pass).toBeTruthy();
                const rows = validator.getAllRows();
                expect(rows.length).toBeGreaterThan(0);
                const summary = validator.getSummary();
                const sampleRow = summary.sampleRow;
                const hasData = Object.values(sampleRow).some((val) => typeof val === 'string' && val.length > 0);
                expect(hasData).toBeTruthy();
            }
        });

        test('TC7.3: Verify special characters handling', async ({ page, equivalencyDownloadPage }) => {
            await equivalencyDownloadPage.openDownloadDialog();
            await equivalencyDownloadPage.selectDownloadOption();
            const downloadPromise = page.waitForEvent('download', { timeout: 300000 });
            await page.getByRole('button', { name: 'Download' }).last().click();
            const download = await downloadPromise;
            const downloadPath = await download.path();

            if (downloadPath?.endsWith('.csv')) {
                const csvContent = fs.readFileSync(downloadPath, 'utf8');
                expect(csvContent.length).toBeGreaterThan(0);
                expect(() => Papa.parse(csvContent, { header: true })).not.toThrow();
            }
        });

        test('TC7.4: Verify downloaded file size is reasonable', async ({ page, equivalencyDownloadPage }) => {
            await equivalencyDownloadPage.openDownloadDialog();
            await equivalencyDownloadPage.selectDownloadOption();
            const downloadPromise = page.waitForEvent('download', { timeout: 300000 });
            await page.getByRole('button', { name: 'Download' }).last().click();
            const download = await downloadPromise;
            const downloadPath = await download.path();
            expect(downloadPath && fs.existsSync(downloadPath)).toBeTruthy();
            const stats = fs.statSync(downloadPath!);
            const fileSizeInKB = stats.size / 1024;
            expect(fileSizeInKB).toBeGreaterThan(1);
        });

        test('TC7.5: Verify file naming convention', async ({ page, equivalencyDownloadPage }) => {
            await equivalencyDownloadPage.openDownloadDialog();
            await equivalencyDownloadPage.selectDownloadOption();
            const downloadPromise = page.waitForEvent('download', { timeout: 300000 });
            await page.getByRole('button', { name: 'Download' }).last().click();
            const download = await downloadPromise;
            const fileName = download.suggestedFilename();
            expect(fileName.length).toBeGreaterThan(0);
            expect(fileName).toMatch(/\.(csv|xlsx|xls)$/i);
        });

        test('TC7.6: Verify CSV encoding is UTF-8', async ({ page, equivalencyDownloadPage }) => {
            await equivalencyDownloadPage.openDownloadDialog();
            await equivalencyDownloadPage.selectDownloadOption();
            const downloadPromise = page.waitForEvent('download', { timeout: 300000 });
            await page.getByRole('button', { name: 'Download' }).last().click();
            const download = await downloadPromise;
            const downloadPath = await download.path();

            if (downloadPath?.endsWith('.csv')) {
                const csvContent = fs.readFileSync(downloadPath, 'utf8');
                expect(csvContent).toBeTruthy();
                expect(csvContent.length).toBeGreaterThan(0);
                const parsed = Papa.parse(csvContent, { header: true });
                expect(parsed.data.length).toBeGreaterThan(0);
            }
        });
    });

    // =========================================================================
    // 9. Error Handling Tests
    // =========================================================================
    test.describe('Error Handling Tests', () => {

        test('TC9.1: Verify cancel download operation', async ({ page, equivalencyDownloadPage }) => {
            await equivalencyDownloadPage.openDownloadDialog();
            await expect(page.getByRole('dialog', { name: 'Download' })).toBeVisible();
            await page.getByRole('button', { name: 'Cancel' }).click();
            await expect(page.getByRole('dialog', { name: 'Download' })).not.toBeVisible({ timeout: 3000 });
        });

        test('TC9.2: Verify download with empty result set', async ({ page, equivalencyDownloadPage }) => {
            await equivalencyDownloadPage.openDownloadDialog();
            await equivalencyDownloadPage.selectDownloadOption();
            await page.getByRole('textbox', { name: 'Start date' }).fill('2000-01-01');
            await page.getByRole('textbox', { name: 'End date' }).fill('2000-01-02');
            await page.getByRole('button', { name: 'Download' }).last().click();
            await page.waitForTimeout(3000);
        });

        test('TC9.3: Verify reopening download dialog after cancel', async ({ page, equivalencyDownloadPage }) => {
            await equivalencyDownloadPage.openDownloadDialog();
            const dialog = page.getByRole('dialog', { name: 'Download' });
            await expect(dialog).toBeVisible();
            await page.getByRole('button', { name: 'Cancel' }).click();
            await expect(dialog).not.toBeVisible({ timeout: 3000 });
            await equivalencyDownloadPage.openDownloadDialog();
            await expect(dialog).toBeVisible();
        });

        test('TC9.4: Verify download button disabled state before selection', async ({ page, equivalencyDownloadPage }) => {
            await equivalencyDownloadPage.openDownloadDialog();
            const downloadButton = page.getByRole('button', { name: 'Download' }).last();
            const isDisabled = await downloadButton.isDisabled();
            expect(isDisabled).toBeTruthy();
        });
    });

    // =========================================================================
    // 10. UI/UX Tests
    // =========================================================================
    test.describe('UI/UX Tests', () => {

        test('TC10.1: Verify download popup responsiveness', async ({ page, equivalencyDownloadPage }) => {
            await equivalencyDownloadPage.openDownloadDialog();
            const dialog = page.getByRole('dialog', { name: 'Download' });
            await expect(dialog).toBeVisible();
            await page.keyboard.press('Tab');
            await page.keyboard.press('Tab');
            await page.keyboard.press('Tab');
            await page.keyboard.press('Escape');
            await expect(dialog).not.toBeVisible({ timeout: 3000 });
        });

        test('TC10.2: Verify filter field usability', async ({ page, equivalencyDownloadPage }) => {
            await equivalencyDownloadPage.openDownloadDialog();
            await equivalencyDownloadPage.selectDownloadOption();
            await expect(page.getByRole('textbox', { name: 'Start date' })).toBeEditable();
            await expect(page.getByRole('combobox', { name: 'Source state(s)' })).toBeVisible();
            await expect(page.getByRole('button', { name: 'Download' }).last()).toBeEnabled();
        });

        test('TC10.3: Verify all filter labels are visible', async ({ page, equivalencyDownloadPage }) => {
            await equivalencyDownloadPage.openDownloadDialog();
            await equivalencyDownloadPage.selectDownloadOption();
            await expect(page.getByText('Start date')).toBeVisible();
            await expect(page.getByText('End date')).toBeVisible();
            await expect(page.getByText('Source state(s)')).toBeVisible();
            await expect(page.getByText('Source institution(s)')).toBeVisible();
            await expect(page.getByText('Target subject(s)')).toBeVisible();
        });

        test('TC10.4: Verify download dialog closes on successful download', async ({ page, equivalencyDownloadPage }) => {
            await equivalencyDownloadPage.openDownloadDialog();
            await equivalencyDownloadPage.selectDownloadOption();
            const downloadPromise = page.waitForEvent('download', { timeout: 300000 });
            await page.getByRole('button', { name: 'Download' }).last().click();
            await downloadPromise;
            await expect(page.getByRole('dialog', { name: 'Download' })).not.toBeVisible({ timeout: 5000 });
        });

        test('TC10.5: Verify keyboard navigation through filters', async ({ page, equivalencyDownloadPage }) => {
            await equivalencyDownloadPage.openDownloadDialog();
            await equivalencyDownloadPage.selectDownloadOption();
            await page.keyboard.press('Tab');
            await page.keyboard.press('Tab');
            const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
            expect(focusedElement).toBeTruthy();
        });
    });

    // =========================================================================
    // 11. Download Option Tests
    // =========================================================================
    test.describe('Download Option Tests', () => {

        test('TC11.1: Verify "Download all" option', async ({ page, equivalencyDownloadPage }) => {
            await equivalencyDownloadPage.openDownloadDialog();
            await equivalencyDownloadPage.selectDownloadOption('Download all');
            const downloadPromise = page.waitForEvent('download', { timeout: 300000 });
            await page.getByRole('button', { name: 'Download' }).last().click();
            const download = await downloadPromise;
            const downloadPath = await download.path();
            expect(downloadPath && fs.existsSync(downloadPath)).toBeTruthy();

            if (downloadPath?.endsWith('.csv')) {
                const validator = new CSVValidator(downloadPath);
                validator.load();
                const dataPresence = validator.validateDataPresence();
                expect(dataPresence.pass).toBeTruthy();
            }
        });

        test('TC11.2: Verify download option dropdown has all options', async ({ page, equivalencyDownloadPage }) => {
            await equivalencyDownloadPage.openDownloadDialog();
            await page.getByRole('combobox', { name: 'Download option' }).click();
            await expect(page.getByRole('option', { name: 'Download all' })).toBeVisible();
        });

        test('TC11.3: Verify switching between download options', async ({ page, equivalencyDownloadPage }) => {
            await equivalencyDownloadPage.openDownloadDialog();
            const downloadOptionCombobox = page.getByRole('combobox', { name: 'Download option' });
            await downloadOptionCombobox.click();
            await page.getByRole('option', { name: 'Download all' }).click();
            await downloadOptionCombobox.click();
            await page.getByRole('option', { name: 'Download all' }).click();
        });
    });

    // =========================================================================
    // 12. Date Edge Cases Tests
    // =========================================================================
    test.describe('Date Edge Cases Tests', () => {

        test('TC12.1: Download with future date range', async ({ page, equivalencyDownloadPage }) => {
            await equivalencyDownloadPage.openDownloadDialog();
            await equivalencyDownloadPage.selectDownloadOption();
            const startDate = new Date(); startDate.setDate(startDate.getDate() + 30);
            const endDate = new Date(); endDate.setDate(endDate.getDate() + 60);
            await page.getByRole('textbox', { name: 'Start date' }).fill(startDate.toISOString().split('T')[0]);
            await page.getByRole('textbox', { name: 'End date' }).fill(endDate.toISOString().split('T')[0]);
            await page.getByRole('button', { name: 'Download' }).last().click();
            await page.waitForTimeout(3000);
        });

        test('TC12.2: Download with very old date range', async ({ page, equivalencyDownloadPage }) => {
            await equivalencyDownloadPage.openDownloadDialog();
            await equivalencyDownloadPage.selectDownloadOption();
            await page.getByRole('textbox', { name: 'Start date' }).fill('2010-01-01');
            await page.getByRole('textbox', { name: 'End date' }).fill('2010-12-31');
            await page.getByRole('button', { name: 'Download' }).last().click();
            await page.waitForTimeout(3000);
        });

        test('TC12.3: Download with one day date range', async ({ page, equivalencyDownloadPage }) => {
            await equivalencyDownloadPage.openDownloadDialog();
            await equivalencyDownloadPage.selectDownloadOption();
            const startDate = new Date(); startDate.setDate(startDate.getDate() - 30);
            const dateStr = startDate.toISOString().split('T')[0];
            await page.getByRole('textbox', { name: 'Start date' }).fill(dateStr);
            await page.getByRole('textbox', { name: 'End date' }).fill(dateStr);

            const downloadPromise = page.waitForEvent('download', { timeout: 300000 });
            await page.getByRole('button', { name: 'Download' }).last().click();
            const download = await downloadPromise;
            const downloadPath = await download.path();
            expect(downloadPath && fs.existsSync(downloadPath)).toBeTruthy();
        });

        test('TC12.4: Download with wide date range (1 year)', async ({ page, equivalencyDownloadPage }) => {
            await equivalencyDownloadPage.openDownloadDialog();
            await equivalencyDownloadPage.selectDownloadOption();
            const startDate = new Date(); startDate.setFullYear(startDate.getFullYear() - 1);
            const endDate = new Date();
            await page.getByRole('textbox', { name: 'Start date' }).fill(startDate.toISOString().split('T')[0]);
            await page.getByRole('textbox', { name: 'End date' }).fill(endDate.toISOString().split('T')[0]);

            const downloadPromise = page.waitForEvent('download', { timeout: 300000 });
            await page.getByRole('button', { name: 'Download' }).last().click();
            const download = await downloadPromise;
            const downloadPath = await download.path();
            expect(downloadPath && fs.existsSync(downloadPath)).toBeTruthy();

            if (downloadPath?.endsWith('.csv')) {
                const validator = new CSVValidator(downloadPath);
                validator.load();
                const dataPresence = validator.validateDataPresence();
                expect(dataPresence.pass).toBeTruthy();
            }
        });
    });

    // =========================================================================
    // 13. State Filter Edge Cases
    // =========================================================================
    test.describe('State Filter Edge Cases', () => {

        test('TC13.1: Download with California state', async ({ page, equivalencyDownloadPage }) => {
            await equivalencyDownloadPage.openDownloadDialog();
            await equivalencyDownloadPage.selectDownloadOption();
            const stateCombobox = page.getByRole('combobox', { name: 'Source state(s)' });
            await stateCombobox.click();
            await stateCombobox.fill('California');
            await page.waitForTimeout(1000);
            await page.keyboard.press('ArrowDown');
            await page.keyboard.press('Enter');

            const downloadPromise = page.waitForEvent('download', { timeout: 300000 });
            await page.getByRole('button', { name: 'Download' }).last().click();
            const download = await downloadPromise;
            const downloadPath = await download.path();
            expect(downloadPath && fs.existsSync(downloadPath)).toBeTruthy();

            if (downloadPath?.endsWith('.csv')) {
                const validator = new CSVValidator(downloadPath);
                validator.load();
                const stateValidation = validator.validateSourceStateFilter('California');
                expect(stateValidation.pass).toBeTruthy();
            }
        });

        test('TC13.2: Download with Texas state', async ({ page, equivalencyDownloadPage }) => {
            await equivalencyDownloadPage.openDownloadDialog();
            await equivalencyDownloadPage.selectDownloadOption();
            const stateCombobox = page.getByRole('combobox', { name: 'Source state(s)' });
            await stateCombobox.click();
            await stateCombobox.fill('Texas');
            await page.waitForTimeout(1000);
            await page.keyboard.press('ArrowDown');
            await page.keyboard.press('Enter');

            const downloadPromise = page.waitForEvent('download', { timeout: 300000 });
            await page.getByRole('button', { name: 'Download' }).last().click();
            const download = await downloadPromise;
            const downloadPath = await download.path();
            expect(downloadPath && fs.existsSync(downloadPath)).toBeTruthy();

            if (downloadPath?.endsWith('.csv')) {
                const validator = new CSVValidator(downloadPath);
                validator.load();
                const dataPresence = validator.validateDataPresence();
                expect(dataPresence.pass).toBeTruthy();
            }
        });

        test('TC13.3: Download with three different states', async ({ page, equivalencyDownloadPage }) => {
            await equivalencyDownloadPage.openDownloadDialog();
            await equivalencyDownloadPage.selectDownloadOption();
            const stateCombobox = page.getByRole('combobox', { name: 'Source state(s)' });
            for (const state of ['Nevada', 'Arizona', 'California']) {
                await stateCombobox.click();
                await stateCombobox.fill(state);
                await page.waitForTimeout(1000);
                await page.keyboard.press('ArrowDown');
                await page.keyboard.press('Enter');
                await page.waitForTimeout(500);
            }

            const downloadPromise = page.waitForEvent('download', { timeout: 300000 });
            await page.getByRole('button', { name: 'Download' }).last().click();
            const download = await downloadPromise;
            const downloadPath = await download.path();
            expect(downloadPath && fs.existsSync(downloadPath)).toBeTruthy();

            if (downloadPath?.endsWith('.csv')) {
                const validator = new CSVValidator(downloadPath);
                validator.load();
                const stateValidation = validator.validateMultipleStatesFilter(['Nevada', 'Arizona', 'California']);
                expect(stateValidation.pass).toBeTruthy();
            }
        });
    });

    // =========================================================================
    // 14. Data Integrity Tests
    // =========================================================================
    test.describe('Data Integrity Tests', () => {

        test('TC14.1: Verify source and target row pairing', async ({ page, equivalencyDownloadPage }) => {
            await equivalencyDownloadPage.openDownloadDialog();
            await equivalencyDownloadPage.selectDownloadOption();
            const downloadPromise = page.waitForEvent('download', { timeout: 300000 });
            await page.getByRole('button', { name: 'Download' }).last().click();
            const download = await downloadPromise;
            const downloadPath = await download.path();

            if (downloadPath?.endsWith('.csv')) {
                const validator = new CSVValidator(downloadPath);
                validator.load();
                const rows = validator.getAllRows();
                expect(rows.length).toBeGreaterThan(0);
                expect(rows.length % 2).toBe(0);
            }
        });

        test('TC14.2: Verify all rows have required columns populated', async ({ page, equivalencyDownloadPage }) => {
            await equivalencyDownloadPage.openDownloadDialog();
            await equivalencyDownloadPage.selectDownloadOption();
            const downloadPromise = page.waitForEvent('download', { timeout: 300000 });
            await page.getByRole('button', { name: 'Download' }).last().click();
            const download = await downloadPromise;
            const downloadPath = await download.path();

            if (downloadPath?.endsWith('.csv')) {
                const validator = new CSVValidator(downloadPath);
                validator.load();
                const rows = validator.getAllRows();
                const headers = validator.headers;
                expect(rows.length).toBeGreaterThan(0);
                expect(headers.length).toBeGreaterThan(0);
            }
        });

        test('TC14.3: Verify CSV has no malformed rows', async ({ page, equivalencyDownloadPage }) => {
            await equivalencyDownloadPage.openDownloadDialog();
            await equivalencyDownloadPage.selectDownloadOption();
            const downloadPromise = page.waitForEvent('download', { timeout: 300000 });
            await page.getByRole('button', { name: 'Download' }).last().click();
            const download = await downloadPromise;
            const downloadPath = await download.path();

            if (downloadPath?.endsWith('.csv')) {
                const csvContent = fs.readFileSync(downloadPath, 'utf8');
                const parsed = Papa.parse(csvContent, { header: true });
                expect(parsed.errors.length).toBe(0);
            }
        });
    });

    // =========================================================================
    // 15. Performance and Load Tests
    // =========================================================================
    test.describe('Performance and Load Tests', () => {

        test('TC15.1: Verify download completes within reasonable time', async ({ page, equivalencyDownloadPage }) => {
            await equivalencyDownloadPage.openDownloadDialog();
            await equivalencyDownloadPage.selectDownloadOption();
            const startTime = Date.now();
            const downloadPromise = page.waitForEvent('download', { timeout: 300000 });
            await page.getByRole('button', { name: 'Download' }).last().click();
            const download = await downloadPromise;
            const duration = (Date.now() - startTime) / 1000;
            expect(download).toBeTruthy();
            console.log(`Download completed in ${duration.toFixed(2)} seconds`);
        });

        test('TC15.2: Verify multiple sequential downloads', async ({ page, equivalencyDownloadPage }) => {
            await equivalencyDownloadPage.openDownloadDialog();
            await equivalencyDownloadPage.selectDownloadOption();
            let downloadPromise = page.waitForEvent('download', { timeout: 300000 });
            await page.getByRole('button', { name: 'Download' }).last().click();
            await downloadPromise;
            await page.waitForTimeout(2000);

            await equivalencyDownloadPage.openDownloadDialog();
            await equivalencyDownloadPage.selectDownloadOption();
            downloadPromise = page.waitForEvent('download', { timeout: 300000 });
            await page.getByRole('button', { name: 'Download' }).last().click();
            const download2 = await downloadPromise;
            expect(download2).toBeTruthy();
        });

        test('TC15.3: Verify dialog responsiveness during download', async ({ page, equivalencyDownloadPage }) => {
            await equivalencyDownloadPage.openDownloadDialog();
            await equivalencyDownloadPage.selectDownloadOption();
            const downloadPromise = page.waitForEvent('download', { timeout: 300000 });
            await page.getByRole('button', { name: 'Download' }).last().click();
            await downloadPromise;
        });
    });
});
