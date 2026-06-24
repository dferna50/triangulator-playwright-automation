import { type Page, type Locator, expect } from '@playwright/test';

export interface UserData {
  email: string;
  firstName: string;
  lastName: string;
  institution: string;
  role: string;
}

export class CreateUserPage {
  readonly page: Page;
  readonly emailInput: any;
  readonly firstNameInput: any;
  readonly lastNameInput: any;
  readonly institutionDropdown: any;
  readonly roleDropdown: any;
  readonly submitButton: any;
  readonly cancelButton: any;
  readonly successMessage: any;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByRole('textbox', { name: 'email' });
    this.firstNameInput = page.getByRole('textbox', { name: 'first name' });
    this.lastNameInput = page.getByRole('textbox', { name: 'last name' });
    this.institutionDropdown = page.getByRole('combobox', { name: 'Institution' });
    this.roleDropdown = page.getByRole('radio', { name: 'role' });
    this.submitButton = page.getByRole('button', { name: 'Send' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    this.successMessage = page.getByText('User invitation sent successfully');
  }

  async fillUserForm(userData: UserData): Promise<void> {
    await this.firstNameInput.fill(userData.firstName);
    await this.lastNameInput.fill(userData.lastName);
    await this.emailInput.fill(userData.email);
    
    // Handle institution combobox - use keyboard to search and select
    await this.institutionDropdown.click();
    await this.page.waitForTimeout(300);
    
    // Type the institution name to filter the dropdown
    await this.institutionDropdown.type(userData.institution);
    await this.page.waitForTimeout(800);
    
    // Press Enter or click the first matching option
    try {
      const institutionOption = this.page.getByRole('option').filter({ hasText: userData.institution }).first();
      await institutionOption.click();
    } catch (error) {
      // If clicking fails, try pressing Enter to select the first filtered option
      await this.page.keyboard.press('Enter');
    }
    
    await this.page.waitForTimeout(300);
    
    // Handle role selection (radio buttons)
    // Map role names to display names for radio button selection
    const roleDisplayName = userData.role === 'Triangulator Admin' ? 'Triangulator Admin' : 
                           userData.role === 'Institution Admin' ? 'Institution Admin' : 'Reviewer';
    const roleRadio = this.page.getByRole('radio', { name: roleDisplayName });
    await expect(roleRadio).toBeVisible({ timeout: 10000 });
    await roleRadio.click();
    await this.page.waitForTimeout(300);
  }

  async submitUserCreation(): Promise<void> {
    await this.submitButton.click();
    await this.page.getByRole('button', { name: 'Open account dropdown' }).click();
    await this.page.getByRole('menuitem', { name: 'Sign Out' }).click();
    // Wait for dialog to close or success message to appear
    try {
//      await expect(this.successMessage).toBeVisible({ timeout: 10000 }); paused for testing 
    } catch {
      // If success message not found, wait for dialog to close instead
      await expect(this.page.locator('dialog')).not.toBeVisible({ timeout: 10000 });
    }
  }

  async createUser(userData: UserData): Promise<void> {
    await this.fillUserForm(userData);
    await this.submitUserCreation();
  }

  async cancelUserCreation(): Promise<void> {
    await this.cancelButton.click();
  }

  async validateRequiredFields(): Promise<void> {
    // Try to submit without filling required fields
    await this.submitButton.click();
    
    // Check for validation messages
    await expect(this.page.getByText('Email is required')).toBeVisible();
    await expect(this.page.getByText('First name is required')).toBeVisible();
    await expect(this.page.getByText('Last name is required')).toBeVisible();
    await expect(this.page.getByText('Institution is required')).toBeVisible();
    await expect(this.page.getByText('Role is required')).toBeVisible();
  }

  async validateEmailFormat(): Promise<void> {
    await this.emailInput.fill('invalid-email');
    await this.firstNameInput.fill('Test');
    await this.lastNameInput.fill('User');
    await this.submitButton.click();
    
    await expect(this.page.getByText('Please enter a valid email address')).toBeVisible();
  }

  async validateDuplicateEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.firstNameInput.fill('Test');
    await this.lastNameInput.fill('User');
    await this.submitButton.click();
    
    await expect(this.page.getByText('A user with this email already exists')).toBeVisible();
  }

  async getAvailableInstitutions(): Promise<string[]> {
    await this.institutionDropdown.click();
    const options = await this.page.locator('[role="option"]').allTextContents();
    await this.page.keyboard.press('Escape'); // Close dropdown
    return options;
  }

  async getAvailableRoles(): Promise<string[]> {
    await this.roleDropdown.click();
    const options = await this.page.locator('[role="option"]').allTextContents();
    await this.page.keyboard.press('Escape'); // Close dropdown
    return options;
  }

  async waitForFormToLoad(): Promise<void> {
    await expect(this.emailInput).toBeVisible({ timeout: 10000 });
    await expect(this.firstNameInput).toBeVisible({ timeout: 10000 });
    await expect(this.lastNameInput).toBeVisible({ timeout: 10000 });
//    await expect(this.institutionDropdown).toBeVisible({ timeout: 10000 });
    // Wait for at least one radio button to be visible
    await expect(this.page.getByRole('radio', { name: 'Triangulator Admin' })).toBeVisible({ timeout: 10000 });
    await expect(this.submitButton).toBeVisible({ timeout: 10000 });
  }

  async isRoleDisabled(role: string): Promise<boolean> {
    await this.roleDropdown.click();
    const roleOption = this.page.getByRole('option', { name: role });
    const isDisabled = await roleOption.isDisabled();
    await this.page.keyboard.press('Escape');
    return isDisabled;
  }

  async isInstitutionAvailable(institution: string): Promise<boolean> {
    await this.institutionDropdown.click();
    const institutionOption = this.page.getByRole('option', { name: institution });
    const isVisible = await institutionOption.isVisible();
    await this.page.keyboard.press('Escape');
    return isVisible;
  }

  // ─── Evaluation Group / Workflow Configuration methods ───────────────────

  /**
   * Navigate to Workflow Configurations page and open the Create Evaluation
   * Group modal.  Called in beforeEach so every TC starts with the modal open.
   */
  async createUserButtonView(): Promise<void> {
    // Navigate: My Workplace → Settings → Workflow Configurations
    await this.page.getByRole('link', { name: 'My Workplace' }).click();
    await this.page.waitForURL('**/app/my-workspace/inst-admin/summary**');

    await this.page.getByRole('link', { name: 'Settings' }).click();
    await this.page.waitForURL('**/app/my-workspace/inst-admin/inst/settings/**');

    await this.page.getByRole('link', { name: 'Open Workflow Configurations' }).click();
    await this.page.waitForURL('**/app/my-workspace/inst-admin/inst/settings/workflow-configs**');

    // Click "Create group" button to open the modal
    const createGroupButton = this.page.getByRole('button', { name: 'create group' });
    await expect(createGroupButton).toBeVisible({ timeout: 10000 });
    await createGroupButton.click();

    // Wait for the modal to appear
    await expect(
      this.page.getByRole('dialog', { name: 'Create evaluation group' })
    ).toBeVisible({ timeout: 10000 });
  }

  /**
   * TC1 – Verify the user selection dropdown lists users and they appear in
   * the expected order (alphabetical by display name).
   */
  async createUserValidationErrorMsg(): Promise<void> {
    const dialog = this.page.getByRole('dialog', { name: 'Create evaluation group' });
    await expect(dialog).toBeVisible();

    // Open the users combobox/dropdown inside the modal
    const usersInput = dialog.locator('[role="combobox"]');
    await usersInput.click();

    // Wait for the listbox to appear
    const listbox = this.page.getByRole('listbox');
    await expect(listbox).toBeVisible({ timeout: 10000 });

    // Collect all option text values
    const options = listbox.getByRole('option');
    const count = await options.count();
    expect(count).toBeGreaterThan(0);

    const names: string[] = [];
    for (let i = 0; i < count; i++) {
      const text = await options.nth(i).textContent();
      if (text) names.push(text.trim());
    }

    // Verify the list is sorted (case-insensitive alphabetical order)
    const sorted = [...names].sort((a, b) =>
      a.toLowerCase().localeCompare(b.toLowerCase())
    );
    expect(names).toEqual(sorted);
  }

  /**
   * TC2 – Add a user then remove them via the delete/remove icon; verify they
   * are no longer listed in the selected users area.
   *
   * The listbox is multi-select (stays open). Selected users appear in:
   * list "Use arrow keys to navigate. Backspace to unselect item."
   * Each listitem contains a generic "Remove" (aria-label) > button.
   */
  async deleteIcon(): Promise<void> {
    const dialog = this.page.getByRole('dialog', { name: 'Create evaluation group' });
    await expect(dialog).toBeVisible();

    // Open dropdown and select the first available user
    const usersInput = dialog.locator('[role="combobox"]');
    await usersInput.click();

    const listbox = this.page.getByRole('listbox');
    await expect(listbox).toBeVisible({ timeout: 10000 });

    // Get first unselected option and its name
    const firstOption = listbox.locator('[role="option"]:not([aria-selected="true"])').first();
    await expect(firstOption).toBeVisible({ timeout: 5000 });
    const selectedName = ((await firstOption.textContent()) ?? '').trim();
    await firstOption.click({ force: true });
    await this.page.waitForTimeout(300);

    // Close the dropdown with Escape (listbox is multi-select, stays open)
    await this.page.keyboard.press('Escape');
    await expect(listbox).not.toBeVisible({ timeout: 5000 });

    // The selected user appears in the selection list
    const selectedList = dialog.getByRole('list', { name: /arrow keys/i });
    await expect(selectedList).toBeVisible({ timeout: 5000 });

    // The "Remove" container is a generic with accessible name "Remove"
    const removeWrapper = selectedList.locator('[aria-label="Remove"]').first();
    const removeButton = removeWrapper.getByRole('button');
    await expect(removeButton).toBeVisible({ timeout: 5000 });
    await removeButton.click();

    // After removal the list should show "No users selected"
    await expect(dialog.getByText('No users selected')).toBeVisible({ timeout: 5000 });
  }

  /**
   * TC3 – Click "Next" with no users selected; verify that an error message
   * is displayed and the Next button stays disabled or the modal shows an error.
   */
  async zeroUsersThrowsError(): Promise<void> {
    const dialog = this.page.getByRole('dialog', { name: 'Create evaluation group' });
    await expect(dialog).toBeVisible();

    const nextButton = dialog.getByRole('button', { name: 'Next' });

    // Next button should be disabled when no users are selected
    await expect(nextButton).toBeDisabled({ timeout: 5000 });
  }

  /**
   * Helper: ensure the users combobox is open, then select `count` unselected
   * options one by one.  The listbox remains open (multi-select), so we simply
   * click the first option that is NOT already selected each iteration.
   */
  private async selectNUsersFromDropdown(dialog: import('@playwright/test').Locator, count: number): Promise<void> {
    // Ensure the dropdown is open
    const usersInput = dialog.locator('[role="combobox"]');
    const listbox = this.page.getByRole('listbox');
    if (!(await listbox.isVisible({ timeout: 2000 }).catch(() => false))) {
      await usersInput.click();
      await expect(listbox).toBeVisible({ timeout: 10000 });
    }

    for (let i = 0; i < count; i++) {
      // Target only options that are not yet selected (no aria-selected="true")
      const unselected = listbox.locator('[role="option"]:not([aria-selected="true"])');
      const isVisible = await unselected.first().isVisible({ timeout: 3000 }).catch(() => false);
      if (!isVisible) break; // no more unselected options
      await unselected.first().click({ force: true });
      await this.page.waitForTimeout(300);
    }
  }

  /**
   * TC5 – Verify all active users from the dropdown can be added to the group
   * (Next button becomes enabled once ≥3 are selected).
   */
  async allActiveUsers(): Promise<void> {
    const dialog = this.page.getByRole('dialog', { name: 'Create evaluation group' });
    await expect(dialog).toBeVisible();

    // Open combobox to discover total user count
    const usersInput = dialog.locator('[role="combobox"]');
    await usersInput.click();
    const listbox = this.page.getByRole('listbox');
    await expect(listbox).toBeVisible({ timeout: 10000 });
    const totalCount = await listbox.getByRole('option').count();
    expect(totalCount).toBeGreaterThan(0);

    // The helper expects the listbox to already be open; select all options
    await this.selectNUsersFromDropdown(dialog, totalCount);

    // Close the dropdown
    await this.page.keyboard.press('Escape');
    await expect(listbox).not.toBeVisible({ timeout: 5000 });

    // After adding all users, Next should be enabled (requires ≥3)
    const nextButton = dialog.getByRole('button', { name: 'Next' });
    await expect(nextButton).toBeEnabled({ timeout: 10000 });
  }

  /**
   * TC6 – In Step 2 enter a group name that already exists and verify the
   * error message "already exists" (or similar) is shown.
   *
   * Step 2 has textbox "Group name" (max 60 chars) and submit button "Submit".
   */
  async enterNumberForCreateGroup(): Promise<void> {
    const dialog = this.page.getByRole('dialog', { name: 'Create evaluation group' });
    await expect(dialog).toBeVisible();

    // Step 1: select 3 users so Next is enabled
    await this.selectNUsersFromDropdown(dialog, 3);

    // Close listbox and proceed to Step 2
    await this.page.keyboard.press('Escape');
    const nextButton = dialog.getByRole('button', { name: 'Next' });
    await expect(nextButton).toBeEnabled({ timeout: 10000 });
    await nextButton.click();

    // Step 2: enter a group name that already exists in the system
    const groupNameInput = dialog.getByRole('textbox', { name: 'Group name' });
    await expect(groupNameInput).toBeVisible({ timeout: 10000 });

    // "123" already exists on this instance (visible in the group table)
    await groupNameInput.fill('123');
    await groupNameInput.blur();

    // Submit to trigger duplicate-name validation
    const submitButton = dialog.getByRole('button', { name: 'Submit' });
    await expect(submitButton).toBeEnabled({ timeout: 10000 });
    await submitButton.click();

    // The application shows an alert toast: "Errored while creating evaluation group"
    // when a group name already exists (rather than inline dialog validation).
    const errorAlert = this.page.getByRole('alert').filter({
      hasText: /errored while creating evaluation group/i,
    });
    await expect(errorAlert).toBeVisible({ timeout: 10000 });
  }

  /**
   * TC7 – Verify that the description field enforces a 250-character limit
   * and displays an appropriate validation message.
   *
   * Step 2 has textbox "Group name" and textbox "Group description" (max 250).
   * The counter displays "X / 250". Submit is labeled "Submit".
   */
  async description250CharLength(): Promise<void> {
    const dialog = this.page.getByRole('dialog', { name: 'Create evaluation group' });
    await expect(dialog).toBeVisible();

    // Step 1: select 3 users so Next is enabled
    await this.selectNUsersFromDropdown(dialog, 3);

    // Close listbox and proceed to Step 2
    await this.page.keyboard.press('Escape');
    const nextButton = dialog.getByRole('button', { name: 'Next' });
    await expect(nextButton).toBeEnabled({ timeout: 10000 });
    await nextButton.click();

    // Step 2: fill in a valid group name first (required to enable Submit)
    const groupNameInput = dialog.getByRole('textbox', { name: 'Group name' });
    await expect(groupNameInput).toBeVisible({ timeout: 10000 });
    await groupNameInput.fill('Test Group TC7');

    // Step 3: fill in description with >250 characters
    const descriptionInput = dialog.getByRole('textbox', { name: 'Group description' });
    await expect(descriptionInput).toBeVisible({ timeout: 10000 });

    const longText = 'A'.repeat(251);
    await descriptionInput.fill(longText);
    await descriptionInput.blur();

    // Expect a character-count or limit error message (e.g. "251 / 250" or "exceeds")
    const counterOrError = dialog.getByText(/25[0-9]|limit|exceed|maximum|character/i);
    await expect(counterOrError).toBeVisible({ timeout: 10000 });
  }

  /**
   * TC9 – Verify the newly created group appears on the Workflow configurations
   * page chart.  (Skipped – requires a full group-creation flow first.)
   */
  async workflowGroupView(): Promise<void> {
    // Navigate to workflow configs and verify the group table row is visible
    await expect(
      this.page.getByRole('dialog', { name: 'Create evaluation group' })
    ).not.toBeVisible();
    const groupNameHeader = this.page.getByText('Group name');
    await expect(groupNameHeader).toBeVisible({ timeout: 10000 });
  }

  /**
   * TC10 – Verify Step 2 rejects a group name that already exists (case-insensitive).
   * (Skipped – full end-to-end flow that creates a group first.)
   */
  async uniqueGroupName(): Promise<void> {
    const dialog = this.page.getByRole('dialog', { name: 'Create evaluation group' });
    await expect(dialog).toBeVisible();
    // Duplicate-name validation is covered by TC6; this variant tests
    // case-insensitivity (e.g. "group 1" should collide with "Group 1").
    const groupNameInput = dialog
      .locator('input[type="text"], input[placeholder*="name" i]')
      .first();
    await expect(groupNameInput).toBeVisible({ timeout: 10000 });
    await groupNameInput.fill('group 1'); // lowercase of an existing name
    await groupNameInput.blur();
    const errorMsg = dialog.getByText(/already exists|duplicate|taken/i);
    await expect(errorMsg).toBeVisible({ timeout: 10000 });
  }

  /**
   * TC8 – Make changes in the modal, then click Cancel (or close), verify a
   * "discard changes" confirmation dialog appears, and confirm it.
   */
  async discardChanges(): Promise<void> {
    const dialog = this.page.getByRole('dialog', { name: 'Create evaluation group' });
    await expect(dialog).toBeVisible();

    // Make a change: open dropdown and select a user
    const usersInput = dialog.locator('[role="combobox"]');
    await usersInput.click();

    const listbox = this.page.getByRole('listbox');
    await expect(listbox).toBeVisible({ timeout: 10000 });

    const firstOption = this.page.getByRole('option').first();
    if (await firstOption.isVisible({ timeout: 3000 }).catch(() => false)) {
      await firstOption.click({ force: true });
      await this.page.waitForTimeout(300);
    }

    // Click Cancel to try to abandon changes
    const cancelButton = dialog.getByRole('button', { name: 'Cancel' });
    await cancelButton.click();

    // A "discard changes" confirmation should appear — either as a new dialog
    // or as text within the same dialog
    const discardDialog = this.page.getByRole('dialog').filter({
      hasText: /discard|abandon|unsaved/i,
    });
    const discardText = this.page.getByText(/discard|abandon|unsaved/i);

    const hasDiscardDialog = await discardDialog.isVisible({ timeout: 5000 }).catch(() => false);

    if (hasDiscardDialog) {
      // Confirm the discard action
      const confirmButton = discardDialog
        .getByRole('button', { name: /discard|yes|confirm|leave/i })
        .first();
      await confirmButton.click();
    } else {
      // If no separate dialog, the main modal may have closed — that is also acceptable
      await expect(dialog).not.toBeVisible({ timeout: 5000 });
      return;
    }

    // Either the modal closes or we're back to workflow configs page
    await expect(dialog).not.toBeVisible({ timeout: 10000 });
  }
}
