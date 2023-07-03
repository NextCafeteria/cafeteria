import useSWR, { useSWRConfig } from "swr";

export function useGetProducts() {
  const { fetcher } = useSWRConfig();
  const { data, error, isLoading } = useSWR("/api/products", fetcher);
  if (error) throw new Error("Could not get products");
  return {
    products: data?.data,
    error: error,
    isLoading: isLoading,
  };
}

export async function CreateProduct(inputData) {
  return await fetch("/api/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(inputData),
  }).then((res) => {
    if (res.status === 200) {
      return res.json();
    }
    throw new Error("Could not update product");
  });
}

export async function GetProduct(productId) {
  return await fetch(`/api/products/${productId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then(async (res) => {
    if (res.status === 200) {
      const data = await res.json();
      return data?.data;
    }
    throw new Error("Could not get product");
  });
}

export async function DeleteProduct(productId) {
  return await fetch(`/api/products/${productId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => {
    if (res.status === 200) {
      return res.json();
    }
    throw new Error("Could not delete product");
  });
}

export async function UpdateProduct(productId, productData) {
  return await fetch(`/api/products/${productId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productData),
  }).then((res) => {
    if (res.status === 200) {
      return res.json();
    }
    throw new Error("Could not update product");
  });
}
