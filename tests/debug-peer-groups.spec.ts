import { test, expect } from '../fixtures/test';

const baseURL = (process.env.BASE_URL ?? 'https://qa.creditmobility.net').replace(/\/$/, '');
const regularUserEmail = process.env.INST_ADMIN_EMAIL ?? '';
const regularUserPassword = process.env.INST_ADMIN_PASSWORD ?? '';

test('Debug: Test all Submit strategies', async ({ page, loginPage, peerGroupsPage }) => {
    page.on('response', async (res) => {
        if (res.url().includes('graphql')) {
            try {
                const body = await res.json();
                const str = JSON.stringify(body).substring(0, 300);
                if (str.includes('peerGroup') || str.includes('error') || str.includes('create')) {
                    console.log(`GraphQL: ${str}`);
                }
            } catch {
                // ignore parse errors
            }
        }
    });

    await page.goto(`${baseURL}/logged-out/login/email`);
    await loginPage.loginUser(regularUserEmail, regularUserPassword);
    await page.waitForLoadState('domcontentloaded');
    await peerGroupsPage.navigateToPeerGroupsPageDirect();

    // Clean up ALL leftover test peer groups
    let count = await peerGroupsPage.getPeerGroupRowCount();
    console.log(`Initial peer groups: ${count}`);
    while (count > 0) {
        await peerGroupsPage.toggleSeeMoreBtn.last().click();
        await peerGroupsPage.deleteMenuItem.click();
        await page.waitForTimeout(1000);
        const dialog = peerGroupsPage.anyDialog;
        if (await dialog.isVisible().catch(() => false)) {
            await peerGroupsPage.clickVueButton(dialog.getByRole('button', { name: 'Delete' }));
        }
        await page.waitForTimeout(3000);
        await page.reload();
        await peerGroupsPage.createPeerGroupBtn.waitFor({ state: 'visible', timeout: 15000 });
        count = await peerGroupsPage.getPeerGroupRowCount();
        console.log(`After cleanup: ${count} groups`);
    }

    // Now create a peer group
    await peerGroupsPage.openCreateDialog();
    await peerGroupsPage.selectInstitution('Abilene Christian University');
    await peerGroupsPage.selectInstitution('Academy of Art University');
    await peerGroupsPage.selectInstitution('Adams State University');
    await peerGroupsPage.clickNext();

    const groupName = `Debug ${Date.now()}`;
    await peerGroupsPage.fillPeerGroupName(groupName);
    await peerGroupsPage.selectMatchThreshold();
    await page.waitForTimeout(500);

    console.log('Using peerPage.clickSubmit()...');
    await peerGroupsPage.clickSubmit();

    await peerGroupsPage.anyDialog.waitFor({ state: 'hidden', timeout: 20000 }).catch(() => {
        console.log('Dialog did NOT close');
    });

    const dialogVisible = await peerGroupsPage.anyDialog.isVisible().catch(() => false);
    console.log('Dialog visible:', dialogVisible);

    if (!dialogVisible) {
        console.log('SUCCESS!');
        await page.waitForTimeout(2000);
        const exists = await peerGroupsPage.isPeerGroupInList(groupName);
        console.log('Group in list:', exists);
    } else {
        console.log('clickSubmit failed. Dialog still open.');
    }
});
