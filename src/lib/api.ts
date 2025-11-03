import { API_BASE_URL } from "@/consts";

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
