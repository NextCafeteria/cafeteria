import { test, expect } from "@playwright/test";

const local = "http://localhost:3000/en";

test("test", async ({ page }) => {
  await page.goto(local);
  expect(await page.title()).toBe("Cafeteria");
  expect(await page.isVisible("text=Home")).toBeTruthy();
  expect(await page.isVisible("text=Orders")).toBeTruthy();
  expect(await page.isVisible("text=Cart")).toBeTruthy();
  expect(await page.isVisible("text=User")).toBeTruthy();
});
