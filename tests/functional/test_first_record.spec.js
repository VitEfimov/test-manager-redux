import { test, expect } from '@playwright/test';


test('clickable buttons', async ({ page }) => {
    // Go to the page
    await page.goto('/');

    // Navigate to Board view
    await page.getByRole('button', { name: "Board", exact: true}).click()

    const firstTask = await page.locator('section__task-label').first()
    const text = firstTask.getByText()

    const expected = 'change priority from 3 to 5'

    await expect(page.getByText(firstTask, { name: expected })).toBeVisible();


    await page.waitForTimeout(1000);
});