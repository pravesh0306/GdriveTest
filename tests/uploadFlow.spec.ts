import { test, expect } from '@playwright/test';
import path from 'path';

test('Google Drive upload flow', async ({ page }) => {
  await page.goto('http://localhost:5173');

  // Simulate file input (replace with a real file path if needed)
  const filePath = path.resolve(__dirname, 'sample.pdf');
  await page.setInputFiles('input[type="file"]', filePath);

  await page.click('text=Upload');

  // Optionally: check for confirmation alert or uploaded file listing
  await expect(page.locator('text=Uploaded:')).toBeVisible();
});
