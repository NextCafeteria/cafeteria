import Rating from "./Rating";
import { useTranslation } from "@/app/i18n/client";

export default function ({ lng, totalRatingTimes, totalRatingStars }) {
  if (!totalRatingStars) {
    totalRatingStars = 0;
  }
  if (!totalRatingTimes) {
    totalRatingTimes = 0;
  }
  const rating = totalRatingTimes > 0 ? totalRatingStars / totalRatingTimes : 0;
  const { t } = useTranslation(lng, "common");
  return (
    <div className="text-xs flex">
      <Rating value={rating} /> <span className="ml-2"></span>{" "}
      {rating.toFixed(1)}/5 - {totalRatingTimes} {t("reviews")}
    </div>
  );
}
