"use client";
import { useState, useEffect } from "react";
import LangSelector from "@/components/LangSelector";
import { GetCommonSettings } from "@/lib/requests/settings";

export default function Header() {
  // Get common settings from local storage
  const [commonSettings, setCommonSettings] = useState(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("commonSettings"));
    }
  });
  useEffect(() => {
    GetCommonSettings()
      .then((data) => {
        setCommonSettings(data);
        localStorage.setItem("commonSettings", JSON.stringify(data));
        setCommonSettings(data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  return (
    <div className="block w-full justify-center border-b-2 border-gray-800 pb-3 pt-2 text-2xl px-2 mb-2">
      {commonSettings?.brandName}
      <LangSelector />
    </div>
  );
}
