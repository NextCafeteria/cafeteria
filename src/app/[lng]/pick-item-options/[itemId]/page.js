"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
const itemsOptions = require("../../food_options.json");
import { useTranslation } from "../../../i18n/client";

export default function PickOptions({ params: { lng, itemId } }) {
  const router = useRouter();

  // If item id is not valid, redirect to home page
  if (!itemId || !itemsOptions[itemId]) {
    router.push(`/${lng}`);
  }

  // Get item options
  let itemOptions = itemsOptions[itemId];

  // Set total price
  const [totalPrice, setTotalPrice] = useState(itemOptions.price);

  // quantity
  const [quantity, setQuantity] = useState(1);

  // Set default options
  const [selectedOptions, setSelectedOptions] = useState({});

  useEffect(() => {
    const options = {};
    itemOptions.customizations.forEach((customization, customizationIndex) => {
      options[customizationIndex] = 0;
    });
    setSelectedOptions(options);
  }, []);

  function updatePrice(selectedOptions, quantity) {
    if (!itemOptions || !itemOptions.customizations) {
      return 0.0;
    }
    let newTotalPrice = itemOptions.price;
    itemOptions.customizations.forEach((customization, customizationIndex) => {
      const optionIndex = selectedOptions[customizationIndex];
      if (optionIndex === undefined) {
        return 0.0;
      }
      const option = customization.options[optionIndex];
      newTotalPrice += option.price;
    });

    newTotalPrice *= quantity;
    setTotalPrice(newTotalPrice);
  }

  function updateOption(customizationIndex, optionIndex) {
    const options = { ...selectedOptions };
    options[customizationIndex] = optionIndex;
    setSelectedOptions(options);

    updatePrice(options, quantity);
  }

  function addToCart() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push({
      id: itemOptions.id,
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
    itemOptions && (
      <main className="flex justify-center p-2 pb-[100px]">
        <div className="w-full max-w-[600px] md:w-[600px] mx-auto font-mono text-sm">
          <p className="flex w-full justify-between border-b-2 border-gray-800 pb-3 pt-2 text-2xl px-2 mb-2">
            {t("Options")}
            <a href={`/${lng}`}>
              <span>X</span>
            </a>
          </p>
          <div className="flex flex-col items-center justify-center w-full p-4 min-h-[100px] my-1 mx-1 rounded-md">
            <div className="flex flex-col items-begin justify-center w-full relative">
              <Image
                src={itemOptions.image}
                alt={itemOptions.name}
                width={128}
                height={128}
                className="absolute right-0 top-0 w-24 h-auto rounded-sm"
              />
              <p className="text-xl font-bold">{itemOptions?.name}</p>
              <p className="text-sm">{itemOptions?.description}</p>
              <p className="text-sm">Base price: ${itemOptions?.price}</p>
            </div>

            {/* Show customizations */}
            {itemOptions.customizations && (
              <div className="flex flex-col items-begin justify-center w-full mt-4">
                {itemOptions.customizations.map(
                  (customization, customizationIndex) => (
                    <div
                      key={customizationIndex}
                      className="flex flex-col items-begin justify-center w-full mt-2 border-[1px] border-gray-600 rounded-md px-2 py-2"
                    >
                      <p className="text-sm font-bold">{customization.name}</p>
                      <div className="flex flex-col items-center justify-center w-full mt-2">
                        {customization.options.map((option, index) => (
                          <div
                            key={index}
                            className="w-full p-2 border-b-[1px] "
                          >
                            <input
                              type="radio"
                              id={option.name}
                              name={customization.name}
                              value={option.name}
                              checked={
                                selectedOptions[customizationIndex] === index
                              }
                              onChange={(e) => {
                                if (e.target.checked) {
                                  updateOption(customizationIndex, index);
                                }
                              }}
                            />
                            <label className="pl-2 w-100" htmlFor={option.name}>
                              {option.name} (${option.price})
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                )}
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
          className="w-full max-w-[700px] fixed bottom-0 md:bottom-2 h-[50px] border-t-[1px] md:border-[1px] border-gray-600 p-2 bg-green-200 md:rounded-md"
          onClick={addToCart}
        >
          <span className="text-2xl">+ {t("Add to cart")}</span>
          <span className="text-2xl float-right">
            ${totalPrice?.toFixed(2)}
          </span>
        </div>
      </main>
    )
  );
}
