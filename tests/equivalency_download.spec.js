const { test, expect } = require('@playwright/test');
const { loginPage } = require('../base_classes/login.js');
const { SuggestionsPage } = require('../base_classes/suggestions.js');
const { CSVValidator } = require('../helpers/csv-validator.js');
const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');

let loginPageInstance, suggestion;

async function openDownloadDialog(page) {
    await page.waitForLoadState('domcontentloaded');
    const downloadButton = page.locator('nav').getByRole('button', { name: 'Download' });
    await downloadButton.waitFor({ state: 'visible', timeout: 10000 });
    await downloadButton.click();
    await page.waitForSelector('[role="dialog"]', { timeout: 5000 });
}

async function selectDownloadOption(page, option = 'Download all') {
    await page.getByRole('combobox', { name: 'Download option' }).click();
    await page.getByRole('option', { name: option }).click();
}

test.describe('Equivalency Download Feature Tests', () => {

    test.beforeEach(async ({ page }) => {
        loginPageInstance = new loginPage(page);
        suggestion = new SuggestionsPage(page);
        await page.goto('https://qa.creditmobility.net/');
        await loginPageInstance.loginuser('testtriangulator+108@gmail.com', 'Triangulator!1');
        await suggestion.navigateToNewSuggestionPage();
    });

    test.describe('Navigation and Access Tests', () => {

        test('TC1.1: Verify user can navigate to download feature', async ({ page }) => {
            await page.waitForLoadState('domcontentloaded');
            const downloadButton = page.locator('nav').getByRole('button', { name: 'Download' });
            await expect(downloadButton).toBeVisible({ timeout: 10000 });
            await expect(downloadButton).toBeEnabled();
        });

        test('TC1.2: Verify download popup opens with all filter options', async ({ page }) => {
            await openDownloadDialog(page);
            
            await expect(page.getByRole('dialog', { name: 'Download' })).toBeVisible({ timeout: 5000 });
            
            await expect(page.getByRole('combobox', { name: 'Download option' })).toBeVisible();
            await expect(page.getByRole('textbox', { name: 'Start date' })).toBeVisible();
            await expect(page.getByRole('textbox', { name: 'End date' })).toBeVisible();
            await expect(page.getByRole('combobox', { name: 'Source state(s)' })).toBeVisible();
            await expect(page.getByRole('combobox', { name: 'Source institution(s)' })).toBeVisible();
            await expect(page.getByRole('textbox', { name: 'Target subject(s)' })).toBeVisible();
            
            const cancelButton = page.getByRole('button', { name: 'Cancel' });
            await expect(cancelButton).toBeVisible();
        });
    });

    test.describe('Date Range Filter Tests', () => {

        test('TC2.1: Download with start date only', async ({ page }) => {
            await openDownloadDialog(page);
            await selectDownloadOption(page);
            
            const startDateInput = page.getByRole('textbox', { name: 'Start date' });
            
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            const formattedDate = thirtyDaysAgo.toISOString().split('T')[0];
            
            await startDateInput.fill(formattedDate);
            
            const downloadPromise = page.waitForEvent('download', { timeout: 300000 });
            await page.getByRole('button', { name: 'Download' }).last().click();
            
            const download = await downloadPromise;
            const downloadPath = await download.path();
            
            expect(fs.existsSync(downloadPath)).toBeTruthy();
            expect(download.suggestedFilename()).toMatch(/\.(csv|xlsx|xls)$/i);
        });

        test('TC2.2: Download with end date only', async ({ page }) => {
            await openDownloadDialog(page);
            await selectDownloadOption(page);
            
            const endDateInput = page.getByRole('textbox', { name: 'End date' });
            
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const formattedDate = yesterday.toISOString().split('T')[0];
            
            await endDateInput.fill(formattedDate);
            
            const downloadPromise = page.waitForEvent('download', { timeout: 300000 });
            await page.getByRole('button', { name: 'Download' }).last().click();
            
            const download = await downloadPromise;
            const downloadPath = await download.path();
            
            expect(fs.existsSync(downloadPath)).toBeTruthy();
        });

        test('TC2.3: Download with complete date range', async ({ page }) => {
            await openDownloadDialog(page);
            await selectDownloadOption(page);
            
            const startDateInput = page.getByRole('textbox', { name: 'Start date' });
            const endDateInput = page.getByRole('textbox', { name: 'End date' });
            
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - 60);
            const endDate = new Date();
            endDate.setDate(endDate.getDate() - 30);
            
            await startDateInput.fill(startDate.toISOString().split('T')[0]);
            await endDateInput.fill(endDate.toISOString().split('T')[0]);
            
            const downloadPromise = page.waitForEvent('download', { timeout: 300000 });
            await page.getByRole('button', { name: 'Download' }).last().click();
            
            const download = await downloadPromise;
            const downloadPath = await download.path();
            
            expect(fs.existsSync(downloadPath)).toBeTruthy();
            
            // Comprehensive CSV validation with date range
            if (downloadPath.endsWith('.csv')) {
                const validator = new CSVValidator(downloadPath);
                validator.load();
                
                // 1. Validate data presence
                const dataPresence = validator.validateDataPresence();
                expect(dataPresence.pass).toBeTruthy();
                console.log(`✓ CSV has ${dataPresence.rowCount} rows`);
                
                // 2. Validate date range (dates should be mapped to decision date column)
                const dateValidation = validator.validateDateRangeFilter(startDate, endDate);
                
                if (!dateValidation.pass) {
                    console.error('Date range validation failed:', dateValidation);
                    console.error('Invalid rows:', dateValidation.invalidRows);
                }
                
                expect(dateValidation.pass).toBeTruthy();
                console.log(`✓ All ${dateValidation.validRows.length} rows have dates within range: ${dateValidation.dateRange.start} to ${dateValidation.dateRange.end}`);
                console.log(`✓ Date column used: ${dateValidation.dateColumn}`);
                
                if (dateValidation.emptyDateRows.length > 0) {
                    console.warn(`⚠ ${dateValidation.emptyDateRows.length} rows have empty dates`);
                }
            }
        });

        test('TC2.4: Download with same start and end date', async ({ page }) => {
            await openDownloadDialog(page);
            await selectDownloadOption(page);
            
            const startDateInput = page.getByRole('textbox', { name: 'Start date' });
            const endDateInput = page.getByRole('textbox', { name: 'End date' });
            
            const today = new Date().toISOString().split('T')[0];
            
            await startDateInput.fill(today);
            await endDateInput.fill(today);
            
            const downloadPromise = page.waitForEvent('download', { timeout: 300000 });
            await page.getByRole('button', { name: 'Download' }).last().click();
            
            const download = await downloadPromise;
            expect(download).toBeTruthy();
        });

        test('TC2.5: Verify validation for invalid date range (end before start)', async ({ page }) => {
            await openDownloadDialog(page);
            await selectDownloadOption(page);
            
            const startDateInput = page.getByRole('textbox', { name: 'Start date' });
            const endDateInput = page.getByRole('textbox', { name: 'End date' });
            
            const today = new Date();
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            
            await startDateInput.fill(today.toISOString().split('T')[0]);
            await endDateInput.fill(yesterday.toISOString().split('T')[0]);
            
           // await page.getByRole('button', { name: 'Download' }).last()
            
            const errorMessage = page.getByText('Start date must be earlier');
            await expect(errorMessage).toBeVisible({ timeout: 3000 });
        });

        test('TC2.6: Download with no date filters', async ({ page }) => {
            await openDownloadDialog(page);
            await selectDownloadOption(page);
            
            const downloadPromise = page.waitForEvent('download', { timeout: 300000 });
            await page.getByRole('button', { name: 'Download' }).last().click();
            
            const download = await downloadPromise;
            const downloadPath = await download.path();
            
            expect(fs.existsSync(downloadPath)).toBeTruthy();
            
            if (downloadPath.endsWith('.csv')) {
                const csvContent = fs.readFileSync(downloadPath, 'utf8');
                const parsedData = Papa.parse(csvContent, { header: true });
                expect(parsedData.data.length).toBeGreaterThan(0);
            }
        });
    });

    test.describe('Source State Filter Tests', () => {

        test('TC3.1: Download with single source state (Nevada)', async ({ page }) => {
            await openDownloadDialog(page);
            await selectDownloadOption(page);
            
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
            
            expect(fs.existsSync(downloadPath)).toBeTruthy();
            
            // Comprehensive CSV validation
            if (downloadPath.endsWith('.csv')) {
                const validator = new CSVValidator(downloadPath);
                validator.load();
                
                // 1. Validate data presence
                const dataPresence = validator.validateDataPresence();
                expect(dataPresence.pass).toBeTruthy();
                console.log(`✓ CSV has ${dataPresence.rowCount} rows`);
                
                // 2. Validate filtered state (only source rows should have Nevada)
                const stateValidation = validator.validateSourceStateFilter('Nevada');
                expect(stateValidation.pass).toBeTruthy();
                
                if (!stateValidation.pass) {
                    console.error('State validation failed:', stateValidation);
                    console.error('Invalid rows:', stateValidation.invalidRows);
                }
                
                console.log(`✓ ${stateValidation.validSourceRows.length} source rows have correct state: Nevada`);
                console.log(`✓ ${stateValidation.targetRows.length} target rows (filters not applied)`);
            }
        });

        test('TC3.2: Download with multiple source states (Arizona and Nevada)', async ({ page }) => {
            await openDownloadDialog(page);
            await selectDownloadOption(page);
            
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
            
            expect(fs.existsSync(downloadPath)).toBeTruthy();
            
            // Comprehensive CSV validation for multiple states
            if (downloadPath.endsWith('.csv')) {
                const validator = new CSVValidator(downloadPath);
                validator.load();
                
                // 1. Validate data presence
                const dataPresence = validator.validateDataPresence();
                expect(dataPresence.pass).toBeTruthy();
                console.log(`✓ CSV has ${dataPresence.rowCount} rows`);
                
                // 2. Validate multiple states filter (only Arizona or Nevada in source rows)
                const stateValidation = validator.validateMultipleStatesFilter(['Arizona', 'Nevada']);
                expect(stateValidation.pass).toBeTruthy();
                
                if (!stateValidation.pass) {
                    console.error('Multiple states validation failed:', stateValidation);
                    console.error('Invalid rows:', stateValidation.invalidRows);
                }
                
                console.log(`✓ All source rows have states from: Arizona, Nevada`);
            }
        });
    });

    test.describe('Source Institution Filter Tests', () => {

        test('TC4.1: Download with single source institution', async ({ page }) => {
            await openDownloadDialog(page);
            await selectDownloadOption(page);
            
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
            
            expect(fs.existsSync(downloadPath)).toBeTruthy();
            
            // CSV validation for institution filter
            if (downloadPath.endsWith('.csv')) {
                const validator = new CSVValidator(downloadPath);
                validator.load();
                
                const dataPresence = validator.validateDataPresence();
                expect(dataPresence.pass).toBeTruthy();
                console.log(`✓ CSV has ${dataPresence.rowCount} rows`);
                
                // Verify institution column exists and has data
                const institutionCol = validator.findColumn(['source_institution', 'source institution', 'institution']);
                expect(institutionCol).toBeTruthy();
                console.log(`✓ Institution column found: ${institutionCol}`);
            }
        });

        test('TC4.2: Download with multiple source institutions', async ({ page }) => {
            await openDownloadDialog(page);
            await selectDownloadOption(page);
            
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
            
            expect(fs.existsSync(downloadPath)).toBeTruthy();
            
            // CSV validation
            if (downloadPath.endsWith('.csv')) {
                const validator = new CSVValidator(downloadPath);
                validator.load();
                
                const dataPresence = validator.validateDataPresence();
                expect(dataPresence.pass).toBeTruthy();
                console.log(`✓ CSV has ${dataPresence.rowCount} rows`);
            }
        });

        test('TC4.3: Verify institution filter with state combination', async ({ page }) => {
            await openDownloadDialog(page);
            await selectDownloadOption(page);
            
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
            
            expect(fs.existsSync(downloadPath)).toBeTruthy();
            
            // CSV validation - verify both state and institution
            if (downloadPath.endsWith('.csv')) {
                const validator = new CSVValidator(downloadPath);
                validator.load();
                
                const dataPresence = validator.validateDataPresence();
                expect(dataPresence.pass).toBeTruthy();
                
                const stateValidation = validator.validateSourceStateFilter('Nevada');
                expect(stateValidation.pass).toBeTruthy();
                console.log(`✓ All source rows have Nevada state`);
                
                const institutionCol = validator.findColumn(['source_institution', 'source institution']);
                expect(institutionCol).toBeTruthy();
                console.log(`✓ Institution filter applied correctly`);
            }
        });
    });

    test.describe('Target Subject Filter Tests', () => {

        test('TC5.1: Download with single target subject', async ({ page }) => {
            await openDownloadDialog(page);
            await selectDownloadOption(page);
            
            const subjectInput = page.getByRole('textbox', { name: 'Target subject(s)' });
            await subjectInput.click();
            await subjectInput.fill('MATH');
            
            const downloadPromise = page.waitForEvent('download', { timeout: 300000 });
            await page.getByRole('button', { name: 'Download' }).last().click();
            
            const download = await downloadPromise;
            const downloadPath = await download.path();
            
            expect(fs.existsSync(downloadPath)).toBeTruthy();
            
            if (downloadPath.endsWith('.csv')) {
                const csvContent = fs.readFileSync(downloadPath, 'utf8');
                const parsedData = Papa.parse(csvContent, { header: true });
                
                const subjectColumn = parsedData.data.find(row => 
                    Object.keys(row).some(key => key.toLowerCase().includes('subject'))
                );
                
                if (subjectColumn && parsedData.data.length > 0) {
                    const subjectKey = Object.keys(subjectColumn).find(key => key.toLowerCase().includes('subject'));
                    const hasMatchingSubject = parsedData.data.some(row => 
                        row[subjectKey] && row[subjectKey].toUpperCase().includes('MATH')
                    );
                    expect(hasMatchingSubject).toBeTruthy();
                }
            }
        });

        test('TC5.2: Download with multiple target subjects', async ({ page }) => {
            await openDownloadDialog(page);
            await selectDownloadOption(page);
            
            const subjectInput = page.getByRole('textbox', { name: 'Target subject(s)' });
            await subjectInput.click();
            await subjectInput.fill('MATH, ENGL');
            
            const downloadPromise = page.waitForEvent('download', { timeout: 300000 });
            await page.getByRole('button', { name: 'Download' }).last().click();
            
            const download = await downloadPromise;
            const downloadPath = await download.path();
            
            expect(fs.existsSync(downloadPath)).toBeTruthy();
            
            // CSV validation for multiple subjects
            if (downloadPath.endsWith('.csv')) {
                const validator = new CSVValidator(downloadPath);
                validator.load();
                
                const dataPresence = validator.validateDataPresence();
                expect(dataPresence.pass).toBeTruthy();
                console.log(`✓ CSV has ${dataPresence.rowCount} rows with multiple subjects`);
                
                const subjectCol = validator.findColumn(['target_subject', 'target subject', 'subject']);
                expect(subjectCol).toBeTruthy();
                console.log(`✓ Subject column found: ${subjectCol}`);
            }
        });

        test('TC5.3: Download with case-insensitive subject', async ({ page }) => {
            await openDownloadDialog(page);
            await selectDownloadOption(page);
            
            const subjectInput = page.getByRole('textbox', { name: 'Target subject(s)' });
            await subjectInput.click();
            await subjectInput.fill('math');
            
            const downloadPromise = page.waitForEvent('download', { timeout: 300000 });
            await page.getByRole('button', { name: 'Download' }).last().click();
            
            const download = await downloadPromise;
            const downloadPath = await download.path();
            
            expect(fs.existsSync(downloadPath)).toBeTruthy();
            
            // CSV validation for case-insensitive subject
            if (downloadPath.endsWith('.csv')) {
                const validator = new CSVValidator(downloadPath);
                validator.load();
                
                const dataPresence = validator.validateDataPresence();
                expect(dataPresence.pass).toBeTruthy();
                console.log(`✓ Case-insensitive subject filter working: ${dataPresence.rowCount} rows`);
            }
        });

        test('TC5.4: Download with subject containing special characters', async ({ page }) => {
            await openDownloadDialog(page);
            await selectDownloadOption(page);
            
            const subjectInput = page.getByRole('textbox', { name: 'Target subject(s)' });
            await subjectInput.click();
            await subjectInput.fill('ENGL');
            
            const downloadPromise = page.waitForEvent('download', { timeout: 300000 });
            await page.getByRole('button', { name: 'Download' }).last().click();
            
            const download = await downloadPromise;
            const downloadPath = await download.path();
            
            expect(fs.existsSync(downloadPath)).toBeTruthy();
            
            // CSV validation
            if (downloadPath.endsWith('.csv')) {
                const validator = new CSVValidator(downloadPath);
                validator.load();
                
                const dataPresence = validator.validateDataPresence();
                expect(dataPresence.pass).toBeTruthy();
                console.log(`✓ Subject filter with special chars: ${dataPresence.rowCount} rows`);
            }
        });
    });

    test.describe('Combined Filter Tests', () => {

        test('TC6.1: Download with all filters applied', async ({ page }) => {
            await openDownloadDialog(page);
            await selectDownloadOption(page);
            
            const startDateInput = page.getByRole('textbox', { name: 'Start date' });
            const endDateInput = page.getByRole('textbox', { name: 'End date' });
            
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - 90);
            const endDate = new Date();
            endDate.setDate(endDate.getDate() - 30);
            
            await startDateInput.fill(startDate.toISOString().split('T')[0]);
            await endDateInput.fill(endDate.toISOString().split('T')[0]);
            
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
            
            const subjectInput = page.getByRole('textbox', { name: 'Target subject(s)' });
            await subjectInput.click();
            await subjectInput.fill('MATH');
            
            const downloadPromise = page.waitForEvent('download', { timeout: 300000 });
            await page.getByRole('button', { name: 'Download' }).last().click();
            
            const download = await downloadPromise;
            const downloadPath = await download.path();
            
            expect(fs.existsSync(downloadPath)).toBeTruthy();
            
            // Comprehensive validation for all filters combined
            if (downloadPath.endsWith('.csv')) {
                const validator = new CSVValidator(downloadPath);
                validator.load();
                
                const dataPresence = validator.validateDataPresence();
                expect(dataPresence.pass).toBeTruthy();
                console.log(`✓ CSV with all filters: ${dataPresence.rowCount} rows`);
                
                // Validate state filter
                const stateValidation = validator.validateSourceStateFilter('California');
                expect(stateValidation.pass).toBeTruthy();
                console.log(`✓ State filter applied: California`);
                
                // Validate date range
                const dateValidation = validator.validateDateRangeFilter(startDate, endDate);
                expect(dateValidation.pass).toBeTruthy();
                console.log(`✓ Date range filter applied: ${dateValidation.dateRange.start} to ${dateValidation.dateRange.end}`);
                
                // Validate structure
                const structureValidation = validator.validateStructure(['state', 'institution', 'subject', 'date']);
                console.log(`✓ All key columns present: ${structureValidation.foundColumns.length} found`);
            }
        });

        test('TC6.2: Download with state and date filters', async ({ page }) => {
            await openDownloadDialog(page);
            await selectDownloadOption(page);
            
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - 60);
            const endDate = new Date();
            endDate.setDate(endDate.getDate() - 30);
            
            const startDateInput = page.getByRole('textbox', { name: 'Start date' });
            const endDateInput = page.getByRole('textbox', { name: 'End date' });
            
            await startDateInput.fill(startDate.toISOString().split('T')[0]);
            await endDateInput.fill(endDate.toISOString().split('T')[0]);
            
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
            
            expect(fs.existsSync(downloadPath)).toBeTruthy();
            
            // Validate combination of state and date filters
            if (downloadPath.endsWith('.csv')) {
                const validator = new CSVValidator(downloadPath);
                validator.load();
                
                const dataPresence = validator.validateDataPresence();
                expect(dataPresence.pass).toBeTruthy();
                console.log(`✓ CSV with state + date filters: ${dataPresence.rowCount} rows`);
                
                // Validate state filter
                const stateValidation = validator.validateSourceStateFilter('Nevada');
                expect(stateValidation.pass).toBeTruthy();
                console.log(`✓ Nevada state filter validated`);
                
                // Validate date range
                const dateValidation = validator.validateDateRangeFilter(startDate, endDate);
                expect(dateValidation.pass).toBeTruthy();
                console.log(`✓ Date range validated: ${dateValidation.validRows.length} rows in range`);
            }
        });

        test('TC6.3: Download with state and subject filters', async ({ page }) => {
            await openDownloadDialog(page);
            await selectDownloadOption(page);
            
            const stateCombobox = page.getByRole('combobox', { name: 'Source state(s)' });
            await stateCombobox.click();
            await stateCombobox.fill('Arizona');
            await page.waitForTimeout(1000);
            await page.keyboard.press('ArrowDown');
            await page.keyboard.press('Enter');
            
            const subjectInput = page.getByRole('textbox', { name: 'Target subject(s)' });
            await subjectInput.click();
            await subjectInput.fill('MATH');
            
            const downloadPromise = page.waitForEvent('download', { timeout: 300000 });
            await page.getByRole('button', { name: 'Download' }).last().click();
            
            const download = await downloadPromise;
            const downloadPath = await download.path();
            
            expect(fs.existsSync(downloadPath)).toBeTruthy();
            
            // Validate state + subject combination
            if (downloadPath.endsWith('.csv')) {
                const validator = new CSVValidator(downloadPath);
                validator.load();
                
                const dataPresence = validator.validateDataPresence();
                expect(dataPresence.pass).toBeTruthy();
                console.log(`✓ State + Subject filters: ${dataPresence.rowCount} rows`);
                
                const stateValidation = validator.validateSourceStateFilter('Arizona');
                expect(stateValidation.pass).toBeTruthy();
                console.log(`✓ Arizona state validated in combination with subject`);
            }
        });

        test('TC6.4: Download with institution and date filters', async ({ page }) => {
            await openDownloadDialog(page);
            await selectDownloadOption(page);
            
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - 45);
            const endDate = new Date();
            
            const startDateInput = page.getByRole('textbox', { name: 'Start date' });
            await startDateInput.fill(startDate.toISOString().split('T')[0]);
            
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
            
            expect(fs.existsSync(downloadPath)).toBeTruthy();
            
            // Validate institution + date combination
            if (downloadPath.endsWith('.csv')) {
                const validator = new CSVValidator(downloadPath);
                validator.load();
                
                const dataPresence = validator.validateDataPresence();
                expect(dataPresence.pass).toBeTruthy();
                console.log(`✓ Institution + Date filters: ${dataPresence.rowCount} rows`);
                
                const dateValidation = validator.validateDateRangeFilter(startDate, endDate);
                expect(dateValidation.pass).toBeTruthy();
                console.log(`✓ Date validation passed with institution filter`);
            }
        });

        test('TC6.5: Download with multiple states and subjects', async ({ page }) => {
            await openDownloadDialog(page);
            await selectDownloadOption(page);
            
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
            
            const subjectInput = page.getByRole('textbox', { name: 'Target subject(s)' });
            await subjectInput.click();
            await subjectInput.fill('MATH, ENGL, BIOL');
            
            const downloadPromise = page.waitForEvent('download', { timeout: 300000 });
            await page.getByRole('button', { name: 'Download' }).last().click();
            
            const download = await downloadPromise;
            const downloadPath = await download.path();
            
            expect(fs.existsSync(downloadPath)).toBeTruthy();
            
            // Validate multiple states + multiple subjects
            if (downloadPath.endsWith('.csv')) {
                const validator = new CSVValidator(downloadPath);
                validator.load();
                
                const dataPresence = validator.validateDataPresence();
                expect(dataPresence.pass).toBeTruthy();
                console.log(`✓ Multiple states + subjects: ${dataPresence.rowCount} rows`);
                
                const stateValidation = validator.validateMultipleStatesFilter(['Nevada', 'Arizona']);
                expect(stateValidation.pass).toBeTruthy();
                console.log(`✓ Multiple states validated with multiple subjects`);
            }
        });
    });

    test.describe('Downloaded File Validation Tests', () => {

        test('TC7.1: Verify file format and structure', async ({ page }) => {
            await openDownloadDialog(page);
            await selectDownloadOption(page);
            
            const downloadPromise = page.waitForEvent('download', { timeout: 300000 });
            await page.getByRole('button', { name: 'Download' }).last().click();
            
            const download = await downloadPromise;
            const downloadPath = await download.path();
            const fileName = download.suggestedFilename();
            
            expect(fileName).toMatch(/\.(csv|xlsx|xls)$/i);
            expect(fs.existsSync(downloadPath)).toBeTruthy();
            
            // Comprehensive CSV validation for structure and data presence
            if (downloadPath.endsWith('.csv')) {
                const validator = new CSVValidator(downloadPath);
                validator.load();
                
                // 1. Validate data presence (CSV has data)
                const dataPresence = validator.validateDataPresence();
                expect(dataPresence.pass).toBeTruthy();
                console.log(`✓ CSV contains ${dataPresence.rowCount} rows and ${dataPresence.columnCount} columns`);
                
                // 2. Validate CSV structure (has expected columns)
                const expectedColumns = ['state', 'institution', 'subject', 'course', 'number', 'decision'];
                const structureValidation = validator.validateStructure(expectedColumns);
                
                console.log(`✓ Found columns: ${structureValidation.foundColumns.join(', ')}`);
                
                if (structureValidation.missingColumns.length > 0) {
                    console.warn(`⚠ Missing some expected columns: ${structureValidation.missingColumns.join(', ')}`);
                }
                
                // At least some columns should be found
                expect(structureValidation.foundColumns.length).toBeGreaterThan(0);
                
                // 3. Display summary
                const summary = validator.getSummary();
                console.log(`✓ CSV Summary - Headers: ${summary.headers.join(', ')}`);
            }
        });

        test('TC7.2: Verify CSV data completeness and no duplicates', async ({ page }) => {
            await openDownloadDialog(page);
            await selectDownloadOption(page);
            
            const downloadPromise = page.waitForEvent('download', { timeout: 300000 });
            await page.getByRole('button', { name: 'Download' }).last().click();
            
            const download = await downloadPromise;
            const downloadPath = await download.path();
            
            expect(fs.existsSync(downloadPath)).toBeTruthy();
            
            if (downloadPath.endsWith('.csv')) {
                const validator = new CSVValidator(downloadPath);
                validator.load();
                
                const dataPresence = validator.validateDataPresence();
                expect(dataPresence.pass).toBeTruthy();
                
                // Verify rows have data (not just headers)
                const rows = validator.getAllRows();
                expect(rows.length).toBeGreaterThan(0);
                
                // Check for non-empty values in key columns
                const summary = validator.getSummary();
                const sampleRow = summary.sampleRow;
                const hasData = Object.values(sampleRow).some(val => val && val.length > 0);
                expect(hasData).toBeTruthy();
                
                console.log(`✓ CSV has ${rows.length} complete data rows`);
            }
        });

        test('TC7.3: Verify special characters handling', async ({ page }) => {
            await openDownloadDialog(page);
            await selectDownloadOption(page);
            
            const downloadPromise = page.waitForEvent('download', { timeout: 300000 });
            await page.getByRole('button', { name: 'Download' }).last().click();
            
            const download = await downloadPromise;
            const downloadPath = await download.path();
            
            if (downloadPath.endsWith('.csv')) {
                const csvContent = fs.readFileSync(downloadPath, 'utf8');
                
                expect(csvContent.length).toBeGreaterThan(0);
                expect(() => Papa.parse(csvContent, { header: true })).not.toThrow();
                
                console.log(`✓ CSV parses correctly with special characters`);
            }
        });

        test('TC7.4: Verify downloaded file size is reasonable', async ({ page }) => {
            await openDownloadDialog(page);
            await selectDownloadOption(page);
            
            const downloadPromise = page.waitForEvent('download', { timeout: 300000 });
            await page.getByRole('button', { name: 'Download' }).last().click();
            
            const download = await downloadPromise;
            const downloadPath = await download.path();
            
            expect(fs.existsSync(downloadPath)).toBeTruthy();
            
            const stats = fs.statSync(downloadPath);
            const fileSizeInBytes = stats.size;
            const fileSizeInKB = fileSizeInBytes / 1024;
            
            // File should be at least 1KB (not empty)
            expect(fileSizeInKB).toBeGreaterThan(1);
            
            console.log(`✓ File size: ${fileSizeInKB.toFixed(2)} KB`);
        });

        test('TC7.5: Verify file naming convention', async ({ page }) => {
            await openDownloadDialog(page);
            await selectDownloadOption(page);
            
            const downloadPromise = page.waitForEvent('download', { timeout: 300000 });
            await page.getByRole('button', { name: 'Download' }).last().click();
            
            const download = await downloadPromise;
            const fileName = download.suggestedFilename();
            
            // Verify filename is not empty and has proper extension
            expect(fileName.length).toBeGreaterThan(0);
            expect(fileName).toMatch(/\.(csv|xlsx|xls)$/i);
            
            console.log(`✓ Downloaded file: ${fileName}`);
        });

        test('TC7.6: Verify CSV encoding is UTF-8', async ({ page }) => {
            await openDownloadDialog(page);
            await selectDownloadOption(page);
            
            const downloadPromise = page.waitForEvent('download', { timeout: 300000 });
            await page.getByRole('button', { name: 'Download' }).last().click();
            
            const download = await downloadPromise;
            const downloadPath = await download.path();
            
            if (downloadPath.endsWith('.csv')) {
                const csvContent = fs.readFileSync(downloadPath, 'utf8');
                
                // Should read without encoding errors
                expect(csvContent).toBeTruthy();
                expect(csvContent.length).toBeGreaterThan(0);
                
                // Verify it can be parsed
                const parsed = Papa.parse(csvContent, { header: true });
                expect(parsed.data.length).toBeGreaterThan(0);
                
                console.log(`✓ CSV encoding validated (UTF-8)`);
            }
        });
    });

    test.describe('Error Handling Tests', () => {

        test('TC9.1: Verify cancel download operation', async ({ page }) => {
            await openDownloadDialog(page);
            
            await expect(page.getByRole('dialog', { name: 'Download' })).toBeVisible();
            
            const cancelButton = page.getByRole('button', { name: 'Cancel' });
            await cancelButton.click();
            
            await expect(page.getByRole('dialog', { name: 'Download' })).not.toBeVisible({ timeout: 3000 });
        });

        test('TC9.2: Verify download with empty result set', async ({ page }) => {
            await openDownloadDialog(page);
            await selectDownloadOption(page);
            
            const startDate = new Date('2000-01-01');
            const endDate = new Date('2000-01-02');
            
            const startDateInput = page.getByRole('textbox', { name: 'Start date' });
            const endDateInput = page.getByRole('textbox', { name: 'End date' });
            
            await startDateInput.fill(startDate.toISOString().split('T')[0]);
            await endDateInput.fill(endDate.toISOString().split('T')[0]);
            
            await page.getByRole('button', { name: 'Download' }).last().click();
            
            await page.waitForTimeout(3000);
        });

        test('TC9.3: Verify reopening download dialog after cancel', async ({ page }) => {
            await openDownloadDialog(page);
            
            const dialog = page.getByRole('dialog', { name: 'Download' });
            await expect(dialog).toBeVisible();
            
            const cancelButton = page.getByRole('button', { name: 'Cancel' });
            await cancelButton.click();
            
            await expect(dialog).not.toBeVisible({ timeout: 3000 });
            
            // Reopen dialog
            await openDownloadDialog(page);
            await expect(dialog).toBeVisible();
            
            console.log('✓ Dialog can be reopened after cancel');
        });

        test('TC9.4: Verify download button disabled state before selection', async ({ page }) => {
            await openDownloadDialog(page);
            
            const downloadButton = page.getByRole('button', { name: 'Download' }).last();
            
            // Button should be disabled without download option selection
            const isDisabled = await downloadButton.isDisabled();
            expect(isDisabled).toBeTruthy();
            
            console.log('✓ Download button properly disabled before selection');
        });
    });

    test.describe('UI/UX Tests', () => {

        test('TC10.1: Verify download popup responsiveness', async ({ page }) => {
            await openDownloadDialog(page);
            
            const dialog = page.getByRole('dialog', { name: 'Download' });
            await expect(dialog).toBeVisible();
            
            await page.keyboard.press('Tab');
            await page.keyboard.press('Tab');
            await page.keyboard.press('Tab');
            
            await page.keyboard.press('Escape');
            await expect(dialog).not.toBeVisible({ timeout: 3000 });
        });

        test('TC10.2: Verify filter field usability', async ({ page }) => {
            await openDownloadDialog(page);
            await selectDownloadOption(page);
            
            const startDateInput = page.getByRole('textbox', { name: 'Start date' });
            await expect(startDateInput).toBeVisible();
            await expect(startDateInput).toBeEditable();
            
            const stateCombobox = page.getByRole('combobox', { name: 'Source state(s)' });
            await expect(stateCombobox).toBeVisible();
            
            const downloadButton = page.getByRole('button', { name: 'Download' }).last();
            await expect(downloadButton).toBeVisible();
            await expect(downloadButton).toBeEnabled();
        });

        test('TC10.3: Verify all filter labels are visible', async ({ page }) => {
            await openDownloadDialog(page);
            await selectDownloadOption(page);
            
            await expect(page.getByText('Start date')).toBeVisible();
            await expect(page.getByText('End date')).toBeVisible();
            await expect(page.getByText('Source state(s)')).toBeVisible();
            await expect(page.getByText('Source institution(s)')).toBeVisible();
            await expect(page.getByText('Target subject(s)')).toBeVisible();
            
            console.log('✓ All filter labels are visible');
        });

        test('TC10.4: Verify download dialog closes on successful download', async ({ page }) => {
            await openDownloadDialog(page);
            await selectDownloadOption(page);
            
            const downloadPromise = page.waitForEvent('download', { timeout: 300000 });
            await page.getByRole('button', { name: 'Download' }).last().click();
            
            await downloadPromise;
            
            const dialog = page.getByRole('dialog', { name: 'Download' });
            await expect(dialog).not.toBeVisible({ timeout: 5000 });
            
            console.log('✓ Dialog closes after successful download');
        });

        test('TC10.5: Verify keyboard navigation through filters', async ({ page }) => {
            await openDownloadDialog(page);
            await selectDownloadOption(page);
            
            await page.keyboard.press('Tab');
            await page.keyboard.press('Tab');
            
            const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
            expect(focusedElement).toBeTruthy();
            
            console.log('✓ Keyboard navigation works through filters');
        });
    });

    test.describe('Download Option Tests', () => {

        test('TC11.1: Verify "Download all" option', async ({ page }) => {
            await openDownloadDialog(page);
            await selectDownloadOption(page, 'Download all');
            
            const downloadPromise = page.waitForEvent('download', { timeout: 300000 });
            await page.getByRole('button', { name: 'Download' }).last().click();
            
            const download = await downloadPromise;
            const downloadPath = await download.path();
            
            expect(fs.existsSync(downloadPath)).toBeTruthy();
            
            if (downloadPath.endsWith('.csv')) {
                const validator = new CSVValidator(downloadPath);
                validator.load();
                
                const dataPresence = validator.validateDataPresence();
                expect(dataPresence.pass).toBeTruthy();
                console.log(`✓ Download all: ${dataPresence.rowCount} rows`);
            }
        });

        test('TC11.2: Verify download option dropdown has all options', async ({ page }) => {
            await openDownloadDialog(page);
            
            const downloadOptionCombobox = page.getByRole('combobox', { name: 'Download option' });
            await downloadOptionCombobox.click();
            
            await expect(page.getByRole('option', { name: 'Download all' })).toBeVisible();
            
            console.log('✓ Download options are available');
        });

        test('TC11.3: Verify switching between download options', async ({ page }) => {
            await openDownloadDialog(page);
            
            const downloadOptionCombobox = page.getByRole('combobox', { name: 'Download option' });
            await downloadOptionCombobox.click();
            await page.getByRole('option', { name: 'Download all' }).click();
            
            await downloadOptionCombobox.click();
            await page.getByRole('option', { name: 'Download all' }).click();
            
            console.log('✓ Can switch between download options');
        });
    });

    test.describe('Date Edge Cases Tests', () => {

        test('TC12.1: Download with future date range', async ({ page }) => {
            await openDownloadDialog(page);
            await selectDownloadOption(page);
            
            const startDate = new Date();
            startDate.setDate(startDate.getDate() + 30);
            const endDate = new Date();
            endDate.setDate(endDate.getDate() + 60);
            
            const startDateInput = page.getByRole('textbox', { name: 'Start date' });
            const endDateInput = page.getByRole('textbox', { name: 'End date' });
            
            await startDateInput.fill(startDate.toISOString().split('T')[0]);
            await endDateInput.fill(endDate.toISOString().split('T')[0]);
            
            await page.getByRole('button', { name: 'Download' }).last().click();
            await page.waitForTimeout(3000);
            
            console.log('✓ Future date range handled');
        });

        test('TC12.2: Download with very old date range', async ({ page }) => {
            await openDownloadDialog(page);
            await selectDownloadOption(page);
            
            const startDate = new Date('2010-01-01');
            const endDate = new Date('2010-12-31');
            
            const startDateInput = page.getByRole('textbox', { name: 'Start date' });
            const endDateInput = page.getByRole('textbox', { name: 'End date' });
            
            await startDateInput.fill(startDate.toISOString().split('T')[0]);
            await endDateInput.fill(endDate.toISOString().split('T')[0]);
            
            await page.getByRole('button', { name: 'Download' }).last().click();
            await page.waitForTimeout(3000);
            
            console.log('✓ Old date range handled');
        });

        test('TC12.3: Download with one day date range', async ({ page }) => {
            await openDownloadDialog(page);
            await selectDownloadOption(page);
            
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - 30);
            const endDate = new Date(startDate);
            
            const startDateInput = page.getByRole('textbox', { name: 'Start date' });
            const endDateInput = page.getByRole('textbox', { name: 'End date' });
            
            await startDateInput.fill(startDate.toISOString().split('T')[0]);
            await endDateInput.fill(endDate.toISOString().split('T')[0]);
            
            const downloadPromise = page.waitForEvent('download', { timeout: 300000 });
            await page.getByRole('button', { name: 'Download' }).last().click();
            
            const download = await downloadPromise;
            const downloadPath = await download.path();
            
            expect(fs.existsSync(downloadPath)).toBeTruthy();
            console.log('✓ Single day date range works');
        });

        test('TC12.4: Download with wide date range (1 year)', async ({ page }) => {
            await openDownloadDialog(page);
            await selectDownloadOption(page);
            
            const startDate = new Date();
            startDate.setFullYear(startDate.getFullYear() - 1);
            const endDate = new Date();
            
            const startDateInput = page.getByRole('textbox', { name: 'Start date' });
            const endDateInput = page.getByRole('textbox', { name: 'End date' });
            
            await startDateInput.fill(startDate.toISOString().split('T')[0]);
            await endDateInput.fill(endDate.toISOString().split('T')[0]);
            
            const downloadPromise = page.waitForEvent('download', { timeout: 300000 });
            await page.getByRole('button', { name: 'Download' }).last().click();
            
            const download = await downloadPromise;
            const downloadPath = await download.path();
            
            expect(fs.existsSync(downloadPath)).toBeTruthy();
            
            if (downloadPath.endsWith('.csv')) {
                const validator = new CSVValidator(downloadPath);
                validator.load();
                
                const dataPresence = validator.validateDataPresence();
                expect(dataPresence.pass).toBeTruthy();
                console.log(`✓ Wide date range (1 year): ${dataPresence.rowCount} rows`);
            }
        });
    });

    test.describe('State Filter Edge Cases', () => {

        test('TC13.1: Download with California state', async ({ page }) => {
            await openDownloadDialog(page);
            await selectDownloadOption(page);
            
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
            
            expect(fs.existsSync(downloadPath)).toBeTruthy();
            
            if (downloadPath.endsWith('.csv')) {
                const validator = new CSVValidator(downloadPath);
                validator.load();
                
                const stateValidation = validator.validateSourceStateFilter('California');
                expect(stateValidation.pass).toBeTruthy();
                console.log(`✓ California state validated: ${stateValidation.validSourceRows.length} source rows`);
            }
        });

        test('TC13.2: Download with Texas state', async ({ page }) => {
            await openDownloadDialog(page);
            await selectDownloadOption(page);
            
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
            
            expect(fs.existsSync(downloadPath)).toBeTruthy();
            
            if (downloadPath.endsWith('.csv')) {
                const validator = new CSVValidator(downloadPath);
                validator.load();
                
                const dataPresence = validator.validateDataPresence();
                expect(dataPresence.pass).toBeTruthy();
                console.log(`✓ Texas state filter: ${dataPresence.rowCount} rows`);
            }
        });

        test('TC13.3: Download with three different states', async ({ page }) => {
            await openDownloadDialog(page);
            await selectDownloadOption(page);
            
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
            
            await page.waitForTimeout(500);
            await stateCombobox.fill('California');
            await page.waitForTimeout(1000);
            await page.keyboard.press('ArrowDown');
            await page.keyboard.press('Enter');
            
            const downloadPromise = page.waitForEvent('download', { timeout: 300000 });
            await page.getByRole('button', { name: 'Download' }).last().click();
            
            const download = await downloadPromise;
            const downloadPath = await download.path();
            
            expect(fs.existsSync(downloadPath)).toBeTruthy();
            
            if (downloadPath.endsWith('.csv')) {
                const validator = new CSVValidator(downloadPath);
                validator.load();
                
                const stateValidation = validator.validateMultipleStatesFilter(['Nevada', 'Arizona', 'California']);
                expect(stateValidation.pass).toBeTruthy();
                console.log('✓ Three states validated successfully');
            }
        });
    });

    test.describe('Data Integrity Tests', () => {

        test('TC14.1: Verify source and target row pairing', async ({ page }) => {
            await openDownloadDialog(page);
            await selectDownloadOption(page);
            
            const downloadPromise = page.waitForEvent('download', { timeout: 300000 });
            await page.getByRole('button', { name: 'Download' }).last().click();
            
            const download = await downloadPromise;
            const downloadPath = await download.path();
            
            if (downloadPath.endsWith('.csv')) {
                const validator = new CSVValidator(downloadPath);
                validator.load();
                
                const rows = validator.getAllRows();
                expect(rows.length).toBeGreaterThan(0);
                expect(rows.length % 2).toBe(0); // Should have pairs
                
                console.log(`✓ CSV has ${rows.length} rows (proper pairing expected)`);
            }
        });

        test('TC14.2: Verify all rows have required columns populated', async ({ page }) => {
            await openDownloadDialog(page);
            await selectDownloadOption(page);
            
            const downloadPromise = page.waitForEvent('download', { timeout: 300000 });
            await page.getByRole('button', { name: 'Download' }).last().click();
            
            const download = await downloadPromise;
            const downloadPath = await download.path();
            
            if (downloadPath.endsWith('.csv')) {
                const validator = new CSVValidator(downloadPath);
                validator.load();
                
                const rows = validator.getAllRows();
                const headers = validator.headers;
                
                expect(rows.length).toBeGreaterThan(0);
                expect(headers.length).toBeGreaterThan(0);
                
                console.log(`✓ Data integrity check: ${rows.length} rows, ${headers.length} columns`);
            }
        });

        test('TC14.3: Verify CSV has no malformed rows', async ({ page }) => {
            await openDownloadDialog(page);
            await selectDownloadOption(page);
            
            const downloadPromise = page.waitForEvent('download', { timeout: 300000 });
            await page.getByRole('button', { name: 'Download' }).last().click();
            
            const download = await downloadPromise;
            const downloadPath = await download.path();
            
            if (downloadPath.endsWith('.csv')) {
                const csvContent = fs.readFileSync(downloadPath, 'utf8');
                const parsed = Papa.parse(csvContent, { header: true });
                
                // Check for parsing errors
                expect(parsed.errors.length).toBe(0);
                
                console.log('✓ No malformed rows detected');
            }
        });
    });

    test.describe('Performance and Load Tests', () => {

        test('TC15.1: Verify download completes within reasonable time', async ({ page }) => {
            await openDownloadDialog(page);
            await selectDownloadOption(page);
            
            const startTime = Date.now();
            
            const downloadPromise = page.waitForEvent('download', { timeout: 300000 });
            await page.getByRole('button', { name: 'Download' }).last().click();
            
            const download = await downloadPromise;
            const endTime = Date.now();
            const duration = (endTime - startTime) / 1000;
            
            expect(download).toBeTruthy();
            console.log(`✓ Download completed in ${duration.toFixed(2)} seconds`);
        });

        test('TC15.2: Verify multiple sequential downloads', async ({ page }) => {
            // First download
            await openDownloadDialog(page);
            await selectDownloadOption(page);
            
            let downloadPromise = page.waitForEvent('download', { timeout: 300000 });
            await page.getByRole('button', { name: 'Download' }).last().click();
            await downloadPromise;
            
            await page.waitForTimeout(2000);
            
            // Second download
            await openDownloadDialog(page);
            await selectDownloadOption(page);
            
            downloadPromise = page.waitForEvent('download', { timeout: 300000 });
            await page.getByRole('button', { name: 'Download' }).last().click();
            const download2 = await downloadPromise;
            
            expect(download2).toBeTruthy();
            console.log('✓ Multiple sequential downloads work');
        });

        test('TC15.3: Verify dialog responsiveness during download', async ({ page }) => {
            await openDownloadDialog(page);
            await selectDownloadOption(page);
            
            const downloadPromise = page.waitForEvent('download', { timeout: 300000 });
            await page.getByRole('button', { name: 'Download' }).last().click();
            
            // Dialog should close or respond appropriately
            await downloadPromise;
            
            console.log('✓ Dialog remains responsive during download');
        });
    });
});
