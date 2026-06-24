import { type Page, type Locator, expect } from '@playwright/test';

export class InstitutionSettingsPage {
    readonly page: Page;

    // Navigation
    readonly myWorkplaceLink: Locator;
    readonly settingsLink: Locator;
    readonly usersHeading: Locator;
    readonly allLink: Locator;
    readonly requestsLink: Locator;
    readonly generalContactLink: Locator;
    readonly institutionHeading: Locator;
    readonly summaryLink: Locator;
    readonly profileLink: Locator;
    readonly ipedsLink: Locator;

    // Page header
    readonly pageTitle: Locator;
    readonly breadcrumbLabel: Locator;
    readonly saveButton: Locator;

    // Institution card
    readonly institutionName: Locator;
    readonly institutionLocation: Locator;

    // Suggestion Management section
    readonly suggestionManagementSection: Locator;
    readonly suggestionManagementHeading: Locator;
    readonly suggestionManagementDescription: Locator;
    readonly frequencyCombobox: Locator;

    // Institution Configurations section
    readonly institutionConfigSection: Locator;
    readonly institutionConfigHeading: Locator;
    readonly institutionConfigDescription: Locator;
    readonly institutionConfigSeeAllLink: Locator;

    // Receive Align Suggestions section
    readonly alignSuggestionsSection: Locator;
    readonly alignSuggestionsHeading: Locator;
    readonly alignToPeersCheckbox: Locator;
    readonly alignToPeersLabel: Locator;
    readonly alignToPeersToggleWrapper: Locator;
    readonly peerGroupsSeeAllLink: Locator;

    // Receive State Connect Suggestions section
    readonly stateConnectSection: Locator;
    readonly stateConnectHeading: Locator;
    readonly stateConnectCheckbox: Locator;
    readonly stateConnectLabel: Locator;
    readonly stateAlignCheckbox: Locator;
    readonly stateAlignLabel: Locator;
    readonly thresholdCombobox: Locator;

    // Workflow Configurations section
    readonly workflowConfigSection: Locator;
    readonly workflowConfigHeading: Locator;
    readonly workflowConfigDescription: Locator;
    readonly workflowConfigSeeAllLink: Locator;

    // Institution Coding Scheme section
    readonly codingSchemeSection: Locator;
    readonly codingSchemeHeading: Locator;
    readonly codingSchemeDescription: Locator;
    readonly schemeCombobox: Locator;

    // API Access Token section
    readonly apiAccessTokenSection: Locator;
    readonly apiAccessTokenHeading: Locator;
    readonly apiAccessTokenDescription: Locator;
    readonly apiAccessTokenSeeAllLink: Locator;

    constructor(page: Page) {
        this.page = page;

        // Navigation
        this.myWorkplaceLink = page.getByRole('link', { name: 'My Workplace' });
        this.settingsLink = page.getByRole('link', { name: 'Settings' });
        this.usersHeading = page.getByRole('heading', { name: 'Users', level: 2 });
        this.allLink = page.getByRole('link', { name: 'All' });
        this.requestsLink = page.getByRole('link', { name: 'Requests' });
        this.generalContactLink = page.getByRole('link', { name: 'General Contact' });
        this.institutionHeading = page.getByRole('heading', { name: 'Institution', level: 2, exact: true });
        this.summaryLink = page.getByRole('link', { name: 'Summary' });
        this.profileLink = page.getByRole('link', { name: 'Profile' });
        this.ipedsLink = page.getByRole('link', { name: 'IPEDS' });

        // Page header
        this.pageTitle = page.getByRole('heading', { name: 'Settings', level: 1 });
        this.breadcrumbLabel = page.getByText('Institution', { exact: true }).first();
        this.saveButton = page.getByRole('button', { name: 'Save' });

        // Institution card
        this.institutionName = page.getByText('American River College');
        this.institutionLocation = page.getByText('Sacramento, California');

        // Suggestion Management
        this.suggestionManagementSection = page.getByRole('region', { name: 'Suggestion management' });
        this.suggestionManagementHeading = page.getByRole('heading', { name: 'Suggestion management', level: 2 });
        this.suggestionManagementDescription = page.getByText('This allows you to set how often your institution receives course equivalency suggestions from the Triangulator.');
        this.frequencyCombobox = page.getByRole('combobox', { name: 'Frequency' });

        // Institution Configurations
        this.institutionConfigSection = page.getByRole('region', { name: 'Institution configurations' });
        this.institutionConfigHeading = page.getByRole('heading', { name: 'Institution configurations', level: 2 });
        this.institutionConfigDescription = page.getByText('This allows you to set exclusion parameters so certain types of courses are not suggested');
        this.institutionConfigSeeAllLink = page.getByRole('link', { name: 'Open Suggestion Configurations page' });

        // Receive Align Suggestions
        this.alignSuggestionsSection = page.getByRole('region', { name: 'Receive align suggestions' });
        this.alignSuggestionsHeading = page.getByRole('heading', { name: 'Receive align suggestions', level: 2 });
        this.alignToPeersCheckbox = page.locator('#should-receive-alignment-suggestions');
        this.alignToPeersLabel = page.locator('label:has(#should-receive-alignment-suggestions)');
        this.alignToPeersToggleWrapper = page.locator('label:has(#should-receive-alignment-suggestions)');
        this.peerGroupsSeeAllLink = page.getByRole('link', { name: 'Open Peer Groups page' });

        // Receive State Connect Suggestions
        this.stateConnectSection = page.getByRole('region', { name: 'Receive state connect suggestions' });
        this.stateConnectHeading = page.getByRole('heading', { name: 'Receive state connect suggestions', level: 2 });
        this.stateConnectCheckbox = page.locator('#should-receive-state-connect-suggestions');
        this.stateConnectLabel = page.locator('label:has(#should-receive-state-connect-suggestions)');
        this.stateAlignCheckbox = page.locator('#should-align-state-connect-suggestions');
        this.stateAlignLabel = page.locator('label:has(#should-align-state-connect-suggestions)');
        this.thresholdCombobox = page.getByRole('combobox', { name: 'Threshold' });

        // Workflow Configurations
        this.workflowConfigSection = page.getByRole('region', { name: 'Workflow configurations' });
        this.workflowConfigHeading = page.getByRole('heading', { name: 'Workflow configurations', level: 2 });
        this.workflowConfigDescription = page.getByText('Create evaluation groups and manage workflow schemes.');
        this.workflowConfigSeeAllLink = page.getByRole('link', { name: 'Open Workflow Configurations page' });

        // Institution Coding Scheme
        this.codingSchemeSection = page.getByRole('region', { name: 'Institution coding scheme' });
        this.codingSchemeHeading = page.getByRole('heading', { name: 'Institution coding scheme', level: 2 });
        this.codingSchemeDescription = page.getByText('Please select the coding scheme that identifies institutions in the rules file you upload.');
        this.schemeCombobox = page.getByRole('combobox', { name: 'Scheme' });

        // API Access Token
        this.apiAccessTokenSection = page.getByRole('region', { name: 'API Access Token' });
        this.apiAccessTokenHeading = page.getByRole('heading', { name: 'API access token', level: 2 });
        this.apiAccessTokenDescription = page.getByText('This allows you to request and generate a token to access the Triangulator APIs.');
        this.apiAccessTokenSeeAllLink = page.getByRole('link', { name: 'Open API Access Token page' });
    }

    async navigateToSettings(): Promise<void> {
        await this.myWorkplaceLink.click();
        await this.page.waitForLoadState('domcontentloaded');
        await this.settingsLink.click();
        await this.page.waitForURL('**/inst/settings/**');
        await this.page.waitForLoadState('domcontentloaded');
    }

    async selectFrequency(option: string): Promise<void> {
        await this.frequencyCombobox.click();
        await this.page.getByRole('option', { name: option, exact: true }).click();
    }

    async selectThreshold(value: string): Promise<void> {
        await this.thresholdCombobox.click();
        await this.page.getByRole('option', { name: value, exact: true }).click();
    }

    async selectScheme(scheme: string): Promise<void> {
        await this.schemeCombobox.click();
        await this.page.getByRole('option', { name: scheme, exact: true }).click();
    }

    async saveSettings(): Promise<void> {
        if (await this.saveButton.isDisabled()) return;
        await this.saveButton.click();
        await this.page.locator('[aria-label="No changes to save"]').waitFor({ state: 'visible', timeout: 15000 });
    }

    async getFrequencyValue(): Promise<string> {
        return (await this.frequencyCombobox.locator('p').textContent()) ?? '';
    }

    async getThresholdValue(): Promise<string> {
        return (await this.thresholdCombobox.locator('p').textContent()) ?? '';
    }

    async getSchemeValue(): Promise<string> {
        return (await this.schemeCombobox.locator('p').textContent()) ?? '';
    }

    async getFrequencyOptions(): Promise<string[]> {
        await this.frequencyCombobox.click();
        const options = await this.page.getByRole('option').allTextContents();
        await this.page.keyboard.press('Escape');
        return options.map((o) => o.trim()).filter(Boolean);
    }

    async getThresholdOptions(): Promise<string[]> {
        await this.thresholdCombobox.click();
        const options = await this.page.getByRole('option').allTextContents();
        await this.page.keyboard.press('Escape');
        return options.map((o) => o.trim()).filter(Boolean);
    }

    async getSchemeOptions(): Promise<string[]> {
        await this.schemeCombobox.click();
        const options = await this.page.getByRole('option').allTextContents();
        await this.page.keyboard.press('Escape');
        return options.map((o) => o.trim()).filter(Boolean);
    }

    async isAlignToPeersChecked(): Promise<boolean> {
        return await this.alignToPeersCheckbox.isChecked();
    }

    async isStateConnectChecked(): Promise<boolean> {
        return await this.stateConnectCheckbox.isChecked();
    }

    async isStateAlignChecked(): Promise<boolean> {
        return await this.stateAlignCheckbox.isChecked();
    }

    async isSaveButtonDisabled(): Promise<boolean> {
        return await this.saveButton.isDisabled();
    }

    async toggleAlignToPeers(): Promise<void> {
        await this.alignToPeersCheckbox.click({ force: true });
    }

    async toggleStateConnect(): Promise<void> {
        await this.stateConnectCheckbox.click({ force: true });
    }

    async toggleStateAlign(): Promise<void> {
        await this.stateAlignCheckbox.click({ force: true });
    }

    async pressEscape(): Promise<void> {
        await this.page.keyboard.press('Escape');
    }

    getOptionByName(name: string): Locator {
        return this.page.getByRole('option', { name, exact: true });
    }

    async getActiveSettingsLink(): Promise<Locator> {
        return this.page.getByRole('link', { name: 'Settings' }).filter({ hasText: 'Settings' });
    }
}
