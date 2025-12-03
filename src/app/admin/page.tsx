"use client";

import Dashboard from "./Dashboard";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import LoginWrapper from "./LoginWrapper";

const queryClient = new QueryClient();

export default function Page() {
  return (
    <SessionProvider basePath="/community-profiles/api/auth">
      <QueryClientProvider client={queryClient}>
        <main className="bg-gray-100">
          <LoginWrapper>
            <Dashboard />
          </LoginWrapper>
        </main>
      </QueryClientProvider>
    </SessionProvider>
  );
}
