const { expect } = require('@playwright/test');

class BoostRequest {

  async autoName(page, name, score, requestName, assign) {
    await page.locator(`:nth-child(${score}) > .pb-8 > .gap-2 > .rounded-md > .flex-1 > .justify-center`).click();
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Backspace');
    await page.keyboard.type('50');

    await page.locator(`:nth-child(${requestName}) > .pb-8 > .gap-2 > .rounded-md > .flex-1 > .justify-center`).click();
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Backspace');
    await page.keyboard.type('Daniel Random 2' + name);

    await page.locator(`.bg-white > :nth-child(${assign})`).click();
  }

  generateUniqueAlphaNumeric(limit) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length: limit }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  }

  async submitRequest(page, name) {
    await page.locator(':nth-child(2) > .relative > .opacity-0').click();
    await page.locator(':nth-child(2) > div.w-full > .relative > .opacity-0').click();
    await page.locator(':nth-child(3) > .relative > .opacity-0 > .inline-block').click();
    await expect(page.locator('.justify-between > div.overflow-hidden > .overflow-hidden'))
      .toHaveText('Request name: Daniel Random 2' + name);
    await expect(page.locator('text=assigned')).toBeVisible();
  }

  async submitRequestUnassigned(page, name) {
    await page.locator('.grid-flow-col > .p-0').click();
    await page.locator(':nth-child(2) > div.w-full > .relative > .opacity-0').click();
    await page.locator(':nth-child(3) > .relative > .opacity-0 > .inline-block').click();
    await expect(page.locator('.justify-between > div.overflow-hidden > .overflow-hidden'))
      .toHaveText('Request name: Daniel Random 2' + name);
    await expect(page.locator('text=New Suggestions')).toBeVisible();
  }

  async submitRequestUnassignedFindCourse(page, name) {
    await page.locator(':nth-child(2) > div.w-full > .relative > .opacity-0').click();
    await page.locator(':nth-child(3) > .relative > .opacity-0 > .inline-block').click();
    await expect(page.locator('.justify-between > div.overflow-hidden > .overflow-hidden'))
      .toHaveText('Request name: Daniel Random 2' + name);
    await expect(page.locator('text=New Suggestions')).toBeVisible();
  }

  async selectRandomItemFromComboBox(page, comboBoxSelector, itemList, num) {
    await page.locator(comboBoxSelector).click();
    await page.locator(itemList).waitFor({ state: 'visible' });
    const randomIndex = Math.floor(Math.random() * num);
    for (let i = 0; i <= randomIndex; i++) {
      await page.keyboard.press('ArrowDown');
    }
    await page.waitForTimeout(1000);
    await page.keyboard.press('Enter');
  }

  async disabledSubmitButton(page) {
    await page.hover('.gap-3 > :nth-child(2) > div.cursor-not-allowed');
    await expect(page.locator('text=Please complete all steps')).toBeVisible();
    await page.hover('body', { position: { x: 0, y: 0 } });
  }

  async navigateToPartnerBoost(page) {
    await expect(page.locator(':nth-child(4) > .text-grey-600 > .text-center')).toHaveText('My Triangulator');
    await page.locator(':nth-child(4) > .text-grey-600 > .text-center').click();
    await expect(page.locator('.flex > .font-semibold')).toHaveText('New Suggestions');
    await page.locator('.relative > .opacity-0').click();
    await expect(page.locator(':nth-child(5) > .list-none > .w-full')).toHaveText(' Boost Suggestions ');
    await page.locator(':nth-child(5) > .list-none > .w-full > .flex-1').click();
    await expect(page.locator('.w-full.gap-4 > .flex-col > .flex > .font-semibold')).toHaveText('Boost Suggestions');
    await expect(page.locator('.items-stretch > :nth-child(1) > .flex')).toBeVisible();
    await expect(page.locator(':nth-child(1) > .flex > .text-lg')).toHaveText('Partner Institution');
    await page.locator('.items-stretch > :nth-child(1) > .flex').click();
    await expect(page.locator('.text-2xl')).toHaveText('Partner Institution');
    await expect(page.locator('.pb-2 > .text-secondary')).toContainText('Allow the Triangulator');
  }

  async navigateToImproveRule(page) {
    await expect(page.locator(':nth-child(4) > .text-grey-600 > .text-center')).toHaveText('My Triangulator');
    await page.locator(':nth-child(4) > .text-grey-600 > .text-center').click();
    await expect(page.locator('.flex > .font-semibold')).toHaveText('New Suggestions');
    await page.locator('.relative > .opacity-0').click();
    await page.locator(':nth-child(5) > .list-none > .w-full > .flex-1').click();
    await expect(page.locator('.w-full.gap-4 > .flex-col > .flex > .font-semibold')).toHaveText('Boost Suggestions');
    await expect(page.locator('.items-stretch > :nth-child(2) > .flex')).toBeEnabled();
    await expect(page.locator(':nth-child(2) > .flex')).toContainText('Improve Rules');
    await page.locator('.items-stretch > :nth-child(2) > .flex').click();
    await expect(page.locator('.pb-2 > .text-secondary')).toContainText('Allow the Triangulator to assist your institution');
    await page.locator('.underline').click();
    await expect(page.locator('.bg-white > .flex > .text-2xl')).toHaveText('Improve Rules Example');
    await page.locator('.absolute > div > .rounded-full > .w-6 > path').click();
  }

  async navigateToFindCourse(page) {
    await expect(page.locator(':nth-child(4) > .text-grey-600 > .text-center')).toHaveText('My Triangulator');
    await page.locator(':nth-child(4) > .text-grey-600 > .text-center').click();
    await expect(page.locator('.flex > .font-semibold')).toHaveText('New Suggestions');
    await page.locator('.relative > .opacity-0').click();
    await page.locator(':nth-child(5) > .list-none > .w-full > .flex-1').click();
    await expect(page.locator('.w-full.gap-4 > .flex-col > .flex > .font-semibold')).toHaveText('Boost Suggestions');
    await expect(page.locator('.items-stretch > :nth-child(3) > .flex')).toBeEnabled();
    await expect(page.locator(':nth-child(3) > .flex > .text-lg')).toHaveText('Find Course');
    await page.locator('#uuid-c3c86810-30c1-4d8d-b805-5be01eca2a12').click();
    await expect(page.locator('text=Find a Course')).toBeVisible();
    await expect(page.locator('.w-full.justify-start > .text-secondary')).toContainText("Allow the Triangulator");
    await page.locator('.underline').click();
    await expect(page.locator('.bg-white > .flex > .text-2xl')).toHaveText('Find Course Example');
    await page.locator('.absolute > [aria-hidden="false"] > .rounded-full > .w-6 > path').click();
  }

  async selectRandomInstitution(page, num) {
    const dropdown = `:nth-child(${num}) > .pb-8 > .timeline-input > #dropdown-trigger > .rounded-md >.flex-1`;
    await page.locator(dropdown).click();
    await page.waitForTimeout(5000); // You may replace this with a smarter wait
    const randomIndex = Math.floor(Math.random() * 5);
    for (let i = 0; i <= randomIndex; i++) {
      await page.locator(`:nth-child(${num}) > .pb-8 > .timeline-input > #dropdown-trigger > .rounded-md`).press('ArrowDown');
    }
    await page.locator(`:nth-child(${num}) > .pb-8 > .timeline-input > #dropdown-trigger > .rounded-md`).press('Enter');
  }

}

module.exports = BoostRequest;
