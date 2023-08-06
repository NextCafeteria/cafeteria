import { OrderStatus } from "../order_status";
import useSWR, { useSWRConfig } from "swr";

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

export function useGetOrders(customerId = null) {
  const { fetcher } = useSWRConfig();
  const url = customerId
    ? `/api/customers/orders?customerId=${customerId}`
    : `/api/customers/orders`;
  const { data, error, isLoading } = useSWR(url, fetcher);
  return {
    orderItems: data?.data,
    error: error,
    isLoading: isLoading,
  };
}

export function useGetStaffOrder(orderId = null) {
  const { fetcher } = useSWRConfig();
  const { data, error, isLoading, mutate } = useSWR(
    `/api/staffs/orders/${orderId}`,
    fetcher
  );
  return {
    order: data?.data,
    error: error,
    isLoading: isLoading,
    mutateOrder: mutate,
  };
}

function useGetStaffOrdersByStatus(status) {
  const { fetcher } = useSWRConfig();
  const { data, error, isLoading, mutate } = useSWR(
    `/api/staffs/orders?status_type=${status}`,
    fetcher
  );
  return {
    orderItems: data?.data,
    error: error,
    isLoading: isLoading,
    mutate,
  };
}
export function useGetStaffQueuedOrders() {
  return useGetStaffOrdersByStatus("new");
}
export function useGetStaffProcessingOrders() {
  return useGetStaffOrdersByStatus("processing");
}
export function useGetStaffInactiveOrders() {
  return useGetStaffOrdersByStatus("inactive");
}
export function useGetOrder(orderId) {
  const { fetcher } = useSWRConfig();
  const { data, error, isLoading, mutate } = useSWR(
    `/api/customers/orders/${orderId}`,
    fetcher
  );
  return {
    order: data?.data,
    error: error,
    isLoading: isLoading,
    mutateOrder: mutate,
  };
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

export async function ResponseOrder(orderId, responseValue) {
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
  return data;
}
