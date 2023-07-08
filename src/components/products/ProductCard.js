import Link from "next/link";
import Image from "next/image";
import Skeleton from "react-loading-skeleton";

import { DeleteProduct } from "@/lib/requests/products";
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

  return (
    <Link href={isLoading ? "" : `/${lng}/products/product-details/${id}`}>
      <div className="relative flex flex-grow w-full p-4 min-h-[180px] mx-1 border-[1px] border-gray-600 rounded-md hover:bg-gray-200 mb-2">
        <div className="w-full relative">
          <h2 className="text-lg font-bold mb-2">
            {isLoading ? <Skeleton width={70} /> : t(name)}
          </h2>
          <p className="text-sm mt-2 mb-2">
            {isLoading ? <Skeleton width={200} /> : description}
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
