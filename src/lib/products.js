export function countItemsByName(items) {
  const itemNamesWithCount = {};
  items.forEach((item) => {
    const name = item.name;
    if (itemNamesWithCount[name]) {
      itemNamesWithCount[name] += item.quantity;
    } else {
      itemNamesWithCount[name] = item.quantity;
    }
  });
  return itemNamesWithCount;
}

export function countTotalItems(items) {
  return items.reduce((acc, item) => acc + item.quantity, 0);
}
