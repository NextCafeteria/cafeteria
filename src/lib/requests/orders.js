import { OrderStatus } from "../order_status";

export async function PlaceOrder(
  items,
  deliveryAddress,
  storeId,
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
      storeId: storeId,
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

export async function GetStaffOrder(
  orderId = null,
  onSuccess = null,
  onError = null
) {
  const response = await fetch(`/api/staffs/orders/${orderId}`, {
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

async function GetStaffOrdersByStatus(
  onSuccess = null,
  onError = null,
  status = null
) {
  const response = await fetch(`/api/staffs/orders?status_type=${status}`, {
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
export async function GetStaffQueuedOrders(onSuccess = null, onError = null) {
  GetStaffOrdersByStatus(onSuccess, onError, "new");
}
export async function GetStaffProcessingOrders(
  onSuccess = null,
  onError = null
) {
  GetStaffOrdersByStatus(onSuccess, onError, "processing");
}
export async function GetStaffInactiveOrders(onSuccess = null, onError = null) {
  GetStaffOrdersByStatus(onSuccess, onError, "inactive");
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

export async function ConfirmOrder(orderId, onSuccess = null, onError = null) {
  await UpdateStaffOrder(orderId, OrderStatus.CONFIRMED, onSuccess, onError);
}

export async function PrepareOrder(orderId, onSuccess = null, onError = null) {
  await UpdateStaffOrder(orderId, OrderStatus.PREPARING, onSuccess, onError);
}

export async function CompleteOrder(orderId, onSuccess = null, onError = null) {
  await UpdateStaffOrder(orderId, OrderStatus.COMPLETED, onSuccess, onError);
}

export async function UpdateStaffOrder(
  orderId,
  status,
  onSuccess = null,
  onError = null
) {
  const response = await fetch(`/api/staffs/orders/${orderId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      status: status,
    }),
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

export async function RateOrder(
  orderId,
  rating,
  commentValue,
  onSuccess = null,
  onError = null
) {
  const response = await fetch(`/api/customers/orders/${orderId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      rating: rating,
      comment_value: commentValue,
    }),
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

export async function ResponseOrder(
  orderId,
  responseValue,
  onSuccess = null,
  onError = null
) {
  const response = await fetch(`/api/staffs/orders/${orderId}/response`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      response_value: responseValue,
    }),
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
