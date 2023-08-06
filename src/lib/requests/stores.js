import useSWR, { useSWRConfig } from "swr";
export function useGetStores() {
  const { fetcher } = useSWRConfig();
  const { data, error, isLoading } = useSWR("/api/stores", fetcher);
  return {
    stores: data?.data,
    error,
    isLoading,
  };
}

export async function CreateStore(inputData, onSuccess = null, onError = null) {
  const response = await fetch("/api/stores", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(inputData),
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

export function useGetStore(storeId) {
  const { fetcher } = useSWRConfig();
  const { data, error, isLoading, mutate } = useSWR(
    `/api/stores/${storeId}`,
    fetcher
  );
  const mutateStore = function (store, options) {
    mutate({ ...data, data: store }, options);
  };
  return {
    store: data?.data,
    error,
    isLoading,
    mutateStore,
  };
}

export async function UpdateStore(storeId, storeData) {
  const response = await fetch(`/api/stores/${storeId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(storeData),
  });

  const data = await response.json();
  return data;
}

export async function DeleteStore(storeId) {
  const response = await fetch(`/api/stores/${storeId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  return data;
}

export async function AddStaff(
  storeId,
  email,
  role,
  onSuccess = null,
  onError = null
) {
  const response = await fetch(`/api/stores/${storeId}/staffs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: email, role: role, storeId: storeId }),
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

export async function RemoveStaff(
  storeId,
  userId,
  onSuccess = null,
  onError = null
) {
  const response = await fetch(
    `/api/stores/${storeId}/staffs?userId=${userId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

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
