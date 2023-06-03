import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { useTranslation } from "@/app/i18n/client";
import Rating from "../Rating";

export default function ({
  lng,
  id,
  name,
  address,
  totalRatingStars,
  totalRatingTimes,
  isLoading,
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
    <Link href={isLoading ? "" : `/${lng}/stores/store-details/${id}`}>
      <div className="relative flex flex-col items-center justify-center w-full p-4 min-h-[100px] mx-1 border-[1px] border-gray-600 rounded-md hover:bg-gray-200 mb-2">
        <div className="flex flex-col items-begin justify-center w-full relative">
          <p className="text-sm font-bold mb-2">
            {isLoading ? <Skeleton width={70} /> : name}
          </p>
          <p className="text-sm mt-2 mb-2">
            {isLoading ? <Skeleton width={200} /> : address}
          </p>
          <div className="mt-4">
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
        <div className="absolute bottom-4 right-4">
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
              d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
            />
          </svg>
        </div>
      </div>
    </Link>
  );
}
