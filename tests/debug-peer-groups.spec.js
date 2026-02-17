const { test, expect } = require('@playwright/test');
const { loginPage } = require('../base_classes/login');
const { PeerGroupsPage } = require('../base_classes/peerGroupsPage');

test('Debug: Test all Submit strategies', async ({ page }) => {
    const baseURL = 'https://qa.creditmobility.net';
    const login = new loginPage(page);
    const peerPage = new PeerGroupsPage(page);

    page.on('response', async (res) => {
        if (res.url().includes('graphql')) {
            try {
                const body = await res.json();
                const str = JSON.stringify(body).substring(0, 300);
                if (str.includes('peerGroup') || str.includes('error') || str.includes('create')) {
                    console.log(`GraphQL: ${str}`);
                }
            } catch (e) {}
        }
    });

    await page.goto(`${baseURL}/logged-out/login/email`);
    await login.loginuser('testtriangulator+108@gmail.com', 'Triangulator!1');
    await page.waitForLoadState('domcontentloaded');
    await peerPage.navigateToPeerGroupsPageDirect();

    // First clean up ALL leftover test peer groups (keep only daniel test 4 if it exists)
    let count = await peerPage.getPeerGroupRowCount();
    console.log(`Initial peer groups: ${count}`);
    while (count > 0) {
        await page.getByRole('button', { name: 'Toggle see more' }).last().click();
        await page.getByRole('menuitem', { name: 'Delete' }).click();
        await page.waitForTimeout(1000);
        const dialog = page.getByRole('dialog');
        if (await dialog.isVisible().catch(() => false)) {
            // Use clickVueButton approach for Delete confirmation
            await peerPage.clickVueButton(dialog.getByRole('button', { name: 'Delete' }));
        }
        await page.waitForTimeout(3000);
        await page.reload();
        await peerPage.createPeerGroupBtn.waitFor({ state: 'visible', timeout: 15000 });
        count = await peerPage.getPeerGroupRowCount();
        console.log(`After cleanup: ${count} groups`);
    }

    // Now create a peer group
    await peerPage.openCreateDialog();
    await peerPage.selectInstitution('Abilene Christian University');
    await peerPage.selectInstitution('Academy of Art University');
    await peerPage.selectInstitution('Adams State University');
    await peerPage.clickNext();

    const groupName = `Debug ${Date.now()}`;
    await peerPage.fillPeerGroupName(groupName);
    await peerPage.selectMatchThreshold();
    await page.waitForTimeout(500);

    // Use clickVueButton from POM (tests the current implementation)
    console.log('Using peerPage.clickSubmit()...');
    await peerPage.clickSubmit();

    // Wait for dialog to close
    await page.getByRole('dialog').waitFor({ state: 'hidden', timeout: 20000 }).catch(() => {
        console.log('Dialog did NOT close');
    });

    const dialogVisible = await page.getByRole('dialog').isVisible().catch(() => false);
    console.log('Dialog visible:', dialogVisible);

    if (!dialogVisible) {
        console.log('SUCCESS!');
        await page.waitForTimeout(2000);
        const exists = await page.locator(`text=${groupName}`).isVisible().catch(() => false);
        console.log('Group in list:', exists);
    } else {
        console.log('clickSubmit failed. Dialog still open.');
    }
});
