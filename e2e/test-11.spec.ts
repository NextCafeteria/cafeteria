import { expect, test } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/en');
  await page.getByText('Hot', { exact: true }).click();
  await page.getByText('Hot', { exact: true }).click({
    button: 'right'
  });
    await expect(page.getByText('Hot', { exact: true })).toHaveText("Hot");

});