"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "@/app/i18n/client";
import LangSelector from "@/components/LangSelector";
import { useGetProducts } from "@/lib/requests/products";
import ProductCardSkeleton from "@/components/skeletons/ProductCard";

export default function Home({ params: { lng } }) {
  const router = useRouter();

  const { products, error, isLoading } = useGetProducts();
  if (error) {
    console.log(error);
  }

  const { t } = useTranslation(lng, "common");
  return (
    <main className="flex justify-center p-2 pb-[200px]">
      <div className="max-w-[600px] md:w-[600px] mx-auto font-mono text-sm">
        <div className="block w-full justify-center border-b-2 border-gray-800 pb-3 pt-2 text-2xl px-2 mb-2">
          {t("title")}
          <LangSelector />
        </div>

        <div className="flex flex-wrap justify-center w-full">
          {isLoading
            ? Array.from({ length: 5 }, (e, i) => i).map((i) => (
                <div
                  key={i}
                  className="flex flex-col items-center justify-center w-full p-4 border-[1px] border-gray-600 min-h-[160px] my-1 mx-1 rounded-md"
                >
                  <div className="flex flex-col items-begin justify-center w-full relative">
                    <div className="animate-pulse bg-gray-300 rounded-md w-24 h-24"></div>
                  </div>
                </div>
              ))
            : products &&
              products.map((product, key) => (
                <ProductCardSkeleton />
              ))}
        </div>
      </div>
    </main>
  );
}
