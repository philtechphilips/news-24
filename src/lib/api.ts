import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import type { ApiUser, FormState } from "./api-types";

/** Server-side only: talks to the FastAPI backend as the logged-in user. */

export const API_URL = process.env.API_URL ?? "http://127.0.0.1:8000";
export const SESSION_COOKIE = "news24_token";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public fields: Record<string, string> = {},
  ) {
    super(message);
  }

  toFormState(): FormState {
    return { error: this.message, fields: this.fields };
  }
}

export async function getToken() {
  return (await cookies()).get(SESSION_COOKIE)?.value;
}

/** Calls the API with the session token. A missing or expired session goes to /login. */
export async function api<T>(
  path: string,
  { json, ...init }: RequestInit & { json?: unknown } = {},
): Promise<T> {
  const token = await getToken();
  if (!token) redirect("/login");

  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(json !== undefined && { "Content-Type": "application/json" }),
      ...init.headers,
    },
    body: json !== undefined ? JSON.stringify(json) : init.body,
  });

  if (res.status === 401) redirect("/login");
  if (!res.ok) throw await toApiError(res);
  return (res.status === 204 ? undefined : await res.json()) as T;
}

async function toApiError(res: Response): Promise<ApiError> {
  const detail = (await res.json().catch(() => null))?.detail;
  if (Array.isArray(detail)) {
    // FastAPI validation errors: [{ loc: ["body", "title"], msg: "..." }, ...]
    const fields = Object.fromEntries(
      detail.map((d: { loc?: unknown[]; msg?: string }) => [
        String(d.loc?.at(-1) ?? "form"),
        d.msg?.replace(/^Value error, /, "") ?? "Invalid value",
      ]),
    );
    return new ApiError(res.status, "Some fields need fixing.", fields);
  }
  return new ApiError(
    res.status,
    typeof detail === "string" ? detail : `Request failed (${res.status})`,
  );
}

/** The logged-in user, or null when signed out. Fetched once per request. */
export const getCurrentUser = cache(async (): Promise<ApiUser | null> => {
  const token = await getToken();
  if (!token) return null;
  const res = await fetch(`${API_URL}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.ok ? res.json() : null;
});
