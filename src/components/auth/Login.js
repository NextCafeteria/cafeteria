"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import googleLogo from "@public/google-18px.svg";
import githubLogo from "@public/github-18px.svg";
import Image from "next/image";
import { signIn } from "next-auth/react";

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

function LoadingSvg() {
  return (
    <>
      <svg
        aria-hidden="true"
        className="mr-2 h-6 w-6 animate-spin fill-blue-600 text-gray-200"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
      <span className="sr-only">Đang tải...</span>
    </>
  );
}

export default function Login() {
  const callbackUrl = "/";
  const session = useSession();
  if (session?.status === "authenticated") {
    window.location.href = callbackUrl;
  }
  const [loading, setLoading] = useState("");
  const error = null; // TODO: Get error from url query
  const errorMessage = error && (AUTH_ERRORS[error] ?? AUTH_ERRORS.default);

  return (
    <>
      <h3 className="text-2xl text-gray-800">Login</h3>
      {callbackUrl != "/" && (
        <p className="text-center text-gray-600">Please login to continue.</p>
      )}
      <div className="mt-6"></div>
      <div
        className={
          "m-2 flex w-full max-w-[320px] items-center justify-center gap-3 border-2 py-3 px-6 rounded-full" +
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
        <p className="text-sm font-semibold">Login with Google</p>
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
          "m-2 flex w-full max-w-[320px] items-center justify-center gap-3 border-2 py-3 px-6 rounded-full" +
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
        <p className="text-sm font-semibold">Login with Github</p>
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
          {errorMessage}
        </div>
      )}
    </>
  );
}
