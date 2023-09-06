"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import ProductCardSkeleton from "@/components/skeletons/ProductCard";
import dynamic from "next/dynamic";
import { useGetProducts } from "@/lib/requests/products";
import { useTranslation } from "@/app/i18n/client";
const Header = dynamic(() => import("@/components/Header"), { ssr: false });
import { useGetCommonSettings } from "@/lib/requests/settings";
import { formatPrice } from "@/lib/utils";
import Fuse from "fuse.js";

export default function Home({ params: { lng } }) {
  const { products, error, isLoading } = useGetProducts();
  if (error) {
    console.log(error);
  }

  const [filteredProducts, setFilteredProducts] = useState(products);
  const handleSearch = (event) => {
    const { value } = event.target;
    if (value.length === 0) {
      setFilteredProducts(products);
      return;
    }

    products.forEach((product) => {
      product.translated_name = t(product.name);
      product.translated_description = t(product.description);
    });

    const fuse = new Fuse(products, {
      keys: ["translated_name", "translated_description"],
    });

    const results = fuse.search(value);
    const items = results.map((result) => result.item);
    setFilteredProducts(items);
  };

  // First data load
  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  const { data: commonSettings } = useGetCommonSettings();

  const productCss = `
  @media screen and (min-width: 768px) {
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
        <Header />
        <div className="px-3 my-4">
          <input
            className="w-full border-[1px] border-gray-600 p-2 rounded-md max-[500px]"
            type="text"
            placeholder={t("Search Products")}
            onChange={handleSearch}
          />
        </div>
        <div className="menu flex flex-wrap justify-center w-full md:gap-5 md:grid md:grid-cols-2">
          {isLoading
            ? Array.from({ length: 4 }, (e, i) => i).map((i) => (
                <div className="product w-full" key={i}>
                  <ProductCardSkeleton />
                </div>
              ))
            : filteredProducts &&
              filteredProducts.map((product, key) => {
                const isAvailable =
                  product.isAvailable === undefined
                    ? true
                    : product.isAvailable;
                return (
                  <Link
                    href={
                      isAvailable
                        ? `/${lng}/pick-item-options/${product.id}`
                        : ""
                    }
                  >
                    <div
                      key={key}
                      className="product md:w-[380px] clickable flex items-center justify-between w-full p-4 border-[1px] bg-white border-gray-600 min-h-[160px] my-1 mx-1 rounded-md"
                    >
                      <div className="product-details flex flex-col items-begin justify-center w-fit relative">
                        <p className="text-xl font-bold mb-[1px]">
                          {t(product.name)}
                        </p>
                        <p className="text-sm font-bold">
                          {" "}
                          {formatPrice(
                            product.price,
                            commonSettings?.currencyPrefix,
                            commonSettings?.currencySuffix,
                            commonSettings?.currencyDecimal
                          )}
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
                  </Link>
                );
              })}
        </div>
      </div>
    </main>
  );
}
