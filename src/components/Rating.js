import classNames from "classnames";
export default function Rating({ value }) {
  return (
    <div className="flex">
      {Array.from({ length: 5 }).map((_, index) => {
        return (
          <svg
            key={index}
            className={classNames(
              value > index ? "text-yellow-400" : "text-gray-300",
              "h-5 w-5 flex-shrink-0"
            )}
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10 1.103a.75.75 0 0 1 .673.418l1.93 3.89 4.33.628a.75.75 0 0 1 .416 1.28l-3.136 3.054.74 4.312a.75.75 0 0 1-1.088.79L10 14.856l-3.87 2.03a.75.75 0 0 1-1.088-.79l.74-4.312L.65 6.319a.75.75 0 0 1 .416-1.28l4.33-.628 1.93-3.89A.75.75 0 0 1 10 1.103z"
            />
          </svg>
        );
      })}
    </div>
  );
}
