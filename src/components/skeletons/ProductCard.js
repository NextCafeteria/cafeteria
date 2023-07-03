import Skeleton from "react-loading-skeleton";

export default function () {
  return (
    <div className="clickable flex flex-col items-center justify-center w-full p-4 border-[1px] border-gray-600 min-h-[160px] my-1 mx-1 rounded-md">
      <div className="flex flex-col items-begin justify-center w-full relative">
        <p className="text-xl font-bold">
          <Skeleton />
        </p>
        <p className="text-sm">
          <Skeleton />
        </p>
        <p className="text-sm">
          <Skeleton />
        </p>
        <button className="w-[140px]">
          <Skeleton height={30} />
        </button>
      </div>
    </div>
  );
}
