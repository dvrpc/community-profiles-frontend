import { API_BASE_URL } from "@/consts";
import { getSession } from "next-auth/react";

async function authorizedFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const session = await getSession();


  // Only attach token if it exists (for admin-protected routes)
  const headers = new Headers(options.headers);
  if (session?.id_token) {
    headers.set("Authorization", `Bearer ${session.id_token}`);
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(`API error ${res.status}: ${message}`);
  }

  return res.json();
}

export async function apiGet<T>(path: string) {
  return authorizedFetch<T>(path, { method: "GET" });
}

export async function apiPost<T>(path: string, body: string) {
  return authorizedFetch<T>(path, { method: "POST", body });
}

export async function apiPut<T>(path: string, body: string) {
  return authorizedFetch<T>(path, { method: "PUT", body });
}
