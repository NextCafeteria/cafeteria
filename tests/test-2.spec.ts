import { expect, test } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://cafe.vietanh.dev/en');
  await page.getByText('User').click();
  
  await page.waitForTimeout(1000);

});