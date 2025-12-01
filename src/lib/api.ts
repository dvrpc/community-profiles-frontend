import { API_BASE_URL } from "@/consts";
import { getSession } from "next-auth/react";

async function authorizedRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const session = await getSession();

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

/** Utility to build request options based on whether body is text or JSON */
function buildBodyOptions(body?: string | object): {
  headers: HeadersInit;
  body?: string;
} {
  if (body === undefined) return { headers: {} };

  if (typeof body === "object") {
    return {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    };
  }

  return {
    headers: { "Content-Type": "text/plain" },
    body,
  };
}


export async function apiGetAuthorized<T>(path: string) {
  return authorizedRequest<T>(path, { method: "GET" });
}

export async function apiPostAuthorized<T>(
  path: string,
  body?: string | object
) {
  const { headers, body: finalBody } = buildBodyOptions(body);
  return authorizedRequest<T>(path, {
    method: "POST",
    headers,
    body: finalBody,
  });
}

export async function apiPutAuthorized<T>(
  path: string,
  body?: string | object
) {
  const { headers, body: finalBody } = buildBodyOptions(body);
  return authorizedRequest<T>(path, {
    method: "PUT",
    headers,
    body: finalBody,
  });
}

export async function apiDeleteAuthorized<T>(path: string) {
  return authorizedRequest<T>(path, { method: "DELETE" });
}

/* -------- Public Requests -------- */

export async function apiGet<T>(path: string, baseUrl = API_BASE_URL) {
  const res = await fetch(`${baseUrl}${path}`);
  if (!res.ok) throw new Error(res.statusText);
  return res.json() as Promise<T>;
}

export async function apiPost<T>(path: string, body?: string | object) {
  const { headers, body: finalBody } = buildBodyOptions(body);
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers,
    body: finalBody,
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json() as Promise<T>;
}

export async function apiPut<T>(path: string, body?: string | object) {
  const { headers, body: finalBody } = buildBodyOptions(body);
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "PUT",
    headers,
    body: finalBody,
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json() as Promise<T>;
}
