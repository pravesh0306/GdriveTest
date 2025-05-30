import { test, expect } from '@playwright/test';
import path from 'path';

test('Google Drive batch upload flow', async ({ page }) => {
  await page.goto('http://localhost:5173?test=true');

  // Simulate multiple file input
  const filePath1 = path.resolve(__dirname, 'sample.pdf');
  const filePath2 = path.resolve(__dirname, 'sample2.pdf');
  await page.setInputFiles('input[type="file"]', [filePath1, filePath2]);

  await page.click('text=Upload');

  // Wait for both uploads to complete (progress shows 'Done')
  await expect(page.locator('li', { hasText: 'sample.pdf: Done' })).toBeVisible();
  await expect(page.locator('li', { hasText: 'sample2.pdf: Done' })).toBeVisible();
});
