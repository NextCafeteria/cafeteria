"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { useTranslation } from "@/app/i18n/client";
import { useGetProducts } from "@/lib/requests/products";
import ProductCard from "@/components/products/ProductCard";
import ProductCardSkeleton from "@/components/skeletons/ProductCard";

export default function ProductManagement({ params: { lng } }) {
  const router = useRouter();
  const session = useSession();
  if (session && session.status === "unauthenticated") {
    console.log("Not logged in.");
    router.push(`/${lng}/login`);
  }

  const productCss = `
    .product {
    width: 380px;
    min-height:182px;
    }
    @media screen and (min-width: 768px) {
    .product {
        width: min(max(280px, 35vw), 380px);
      }
    }`;
  const { products, error, isLoading } = useGetProducts();
  if (error) {
    console.log(error);
  }

  const handleAddProduct = () => {
    router.push(`/${lng}/dashboard/products/new-product`);
  };

  const { t } = useTranslation(lng, "common");
  return (
    <main className="flex justify-center p-2 pb-[200px]">
      <style>{productCss}</style>
      <div className="w-full max-w-[600px] md:w-[1000px] mx-auto font-mono text-sm">
        <div className="flex w-full justify-between pb-3 pt-2 text-3xl px-2 mb-2 mt-4">
          {t("Products")}
        </div>
        {products && products.length > 0 ? (
          products.map(
            (params, key) => (
              (params.lng = lng), (<ProductCard key={key} {...params} />)
            )
          )
        ) : isLoading ? (
          Array.from({ length: 3 }, (e, i) => i).map((i) => (
            <div className="w-full">
              <ProductCardSkeleton key={i} />
            </div>
          ))
        ) : (
          <p className="text-sm">
            {t("Add a product by clicking the button below.")}
          </p>
        )}
      </div>
      <div
        className="btn btn-primary mb-2 w-full max-w-[1000px] fixed bottom-[90px]  md:bottom-[20px] h-[50px] md:rounded-md"
        onClick={() => {
          router.push(`/${lng}/dashboard/products/new-product`);
        }}
      >
        <span className="text-2xl" onClick={handleAddProduct}>
          + {t("Add product")}
        </span>
      </div>
    </main>
  );
}
