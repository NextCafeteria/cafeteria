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
                  <div className="flex flex-grow w-full relative">
                    <div className="grow">
                      <p className="text-xl font-bold">{t(product.name)}</p>
                      <p className="text-sm break-words mb-2">
                        {t(product.description)}
                      </p>
                      <p className="text-sm font-bold">
                        {product.price.toLocaleString("vi-VN")}đ
                      </p>
                      <button className="flex px-4 py-2 mt-4 text-sm bg-green-600 text-white rounded-md">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-5 h-5 mr-1"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {t("Add")}
                      </button>
                    </div>
                    <div>
                      <img
                        src={product.image}
                        alt={t(product.name)}
                        width={128}
                        height={64}
                        className="w-[150px] rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </main>
  );
}
