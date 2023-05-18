export async function PlaceOrder(items) {
  // Call the API to place the order
  const response = await fetch("/api/customers/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(items),
  });

  const data = await response.json();
  if (data?.success) {
    // Clear the cart
    // localStorage.setItem('cart', JSON.stringify([]));
    alert("Order placed successfully"); // TODO: Redirect to order page, Use toast
  } else {
    alert("Order failed. Error: " + data?.error); // TODO: Use toast
  }
}
