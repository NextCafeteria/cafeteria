import { expect, test } from "@playwright/test";

const authFile = "playwright/.auth/user.json";
const local = "http://localhost:3000/en/";

test("login", async ({ page }) => {
  await page.goto(local);
  await page.locator('div').filter({ hasText: /^Menu$/ }).click();
  await page.getByText("Login with Google").click();


  await page.context().storageState({ path: authFile });
  await page.waitForLoadState("networkidle");

  await page.context().storageState({ path: authFile });
});
