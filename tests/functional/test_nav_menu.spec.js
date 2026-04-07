import { test, expect } from '@playwright/test';


await page.getByRole('button', { name: 'Board', exact: true }).click();test('clickable buttons', async ({ page }) => {
    // Go to the page
    await page.goto('/');

    // Navigate to Board view
    await page.getByRole('button', { name: "Dashboard", exact: true}).click()
    await page.getByRole('button', { name: "Board", exact: true}).click()
    await page.getByRole('button', { name: "Pomodoro ", exact: true}).click()
    await page.getByRole('button', { name: "About", exact: true}).click()
    await page.getByRole('button', { name: "Settings", exact: true}).click()
    await page.getByRole('button', { name: "LogOut", exact: false}).isDisabled()

    await page.waitForTimeout(1000);
});