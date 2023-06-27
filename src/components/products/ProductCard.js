import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { useTranslation } from "@/app/i18n/client";

export default function ({
  lng,
  id,
  name,
  price,
  description,
  image,
  customizations,
  isLoading,
}) {
  const { t } = useTranslation(lng, "common");

  return (
    <Link href={isLoading ? "" : `/${lng}/products/product-details/${id}`}>
      <div className="relative flex flex-col items-center justify-center w-full p-4 min-h-[150px] mx-1 border-[1px] border-gray-600 rounded-md hover:bg-gray-200 mb-2">
        <img
            src={image}
            alt={t(name)}
            width={128}
            height={64}
            className="absolute right-2 top-2 w-28 h-auto max-h-28 rounded-md"
        />
        <div className="w-full relative">
          <h2 className="text-lg font-bold mb-2">
            {isLoading ? <Skeleton width={70} /> : name}
          </h2>
          <p className="text-sm mt-2 mb-2">
            {isLoading ? <Skeleton width={200} /> : description}
          </p>
          <p className="text-sm mt-2 mb-2">
            <b>{t("Base Price:")}</b> {isLoading ? <Skeleton width={50} /> : "$" + price}
          </p>
          <p className="text-sm mt-2 mb-2">
            {isLoading ? <Skeleton width={50} /> : Object.keys(customizations).length + " " + t("customizations")}
          </p>
        </div>
        <div className="absolute bottom-4 right-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
            />
          </svg>
        </div>
      </div>
    </Link>
  );
}
