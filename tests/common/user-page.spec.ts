import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto("https://cafe.vietanh.dev/en");
  await page.getByText("User").click();

  await page.waitForURL("https://cafe.vietanh.dev/en/user");

  // await page.getByText('haitrinhjun5@gmail.com');
  expect(await page.isVisible("text=haitrinhjun5@gmail.com")).toBeTruthy();
  expect(await page.isVisible("text=hải trịnh")).toBeTruthy();

  expect(await page.isVisible("text=Sign out")).toBeTruthy();
});
