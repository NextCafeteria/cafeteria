export default function RatingInput({ value, setValue }) {
  return (
    <div className="flex">
      {Array.from({ length: 5 }).map((_, index) => {
        return (
          <svg
            key={index}
            fill={value > index ? "#FFCC00" : "#CCCCCC"}
            viewBox="0 0 32 32"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            className="cursor-pointer"
            onClick={() => setValue(index + 1)}
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              {" "}
              <title>star</title>{" "}
              <path d="M3.488 13.184l6.272 6.112-1.472 8.608 7.712-4.064 7.712 4.064-1.472-8.608 6.272-6.112-8.64-1.248-3.872-7.808-3.872 7.808z"></path>{" "}
            </g>
          </svg>
        );
      })}
    </div>
  );
}
