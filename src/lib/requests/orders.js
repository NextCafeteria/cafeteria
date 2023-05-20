export async function PlaceOrder(
  items,
  deliveryAddress,
  onSuccess = null,
  onError = null
) {
  const response = await fetch("/api/customers/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      items: items,
      deliveryAddress: deliveryAddress,
    }),
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

export async function GetOrder(orderId, onSuccess = null, onError = null) {
  const response = await fetch(`/api/customers/orders/${orderId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  if (data?.success) {
    if (onSuccess) {
      onSuccess(data.data);
    }
  } else {
    if (onError) {
      onError(data);
    }
  }
}

export async function CancelOrder(orderId, onSuccess = null, onError = null) {
  const response = await fetch(`/api/customers/orders/${orderId}/cancel`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  if (data?.success) {
    if (onSuccess) {
      onSuccess(data.data);
    }
  } else {
    if (onError) {
      onError(data);
    }
  }
}
