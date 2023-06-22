import { test, expect } from "@playwright/test";

const cartFile = "playwright/cart/hot.json";

const local = "http://localhost:3000/en";

test("should allow options", async ({ page }) => {
  await page.goto(local);
  await page.getByText("Hot", { exact: true }).click();
  await page.waitForURL(`${local}/pick-item-options/*`);
  await page.locator("input[value='Yes'][name='Whipped Cream']").check();
  await page.locator("input[value='3 Pumps'][name='Chocolate Sauce']").check();
  await page.locator("input[value='M']").check();
  await page.getByText("Add to cart").click();
  await page.waitForLoadState("networkidle");

  await page.goto(`${local}/cart`);
  const items = page.getByTestId("cart-item");

  await expect(items).toHaveCount(1);
  await expect(items.nth(0)).toContainText("Hot");
  await expect(items.nth(0)).toContainText("M");
  await expect(items.nth(0)).toContainText("Whipped Cream: Yes");
  await expect(items.nth(0)).toContainText("Chocolate Sauce: 3 Pumps");
});

test("should allow quantity", async ({ page }) => {
  await page.goto(local);
  await page.getByText("Bagel", { exact: true }).click();
  await page.waitForURL(`${local}/pick-item-options/*`);
  await page.getByRole("button", { name: "+" }).click();
  await page.getByRole("button", { name: "+" }).click();
  await page.getByRole("button", { name: "+" }).click();
  await page.getByText("Add to cart").click();
  await page.waitForLoadState("networkidle");

  await page.goto(`${local}/cart`);
  const items = page.getByTestId("cart-item");
  await expect(items).toHaveCount(1);
  await expect(items.nth(0)).toContainText("Bagel");
  await expect(items.nth(0)).toContainText("4 x");
});

test("should allow change quantity", async ({ page }) => {
  await page.goto(local);
  await page.getByText("Bagel", { exact: true }).click();
  await page.waitForURL(`${local}/pick-item-options/*`);
  await page.getByText("Add to cart").click();
  await page.waitForLoadState("networkidle");

  await page.goto(local);
  await page.getByText("Bagel", { exact: true }).click();
  await page.waitForURL(`${local}/pick-item-options/*`);
  await page.getByRole("button", { name: "+" }).click();
  await page.getByText("Add to cart").click();

  await page.goto(`${local}/cart`);
  const items = page.getByTestId("cart-item");

  await expect(items).toHaveCount(1);
  await expect(items.nth(0)).toContainText("Bagel");
  await expect(items.nth(0)).toContainText("2 x");
});
