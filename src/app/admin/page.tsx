"use client";
import { useEffect } from "react";
import SmallHeader from "../SmallHeader";
import Dashboard from "./Dashboard";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useSession, signIn, SessionProvider } from "next-auth/react";
import LoginWrapper from "./LoginWrapper";

const queryClient = new QueryClient();

export default function Page() {


  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <SmallHeader />

        <main>
          <LoginWrapper>
            <Dashboard />
          </LoginWrapper>
        </main>
      </QueryClientProvider>
    </SessionProvider>
  );
}
