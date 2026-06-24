import { type Page, expect } from '@playwright/test';

export class BoostRequestPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  generateUniqueAlphaNumeric(limit: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length: limit }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  }

  // ─── Navigation ─────────────────────────────────────────────────────────

  async navigateToBoostSuggestions(): Promise<void> {
    await this.page.goto('/app/my-triangulator/requests/boost-suggestions');
    await this.page.waitForLoadState('networkidle');
    await expect(this.page.getByRole('heading', { name: 'Boost Suggestions', level: 1 })).toBeVisible({ timeout: 15000 });
  }

  async clickPartnerInstitutionCard(): Promise<void> {
    await this.page.getByRole('link', { name: 'Partner Institution' }).first().click();
    await this.page.waitForURL(/partner-institution/, { timeout: 15000 });
    await expect(this.page.getByText(/Partner Institution/i).first()).toBeVisible({ timeout: 10000 });
  }

  async clickImproveRulesCard(): Promise<void> {
    await this.page.getByRole('link', { name: 'Improve Rules' }).first().click();
    await this.page.waitForURL(/improve-rules/, { timeout: 15000 });
    await expect(this.page.getByText(/Improve Rules/i).first()).toBeVisible({ timeout: 10000 });
  }

  async clickFindCourseCard(): Promise<void> {
    await this.page.getByRole('link', { name: 'Find Course' }).first().click();
    await this.page.waitForURL(/find-course/, { timeout: 15000 });
    await expect(this.page.getByText(/Find a? Course/i).first()).toBeVisible({ timeout: 10000 });
  }

  // ─── Partner Institution Form ─────────────────────────────────────────────

  async selectSourceInstitutionLevel(level: string): Promise<void> {
    const combo = this.page.getByRole('combobox', { name: 'Source Institution Level', exact: true });
    await combo.click();
    await this.page.waitForTimeout(500);
    await this.page.getByRole('option', { name: level }).first().click();
    await this.page.waitForTimeout(300);
  }

  async selectSourceState(state: string): Promise<void> {
    const combo = this.page.getByRole('combobox', { name: 'Source State', exact: true });
    await combo.click();
    await this.page.waitForTimeout(500);
    await this.page.getByRole('option', { name: state }).first().click();
    await this.page.waitForTimeout(300);
  }

  async selectSourceInstitution(institution: string): Promise<void> {
    const combo = this.page.getByRole('combobox', { name: 'Source Institution', exact: true });
    await combo.click();
    await this.page.waitForTimeout(1000);
    await this.page.getByRole('option', { name: institution }).first().click();
    await this.page.waitForTimeout(300);
  }

  async fillMinimumScore(score: string): Promise<void> {
    const input = this.page.getByRole('textbox', { name: /Minimum score/i }).first();
    await expect(input).toBeEnabled({ timeout: 10000 });
    await input.fill(score);
  }

  async selectMaximumMatches(matches: string): Promise<void> {
    const combo = this.page.getByRole('combobox', { name: /Maximum matches/i }).first();
    await combo.click();
    await this.page.waitForTimeout(500);
    await this.page.getByRole('option', { name: matches }).first().click();
    await this.page.waitForTimeout(500);
  }

  async fillRequestName(name: string): Promise<void> {
    const input = this.page.getByRole('textbox', { name: /Request Name/i }).first();
    await expect(input).toBeEnabled({ timeout: 10000 });
    await input.fill(name);
  }

  async submitBoostRequest(): Promise<void> {
    const submitBtn = this.page.getByRole('button', { name: /Submit/i }).first();
    await submitBtn.click();
    await this.page.waitForLoadState('networkidle');
  }

  async cancelBoostRequest(): Promise<void> {
    const cancelBtn = this.page.getByRole('button', { name: /Cancel/i }).first();
    await cancelBtn.click();
    await this.page.waitForLoadState('networkidle');
  }

  async validateSubmitDisabledTooltip(): Promise<void> {
    await expect(this.page.locator('[aria-label*="Please complete all steps"]').first()).toBeVisible();
  }

  // ─── Request Log ──────────────────────────────────────────────────────────

  async validateRequestLogHasRows(): Promise<void> {
    const rows = this.page.getByRole('rowgroup').first().getByRole('row');
    expect(await rows.count()).toBeGreaterThan(0);
  }

  async validateRequestLogTypeColumn(): Promise<void> {
    const typeHeader = this.page.getByRole('columnheader', { name: 'Type' }).first();
    await expect(typeHeader).toBeVisible();
  }

  async openRequestLogRowByName(name: string): Promise<void> {
    const rowBtn = this.page.getByRole('button', { name }).first();
    await rowBtn.click();
    await this.page.waitForLoadState('networkidle');
  }

  // ─── Improve Rules Form ───────────────────────────────────────────────────

  async selectYourSubject(subject: string): Promise<void> {
    const combo = this.page.getByRole('combobox', { name: 'Your subject', exact: true });
    await combo.click();
    await this.page.waitForTimeout(500);
    await this.page.getByRole('option', { name: subject, exact: true }).click();
    await this.page.waitForTimeout(300);
  }

  async selectYourNumber(number: string): Promise<void> {
    const combo = this.page.getByRole('combobox', { name: 'Your number', exact: true });
    await combo.click();
    await this.page.waitForTimeout(500);
    await this.page.getByRole('option', { name: number, exact: true }).click();
    await this.page.waitForTimeout(300);
  }

  async fillImproveRulesForm(subject: string, number: string, minScore: string, requestName: string): Promise<void> {
    await this.selectYourSubject(subject);
    await this.selectYourNumber(number);
    const scoreInput = this.page.getByRole('textbox', { name: 'Minimum score', exact: true });
    await expect(scoreInput).toBeEnabled({ timeout: 10000 });
    await scoreInput.fill(minScore);
    const nameInput = this.page.getByRole('textbox', { name: 'Request Name', exact: true });
    await expect(nameInput).toBeEnabled({ timeout: 10000 });
    await nameInput.fill(requestName);
  }

  // ─── Find Course Form ─────────────────────────────────────────────────────

  async fillFindCourseForm(level: string, state: string, institution: string, subject: string, number: string, minScore: string, requestName: string): Promise<void> {
    await this.selectSourceInstitutionLevel(level);
    await this.selectSourceState(state);
    await this.selectSourceInstitution(institution);
    await this.page.getByRole('textbox', { name: 'Enter subject', exact: true }).fill(subject);
    await this.page.getByRole('textbox', { name: 'Enter course number', exact: true }).fill(number);
    await this.page.waitForTimeout(300);
    const scoreInput = this.page.getByRole('textbox', { name: 'Minimum score', exact: true });
    await expect(scoreInput).toBeEnabled({ timeout: 10000 });
    await scoreInput.fill(minScore);
    const nameInput = this.page.getByRole('textbox', { name: 'Request Name', exact: true });
    await expect(nameInput).toBeEnabled({ timeout: 10000 });
    await nameInput.fill(requestName);
  }
}
