const settings = require("@/data/settings.json");
const taxRate = settings.tax_rate;

function roundUp(value, decimals = 2) {
  return Number(Math.ceil(value + "e" + decimals) + "e-" + decimals);
}

export function populateCart(cart, products) {
  // Calculate price
  let price = 0.0;
  let tax = 0.0;
  let total = 0.0;
  let quantity = 0;
  let items = []; // Cart with product data
  cart.forEach((item) => {
    const product = products.find((product) => product.id === item.id);
    if (product) {
      // Calculate price
      let productPrice = product.price;
      let productTax = 0.0;
      let productTotal = 0.0;
      let productSelectedOptions = [];
      let productQuantity = 0;
      if (item.selectedOptions) {
        // Loop in selectedOptions dict
        for (const [customizationId, optionId] of Object.entries(
          item.selectedOptions
        )) {
          const optionPrice =
            product?.customizations[customizationId]?.options[optionId]?.price;
          if (!optionPrice) {
            continue;
          }
          productPrice += optionPrice;
          productTax += optionPrice * taxRate;
          productTotal += optionPrice * (1 + taxRate);
          productSelectedOptions.push({
            customizationId: optionId,
          });
        }
      }

      // Calculate total
      productQuantity = item.quantity;
      productPrice *= productQuantity;
      productTax *= productQuantity;
      productTotal *= productQuantity;

      // Add to cart
      price += productPrice;
      tax += productTax;
      total += productTotal;
      quantity += productQuantity;

      // Add to populated cart
      items.push({
        ...product,
        selectedOptions: productSelectedOptions,
        quantity: productQuantity,
      });
    }
  });

  let data = {
    price: roundUp(price),
    tax: roundUp(tax),
    total: roundUp(total),
    quantity: quantity,
    items: items,
  };

  return data;
}
