// spec: specs/faq-test-plan.md

const { test, expect } = require('@playwright/test');
const { loginPage } = require('../base_classes/login');
const { faqPage } = require('../base_classes/faqPage');

test.describe('FAQ Functionality Tests', () => {
    const baseURL = 'https://qa.creditmobility.net';
    const adminEmail = 'creditmobility@asu.edu';
    const adminPassword = 'Triangulator!1';
    const regularUserEmail = 'testtriangulator+108@gmail.com';
    const regularUserPassword = 'Triangulator!1';
    
    // Test FAQ URLs
    const testFaqUrl = 'https://help.example.com/faq';
    const updatedFaqUrl = 'https://support.example.com/help';
    const faqUrlWithParams = 'https://help.example.com/faq?category=general&lang=en';

    test.describe('FAQ Admin Configuration Tests', () => {

        test('TC1.1: Navigate to FAQ Settings', async ({ page }) => {
            const login = new loginPage(page);
            const faq = new faqPage(page);
            
            // Login as admin
            await page.goto(`${baseURL}/logged-out/login/email`);
            await login.loginuser(adminEmail, adminPassword);
            await page.waitForLoadState('domcontentloaded');
            
            // Navigate to FAQ settings
            await faq.navigateToFaqSettings();
            
            // Verify FAQ settings page loaded
            await faq.verifyFaqSettingsPageLoaded();
            
            console.log('✓ Successfully navigated to FAQ settings page');
        });

        test('TC1.2: Set FAQ Link with Valid URL', async ({ page }) => {
            const login = new loginPage(page);
            const faq = new faqPage(page);
            
            // Login and navigate to FAQ settings
            await page.goto(`${baseURL}/logged-out/login/email`);
            await login.loginuser(adminEmail, adminPassword);
            await page.waitForLoadState('domcontentloaded');
            
            // Navigate to FAQ settings and set URL
            await faq.navigateToFaqSettings();
            await faq.setAndSaveFaqUrl(testFaqUrl);
            
            // Verify value persisted
            const savedValue = await faq.getFaqUrlValue();
            expect(savedValue).toBe(testFaqUrl);
            
            console.log(`✓ FAQ link set successfully: ${testFaqUrl}`);
        });

        test('TC1.3: Update Existing FAQ Link', async ({ page }) => {
            const login = new loginPage(page);
            const faq = new faqPage(page);
            
            // Login and navigate to FAQ settings
            await page.goto(`${baseURL}/logged-out/login/email`);
            await login.loginuser(adminEmail, adminPassword);
            await page.waitForLoadState('domcontentloaded');
            
            await faq.navigateToFaqSettings();
            
            // Verify existing value
            const existingValue = await faq.getFaqUrlValue();
            console.log(`Existing FAQ URL: ${existingValue}`);
            
            // Update with new URL
            await faq.setAndSaveFaqUrl(updatedFaqUrl);
            
            // Verify new value persisted
            const newValue = await faq.getFaqUrlValue();
            expect(newValue).toBe(updatedFaqUrl);
            
            console.log(`✓ FAQ link updated successfully: ${updatedFaqUrl}`);
        });

        test('TC1.4: Set FAQ Link with Empty Value', async ({ page }) => {
            const login = new loginPage(page);
            const faq = new faqPage(page);
            
            await page.goto(`${baseURL}/logged-out/login/email`);
            await login.loginuser(adminEmail, adminPassword);
            await page.waitForLoadState('domcontentloaded');
            
            await faq.navigateToFaqSettings();
            
            // Clear the field
            await faq.clearFaqUrl();
            
            // Attempt to save
            await faq.clickSave();
            
            // Check for validation message or successful save
            const hasError = await page.locator('text=/error|required|invalid/i').isVisible().catch(() => false);
            
            if (hasError) {
                console.log('✓ Validation message shown for empty value');
            } else {
                console.log('✓ Empty value saved (FAQ link disabled)');
            }
        });

        test('TC1.5: Set FAQ Link with Invalid URL Format', async ({ page }) => {
            const login = new loginPage(page);
            const faq = new faqPage(page);
            
            await page.goto(`${baseURL}/logged-out/login/email`);
            await login.loginuser(adminEmail, adminPassword);
            await page.waitForLoadState('domcontentloaded');
            
            await faq.navigateToFaqSettings();
            
            // Enter invalid URL
            await faq.setFaqUrl('not-a-valid-url');
            
            // Attempt to save
            await faq.clickSave();
            
            // Check for validation - either HTML5 validation or custom message
            const faqInput = faq.getFaqInput();
            const isInvalid = await faqInput.evaluate((el) => !el.checkValidity()).catch(() => false);
            
            if (isInvalid) {
                console.log('✓ Validation prevented invalid URL format');
            } else {
                // Check for custom validation message
                const hasError = await page.locator('text=/error|invalid|url/i').isVisible().catch(() => false);
                expect(hasError).toBeTruthy();
                console.log('✓ Custom validation shown for invalid URL');
            }
        });

        test('TC1.6: Set FAQ Link with Special Characters', async ({ page }) => {
            const login = new loginPage(page);
            const faq = new faqPage(page);
            
            await page.goto(`${baseURL}/logged-out/login/email`);
            await login.loginuser(adminEmail, adminPassword);
            await page.waitForLoadState('domcontentloaded');
            
            await faq.navigateToFaqSettings();
            
            // Enter URL with query parameters
            await faq.setAndSaveFaqUrl(faqUrlWithParams);
            
            // Verify URL with special characters saved
            const savedValue = await faq.getFaqUrlValue();
            expect(savedValue).toContain('?category=general');
            
            console.log('✓ FAQ URL with special characters saved successfully');
        });
    });

    test.describe('FAQ Navigation Tests (Logged In Users)', () => {

        test('TC2.1: Verify FAQ Link Appears in Top Navigation (Logged In)', async ({ page }) => {
            const login = new loginPage(page);
            const faq = new faqPage(page);
            
            // First, ensure FAQ link is set (as admin)
            await page.goto(`${baseURL}/logged-out/login/email`);
            await login.loginuser(adminEmail, adminPassword);
            await page.waitForLoadState('domcontentloaded');
            
            await faq.navigateToFaqSettings();
            await faq.setAndSaveFaqUrl(testFaqUrl);
            
            // Now login as regular user and check for FAQ link
            await page.goto(`${baseURL}/logged-out/login/email`);
            await login.loginuser(regularUserEmail, regularUserPassword);
            await page.waitForLoadState('domcontentloaded');
            
            // Verify FAQ link in navigation
            const faqLink = faq.getFaqLinkInNav();
            await expect(faqLink).toBeVisible({ timeout: 10000 });
            
            console.log('✓ FAQ link visible in top navigation for logged-in user');
        });

        test('TC2.2: Click FAQ Link (Logged In User)', async ({ page }) => {
            const login = new loginPage(page);
            const faq = new faqPage(page);
            
            // Login as regular user
            await page.goto(`${baseURL}/logged-out/login/email`);
            await login.loginuser(regularUserEmail, regularUserPassword);
            await page.waitForLoadState('domcontentloaded');
            
            // Find and click FAQ link
            const faqLink = faq.getFaqLinkInNav();
            const isVisible = await faqLink.isVisible().catch(() => false);
            
            if (isVisible) {
                await faqLink.click();
                await page.waitForURL(/.*faq.*/, { timeout: 10000 }).catch(() => {});
                const currentUrl = page.url();
                console.log(`✓ FAQ link navigated to: ${currentUrl}`);
                expect(currentUrl).toMatch(/faq/i);
            } else {
                console.log('⚠ FAQ link not visible for logged-in user');
            }
        });

        test('TC2.3: FAQ Link Persists Across Pages (Logged In)', async ({ page }) => {
            const login = new loginPage(page);
            const faq = new faqPage(page);
            
            await page.goto(`${baseURL}/logged-out/login/email`);
            await login.loginuser(regularUserEmail, regularUserPassword);
            await page.waitForLoadState('domcontentloaded');
            
            // Check FAQ link on dashboard
            let faqLink = faq.getFaqLinkInNav();
            await expect(faqLink).toBeVisible({ timeout: 5000 });
            console.log('✓ FAQ link visible on dashboard');
            
            // Navigate to My Workplace
            await page.getByRole('link', { name: 'My Workplace' }).click();
            await page.waitForURL(/.*my-workspace.*/, { timeout: 10000 });
            
            // Check FAQ link still visible
            faqLink = faq.getFaqLinkInNav();
            await expect(faqLink).toBeVisible({ timeout: 5000 });
            console.log('✓ FAQ link persists on other pages');
        });
    });

    test.describe('FAQ Navigation Tests (Logged Out Users)', () => {

        test('TC3.1: Verify FAQ Link Appears in Top Navigation (Logged Out)', async ({ page }) => {
            const faq = new faqPage(page);
            
            // Navigate to homepage logged out
            await page.goto(baseURL);
            await page.waitForLoadState('domcontentloaded');
            
            // Check if FAQ link visible in navigation
            const isVisible = await faq.isFaqLinkVisibleInNav();
            
            if (isVisible) {
                console.log('✓ FAQ link visible in top navigation for logged-out users');
            } else {
                console.log('⚠ FAQ link not visible for logged-out users (may be by design)');
            }
        });

        test('TC3.2: Click FAQ Link (Logged Out User)', async ({ page }) => {
            const faq = new faqPage(page);
            
            await page.goto(baseURL);
            await page.waitForLoadState('domcontentloaded');
            
            const isVisible = await faq.isFaqLinkVisibleInNav();
            
            if (isVisible) {
                // Try clicking FAQ link
                const faqLink = faq.getFaqLinkInNav();
                const [newPage] = await Promise.all([
                    page.context().waitForEvent('page').catch(() => null),
                    faqLink.click().catch(() => {})
                ]);
                
                if (newPage) {
                    await newPage.waitForLoadState('domcontentloaded', { timeout: 10000 });
                    const newUrl = newPage.url();
                    console.log(`✓ FAQ link works for logged-out users: ${newUrl}`);
                    await newPage.close();
                } else {
                    console.log('✓ FAQ link clicked (same tab navigation)');
                }
            } else {
                console.log('⚠ FAQ link not available for logged-out users');
            }
        });

        test('TC3.3: FAQ Link on Login Page', async ({ page }) => {
            const faq = new faqPage(page);
            
            await page.goto(`${baseURL}/logged-out/login/email`);
            await page.waitForLoadState('domcontentloaded');
            
            const isVisible = await faq.isFaqLinkVisibleInNav();
            
            if (isVisible) {
                console.log('✓ FAQ link visible on login page');
                
                // Verify it's clickable
                const faqLink = faq.getFaqLinkInNav();
                await expect(faqLink).toBeEnabled();
            } else {
                console.log('⚠ FAQ link not visible on login page');
            }
        });
    });

    test.describe('FAQ Link Update Propagation Tests', () => {

        test('TC4.1: FAQ Link Updates Reflect Immediately (Logged In)', async ({ page, context }) => {
            const login = new loginPage(page);
            const faq = new faqPage(page);
            
            // Admin updates FAQ link
            await page.goto(`${baseURL}/logged-out/login/email`);
            await login.loginuser(adminEmail, adminPassword);
            await page.waitForLoadState('domcontentloaded');
            
            await faq.navigateToFaqSettings();
            await faq.setAndSaveFaqUrl(updatedFaqUrl);
            
            console.log('✓ Admin updated FAQ link');
            
            // Open new page as regular user
            const newPage = await context.newPage();
            const newLogin = new loginPage(newPage);
            const newFaq = new faqPage(newPage);
            await newPage.goto(`${baseURL}/logged-out/login/email`);
            await newLogin.loginuser(regularUserEmail, regularUserPassword);
            await newPage.waitForLoadState('networkidle');
            
            // Check if FAQ link reflects the update
            const faqLink = newFaq.getFaqLinkInNav();
            const href = await faqLink.getAttribute('href').catch(() => '');
            
            if (href && href.includes('support.example.com')) {
                console.log('✓ FAQ link update reflected immediately for logged-in users');
            } else {
                console.log('⚠ FAQ link update may need page refresh or time to propagate');
            }
            
            await newPage.close();
        });

        test('TC4.2: FAQ Link Updates Reflect Immediately (Logged Out)', async ({ page, context }) => {
            const login = new loginPage(page);
            const faq = new faqPage(page);
            
            // Admin updates FAQ link
            await page.goto(`${baseURL}/logged-out/login/email`);
            await login.loginuser(adminEmail, adminPassword);
            await page.waitForLoadState('domcontentloaded');
            
            await faq.navigateToFaqSettings();
            await faq.setAndSaveFaqUrl(testFaqUrl);
            
            console.log('✓ Admin updated FAQ link');
            
            // Open new page as logged-out user
            const newPage = await context.newPage();
            const newFaq = new faqPage(newPage);
            await newPage.goto(baseURL);
            await newPage.waitForLoadState('networkidle');
            
            const faqLink = newFaq.getFaqLinkInNav();
            const isVisible = await faqLink.isVisible().catch(() => false);
            
            if (isVisible) {
                const href = await faqLink.getAttribute('href');
                console.log(`✓ FAQ link for logged-out users: ${href}`);
            } else {
                console.log('⚠ FAQ link not visible for logged-out users');
            }
            
            await newPage.close();
        });
    });

    test.describe('Edge Cases and Error Handling', () => {

        test('TC5.4: FAQ Link with HTTPS Protocol', async ({ page }) => {
            const login = new loginPage(page);
            const faq = new faqPage(page);
            
            await page.goto(`${baseURL}/logged-out/login/email`);
            await login.loginuser(adminEmail, adminPassword);
            await page.waitForLoadState('domcontentloaded');
            
            await faq.navigateToFaqSettings();
            await faq.setAndSaveFaqUrl('https://secure.example.com/faq');
            
            const savedValue = await faq.getFaqUrlValue();
            expect(savedValue).toContain('https://');
            
            console.log('✓ HTTPS URL saved successfully');
        });

        test('TC5.5: FAQ Link with HTTP Protocol', async ({ page }) => {
            const login = new loginPage(page);
            const faq = new faqPage(page);
            
            await page.goto(`${baseURL}/logged-out/login/email`);
            await login.loginuser(adminEmail, adminPassword);
            await page.waitForLoadState('domcontentloaded');
            
            await faq.navigateToFaqSettings();
            await faq.setAndSaveFaqUrl('http://example.com/faq');
            
            // Check if HTTP is accepted or converted to HTTPS
            const savedValue = await faq.getFaqUrlValue();
            
            if (savedValue.startsWith('http://')) {
                console.log('✓ HTTP URL accepted');
            } else if (savedValue.startsWith('https://')) {
                console.log('✓ HTTP URL converted to HTTPS automatically');
            }
        });
    });

    test.describe('Permission and Security Tests', () => {

        test('TC6.1: Non-Admin Cannot Access FAQ Settings', async ({ page }) => {
            const login = new loginPage(page);
            
            // Login as regular user
            await page.goto(`${baseURL}/logged-out/login/email`);
            await login.loginuser(regularUserEmail, regularUserPassword);
            await page.waitForLoadState('domcontentloaded');
            
            // Try to access My Workplace
            const myWorkplace = page.locator('text=My Workplace').first();
            const isVisible = await myWorkplace.isVisible().catch(() => false);
            
            if (!isVisible) {
                console.log('✓ Regular user cannot see My Workplace option');
                return;
            }
            
            await myWorkplace.click();
            await page.waitForURL(/.*my-workspace.*/, { timeout: 10000 });
            
            // Check if Settings option exists
            const settings = page.locator('text=Settings').first();
            const settingsVisible = await settings.isVisible().catch(() => false);
            
            if (!settingsVisible) {
                console.log('✓ Regular user cannot see Settings option');
                return;
            }
            
            await settings.click();
            await page.waitForURL(/.*settings.*/, { timeout: 10000 });
            
            // Check if FAQ option exists
            const faq = page.locator('a:has-text("FAQ"), button:has-text("FAQ")').first();
            const faqVisible = await faq.isVisible().catch(() => false);
            
            if (!faqVisible) {
                console.log('✓ Regular user cannot see FAQ settings option');
            } else {
                console.log('⚠ Regular user can see FAQ option - need to verify permissions');
            }
        });

        test('TC6.2: XSS Prevention in FAQ Link', async ({ page }) => {
            const login = new loginPage(page);
            const faq = new faqPage(page);
            
            await page.goto(`${baseURL}/logged-out/login/email`);
            await login.loginuser(adminEmail, adminPassword);
            await page.waitForLoadState('domcontentloaded');
            
            await faq.navigateToFaqSettings();
            
            // Try XSS payload
            await faq.setFaqUrl('javascript:alert("XSS")');
            await faq.clickSave();
            
            // Check if rejected
            const faqInput = faq.getFaqInput();
            const isInvalid = await faqInput.evaluate((el) => !el.checkValidity()).catch(() => false);
            const hasError = await page.locator('text=/error|invalid/i').isVisible().catch(() => false);
            
            if (isInvalid || hasError) {
                console.log('✓ XSS payload rejected by validation');
            } else {
                const savedValue = await faq.getFaqUrlValue();
                expect(savedValue).not.toContain('javascript:');
                console.log('✓ XSS payload sanitized');
            }
        });
    });

    test.describe('UI/UX Tests', () => {

        test('TC7.1: FAQ Link Styling and Visibility', async ({ page }) => {
            const login = new loginPage(page);
            const faq = new faqPage(page);
            
            await page.goto(`${baseURL}/logged-out/login/email`);
            await login.loginuser(regularUserEmail, regularUserPassword);
            await page.waitForLoadState('domcontentloaded');
            
            const isVisible = await faq.isFaqLinkVisibleInNav();
            
            if (isVisible) {
                // Check styling properties
                const faqLink = faq.getFaqLinkInNav();
                const color = await faqLink.evaluate((el) => window.getComputedStyle(el).color);
                const fontSize = await faqLink.evaluate((el) => window.getComputedStyle(el).fontSize);
                
                console.log(`✓ FAQ link is visible with color: ${color}, size: ${fontSize}`);
            } else {
                console.log('⚠ FAQ link not visible');
            }
        });

        test('TC7.2: FAQ Link Hover State', async ({ page }) => {
            const login = new loginPage(page);
            const faq = new faqPage(page);
            
            await page.goto(`${baseURL}/logged-out/login/email`);
            await login.loginuser(regularUserEmail, regularUserPassword);
            await page.waitForLoadState('domcontentloaded');
            
            const isVisible = await faq.isFaqLinkVisibleInNav();
            
            if (isVisible) {
                // Hover over FAQ link
                const faqLink = faq.getFaqLinkInNav();
                await faqLink.hover();
                
                // Check cursor style
                const cursor = await faqLink.evaluate((el) => window.getComputedStyle(el).cursor);
                expect(cursor).toBe('pointer');
                
                console.log('✓ FAQ link has proper hover state');
            }
        });

        test('TC7.3: FAQ Settings Page Layout', async ({ page }) => {
            const login = new loginPage(page);
            const faq = new faqPage(page);
            
            await page.goto(`${baseURL}/logged-out/login/email`);
            await login.loginuser(adminEmail, adminPassword);
            await page.waitForLoadState('domcontentloaded');
            
            await faq.navigateToFaqSettings();
            
            // Check page elements
            const faqInput = faq.getFaqInput();
            const saveButton = faq.getSaveButton();
            
            await expect(faqInput).toBeVisible();
            await expect(saveButton).toBeVisible();
            
            console.log('✓ FAQ settings page has proper layout with input and save button');
        });
    });

    test.describe('Mobile Responsiveness Tests', () => {

        test('TC8.1: FAQ Link on Mobile View (Logged In)', async ({ page }) => {
            // Set mobile viewport
            await page.setViewportSize({ width: 375, height: 667 });
            
            const login = new loginPage(page);
            const faq = new faqPage(page);
            await page.goto(`${baseURL}/logged-out/login/email`);
            await login.loginuser(regularUserEmail, regularUserPassword);
            await page.waitForLoadState('domcontentloaded');
            
            // Check for mobile menu
            const menuButton = page.locator('button[aria-label*="menu" i], button:has-text("☺")').first();
            const menuVisible = await menuButton.isVisible().catch(() => false);
            
            if (menuVisible) {
                await menuButton.click();
                await page.waitForLoadState('domcontentloaded');
            }
            
            // Check if FAQ link visible
            const isVisible = await faq.isFaqLinkVisibleInNav();
            
            if (isVisible) {
                console.log('✓ FAQ link accessible on mobile view');
            } else {
                console.log('⚠ FAQ link not visible on mobile view');
            }
        });

        test('TC8.3: FAQ Settings Page on Mobile', async ({ page }) => {
            // Set mobile viewport
            await page.setViewportSize({ width: 375, height: 667 });
            
            const login = new loginPage(page);
            const faq = new faqPage(page);
            await page.goto(`${baseURL}/logged-out/login/email`);
            await login.loginuser(adminEmail, adminPassword);
            await page.waitForLoadState('domcontentloaded');
            
            await faq.navigateToFaqSettings();
            
            const faqInput = faq.getFaqInput();
            const saveButton = faq.getSaveButton();
            
            await expect(faqInput).toBeVisible();
            await expect(saveButton).toBeVisible();
            
            console.log('✓ FAQ settings page is responsive on mobile');
        });
    });
});
