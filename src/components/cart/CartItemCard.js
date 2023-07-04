import Image from "next/image";

import { useTranslation } from "@/app/i18n/client";

export default function CartItemCard({ lng, item, index, handeDelete }) {
  const { name, price, quantity } = item;
  const { t } = useTranslation(lng, "common");

  return (
    <div
      className={
        "p-4 border-b-2 relative" + (index % 2 === 0 ? " bg-gray-100" : "")
      }
      key={index}
    >
      <div className="flex justify-between w-full pb-1 pt-2">
        <p className="text-sm font-bold">{t(name)}</p>
        <p className="text-sm font-bold">
          {quantity} x {price}đ
        </p>
      </div>
      <Image width={200} height={100} src={item.image} className="w-16 h-auto rounded-md mb-4" />
      {Object.keys(item.customizations)
        .sort(
          (a, b) => item.customizations[a].order - item.customizations[b].order
        )
        .map((customizationId) => {
          if (item.selectedOptions[customizationId] === undefined) return;
          return (
            <p
              key={item.customizations[customizationId].order}
              className="text-sm"
            >
              {t(item.customizations[customizationId].name)}:{" "}
              {t(
                item.customizations[customizationId].options[
                  item.selectedOptions[customizationId]
                ]?.name
              )}
            </p>
          );
        })}
      <button
        className="absolute right-2 bottom-2 text-md text-gray-500 float-right"
        onClick={() => {
          handeDelete(index);
        }}
      >
        {t("Remove")}
      </button>
    </div>
  );
}
