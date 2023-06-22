<<<<<<< HEAD
import { expect, test } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

test('login', async ({ page }) => {
  await page.goto('https://cafe.vietanh.dev/en');
  await page.getByText('User').click();
  await page.getByText('Login with Google').click();
  await page.getByRole('textbox', { name: 'Email or phone' }).fill('machdieubang2110');
  // await page.getByRole('textbox', { name: 'Email or phone' }).press('Enter');
  // await page.getByRole('textbox', { name: 'Email or phone' }).press('Enter');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('textbox', { name: 'Enter your password' }).fill('!tach!Uch!h@');
  await page.getByRole('button', { name: 'Next' }).click();
  // await page.waitForTimeout(30000);

  await page.waitForURL('https://cafe.vietanh.dev/en');
=======
import { test, expect } from "@playwright/test";

const authFile = "playwright/.auth/user.json";
const local = "http://localhost:3000/en/";

test("login", async ({ page }) => {
  await page.goto(local);
  await page.getByText("User").click();
  await page.getByText("Login with Google").click();
  await page
    .getByRole("textbox", { name: "Email or phone" })
    .fill("");
  // await page.getByRole('textbox', { name: 'Email or phone' }).press('Enter');
  // await page.getByRole('textbox', { name: 'Email or phone' }).press('Enter');
  await page.getByRole("button", { name: "Next" }).click();
  await page
    .getByRole("textbox", { name: "Enter your password" })
    .fill("");
  await page
    .getByRole("textbox", { name: "Enter your password" })
    .press("Enter");
  // await page.getByRole('button', { name: 'Next' }).click();
  // await page.waitForTimeout(30000);

  // await page.context().storageState({ path: authFile });

  // await page.waitForURL(local);
  await page.waitForLoadState("networkidle");
>>>>>>> c387d0ab85b31e192433e342a93662e40025e0b6

  await page.context().storageState({ path: authFile });
});
