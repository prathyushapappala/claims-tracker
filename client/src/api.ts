import type { Claim, ClaimStatus, NewClaim } from "./types";

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Request failed (${res.status})`);
  }
  return res.status === 204 ? (undefined as T) : res.json();
}

export const getClaims = (status?: ClaimStatus) =>
  request<Claim[]>(status ? `/api/claims?status=${status}` : "/api/claims");

export const createClaim = (claim: NewClaim) =>
  request<Claim>("/api/claims", { method: "POST", body: JSON.stringify(claim) });

export const updateStatus = (id: string, status: ClaimStatus) =>
  request<Claim>(`/api/claims/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });

export const deleteClaim = (id: string) => request<void>(`/api/claims/${id}`, { method: "DELETE" });
