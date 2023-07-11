import classNames from "classnames";

export default function Comment({ comment }) {
  return (
    <div className="flex">
      {comment.staffId && (
        <svg
          className="mx-2 w-6 h-6 my-auto"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#0EA5E9"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          transform="rotate(180)"
        >
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            <polyline points="9 17 4 12 9 7"></polyline>
            <path d="M20 18v-2a4 4 0 00-4-4H4"></path>
          </g>
        </svg>
      )}
      <p
        className={classNames(
          comment.staffId ? "text-sky-500" : "text-gray-500",
          "text-sm px-4 py-2 rounded-xl bg-gray-100 my-2",
        )}
      >
        {comment.value}
      </p>
    </div>
  );
}
