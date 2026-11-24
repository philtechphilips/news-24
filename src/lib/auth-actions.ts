"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { API_URL, SESSION_COOKIE } from "./api";

export type LoginState = { error: string | null; email: string };

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = safeRedirect(formData.get("next"));

  if (!email || !password) {
    return { error: "Enter your email and password.", email };
  }

  let res: Response;
  try {
    // FastAPI's OAuth2 form expects `username`, sent as form-urlencoded.
    res = await fetch(`${API_URL}/login`, {
      method: "POST",
      body: new URLSearchParams({ username: email, password }),
    });
  } catch {
    return { error: "We can't reach the server right now. Try again shortly.", email };
  }

  if (res.status === 401) {
    return { error: "That email and password don't match.", email };
  }
  if (!res.ok) {
    return { error: "Something went wrong signing you in. Try again.", email };
  }

  const { access_token } = (await res.json()) as { access_token: string };

  (await cookies()).set(SESSION_COOKIE, access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: tokenExpiry(access_token),
  });

  if (next) redirect(next);
  // Admins land in the dashboard; everyone else goes home.
  const me = await fetch(`${API_URL}/users/me`, {
    headers: { Authorization: `Bearer ${access_token}` },
  })
    .then((r) => (r.ok ? r.json() : null))
    .catch(() => null);
  redirect(me?.role === "admin" ? "/admin" : "/");
}

export async function logout() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/login");
}

/** Only same-site paths, so ?next= can't send people to another domain. */
function safeRedirect(value: FormDataEntryValue | null): string | null {
  const path = typeof value === "string" ? value : "";
  return path.startsWith("/") && !path.startsWith("//") ? path : null;
}

/** The cookie lives exactly as long as the JWT, falling back to 30 minutes. */
function tokenExpiry(token: string): Date {
  try {
    const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString());
    if (typeof payload.exp === "number") return new Date(payload.exp * 1000);
  } catch {}
  return new Date(Date.now() + 30 * 60 * 1000);
}
