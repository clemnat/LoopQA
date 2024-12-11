// Import Playwright
const { test, expect } = require('@playwright/test');

// Define data-driven test cases
const testData = [
    {
        name: 'Test Case 1',
        navigateTo: 'Web Application',
        task: 'Implement user authentication',
        column: 'To Do',
        tags: ['Feature', 'High Priority']
    },
    {
        name: 'Test Case 2',
        navigateTo: 'Web Application',
        task: 'Fix navigation bug',
        column: 'To Do',
        tags: ['Bug']
    },
    {
        name: 'Test Case 3',
        navigateTo: 'Web Application',
        task: 'Design system updates',
        column: 'In Progress',
        tags: ['Design']
    },
    {
        name: 'Test Case 4',
        navigateTo: 'Mobile Application',
        task: 'Push notification system',
        column: 'To Do',
        tags: ['Feature']
    },
    {
        name: 'Test Case 5',
        navigateTo: 'Mobile Application',
        task: 'Offline mode',
        column: 'In Progress',
        tags: ['Feature', 'High Priority']
    },
    {
        name: 'Test Case 6',
        navigateTo: 'Mobile Application',
        task: 'App icon design',
        column: 'Done',
        tags: ['Design']
    }
];

// Test suite
for (const { name, navigateTo, task, column, tags } of testData) {
    test(name, async ({ page }) => {
        // Step 1: Login
        await page.goto('https://animated-gingersnap-8cf7f2.netlify.app/', { timeout: 60000 });
        await page.waitForLoadState('networkidle');

        // Debugging: Log the page content if email is not visible
        const isEmailVisible = await page.isVisible('input[name="email"]');
        if (!isEmailVisible) {
            console.error('Email field not found! Debugging selectors...');
            console.log(await page.content());
            return;
        }

        // Fill in credentials and submit
        await page.fill('input[name="email"]', 'admin');
        await page.fill('input[name="password"]', 'password123');
        await page.click('button[type="submit"]');

        // Verify login was successful
        const isLoggedIn = await page.isVisible('text=Dashboard');
        if (!isLoggedIn) {
            console.error('Login failed! Dashboard not found.');
            return;
        }

        // Step 2: Navigate to specified section
        await page.click(`text=${navigateTo}`);
        await page.waitForSelector(`text=${navigateTo}`, { timeout: 30000 });

        // Step 3: Verify task details
        const taskLocator = page.locator(`text=${task}`);
        await expect(taskLocator).toBeVisible({ timeout: 15000 });

        const columnLocator = taskLocator.locator(`xpath=..//ancestor::div[contains(@class, 'column')]//h2[text()="${column}"]`);
        await expect(columnLocator).toBeVisible({ timeout: 15000 });

        for (const tag of tags) {
            const tagLocator = taskLocator.locator(`xpath=..//span[contains(@class, 'tag') and text()="${tag}"]`);
            await expect(tagLocator).toBeVisible({ timeout: 15000 });
        }
    });
}
