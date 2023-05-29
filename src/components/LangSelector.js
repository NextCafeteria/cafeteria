import { usePathname } from "next/navigation";
import Link from "next/link";

export default function LangSelector({ className }) {
  const pathname = usePathname();
  const lng = pathname.split("/")[1];
  const path = pathname.split("/").slice(2).join("/");

  return (
    <div className={className ? className : "float-right"}>
      <Link href={`/${lng === "vi" ? "en" : "vi"}/${path}`}>
        <div
          className={
            "p-2 inline-block text-sm" + (lng === "vi" ? " font-bold" : "")
          }
        >
          VI
        </div>
      </Link>
      <div className="py-2 inline-block text-sm mx-1">|</div>
      <Link href={`/${lng === "en" ? "vi" : "en"}/${path}`}>
        <div
          className={
            "p-2 inline-block text-sm" + (lng === "en" ? " font-bold" : "")
          }
        >
          EN
        </div>
      </Link>
    </div>
  );
}
