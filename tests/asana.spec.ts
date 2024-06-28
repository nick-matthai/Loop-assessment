const { test, expect } = require('@playwright/test');

test.setTimeout(60000);

const testCases = [
  {
    "id": 1,
    "name": "Test Case 1",
    "leftNav": "Cross-functional project plan, Project",
    "column": "To do",
    "card_title": "Draft project brief",
  },
  {
    "id": 2,
    "name": "Test Case 2",
    "leftNav": "Cross-functional project plan, Project",
    "column": "To do",
    "card_title": "Schedule kickoff meeting",
  },
  {
    "id": 3,
    "name": "Test Case 3",
    "leftNav": "Cross-functional project plan, Project",
    "column": "To do",
    "card_title": "Share timeline with teammates",
  },
  {
    "id": 4,
    "name": "Test Case 4",
    "leftNav": "Work Requests",
    "column": "New Requests",
    "card_title": "[Example] Laptop setup for new hire",
  },
  {
    "id": 5,
    "name": "Test Case 5",
    "leftNav": "Work Requests",
    "column": "In Progress",
    "card_title": "[Example] Password not working",
  },
  {
    "id": 6,
    "name": "Test Case 6",
    "leftNav": "Work Requests",
    "column": "Completed",
    "card_title": "[Example] New keycard for Daniela V",
  }
];

test.describe('Asana Data-Driven Tests', () => {
  testCases.forEach((data) => {
    test(data.name, async ({ page }) => {
      // Login to Asana
      await test.step('Login to Asana', async () => {
        await page.goto('https://app.asana.com/-/login');
        await page.type('input[name="e"]', 'ben+pose@workwithloop.com');
        await page.getByRole('button', { name: 'Continue' }).nth(1).click();
        await page.type('input[name="p"]', 'Password123');
        await page.getByRole('button', { name: 'Log in' }).click();
        await page.waitForNavigation();
      });

      // Navigate to the project page
      await test.step('Navigate to the project page', async () => {
        const leftNavItems = data.leftNav.split(', ');
        for (const item of leftNavItems) {
          await page.click(`text=${item}`);
        }
      });

      // Verify the card is within the right column
      await test.step('Verify the card is within the right column', async () => {
        const column = await page.locator(`text=${data.column}`);
        const card = await column.locator(`text=${data.card_title}`);
        await expect(card).toBeVisible({ timeout: 60000 });
      });
    });
  });
});
