"use client";
import { useEffect, useState } from "react";
import { useTranslation } from "@/app/i18n/client";
import { useRouter } from "next/navigation";
import { GetProduct } from "@/lib/requests/products";
import { useSession } from "next-auth/react";
import BackButton from "@/components/buttons/BackButton";
import CustomizationCard from "@/components/products/CustomizationCard";

export default function ({ params: { lng, productId } }) {
  const router = useRouter();
  const session = useSession();
  if (session && session.status === "unauthenticated") {
    router.push(`/${lng}/login`);
  }

  const [productData, setProductData] = useState(null);

  const refetchProductData = () => {
    GetProduct(
      productId,
      (data) => {
        setProductData(data);
      },
      (e) => {
        console.log(e);
        alert("Could not get products");
        router.push(`/${lng}/products`);
      }
    );
  };

  useEffect(() => {
    refetchProductData();
  }, []);

  const updateProductCustomization = (customizationId, customizationData) => {
    let productDataCopy = { ...productData };
    productDataCopy.customizations[customizationId] = customizationData;
    setProductData(productDataCopy);
  };

  const { t } = useTranslation(lng, "common");

  return (
    <main className="flex justify-center p-2 pb-[200px]">
      <div className="w-full max-w-[600px] md:w-[600px] mx-auto font-mono text-sm">
        <div className="pb-3 pt-2 border-b-2 border-gray-800">
          <div className="flex w-full text-2xl px-2">
            <BackButton href={`/${lng}/products`} />
            {t("Product")}: {productData?.name}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center w-full my-2 mx-1 rounded-md">
          <div className="flex flex-col items-begin justify-center w-full relative">
            <p className="text-md font-bold">{t("Name")}</p>
            <input
              type="text"
              className="w-full border-[1px] border-gray-600 rounded-md p-2 mb-4"
              value={productData?.name}
              onChange={(e) => {
                let productDataCopy = { ...productData };
                productDataCopy.name = e.target.value;
                setProductData(productDataCopy);
              }}
            />
            <p className="text-md font-bold">{t("Description")}</p>
            <input
              type="text"
              className="w-full border-[1px] border-gray-600 rounded-md p-2 mb-4"
              value={productData?.description}
              onChange={(e) => {
                let productDataCopy = { ...productData };
                productDataCopy.description = e.target.value;
                setProductData(productDataCopy);
              }}
            />
          </div>
        </div>

        <div className="text-xl font-bold mt-2 mb-4">{t("Customizations")}</div>
        {productData?.customizations && Object.keys(productData?.customizations).sort().map((customization, id) => (
          <CustomizationCard
            key={customization}
            customization={...productData?.customizations[customization]}
            lng={lng}
            productId={productId}
            updateCustomization={updateProductCustomization}
          />
        ))}
        {(productData?.customizations && !Object.keys(productData?.customizations).length) && (
          <p className="text-sm">
            {t("Add a customization by clicking the button below.")}
          </p>
        )}
        <button type="button" class="focus:outline-none bg-green-700 text-white hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2 mr-2 mb-2:bg-red-700 w-full mt-1">
          Add Customization
        </button>
      </div>
      <div className="w-full max-w-[700px] fixed bottom-[90px] md:bottom-[20px]">
        <div
          className="h-[50px] border-t-[1px] md:border-[1px] border-gray-600 p-2 bg-green-700 text-white md:rounded-md"
        >
          <span className="text-2xl">+ {t("Save changes")}</span>
        </div>
      </div>
    </main>
  );
}
