"use client";

import Dashboard from "./Dashboard";
import { SessionProvider } from "next-auth/react";
import LoginWrapper from "./LoginWrapper";

export default function Page() {
  return (
    <SessionProvider
      {...(process.env.NODE_ENV === "production" && {
        basePath: "/community-profiles/api/auth",
      })}
    >
      <main className="bg-gray-100">
        <LoginWrapper>
          <Dashboard />
        </LoginWrapper>
      </main>
    </SessionProvider>
  );
}
