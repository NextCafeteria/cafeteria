import { test, expect } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

test('login', async ({ page }) => {
  await page.goto('https://cafe.vietanh.dev/en');
  await page.getByText('User').click();
  await page.getByText('Login with Google').click();
  await page.getByRole('textbox', { name: 'Email or phone' }).fill('haitrinhjun5');
  // await page.getByRole('textbox', { name: 'Email or phone' }).press('Enter');
  // await page.getByRole('textbox', { name: 'Email or phone' }).press('Enter');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('textbox', { name: 'Enter your password' }).fill('');
  await page.getByRole('button', { name: 'Next' }).click();
  // await page.waitForTimeout(30000);

  await page.waitForURL('https://cafe.vietanh.dev/en');

  await page.context().storageState({ path: authFile });
});
