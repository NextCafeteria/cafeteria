export const GetCustomer = async (customerEmail = null) => {
  return await fetch(`/api/customers-360?customerEmail=${customerEmail}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then(async (response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    if (response.status != 200) {
      throw new Error("Network response was not ok");
    }
    const data = (await response.json())?.data;
    if (!data) {
      throw new Error("Network response was not ok");
    }
    return data;
  });
};
