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
      data-testid="cart-item"
    >
      <div className="flex justify-between w-full pb-1 pt-2">
        <p className="text-sm font-bold">{t(name)}</p>
        <p className="text-sm font-bold">
          {quantity} x ${price}
        </p>
      </div>
      <img src={item.image} className="w-16 h-auto rounded-md mb-4" />
      {item.customizations.map((customization, customizationIndex) => {
        return (
          <p key={customizationIndex} className="text-sm">
            {t(customization.name)}:{" "}
            {t(
              customization.options[item.selectedOptions[customizationIndex]]
                ?.name
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
