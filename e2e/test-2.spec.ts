import { expect, test } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/vn');
  
  await page.getByText('Menu').click();
  
  await page.waitForTimeout(1000);

});