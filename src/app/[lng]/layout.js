import "../globals.css";
import { Roboto } from "next/font/google";

import { dir } from "i18next";
import { languages } from "../i18n/settings";

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}

const roboto = Roboto({
  display: "swap",
  subsets: ["latin-ext"],
  weight: ["100", "300", "400", "500", "700", "900"],
});

export const metadata = {
  title: "Cafeteria App",
  description: "Cafeteria App for small business",
};

export default function RootLayout({ children, params: { lng } }) {
  return (
    <html lang={lng} dir={dir(lng)}>
      <body className={roboto.className}>{children}</body>
    </html>
  );
}
