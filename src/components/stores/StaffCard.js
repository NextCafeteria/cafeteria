import Skeleton from "react-loading-skeleton";
import { useTranslation } from "@/app/i18n/client";
import { RemoveStaff } from "@/lib/requests/stores";
import Rating from "../RatingWithNumbers";
import ConfirmModal from "../modals/ConfirmModal";
import { useRef } from "react";
import { toast } from "react-toastify";
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
  const modalRef = useRef();
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
              <Rating
                lng={lng}
                totalRatingStars={totalRatingStars}
                totalRatingTimes={totalRatingTimes}
              />
            </>
          )}
        </div>
      </div>
      <div className="mt-8"></div>
      <div
        className="absolute bottom-4 right-4 bg-red-500 text-white px-2 py-1 rounded-md cursor-pointer"
        onClick={() => {
          modalRef.current.showModal();
        }}
      >
        {t("Remove as staff")}
      </div>
      <ConfirmModal
        lng={lng}
        title={"Confirm Delete"}
        msg={"Are you sure?"}
        handleConfirm={() => {
          RemoveStaff(
            storeId,
            id,
            (data) => {
              toast.success("Remove staff successfully");
              if (refetchList) {
                refetchList();
              }
            },
            (e) => {
              console.log(e);
              toast.error("Could not remove staff");
            }
          );
        }}
        modalRef={modalRef}
      />
    </div>
  );
}
