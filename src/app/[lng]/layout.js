"use client";
import { SessionProvider } from "next-auth/react";

import "../globals.css";
import { Roboto } from "next/font/google";

import { dir } from "i18next";
import { languages } from "../i18n/settings";
import { useTranslation } from "@/app/i18n/client";

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}

const roboto = Roboto({
  display: "swap",
  subsets: ["latin-ext"],
  weight: ["100", "300", "400", "500", "700", "900"],
});
import Footer from "@/components/Footer";

export default function RootLayout({ children, params: { lng } }) {
  const { t } = useTranslation(lng, "common");

  return (
    <html lang={lng} dir={dir(lng)}>
      <head>
        <title>{t("title")}</title>
      </head>
      <body className={roboto.className}>
        <SessionProvider>
          {children}
          <Footer lng={lng} />
        </SessionProvider>
      </body>
    </html>
  );
}
