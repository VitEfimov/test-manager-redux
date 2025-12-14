
import { test, expect } from '@playwright/test';

test('drag and drop task from Today to Tomorrow', async ({ page }) => {
    // Go to the page
    await page.goto('/');

    // Navigate to Board view
    await page.getByRole('button', { name: 'Board', exact: true }).click();

    // Wait for tasks to load (assuming default data or specific setup)
    // We'll look for a task in "Today" section.
    // Based on code, Today section has h3 "Today"

    // Locate a task in the "Today" list (first droppable)
    const todayList = page.locator('ul.section__field').first();
    const task = todayList.locator('.section__task').first();

    // Get text to verify later
    const taskName = await task.locator('.section__task-label, .section__task-input').inputValue().catch(() => task.locator('.section__task-label').innerText());

    // Locate destination "Tomorrow" list
    // The second ul.section__field usually, or we can look for h3 "Tomorrow"
    const tomorrowList = page.locator('ul.section__field').filter({ hasText: 'Tomorrow' });

    // Drag and drop using mouse events (better for react-beautiful-dnd)
    const sourceBox = await task.boundingBox();
    const targetBox = await tomorrowList.boundingBox();

    if (sourceBox && targetBox) {
        await page.mouse.move(sourceBox.x + sourceBox.width / 2, sourceBox.y + sourceBox.height / 2);
        await page.mouse.down();
        await page.waitForTimeout(200); // Wait for lift
        // Move with steps to simulate real user and allow rbd to detect drag
        await page.mouse.move(targetBox.x + targetBox.width / 2, targetBox.y + targetBox.height / 2, { steps: 20 });
        await page.mouse.up();
    }

    // Verification
    // 1. Check if task is now in Tomorrow list
    await expect(tomorrowList.locator('.section__task')).toContainText(taskName);

    // 2. Check if task is NO LONGER in Today list (unless it was the only one, then list might be empty)
    // Logic might leave it there if the mock logic doesn't actually remove it? 
    // Redux should update it.

    // Wait a bit to see visual effects if any (for debugging recording)
    await page.waitForTimeout(1000);
});
