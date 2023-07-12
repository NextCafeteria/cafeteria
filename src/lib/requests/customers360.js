export const GetCustomer = async (customerEmail = null) => {
  return await fetch(`/api/customers-360?customerEmail=${customerEmail}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then(async (response) => {
    const data = (await response.json())?.data;
    return data;
  });
};
