import { expect, test } from '@playwright/test';
const authFile = "playwright/.auth/user.json";

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/en');
  await page.context().storageState({ path: authFile });

  await page.locator('div').filter({ hasText: /^Orders$/ }).click();await page.locator('div:nth-child(2) > .flex > .px-2').click();
  await page.getByText('Cold', { exact: true }).click({
    clickCount: 3
  });
  await expect(page.getByText('Cold', { exact: true })).toHaveText("Hot");

});