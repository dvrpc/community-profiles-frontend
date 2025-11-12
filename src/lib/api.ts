import { API_BASE_URL } from "@/consts";
import { getSession } from "next-auth/react";

async function authorizedRequest<T>(
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

export async function apiGetAuthorized<T>(path: string) {
  return authorizedRequest<T>(path, { method: "GET" });
}

export async function apiPostAuthorized<T>(path: string, body: string) {
  return authorizedRequest<T>(path, { method: "POST", body });
}

export async function apiPutAuthorized<T>(path: string, body: string) {
  return authorizedRequest<T>(path, { method: "PUT", body });
}

export async function apiDeleteAuthorized<T>(path: string) {
  return authorizedRequest<T>(path, { method: "DELETE" });
}

export async function apiGet<T>(path: string) {
  const res = await fetch(`${API_BASE_URL}${path}`);

  if (!res.ok) throw new Error(res.statusText);

  return res.json() as Promise<T>;
}

export async function apiPost<T>(path: string, body: string) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",

    headers: { "Content-Type": "text/plain" },

    body,
  });

  if (!res.ok) throw new Error(res.statusText);

  return res.json() as Promise<T>;
}

export async function apiPut(path: string, body: string) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "PUT",

    headers: { "Content-Type": "text/plain" },

    body,
  });

  if (!res.ok) throw new Error(res.statusText);

  return res.json();
}