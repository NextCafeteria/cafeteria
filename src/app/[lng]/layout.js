"use client";
import { SessionProvider } from "next-auth/react";

import "../globals.css";
import { Roboto } from "next/font/google";

import { dir } from "i18next";
import { languages } from "../i18n/settings";
import { useTranslation } from "@/app/i18n/client";
import { useState } from "react";

import 'intro.js/introjs.css';
export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}

const roboto = Roboto({
  display: "swap",
  subsets: ["latin-ext"],
  weight: ["100", "300", "400", "500", "700", "900"],
});
import MainMenu from "@/components/MainMenu";
import { PersistentSteps } from "@next-cafeteria/quick-intro"
import { Steps } from "intro.js-react";

export default function RootLayout({ children, params: { lng } }) {
  const { t } = useTranslation(lng, "common");
  const [stepsEnabled, setStepsEnabled] = useState(true);

  return (
    <html lang={lng} dir={dir(lng)}>
      <head>
        <title>{t("title")}</title>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content={t("title")} />
        <meta name="description" content={t("description")} />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#2B5797" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#000000" />

        <link rel="apple-touch-icon" href="/images/icons/icon-512x512.png" />
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
        <link rel="shortcut icon" href="/images/icons/icon-512x512.png" />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:url" content={process.env.NEXT_PUBLIC_SERVER_URL} />
        <meta name="twitter:title" content={t("title")} />
        <meta name="twitter:description" content={t("description")} />
        <meta
          name="twitter:image"
          content={`${process.env.NEXT_PUBLIC_SERVER_URL}/images/icons/icon-512x512.png`}
        />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={t("title")} />
        <meta property="og:description" content={t("description")} />
        <meta property="og:site_name" content={t("title")} />
        <meta property="og:url" content={process.env.NEXT_PUBLIC_SERVER_URL} />
        <meta
          property="og:image"
          content={`${process.env.NEXT_PUBLIC_SERVER_URL}/images/icons/icon-512x512.png`}
        />
      </head>
      <body className={roboto.className}>
        <SessionProvider>
          {children}
          <MainMenu lng={lng} />
          {/* <Steps 
      enabled={true}
      steps={[
        {
          element: ".menu-home",
          intro: "Home step",
          title: "Explore main menu"
        },
        {
          element: ".menu-orders",
          intro: "Orders step"
        }]}
      initialStep={0}
      onChange={(nextStepIndex) => {
        localStorage.setItem(`tutorial-abc-step`, nextStepIndex.toString());
      }}
      onExit={() => {}}
    ></Steps> */}
          <PersistentSteps
            title="main-menu"
            steps={[
              {
                element: ".menu-home",
                intro: "Home step",
                title: "Explore main menu"
              },
              {
                element: ".menu-orders",
                intro: "Orders step"
              }]}
          >
          </PersistentSteps>

          {/* <Steps
          enabled={stepsEnabled}
          steps={[
            {
              element: ".menu-home",
              intro: "Home step",
              title: "Explore main menu"
            },
            {
              element: ".menu-orders",
              intro: "Orders step"
            }]}
          initialStep={0}
          onExit={() => {}}

        /> */}
        </SessionProvider>
      </body>
    </html>
  );
}
