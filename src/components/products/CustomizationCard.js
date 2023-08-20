import { uuidv4 } from "@/lib/utils";
import { useTranslation } from "@/app/i18n/client";

export default function ({ lng, id, customization, updateCustomization }) {
  const { t } = useTranslation(lng, "common");

  return (
    <div className="relative flex flex-col items-center justify-center w-full p-4 min-h-[100px] mx-1 border-[1px] border-gray-600 rounded-md bg-white hover:bg-gray-200 mb-2">
      <div className="flex flex-col items-begin justify-center w-full relative">
        <p className="text-sm font-bold mb-2 pr-2">
          <input
            type="text"
            value={customization.name}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
            placeholder="Customization name"
            required
            onChange={(e) => {
              updateCustomization(id, {
                ...customization,
                name: e.target.value,
              });
            }}
          />
        </p>
      </div>
      {customization.options &&
        Object.keys(customization.options)
          .sort((a, b) => {
            a.order - b.order;
          })
          .map((optionId) => {
            const isAvailable =
              customization.options[optionId].isAvailable === undefined
                ? true
                : customization.options[optionId].isAvailable;
            return (
              <div
                key={optionId}
                className="flex flex-col items-begin justify-center w-full relative"
              >
                <div className="flex gap-1 mb-1">
                  <div className="grow">
                    <input
                      type="text"
                      value={customization.options[optionId].name}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                      placeholder="Option name"
                      required
                      onChange={(e) => {
                        updateCustomization(id, {
                          ...customization,
                          options: {
                            ...customization.options,
                            [optionId]: {
                              ...customization.options[optionId],
                              name: e.target.value,
                            },
                          },
                        });
                      }}
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      value={customization.options[optionId].price}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                      placeholder="Price"
                      required
                      onChange={(e) => {
                        updateCustomization(id, {
                          ...customization,
                          options: {
                            ...customization.options,
                            [optionId]: {
                              ...customization.options[optionId],
                              price: e.target.value,
                            },
                          },
                        });
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    className={
                      "w-[150px] focus:outline-none text-white font-medium rounded-lg text-sm px-5 py-2 mb-2:bg-red-700" +
                      (isAvailable
                        ? " bg-green-600 hover:bg-green-800 focus:ring-4 focus:ring-green-300"
                        : " bg-gray-400 hover:bg-gray-800 focus:ring-4 focus:ring-gray-300")
                    }
                    onClick={() => {
                      updateCustomization(id, {
                        ...customization,
                        options: {
                          ...customization.options,
                          [optionId]: {
                            ...customization.options[optionId],
                            isAvailable: !isAvailable,
                          },
                        },
                      });
                    }}
                  >
                    {isAvailable ? t("Available") : t("Unavailable")}
                  </button>
                  <button
                    type="button"
                    className="focus:outline-none text-white bg-gray-400 hover:bg-gray-800 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2 mr-2 mb-2:bg-red-700"
                    onClick={() => {
                      let customizationCopy = {
                        ...customization,
                        options: { ...customization.options },
                      };
                      delete customizationCopy.options[optionId];
                      updateCustomization(id, customizationCopy);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
      <button
        type="button"
        className="focus:outline-none bg-green-600 text-white hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2 mr-2 mb-2:bg-red-700 w-full mt-1"
        onClick={() => {
          updateCustomization(id, {
            ...customization,
            options: {
              ...customization.options,
              [uuidv4()]: {
                name: "",
                price: 0,
                order:
                  Math.max(
                    ...Object.keys(customization.options).map(
                      (optionId) => customization.options[optionId].order
                    )
                  ) + 1,
              },
            },
          });
        }}
      >
        {t("Add Option")}
      </button>
      <button
        type="button"
        className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2 mr-2 mb-2:bg-red-700 w-full mt-1 mb-2"
        onClick={() => {
          updateCustomization(id, null);
        }}
      >
        {t("Remove Customization")}
      </button>
    </div>
  );
}
