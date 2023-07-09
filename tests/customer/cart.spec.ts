import { test, expect } from "@playwright/test";
import { it } from "node:test";

const cartFile = "playwright/cart/hot.json";

const local = "http://localhost:3000/en";

test("should allow add to cart", async ({ page }) => {
  await page.goto(local);
  await page.getByText("Hot", { exact: true }).click();
  await page.waitForURL(`${local}/pick-item-options/*`);
  await page.getByText("Add to cart").click();
  await page.waitForLoadState("networkidle");

  await page.goto(`${local}/cart`);
  let items = page.getByTestId("cart-item");
  await expect(items).toHaveCount(1);
  await expect(items.nth(0)).toContainText("Hot");

  await page.goto(local);
  await page.getByText("Cold", { exact: true }).click();
  await page.waitForURL(`${local}/pick-item-options/*`);
  await page.getByText("Add to cart").click();
  await page.waitForLoadState("networkidle");

  await page.goto(`${local}/cart`);
  items = page.getByTestId("cart-item");
  await expect(items).toHaveCount(2);
  await expect(items).toContainText(["Hot", "Cold"]);
  // await page.context().storageState({ path: cartFile });

  //save only the local storage
  // await page.context().storageState({ path: 'playwright/cart/local.json', storageTypes: ['local'] });
});

test("should allow remove from cart", async ({ page }) => {
  await page.goto(local);
  await page.getByText("Bagel", { exact: true }).click();
  await page.waitForURL(`${local}/pick-item-options/*`);
  await page.getByText("Add to cart").click();
  await page.waitForLoadState("networkidle");

  await page.goto(`${local}/cart`);
  let items = page.getByTestId("cart-item");
  await expect(items.nth(0)).toContainText("Remove");

  await page.goto(local);
  await page.getByText("Hot", { exact: true }).click();
  await page.waitForURL(`${local}/pick-item-options/*`);
  await page.getByText("Add to cart").click();
  await page.waitForLoadState("networkidle");

  await page.goto(`${local}/cart`);

  items = page.getByTestId("cart-item");
  items
    .filter({ hasText: "Hot" })
    .nth(0)
    .getByRole("button", { name: "Remove" })
    .click();

  items = page.getByTestId("cart-item");
  await expect(items).toHaveCount(1);
  await expect(items.nth(0)).toContainText("Bagel");
});
