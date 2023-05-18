"use client";

import Login from "@components/auth/Login";
import AuthPage from "@components/auth/Auth";

export default function LoginPage() {
  return (
    <>
      <AuthPage>
        <Login />
      </AuthPage>
    </>
  );
}
