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

  const productCss = `
    @media screen and (min-width: 768px) and (max-width: 1440px) {
    .product {
        width: min(max(280px, 35vw), 380px);
      }
    .product-details {
      min-width: 8.75rem;
    }
    .main {
      padding-left: calc(9.5rem - 5vw);
    }
  }`;

  const { t } = useTranslation(lng, "common");
  return (
    <main className="main flex justify-center p-2 pb-[200px]">
      <style>{productCss}</style>
      <div className="max-w-[600px] md:max-w-[1000px] mx-auto font-mono text-sm">
        <div className="block w-full justify-center border-b-2 border-gray-800 pb-3 pt-2 text-2xl px-2 mb-2">
          {t("title")}
          <LangSelector />
        </div>

        <div className="menu flex flex-wrap justify-center w-full md:gap-5 md:grid md:grid-cols-2 ">
          {isLoading
            ? Array.from({ length: 3 }, (e, i) => i).map((i) => (
                <div className="product">
                  <ProductCardSkeleton />
                </div>
              ))
            : products &&
              products.map((product, key) => {
                const isAvailable =
                  product.isAvailable === undefined
                    ? true
                    : product.isAvailable;
                return (
                  <div
                    key={key}
                    className="product md:w-[380px] clickable flex items-center justify-between w-full p-4 border-[1px] border-gray-600 min-h-[160px] my-1 mx-1 rounded-md"
                    onClick={() => {
                      if (!isAvailable) return;
                      router.push(`/${lng}/pick-item-options/${product.id}`);
                    }}
                  >
                    <div className="product-details flex flex-col items-begin justify-center w-fit relative">
                      <p className="text-xl font-bold mb-[1px]">
                        {t(product.name)}
                      </p>
                      <p className="text-sm font-bold">
                        {" "}
                        {product.price.toLocaleString("vi-VN")}đ
                      </p>
                      <p className="text-sm h-[2.25rem] mr-1 mt-[3px]">
                        {t(product.description)}
                      </p>
                      <button
                        className={
                          "mt-2 text-sm text-white h-[1rem] btn btn-sm" +
                          (isAvailable
                            ? " btn-primary"
                            : " bg-gray-500 cursor-not-allowed hover:bg-gray-500")
                        }
                      >
                        {t("Add to cart")}
                      </button>
                    </div>
                    <div className="img h-[148px] w-[148px] rounded-sm">
                      <img
                        src={product.image}
                        alt={t(product.name)}
                        className={
                          "w-full h-full object-cover rounded" +
                          (isAvailable ? "" : " grayscale")
                        }
                      />
                    </div>
                  </div>
                );
              })}
        </div>
      </div>
    </main>
  );
}
