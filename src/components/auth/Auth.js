import React from "react";

export default function AuthPage({ children }) {
  return (
    <main className="flex h-screen w-full items-center justify-center md:px-5">
      <div className="relative flex min-h-[100%] w-full max-w-[640px] flex-col items-center bg-white py-12 pb-20 shadow-lg md:min-h-[400px] md:md:px-4 rounded-lg">
        {children}
      </div>
    </main>
  );
}
