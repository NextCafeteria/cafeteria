const itemsOptions = require("../app/[lng]/food_options.json");
const settings = require("../app/[lng]/settings.json");

const taxRate = settings.tax_rate;

function roundUp(value, decimals = 2) {
  return Number(Math.ceil(value + "e" + decimals) + "e-" + decimals);
}

export function getItemOptionsById(id) {
  let itemOptions = null;
  for (const item of itemsOptions) {
    if (item.id === id) {
      itemOptions = item;
      break;
    }
  }
  return itemOptions;
}

export function calculatePrice(id, selectedOptions, quantity = 1) {
  const itemOptions = getItemOptionsById(id);

  // Get additional price for customizations
  let totalPrice = itemOptions.price;
  itemOptions.customizations.forEach((customization, customizationIndex) => {
    const optionIndex = selectedOptions[customizationIndex];
    if (optionIndex === undefined) {
      return 0.0;
    }
    const option = customization.options[optionIndex];
    totalPrice += option.price;
  });

  return roundUp(totalPrice * quantity);
}

export function calculatePriceForList(items) {
  let totalPrice = 0;
  items.forEach((item) => {
    totalPrice += calculatePrice(item.id, item.selectedOptions, item.quantity);
  });
  return roundUp(totalPrice);
}

export function calculateTax(totalPrice) {
  return roundUp(totalPrice * taxRate);
}

export function calculateTotalPriceWithTax(totalPrice) {
  return roundUp(totalPrice + calculateTax(totalPrice));
}

export function getItemsWithPrice(items) {
  return items.map((item) => {
    const itemOptions = getItemOptionsById(item.id);
    const price = calculatePrice(item.id, item.selectedOptions, item.quantity);
    return {
      ...item,
      price: price,
      name: itemOptions.name,
      description: itemOptions.description,
      image: itemOptions.image,
      customizations: itemOptions.customizations,
      selectedOptions: item.selectedOptions,
    };
  });
}
