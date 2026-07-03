import { test, expect } from '../fixtures/test';
import { LoginPage } from '../pages/LoginPage';
import { SuggestionsPage } from '../pages/SuggestionsPage';
import { BoostRequestPage } from '../pages/BoostRequestPage';

const creds = {
    pimaadmin: process.env.REGULAR_USER_EMAIL ?? 'testtriangulator+108@gmail.com',
    instadmin: process.env.INST_ADMIN_EMAIL ?? 'testtriangulator+109@gmail.com',
    instadmin2: process.env.INST_ADMIN2_EMAIL ?? 'testtriangulator+11@gmail.com',
    admin: process.env.ADMIN_EMAIL ?? 'creditmobility@asu.edu',
    password: process.env.REGULAR_USER_PASSWORD ?? '#TransferTri1',
};

async function loginAsPimaAdmin(browser: import('@playwright/test').Browser) {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('');
    const login = new LoginPage(page);
    await login.loginUser(creds.pimaadmin, creds.password);
    const suggestions = new SuggestionsPage(page);
    const boost = new BoostRequestPage(page);
    return { page, login, suggestions, boost };
}

async function loginAsInstAdmin(browser: import('@playwright/test').Browser) {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('');
    const login = new LoginPage(page);
    await login.loginUser(creds.instadmin, creds.password);
    const suggestions = new SuggestionsPage(page);
    const boost = new BoostRequestPage(page);
    return { page, login, suggestions, boost };
}

async function loginAsInstAdmin2(browser: import('@playwright/test').Browser) {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('');
    const login = new LoginPage(page);
    await login.loginUser(creds.instadmin2, creds.password);
    const suggestions = new SuggestionsPage(page);
    const boost = new BoostRequestPage(page);
    return { page, login, suggestions, boost };
}

async function loginAsAdmin(browser: import('@playwright/test').Browser) {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('');
    const login = new LoginPage(page);
    await login.loginUser(creds.admin, creds.password);
    const suggestions = new SuggestionsPage(page);
    const boost = new BoostRequestPage(page);
    return { page, login, suggestions, boost };
}

// ─── SUITE 1: BOOST SUGGESTIONS PAGE ─────────────────────────────────────────

test.describe('Boost Suggestions – Landing Page', () => {
    let page: import('@playwright/test').Page;
    let suggestions: SuggestionsPage;
    let boost: BoostRequestPage;

    test.beforeEach(async ({ browser }) => {
        ({ page, suggestions, boost } = await loginAsPimaAdmin(browser));
        await boost.navigateToBoostSuggestions();
    });

    test('Page heading is "Boost Suggestions"', async () => {
        await expect(page.getByRole('heading', { name: 'Boost Suggestions', level: 1 })).toBeVisible();
    });

    test('Description paragraph is visible', async () => {
        await expect(page.getByText(/Actively generate suggestions based on similarities/i)).toBeVisible();
    });

    test('Three boost cards are visible: Partner Institution, Improve Rules, Find Course', async () => {
        await suggestions.validateBoostPageCards();
    });

    test('Request log table has expected columns', async () => {
        await suggestions.validateBoostRequestLogColumns();
    });

    test('Request log contains at least one row', async () => {
        await boost.validateRequestLogHasRows();
    });

    test('Request log Type column is visible', async () => {
        await boost.validateRequestLogTypeColumn();
    });

    test('Pagination controls are visible on request log', async () => {
        await suggestions.validatePaginationVisible();
    });

    test('Refresh button is visible on request log', async () => {
        await expect(page.getByRole('button', { name: /Refresh/i }).first()).toBeVisible();
    });
});

// ─── SUITE 2: PARTNER INSTITUTION BOOST FORM ──────────────────────────────────

test.describe('Boost Suggestions – Partner Institution Form', () => {
    let page: import('@playwright/test').Page;
    let boost: BoostRequestPage;

    test.beforeEach(async ({ page: fixturePage, loginPage, boostRequestPage }) => {
        page = fixturePage;
        boost = boostRequestPage;
        await page.goto('');
        await loginPage.loginUser(creds.pimaadmin, creds.password);
        await boost.navigateToBoostSuggestions();
        await boost.clickPartnerInstitutionCard();
        await page.waitForTimeout(2000);
    });

    test('Form heading shows "Partner Institution"', async () => {
        await expect(page.getByText('Partner Institution').first()).toBeVisible();
    });

    test('Description contains "Allow the Triangulator"', async () => {
        await expect(page.getByText(/Allow the Triangulator to assist your institution/i).first()).toBeVisible();
    });

    test('Back button is visible', async () => {
        await expect(page.getByRole('button', { name: /Go back/i }).first()).toBeVisible();
    });

    test('Step 1: Source Institution Level combobox is visible', async () => {
        await expect(page.getByRole('combobox', { name: /Source Institution Level/i }).first()).toBeVisible();
    });

    test('Step 2: Source State combobox is disabled initially', async () => {
        const combo = page.getByRole('combobox', { name: /Source State/i }).first();
        await expect(combo).toBeDisabled();
    });

    test('Step 3: Source Institution combobox is disabled initially', async () => {
        const combo = page.getByRole('combobox', { name: /^Source Institution$/i }).first();
        await expect(combo).toBeDisabled();
    });

    test('Step 4: Minimum score textbox is disabled initially', async () => {
        const input = page.getByRole('textbox', { name: /Minimum score/i }).first();
        await expect(input).toBeDisabled();
    });

    test('Step 5: Maximum matches combobox is visible', async () => {
        await expect(page.getByRole('combobox', { name: /Maximum matches/i }).first()).toBeVisible();
    });

    test('Step 6: Request Name textbox is disabled initially', async () => {
        const input = page.getByRole('textbox', { name: /Request Name/i }).first();
        await expect(input).toBeDisabled();
    });

    test('More options: Assign Suggestion button is visible', async () => {
        await expect(page.getByRole('button', { name: /Assign Suggestion/i }).first()).toBeVisible();
    });

    test('More options: Add Description button is visible', async () => {
        await expect(page.getByRole('button', { name: /Add Description/i }).first()).toBeVisible();
    });

    test('Cancel button is visible', async () => {
        await expect(page.getByRole('button', { name: /Cancel/i }).first()).toBeVisible();
    });

    test('Submit button is disabled when form is incomplete', async () => {
        const submitBtn = page.getByRole('button', { name: /Submit/i }).first();
        await expect(submitBtn).toBeDisabled();
    });

    test('Submit button tooltip shows "Please complete all steps" on hover', async () => {
        await boost.validateSubmitDisabledTooltip();
    });

    test('Can fill and submit Partner Institution boost request', async () => {
        await boost.selectSourceInstitutionLevel('At least 2 but less than 4');
        await page.waitForTimeout(500);
        await boost.selectSourceState('Arizona');
        await page.waitForTimeout(500);
        await boost.selectSourceInstitution('Central Arizona College');
        await page.waitForTimeout(500);
        await boost.fillMinimumScore('68');
        await boost.selectMaximumMatches('5');
        await boost.fillRequestName('autotest' + boost.generateUniqueAlphaNumeric(6));
        await boost.submitBoostRequest();
        await expect(page.getByText('Processing').first()).toBeVisible({ timeout: 15000 });
    });
});

// ─── SUITE 3: IMPROVE RULES BOOST FORM ─────────────────────────────────────────

test.describe('Boost Suggestions – Improve Rules Form', () => {
    let page: import('@playwright/test').Page;
    let boost: BoostRequestPage;

    test.beforeEach(async ({ browser }) => {
        ({ page, boost } = await loginAsPimaAdmin(browser));
        await boost.navigateToBoostSuggestions();
        await boost.clickImproveRulesCard();
    });

    test('Form heading shows "Improve Rules"', async () => {
        await expect(page.getByText('Improve Rules').first()).toBeVisible();
    });

    test('Back button is visible', async () => {
        await expect(page.getByRole('button', { name: /Go back/i }).first()).toBeVisible();
    });

    test('See an example button is visible', async () => {
        await expect(page.getByRole('button', { name: /See an example/i }).first()).toBeVisible();
    });

    test.skip('Can fill and submit Improve Rules boost request', async () => {
        await boost.fillImproveRulesForm('ARC', '205', '60', 'autoimprove' + boost.generateUniqueAlphaNumeric(6));
        await boost.submitBoostRequest();
        await expect(page.getByText('Processing').first()).toBeVisible({ timeout: 15000 });
    });
});

// ─── SUITE 4: FIND COURSE BOOST FORM ───────────────────────────────────────────

test.describe('Boost Suggestions – Find Course Form', () => {
    let page: import('@playwright/test').Page;
    let boost: BoostRequestPage;

    test.beforeEach(async ({ browser }) => {
        ({ page, boost } = await loginAsPimaAdmin(browser));
        await boost.navigateToBoostSuggestions();
        await boost.clickFindCourseCard();
    });

    test('Form heading shows "Find a Course"', async () => {
        await expect(page.getByText(/Find a Course/i).first()).toBeVisible();
    });

    test('Back button is visible', async () => {
        await expect(page.getByRole('button', { name: /Go back/i }).first()).toBeVisible();
    });

    test('Can fill and submit Find Course boost request', async () => {
        await boost.fillFindCourseForm('At least 2 but less than 4 years', 'Arizona', 'Central Arizona College', 'MAT', '151', '60', 'autofind' + boost.generateUniqueAlphaNumeric(6));
        await boost.submitBoostRequest();
        await expect(page.getByText('Processing').first()).toBeVisible({ timeout: 15000 });
    });
});

// ─── SUITE 5: NEW SUGGESTIONS – BOOST TYPE FILTERS ─────────────────────────────

test.describe('New Suggestions – All Suggestion Type Filters', () => {
    let page: import('@playwright/test').Page;
    let suggestions: SuggestionsPage;

    test.beforeEach(async ({ browser }) => {
        ({ page, suggestions } = await loginAsPimaAdmin(browser));
        await suggestions.goToNewSuggestions();
    });

    const boostTypes = [
        'Partner institution boost',
        'Improve rules boost',
        'Find course boost',
    ];

    for (const type of boostTypes) {
        test(`${type} filter: chip is shown after applying`, async () => {
            await suggestions.applyFilterBySuggestionType(type);
            await suggestions.validateActiveFilterChipContains(type.split(' ')[0]);
        });
    }

    test('Clear all filters removes active chips', async () => {
        await suggestions.applyFilterBySuggestionType('Partner institution boost');
        await suggestions.validateActiveFilterChipContains('Partner');
        await suggestions.clearAllFiltersViaChip();
        await expect(page.getByRole('button', { name: /clear all filters/i })).toHaveCount(0);
    });
});

// ─── SUITE 6: BOOST REQUEST LOG – ROW INTERACTIONS ─────────────────────────────

test.describe('Boost Suggestions – Request Log Row Interactions', () => {
    let page: import('@playwright/test').Page;
    let suggestions: SuggestionsPage;
    let boost: BoostRequestPage;

    test.beforeEach(async ({ browser }) => {
        ({ page, suggestions, boost } = await loginAsPimaAdmin(browser));
        await boost.navigateToBoostSuggestions();
    });

    test('Clicking a request log name navigates to suggestion detail', async () => {
        const firstRow = page.getByRole('rowgroup').first().getByRole('row').first();
        const nameCell = firstRow.getByRole('gridcell', { name: 'Name' }).getByRole('button').first();
        if (await nameCell.count() > 0) {
            await nameCell.click();
            await page.waitForLoadState('networkidle');
            await expect(page.getByRole('button', { name: /Back/i }).first()).toBeVisible({ timeout: 10000 });
        } else {
            test.skip(true, 'No request log rows available');
        }
    });

    test('Request log status column shows valid status values', async () => {
        const rows = page.getByRole('rowgroup').first().getByRole('row');
        const count = await rows.count();
        if (count === 0) {
            test.skip(true, 'No request log rows available');
            return;
        }
        const statusCell = rows.first().getByRole('gridcell', { name: 'Status' });
        const text = ((await statusCell.textContent()) ?? '').trim();
        expect(text.length).toBeGreaterThan(0);
    });

    test('Request log shows numeric suggestion counts', async () => {
        const rows = page.getByRole('rowgroup').first().getByRole('row');
        const count = await rows.count();
        if (count === 0) {
            test.skip(true, 'No request log rows available');
            return;
        }
        const cells = rows.first().getByRole('gridcell');
        const suggestionsCell = cells.nth(4);
        const text = ((await suggestionsCell.textContent()) ?? '').trim();
        expect(parseInt(text)).toBeGreaterThanOrEqual(0);
    });
});

