import { expect, test } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://cafe.vietanh.dev/en');
  await page.locator('div').filter({ hasText: /^User$/ }).click();
  await page.waitForURL('https://cafe.vietanh.dev/en/user');
  await page.waitForTimeout(3000);

  await expect(page.locator("body > main > div.min-h-20.p-4.mt-4.border-b-2.border-gray-800.relative.mb-8 > div > div.p-4 > div.text-left.text-gray-800.mb-2")).toHaveText("machdieubang2110@gmail.com");
});
