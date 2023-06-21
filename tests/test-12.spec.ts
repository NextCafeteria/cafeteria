import { expect, test } from '@playwright/test';

test('test', async ({ page }) => {
  await page.locator('body').click();
  await page.goto('https://cafe.vietanh.dev/en');
  await page.locator('div').filter({ hasText: /^Orders$/ }).click();await page.locator('div:nth-child(2) > .flex > .px-2').click();
  await page.getByText('Cold', { exact: true }).click({
    clickCount: 3
  });
  await expect(page.getByText('Cold', { exact: true })).toHaveText("Hot");

});