import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { useTranslation } from "@/app/i18n/client";
import { RemoveStaff } from "@/lib/requests/stores";
import Rating from "../Rating";

export default function ({
  lng,
  storeId,
  id,
  name,
  email,
  totalRatingStars,
  totalRatingTimes,
  isLoading,
  refetchList,
}) {
  const { t } = useTranslation(lng, "common");
  if (!totalRatingStars) {
    totalRatingStars = 0;
  }
  if (!totalRatingTimes) {
    totalRatingTimes = 0;
  }
  const rating = totalRatingTimes > 0 ? totalRatingStars / totalRatingTimes : 0;

  return (
    <div className="relative flex flex-col items-center justify-center w-full p-4 min-h-[100px] mx-1 border-[1px] border-gray-600 rounded-md hover:bg-gray-200 mb-2">
      <div className="flex flex-col items-begin justify-center w-full relative">
        <p className="text-sm font-bold mb-2">
          {isLoading ? <Skeleton width={70} /> : name}
        </p>
        <p className="text-sm mt-2 mb-2">
          {isLoading ? <Skeleton width={200} /> : email}
        </p>
        <div>
          {isLoading ? (
            <Skeleton width={200} />
          ) : (
            <>
              <Rating value={rating} /> {rating.toFixed(1)}/5 {t("stars")} -{" "}
              {totalRatingTimes} {t("reviews")}
            </>
          )}
        </div>
      </div>
      <div
        className="absolute bottom-4 right-4 bg-red-500 text-white px-2 py-1 rounded-md cursor-pointer"
        onClick={() => {
          if (confirm(t("Are you sure?"))) {
            RemoveStaff(
              storeId,
              id,
              (data) => {
                alert(t("Remove staff successfully"));
                if (refetchList) {
                  refetchList();
                }
              },
              (e) => {
                console.log(e);
                alert(t("Could not remove staff"));
              }
            );
          }
        }}
      >
        {t("Remove as staff")}
      </div>
    </div>
  );
}
