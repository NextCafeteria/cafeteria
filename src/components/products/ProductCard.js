import {
  DeleteProduct,
  ToggleProductAvailability,
} from "@/lib/requests/products";

import Image from "next/image";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import { useState } from "react";
import { useTranslation } from "@/app/i18n/client";

export default function ({
  lng,
  id,
  name,
  price,
  description,
  image,
  customizations,
  isAvailable,
  isLoading,
}) {
  const { t } = useTranslation(lng, "common");
  const [localIsAvailable, setLocalIsAvailable] = useState(
    isAvailable === undefined ? true : isAvailable
  );

  const handleDeleteProduct = () => {
    if (confirm(t("Are you sure you want to delete this product?"))) {
      DeleteProduct(id)
        .then(() => {
          alert(t("Product deleted"));
          window.location.reload();
        })
        .catch((e) => {
          console.log(e);
          alert(t("Could not delete product"));
        });
    }
  };

  const handleToggleAvailability = () => {
    if (
      confirm(t("Are you sure you want to toggle this product's availability?"))
    ) {
      ToggleProductAvailability(id)
        .then(() => {
          setLocalIsAvailable(!localIsAvailable);
        })
        .catch((e) => {
          console.log(e);
          alert(t("Could not toggle product availability"));
        });
    }
  };

  return (
    <Link
      href={isLoading ? "" : `/${lng}/dashboard/products/product-details/${id}`}
    >
      <div className="relative flex flex-grow w-full p-4 min-h-[180px] mx-1 border-[1px] border-gray-600 rounded-md hover:bg-gray-200 mb-2">
        <div className="w-full relative">
          <h2 className="text-lg font-bold mb-2">
            {isLoading ? <Skeleton width={70} /> : t(name)}
          </h2>
          <p className="text-sm mt-2 mb-2">
            {isLoading ? <Skeleton width={200} /> : t(description)}
          </p>
          <p className="text-sm mt-2 mb-2">
            <b>{t("Base Price")}:</b>{" "}
            {isLoading ? (
              <Skeleton width={50} />
            ) : (
              price?.toLocaleString("vi-VN") + "đ"
            )}
          </p>
          <p className="text-sm mt-2 mb-2">
            {isLoading ? (
              <Skeleton width={50} />
            ) : (
              Object.keys(customizations).length + " " + t("customizations")
            )}
          </p>
        </div>
        <div>
          <Image
            src={image}
            alt={t(name)}
            width={128}
            height={64}
            className="w-[200px] h-auto rounded-md"
          />
        </div>
        <div className="absolute bottom-4 right-4">
          {localIsAvailable ? (
            <button
              className="px-1 py-0.5 text-sm bg-blue-500 text-white rounded-md w-[100px] mr-2"
              onClick={(e) => {
                e.preventDefault();
                handleToggleAvailability();
              }}
            >
              {t("Available")}
            </button>
          ) : (
            <button
              className="px-1 py-0.5 text-sm bg-gray-500 text-white rounded-md w-[100px] mr-2"
              onClick={(e) => {
                e.preventDefault();
                handleToggleAvailability();
              }}
            >
              {t("Unavailable")}
            </button>
          )}
          <button
            className="px-1 py-0.5 text-sm bg-red-500 text-white rounded-md w-[100px]"
            onClick={(e) => {
              e.preventDefault();
              handleDeleteProduct();
            }}
          >
            {t("Delete")}
          </button>
        </div>
      </div>
    </Link>
  );
}
