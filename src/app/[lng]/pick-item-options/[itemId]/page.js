"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { useTranslation } from "@/app/i18n/client";
import { useGetProduct } from "@/lib/requests/products";
import XButton from "@/components/buttons/XButton";
import { toast } from "react-toastify";
import { useGetCommonSettings } from "@/lib/requests/settings";
import { formatPrice } from "@/lib/utils";

export default function PickOptions({ params: { lng, itemId } }) {
  const router = useRouter();
  const session = useSession();
  if (session && session?.status === "unauthenticated") {
    router.push(`/${lng}/login`);
    return <></>;
  }

  const { data: commonSettings } = useGetCommonSettings();

  // If item id is not valid, redirect to home page
  if (!itemId) {
    router.push(`/${lng}`);
  }

  // Quantity
  const [quantity, setQuantity] = useState(1);

  // Set default options
  const [selectedOptions, setSelectedOptions] = useState({});

  // Get product data
  const { product, error, isLoading } = useGetProduct(itemId);
  // Set total price
  const [totalPrice, setTotalPrice] = useState(0.0);
  if (error) {
    console.log(error);
    toast.error("Could not get product");
    router.push(`/${lng}`);
  }
  useEffect(() => {
    const options = {}; // { customizationId: optionId }
    if (product?.customizations) {
      Object.keys(product.customizations).map((customizationId, k) => {
        const customization = product.customizations[customizationId];
        if (customization.options) {
          const allOptions = Object.keys(customization.options).sort((a, b) => {
            return (
              customization.options[a].order - customization.options[b].order
            );
          });
          options[customizationId] = allOptions[0];
        }
      });
      setSelectedOptions(options);
      setTotalPrice(product?.price);
    }
  }, [product]);

  function updatePrice(selectedOptions, quantity) {
    if (!product || !product?.customizations) {
      return 0.0;
    }
    let newTotalPrice = product?.price;
    for (const customizationId in selectedOptions) {
      const optionId = selectedOptions[customizationId];
      const option = product.customizations[customizationId].options[optionId];
      newTotalPrice += parseFloat(option.price);
    }

    newTotalPrice *= quantity;
    setTotalPrice(newTotalPrice);
  }

  function updateOption(customizationId, optionId) {
    const options = { ...selectedOptions };
    options[customizationId] = optionId;
    setSelectedOptions(options);

    updatePrice(options, quantity);
  }

  function addToCart() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push({
      id: product.id,
      selectedOptions,
      quantity,
    });
    localStorage.setItem("cart", JSON.stringify(cart));
    router.push(`/${lng}/cart`);
  }

  function handleNewQuantity(newQuantity) {
    setQuantity(newQuantity);
    updatePrice(selectedOptions, newQuantity);
  }

  const { t } = useTranslation(lng, "common");
  return (
    product && (
      <main className="flex justify-center p-2 pb-[200px]">
        <div className="w-full max-w-[600px] md:w-[1000px] mx-auto font-mono text-sm">
          <div className="flex w-full justify-between border-b-2 border-gray-800 pb-3 pt-2 text-2xl px-2 mb-2">
            {t("Options")}
            <XButton />
          </div>
          <div className="flex flex-col items-center justify-center w-full p-2 min-h-[100px] my-1 mx-0 rounded-md">
            <div className="product-content flex items-center justify-between bg-white w-full p-4 border-[1px] border-gray-600 min-h-[160px] my-1 mx-1 rounded-md">
              <div className="flex flex-col items-begin justify-center w-fit relative">
                <p className="text-xl font-bold">{t(product?.name)}</p>
                <p className="text-sm">{t(product?.description)}</p>
                <p className="text-sm">
                  {t("Base price")}:{" "}
                  {formatPrice(
                    product?.price,
                    commonSettings?.currencyPrefix,
                    commonSettings?.currencySuffix,
                    commonSettings?.currencyDecimal
                  )}
                </p>
              </div>
              <div className="h-32 w-32 rounded-sm">
                <Image
                  src={product?.image}
                  alt={t(product?.name)}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover rounded"
                />
              </div>
            </div>

            {/* Show customizations */}
            {product?.customizations && (
              <div className="flex flex-col items-begin justify-center w-full mt-4">
                {Object.keys(product?.customizations)
                  .sort(
                    (a, b) =>
                      product?.customizations[a].order -
                      product?.customizations[b].order
                  )
                  .map((customizationId, customizationIndex) => (
                    <div
                      key={customizationIndex}
                      className="flex flex-col items-begin justify-center w-full mt-2 border-[1px] border-gray-600 rounded-md px-2 py-2"
                    >
                      <p className="text-sm font-bold">
                        {t(product?.customizations[customizationId].name)}
                      </p>
                      <div className="flex flex-col items-center justify-center w-full mt-2">
                        {product?.customizations[customizationId]?.options &&
                          Object.keys(
                            product?.customizations[customizationId]?.options
                          )
                            .sort(
                              (a, b) =>
                                product?.customizations[customizationId]
                                  ?.options[a].order -
                                product?.customizations[customizationId]
                                  ?.options[b].order
                            )
                            .map((optionId, index) => {
                              const option =
                                product?.customizations[customizationId]
                                  ?.options[optionId];
                              const isAvailable =
                                option.isAvailable === undefined ||
                                option.isAvailable;
                              return (
                                <div
                                  key={index}
                                  className="w-full p-2 border-b-[1px] cursor-pointer"
                                  onClick={() => {
                                    if (!isAvailable) {
                                      return;
                                    }
                                    const input = document.getElementById(
                                      t(optionId)
                                    );
                                    input.checked = true;
                                    updateOption(customizationId, optionId);
                                  }}
                                >
                                  <input
                                    type="radio"
                                    id={t(optionId)}
                                    name={t(
                                      product.customizations[customizationId]
                                        .name
                                    )}
                                    disabled={!isAvailable}
                                    value={t(option.name)}
                                    checked={
                                      selectedOptions[customizationId] ==
                                      optionId
                                    }
                                  />
                                  <label
                                    className={
                                      "pl-2 w-100 cursor-pointer" +
                                      (!isAvailable ? " text-gray-400" : "")
                                    }
                                    htmlFor={t(option.name)}
                                  >
                                    {t(option.name)} (
                                    {formatPrice(
                                      option.price,
                                      commonSettings?.currencyPrefix,
                                      commonSettings?.currencySuffix,
                                      commonSettings?.currencyDecimal
                                    )}
                                    )
                                  </label>
                                </div>
                              );
                            })}
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {/* Show quantity */}
            <div className="flex flex-col items-begin justify-center w-full mt-4">
              <p className="text-lg font-bold text-center mb-2">
                {t("Quantity")}
              </p>
              <div className="flex flex-row items-center justify-center w-full mt-2">
                <button
                  className="w-10 h-10 border-2 border-gray-600 rounded-md"
                  onClick={() => {
                    if (quantity > 1) {
                      handleNewQuantity(quantity - 1);
                    }
                  }}
                >
                  -
                </button>
                <input
                  type="text"
                  className="w-20 px-2 text-center font-bold"
                  value={quantity}
                  onChange={(e) => {
                    handleNewQuantity(e.target.value);
                  }}
                />
                <button
                  className="w-10 h-10 border-2 border-gray-600 rounded-md"
                  onClick={() => {
                    handleNewQuantity(quantity + 1);
                  }}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
        <div
          className="btn btn-primary mb-2 w-full max-w-[700px] fixed bottom-[90px]  md:bottom-[20px] h-[50px]  md:rounded-md"
          onClick={addToCart}
        >
          <span className="text-2xl">+ {t("Add to cart")}</span>
          <span className="text-2xl float-right">
            {formatPrice(
              totalPrice,
              commonSettings?.currencyPrefix,
              commonSettings?.currencySuffix,
              commonSettings?.currencyDecimal
            )}
          </span>
        </div>
      </main>
    )
  );
}
