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

export function useGetProduct(productId) {
  const { fetcher } = useSWRConfig();
  const { data, error, isLoading, mutate } = useSWR(
    `/api/products/${productId}`,
    fetcher
  );
  const mutateProduct = function (product, options) {
    mutate({ ...data, data: product }, options);
  };
  return {
    product: data?.data,
    error,
    isLoading,
    mutateProduct,
  };
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

export async function ToggleProductAvailability(productId) {
  return await fetch(`/api/products/${productId}/toggle-availability`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => {
    if (res.status === 200) {
      return res.json();
    }
    throw new Error("Could not toggle product availability");
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
