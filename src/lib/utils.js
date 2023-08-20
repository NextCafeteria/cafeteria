export function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}

export function formatPrice(price, prefix, suffix, decimal) {
  let formatedPrice = price;
  if (decimal) {
    formatedPrice = formatedPrice.toFixed(decimal);
  } else {
    formatedPrice = formatedPrice.toFixed(0);
  }
  formatedPrice = formatedPrice.replace(/\d(?=(\d{3})+\.)/g, "$&,");
  formatedPrice = formatedPrice.replace(/\d(?=(\d{3})+$)/g, "$&,");
  if (prefix) {
    formatedPrice = prefix + formatedPrice;
  }
  if (suffix) {
    formatedPrice = formatedPrice + suffix;
  }
  return formatedPrice;
}
