import { expect, test } from '@playwright/test';
const authFile = "playwright/.auth/user.json";

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/vi');
  await page.context().storageState({ path: authFile });
  await page.waitForLoadState("networkidle");

  await page.locator('div').filter({ hasText: /^Menu$/ }).click();
  await page.getByText('Đăng nhập với GoogleĐang tải...').click();
  await page.getByRole('textbox', { name: 'Email or phone' }).click();
  await page.getByRole('textbox', { name: 'Email or phone' }).fill('machdieubang2110@gmail.com');
  await page.getByRole('textbox', { name: 'Email or phone' }).press('Enter');
  await page.getByRole('link', { name: 'Try again' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('textbox', { name: 'Enter your password' }).press('Enter');
});