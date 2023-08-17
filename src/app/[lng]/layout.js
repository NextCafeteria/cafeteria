"use client";

import "../globals.css";
import "react-loading-skeleton/dist/skeleton.css";
import "react-toastify/dist/ReactToastify.css";

import MainMenu from "@/components/MainMenu";
import { Roboto } from "next/font/google";
import { SWRConfig } from "swr";
import { SessionProvider } from "next-auth/react";
import { ToastContainer } from "react-toastify";
import { dir } from "i18next";
import { languages } from "../i18n/settings";
import { useGetCommonSettings } from "@/lib/requests/settings";
import { usePathname } from "next/navigation";
import { Analytics } from "@vercel/analytics/react";

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}

const roboto = Roboto({
  display: "swap",
  subsets: ["latin-ext"],
  weight: ["100", "300", "400", "500", "700", "900"],
});

export default function RootLayout({ children, params: { lng } }) {
  const pathname = usePathname();
  const isDashboard = pathname.split("/")[2] === "dashboard";
  const DEFAULT_THEME = "light";

  const { data: commonSettings, error } = useGetCommonSettings();
  if (error) {
    console.log(error);
  }

  return (
    <html lang={lng} dir={dir(lng)} data-theme={commonSettings?.theme}>
      <head>
        <title>{commonSettings?.brandName}</title>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta
          name="apple-mobile-web-app-title"
          content={commonSettings?.brandName}
        />
        <meta name="description" content={commonSettings?.brandDescription} />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#2B5797" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#000000" />

        <link rel="apple-touch-icon" href="/images/icons/apple-icon.png" />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/images/icons/icon-152x152.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="192x192"
          href="/images/icons/icon-192x192.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="384x384"
          href="images/icons/icon-384x384.png"
        />

        <link rel="manifest" href="/manifest.json" />
        <link rel="shortcut icon" href="/images/icons/apple-icon.png" />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:url" content={process.env.NEXT_PUBLIC_SERVER_URL} />
        <meta name="twitter:title" content={commonSettings?.brandName} />
        <meta
          name="twitter:description"
          content={commonSettings?.brandDescription}
        />
        <meta
          name="twitter:image"
          content={`${process.env.NEXT_PUBLIC_SERVER_URL}/images/icons/icon-512x512.png`}
        />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={commonSettings?.brandName} />
        <meta
          property="og:description"
          content={commonSettings?.brandDescription}
        />
        <meta property="og:site_name" content={commonSettings?.brandName} />
        <meta property="og:url" content={process.env.NEXT_PUBLIC_SERVER_URL} />
        <meta
          property="og:image"
          content={`${process.env.NEXT_PUBLIC_SERVER_URL}/images/icons/icon-512x512.png`}
        />
      </head>
      <body className={roboto.className}>
        <SWRConfig
          value={{
            fetcher: (...args) => fetch(...args).then((res) => res.json()),
          }}
        >
          <SessionProvider>
            {children}
            {!isDashboard && <MainMenu lng={lng} />}
            <ToastContainer autoClose={5000} hideProgressBar />
          </SessionProvider>
        </SWRConfig>
        <Analytics />
      </body>
    </html>
  );
}
