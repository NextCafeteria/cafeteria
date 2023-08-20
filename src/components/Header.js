"use client";
import LangSelector from "@/components/LangSelector";
import { useGetCommonSettings } from "@/lib/requests/settings";

export default function Header() {
  const { data: commonSettings, error } = useGetCommonSettings();
  if (error) {
    console.log(error);
  }
  return (
    <div className="block w-full justify-center border-b-2 border-gray-800 pb-3 pt-2 text-2xl px-2 mb-2">
      {commonSettings?.brandName}
      <LangSelector />
    </div>
  );
}
