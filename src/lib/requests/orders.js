export async function PlaceOrder(items, onSuccess = null, onError = null) {
  const response = await fetch("/api/customers/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(items),
  });

  const data = await response.json();
  if (data?.success) {
    if (onSuccess) {
      onSuccess(data?.data);
    }
  } else {
    if (onError) {
      onError(data);
    }
  }
}

export async function GetOrders(onSuccess = null, onError = null) {
  const response = await fetch("/api/customers/orders", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  if (data?.success) {
    if (onSuccess) {
      onSuccess(data?.data);
    }
  } else {
    if (onError) {
      onError(data);
    }
  }
}
