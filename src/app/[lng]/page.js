"use client";
import { useRouter } from "next/navigation";
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
            ? Array.from({ length: 3 }, (e, i) => i).map((i) => (
                <ProductCardSkeleton />
              ))
            : products &&
              products.map((product, key) => (
                <div
                  key={key}
                  className="clickable flex flex-col items-center justify-center w-full p-4 border-[1px] border-gray-600 min-h-[160px] my-1 mx-1 rounded-md"
                  onClick={() => {
                    router.push(`/${lng}/pick-item-options/${product.id}`);
                  }}
                >
                  <div className="flex flex-col items-begin justify-center w-full relative">
                    <img
                      src={product.image}
                      alt={t(product.name)}
                      width={128}
                      height={128}
                      className="absolute right-0 top-0 w-24 h-auto max-h-24 rounded-sm"
                    />
                    <p className="text-xl font-bold">{t(product.name)}</p>
                    <p className="text-sm">{t(product.description)}</p>
                    <p className="text-sm">{product.price}đ</p>
                    <button className="px-2 py-1 mt-4 text-sm bg-green-700 text-white rounded-md w-[140px]">
                      {t("Add to cart")}
                    </button>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </main>
  );
}
