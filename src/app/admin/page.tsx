"use client";
import SmallHeader from "../SmallHeader";
import Dashboard from "./Dashboard";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function Page() {
  return (
    <QueryClientProvider client={queryClient}>
      <SmallHeader />
      <main>
        <Dashboard />
      </main>
    </QueryClientProvider>
  );
}
