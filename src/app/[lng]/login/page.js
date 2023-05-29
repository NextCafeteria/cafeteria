"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

import LangSelector from "@/components/LangSelector";
import { useTranslation } from "@/app/i18n/client";
import LoadingSvg from "@/components/LoadingSvg";

import Banner from "@public/banner.png";
import googleLogo from "@public/google-18px.svg";
import githubLogo from "@public/github-18px.svg";

const useGoogleLogin = process.env.NEXT_PUBLIC_GOOGLE_LOGIN === "true";
const useGithubLogin = process.env.NEXT_PUBLIC_GITHUB_LOGIN === "true";
const AUTH_ERRORS = {
  Signin: "Please try another account.",
  OAuthSignin: "Please try another account.",
  OAuthCallback: "Please try another account.",
  OAuthCreateAccount: "Please try another account.",
  EmailCreateAccount: "Please try another account.",
  Callback: "Please try another account.",
  OAuthAccountNotLinked:
    "To confirm your identity, sign in with the same account you used originally.",
  EmailSignin: "Check your email address.",
  CredentialsSignin:
    "Sign in failed. Check the details you provided are correct.",
  default: "Unable to sign in.",
};

export default function Page({ params: { lng } }) {
  const searchParams = useSearchParams();
  const callbackUrl = `/${lng}`;
  const router = useRouter();
  const session = useSession();
  if (session && session.status === "authenticated") {
    router.push(`/${lng}`);
  }
  const [loading, setLoading] = useState("");
  const error = searchParams.get("error", null);
  const errorMessage = error && (AUTH_ERRORS[error] ?? AUTH_ERRORS.default);

  const { t } = useTranslation(lng, "common");
  return (
    <main className="flex justify-center p-2 pb-[200px]">
      <div className="relative flex min-h-[100%] w-full max-w-[640px] flex-col items-center bg-white py-12 px-2 pb-[90px] md:min-h-[400px] md:px-4 rounded-lg">
        <div className="block w-full justify-centerpb-3 pt-2 text-2xl px-2 mb-2">
          <LangSelector />
        </div>

        <Image alt="Logo" src={Banner} className="rounded-md overflow-hidden" />
        <div className="mt-12"></div>
        <div
          className={
            "m-6 flex w-full items-center justify-center gap-3 border-2 border-gray-600 py-3 px-2 rounded-md" +
            (loading === "google" ? " bg-gray-200" : "") +
            (useGoogleLogin ? "" : " hidden")
          }
          onClick={() => {
            if (loading !== "") {
              return;
            }
            setLoading("google");
            signIn("google", { callbackUrl: callbackUrl });
          }}
        >
          <Image src={googleLogo} width="18" height="18" alt="Google" />
          <p className="text-sm font-semibold">{t("Login with Google")}</p>
          <div
            role="status"
            className={loading === "google" ? "" : " invisible"}
            style={{
              marginRight: "-3rem",
            }}
          >
            <LoadingSvg />
          </div>
        </div>
        <div
          className={
            "m-2 flex w-full max-w-[320px] items-center justify-center gap-3 border-2 py-3 px-6 rounded-md" +
            (loading === "github" ? " bg-gray-200" : "") +
            (useGithubLogin ? "" : " hidden")
          }
          onClick={() => {
            if (loading !== "") {
              return;
            }
            setLoading("github");
            signIn("github", { callbackUrl: callbackUrl });
          }}
        >
          <Image src={githubLogo} width="18" height="18" alt="Github" />
          <p className="text-sm font-semibold">{t("Login with Github")}</p>
          <div
            role="status"
            className={loading === "github" ? "" : " invisible"}
            style={{
              marginRight: "-3rem",
            }}
          >
            <LoadingSvg />
          </div>
        </div>
        {error && (
          <div
            className="m-4 rounded-2xl bg-red-50 p-4 text-sm text-red-800"
            role="alert"
            style={{
              maxWidth: "420px",
            }}
          >
            {t(errorMessage)}
          </div>
        )}
      </div>
    </main>
  );
}
