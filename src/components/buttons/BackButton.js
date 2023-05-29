import { useRouter } from "next/navigation";

export default function BackButton(params) {
  const router = useRouter();

  return (
    <div
      className="mr-2"
      onClick={() => {
        if (params.href) {
          router.push(params.href);
        } else {
          router.back();
        }
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
          d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
        />
      </svg>
    </div>
  );
}
