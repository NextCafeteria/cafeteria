import { expect, test } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://cafe.vietanh.dev/en');
  await page.getByText('Home').click();
  await page.getByText('Hot', { exact: true }).click();
  await page.getByText('Add to cart').click();

  await page.getByText('Cart').click();

  

  
  
});
