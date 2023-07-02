export async function PopulateCart(cart) {
  return await fetch("/api/cart/calculate-price", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cart),
  })
    .then(async (res) => {
      if (res.status === 200) {
        const data = (await res.json()).data;
        return data;
      }
      throw new Error("Could not populate cart");
    })
    .catch((e) => {
      throw e;
    });
}
