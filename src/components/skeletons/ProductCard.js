import Skeleton from "react-loading-skeleton";

export default function () {
  return (
    <div className="clickable flex flex-col items-center justify-center w-full h-full p-4 border-[1px] bg-white border-gray-600 min-h-[160px] my-1 mx-1 rounded-md">
      <div className="flex flex-col items-begin justify-center w-full relative">
        <p className="text-xl font-bold">
          <Skeleton />
        </p>
        <p className="text-sm mb-2">
          <Skeleton />
        </p>
        <p className="text-sm">
          <Skeleton />
        </p>
        <button className="w-[100px]">
          <Skeleton height={38} />
        </button>
      </div>
    </div>
  );
}
