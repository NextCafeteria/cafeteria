import { test, expect } from "@playwright/test";

const local = "http://localhost:3000/en";

test("should allow create order", async ({ page }) => {
  await page.goto(`${local}/orders`);
  await page.waitForLoadState("networkidle");
  let orders = page.getByTestId("customer-order-item");
  let count = await orders.count();

  await page.goto(local);
  await page.getByText("Hot", { exact: true }).click();
  await page.waitForURL(`${local}/pick-item-options/*`);
  await page.locator("input[value='Yes'][name='Whipped Cream']").check();
  await page.locator("input[value='3 Pumps'][name='Chocolate Sauce']").check();
  await page.locator("input[value='M']").check();
  await page.getByText("Add to cart").click();
  await page.waitForLoadState("networkidle");

  await page.goto(local);
  await page.getByText("Cold", { exact: true }).click();
  await page.waitForURL(`${local}/pick-item-options/*`);
  await page.locator("input[value='Yes'][name='Whipped Cream']").check();
  await page.locator("input[value='XL']").check();
  await page.getByText("Add to cart").click();
  await page.waitForLoadState("networkidle");

  await page.goto(`${local}/cart`);
  await page.waitForLoadState("networkidle");
  await page.getByText("Place Order").click();
  await page.waitForLoadState("networkidle");

  await page.goto(`${local}/orders`);
  orders = page.getByTestId("customer-order-item");
  await expect(orders).toHaveCount(count + 1);

  const order = orders.nth(count);
  let items = order.getByTestId("order-item");
  await expect(items).toHaveCount(2);
  await expect(items).toContainText(["Hot", "Cold"]);

  await order.click();
  await page.waitForLoadState("networkidle");
  items = page.getByTestId("order-item");
  await expect(items).toHaveCount(2);
  await expect(items.nth(0)).toContainText("Hot");
  await expect(items.nth(0)).toContainText("M");
  await expect(items.nth(0)).toContainText("Whipped Cream: Yes");
  await expect(items.nth(0)).toContainText("Chocolate Sauce: 3 Pumps");

  await expect(items.nth(1)).toContainText("Cold");
  await expect(items.nth(1)).toContainText("XL");
  await expect(items.nth(0)).toContainText("Whipped Cream: Yes");

  await expect(page.getByText("Total$8.05")).toBeAttached();
  await expect(page.getByText("Delivery AddressAt the counter")).toBeAttached();
});
