"use client";
import { useEffect, useState } from "react";
import { useTranslation } from "@/app/i18n/client";
import { useRouter } from "next/navigation";
import { useGetProduct, UpdateProduct } from "@/lib/requests/products";
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

  const [isUpdatingImage, setIsUpdatingImage] = useState(false);
  const [updateImageProgress, setUpdateProgress] = useState(0);

  const { product, error, isLoading, mutateProduct } = useGetProduct(productId);
  if (isLoading) console.log("loading");
  if (error) {
    console.log(error);
    alert("Could not get product");
    router.push(`/${lng}/dashboard/products`);
  }
  const setProductData = function (productData) {
    mutateProduct(productData, {revalidate: false});
  };   

  const updateProductCustomization = (customizationId, customizationData) => {
    if(customizationData === null) {
      const customizationsCopy = {...product.customizations};
      delete customizationsCopy[customizationId];
      setProductData({
        ...product,
        customizations: customizationsCopy,
      });
  }
    else {
      setProductData({
        ...product,
        customizations: {
          ...product.customizations,
          [customizationId]: customizationData,
        },
    });
    }
  };

  const handleSaveProduct = () => {
    UpdateProduct(
      productId,
      product,
    ).then(() => {
      alert("Product updated");
      router.push(`/${lng}/dashboard/products`);
    }
    ).catch((e) => {
      console.log(e);
      alert("Could not update product");
    });
  };

  const { t } = useTranslation(lng, "common");

  return (
    <main className="flex justify-center p-2 pb-[200px]">
      <div className="w-full max-w-[1000px] md:w-[1000px] mx-auto font-mono text-sm">
        <div className="pb-3 pt-2 border-b-2 border-gray-800">
          <div className="flex w-full text-2xl px-2">
            <BackButton href={`/${lng}/dashboard/products`} />
            {t("Product")}: {product?.name}
          </div>
        </div>


        {
          isLoading ? (
            <div className="flex flex-col items-center justify-center w-full h-[500px]">
              loading...
            </div>
          ) : (
<div className="flex flex-row w-full my-2 mx-1 rounded-md">
          <div className="flex flex-col items-begin justify-center w-full relative">
            <p className="text-md font-bold">{t("Name")}</p>
            <input
              type="text"
              className="w-full border-[1px] border-gray-600 rounded-md p-2 mb-2"
              value={product?.name}
              onChange={(e) => {
                mutateProduct({ ...product,
                  name: e.target.value }, {revalidate: false});
              }}
            />
            <p className="text-md font-bold">{t("Description")}</p>
            <input
              type="text"
              className="w-full border-[1px] border-gray-600 rounded-md p-2 mb-2"
              value={product?.description}
              onChange={(e) => {
                mutateProduct({ ...product,
                  description: e.target.value }, {revalidate: false});
              }}
            />
            <p className="text-md font-bold">{t("Price")}</p>
            <input
              type="number"
              className="w-full border-[1px] border-gray-600 rounded-md p-2 mb-2"
              value={product?.price}
              onChange={(e) => {
                mutateProduct({ ...product,
                  price: parseFloat(e.target.value) }, {revalidate: false});
              }}
            />
          </div>

          <div className="rounded-md w-[200px] justify-center align-middle items-center relative overflow-hidden border-[1px] m-2 border-gray-600 h-fit pb-[30px]">
          {
          isUpdatingImage ? (
            <div className="flex absolute left-0 bottom-0 bg-gray-100 w-20 h-10 opacity-70 transition-opacity duration-[0.2s] ease-[ease-in-out] content-center items-center">
              {updateImageProgress + "%"}
            </div>
          ) : 
          (
              product?.image ? (
                <Image
                alt={product?.name}
                src={product?.image}
                width={200}
                height={200}
                className="overflow-hidden shadow-md w-[200px] h-auto"
              />) : (
                <Skeleton width={200} height={100} />
              )
          )
          }

          <ImageUploader
            styles="absolute left-0 bottom-0 bg-gray-100 w-full h-[30px] duration-[0.2s] ease-[ease-in-out]"
            handleUploadStart={() => {
              setIsUpdatingImage(true);
            }}
            handleUploadSuccess={(url) => {
              setIsUpdatingImage(false);
              setProductData({...product, image: url});
            }}
            handleUploadProgress={(progress) => {
              setUpdateProgress(progress);
            }}
          />
        </div>
        </div>
          )
        }
        

        {product?.customizations && Object.keys(product?.customizations).sort(
          (a, b) => {
            a.order - b.order;
          }
        ).map((customizationId, id) => (
          <CustomizationCard
            key={customizationId}
            id={customizationId}
            customization={...product?.customizations[customizationId]}
            lng={lng}
            updateCustomization={updateProductCustomization}
          />
        ))}
        {(product?.customizations && !Object.keys(product?.customizations).length) && (
          <p className="text-sm">
            {t("Add a customization by clicking the button below.")}
          </p>
        )}
        <button type="button" className="focus:outline-none bg-green-600 text-white hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2 mr-2 mb-2:bg-red-700 w-full mt-1"
          onClick={() => {
            setProductData({ ...product,
              customizations: {
                ...product?.customizations,
                [uuidv4()]: {
                  order: Math.max(...Object.keys(product?.customizations).map((customizationId) => product?.customizations[customizationId].order)) + 1,
                  name: "",
                  description: "",
                  price: 0,
                  options: {},
                },
              },
            });
          }}
        >
          { t("Add Customization") }
        </button>
      </div>
      <div className="btn btn-primary mb-2 w-full max-w-[700px] fixed bottom-[90px]  md:bottom-[20px]">
        <div
          onClick={handleSaveProduct}
        >
          <span className="text-2xl"
          >+ {t("Save changes")}</span>
        </div>
      </div>
    </main>
  );
}