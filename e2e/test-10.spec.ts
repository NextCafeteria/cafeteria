import { expect, test } from '@playwright/test';
const authFile = "playwright/.auth/user.json";

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/en');
  await page.locator('div').filter({ hasText: /^Menu$/ }).click();
  await page.waitForURL('http://localhost:3000/en/user');
  await page.context().storageState({ path: authFile });
  await page.waitForTimeout(3000);
});
