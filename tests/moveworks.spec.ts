import { test, expect } from '@playwright/test';
import { writeFile, readFile, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { promisify } from 'util';

const writeFileAsync = promisify(writeFile);
const readFileAsync = promisify(readFile);

async function getNextScreenshotNumber(): Promise<number> {
    const countFile = 'count.txt';
    let count = 0;

    if (existsSync(countFile)) {
        const data = await readFileAsync(countFile, 'utf8');
        count = parseInt(data, 10);
    }

    count++;

    await writeFileAsync(countFile, count.toString());

    return count;
}

test('test', async ({ page }) => {
    await page.goto('https://www.moveworks.com/');
    await page.getByRole('listitem', { name: 'Why Moveworks Menu' }).locator('span').click();
    await page.getByRole('link', { name: 'Copilot Interface' }).click();

    // Get the next screenshot number
    const screenshotNumber = await getNextScreenshotNumber();

    // Define the folder where screenshots will be saved
    const screenshotsFolder = 'screenshots';

    // Create the folder if it doesn't exist
    if (!existsSync(screenshotsFolder)) {
        mkdirSync(screenshotsFolder);
    }

    // Use the folder path and screenshot number in the file path
    const screenshotPath = join(screenshotsFolder, `screenshotMW${screenshotNumber}.png`);
    await page.getByRole('heading', { name: 'Automate work with AI' }).screenshot({ path: screenshotPath });
});
