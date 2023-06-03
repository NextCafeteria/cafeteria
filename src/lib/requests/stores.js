export async function GetStores(onSuccess = null, onError = null) {
  const response = await fetch("/api/stores", {
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

export async function GetStore(storeId, onSuccess = null, onError = null) {
  const response = await fetch(`/api/stores/${storeId}`, {
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
