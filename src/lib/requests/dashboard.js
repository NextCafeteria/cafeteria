export async function GetRevenueInfo() {
  const response = await fetch(`/api/dashboard/revenue`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  return data;
}

export async function GetCustomerInfoLastWeek() {
  const response = await fetch(`/api/dashboard/revenue`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  return data;
}

export async function GetCustomerInfoLastYear() {
  GetRevenueByTime(onSuccess, onError, "Lastyear");
}

async function GetRevenueByTime(onSuccess = null, onError = null, time = null) {
  const response = await fetch(`/api/dashboard/revenue=${time}`, {
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

// return a list of top seller drinks

//
