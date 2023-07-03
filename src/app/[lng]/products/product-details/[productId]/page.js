"use client";
import { useEffect, useState } from "react";
import { useTranslation } from "@/app/i18n/client";
import { useRouter } from "next/navigation";
import { GetProduct, UpdateProduct } from "@/lib/requests/products";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Skeleton from "react-loading-skeleton";

import BackButton from "@/components/buttons/BackButton";
import CustomizationCard from "@/components/products/CustomizationCard";
import ImageUploader from "@/components/ImageUploader";
import { uuidv4 } from "@/lib/utils";

export default function ({ params: { lng, productId } }) {
  const router = useRouter();
  const session = useSession();
  if (session && session.status === "unauthenticated") {
    router.push(`/${lng}/login`);
  }

  const [productData, setProductData] = useState(null);
  const [isUpdatingImage, setIsUpdatingImage] = useState(false);
  const [updateImageProgress, setUpdateProgress] = useState(0);

  const refetchProductData = () => {
    GetProduct(productId).then((productData) => {
      setProductData(productData);
    }).catch((e) => {
      console.log(e);
      alert("Could not get product");
    });
  };

  useEffect(() => {
    refetchProductData();
  }, []);

  const updateProductCustomization = (customizationId, customizationData) => {
    let productDataCopy = { ...productData };
    if (customizationData === null) {
      delete productDataCopy.customizations[customizationId];
      setProductData(productDataCopy);
      return;
    }
    productDataCopy.customizations[customizationId] = customizationData;
    setProductData(productDataCopy);
  };

  const handleSaveProduct = () => {
    UpdateProduct(
      productId,
      productData,
    ).then(() => {
      alert("Product updated");
      router.push(`/${lng}/products`);
    }
    ).catch((e) => {
      console.log(e);
      alert("Could not update product");
    });
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

        <div className="flex flex-row w-full my-2 mx-1 rounded-md">
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

          <div className="rounded-md w-[200px] justify-center align-middle items-center relative overflow-hidden border-[1px] m-2 border-gray-600 h-fit pb-[30px]">
          {isUpdatingImage ? (
            <div className="flex absolute left-0 bottom-0 bg-gray-100 w-20 h-10 opacity-70 transition-opacity duration-[0.2s] ease-[ease-in-out] content-center items-center">
              {updateImageProgress + "%"}
            </div>
          ) : (
              productData?.image ? (
                <Image
                alt={productData?.name}
                src={productData?.image}
                width={200}
                height={200}
                className="overflow-hidden shadow-md w-[200px] h-auto"
              />) : (
                <Skeleton width={200} height={100} />
              )
          )}

          <ImageUploader
            styles="absolute left-0 bottom-0 bg-gray-100 w-full h-[30px] duration-[0.2s] ease-[ease-in-out]"
            handleUploadStart={() => {
              setIsUpdatingImage(true);
            }}
            handleUploadSuccess={(url) => {
              setIsUpdatingImage(false);
              let productDataCopy = { ...productData };
              productDataCopy.image = url;
              setProductData(productDataCopy);
            }}
            handleUploadProgress={(progress) => {
              setUpdateProgress(progress);
            }}
          />
        </div>
        </div>

        <div className="text-xl font-bold mt-2 mb-4">{t("Customizations")}</div>
        {productData?.customizations && Object.keys(productData?.customizations).sort(
          (a, b) => {
            a.order - b.order;
          }
        ).map((customizationId, id) => (
          <CustomizationCard
            key={customizationId}
            id={customizationId}
            customization={...productData?.customizations[customizationId]}
            lng={lng}
            updateCustomization={updateProductCustomization}
          />
        ))}
        {(productData?.customizations && !Object.keys(productData?.customizations).length) && (
          <p className="text-sm">
            {t("Add a customization by clicking the button below.")}
          </p>
        )}
        <button type="button" className="focus:outline-none bg-green-700 text-white hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2 mr-2 mb-2:bg-red-700 w-full mt-1"
          onClick={() => {
            let productDataCopy = { ...productData };
            if (!productDataCopy.customizations) {
              productDataCopy.customizations = {};
            }
            let customizationId = uuidv4();
            productDataCopy.customizations[customizationId] = {
              order: Math.max(...Object.keys(productDataCopy.customizations).map((customizationId) => productDataCopy.customizations[customizationId].order)) + 1,
              name: "",
              description: "",
              price: 0,
              options: {},
            };
            setProductData(productDataCopy);
          }}
        >
          Add Customization
        </button>
      </div>
      <div className="w-full max-w-[700px] fixed bottom-[90px] md:bottom-[20px]">
        <div
          className="h-[50px] border-t-[1px] md:border-[1px] border-gray-600 p-2 bg-green-700 text-white md:rounded-md"
          onClick={handleSaveProduct}
        >
          <span className="text-2xl"
          >+ {t("Save changes")}</span>
        </div>
      </div>
    </main>
  );
}
