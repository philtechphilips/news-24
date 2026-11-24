"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { API_URL, SESSION_COOKIE, toApiError } from "./api";

export type LoginState = { error: string | null; email: string };

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = safeRedirect(formData.get("next"));

  if (!email || !password) {
    return { error: "Enter your email and password.", email };
  }

  const session = await startSession(email, password);
  if ("error" in session) return { error: session.error, email };

  if (next) redirect(next);
  // Admins land in the dashboard; everyone else goes home.
  const me = await fetch(`${API_URL}/users/me`, {
    headers: { Authorization: `Bearer ${session.token}` },
  })
    .then((r) => (r.ok ? r.json() : null))
    .catch(() => null);
  redirect(me?.role === "admin" ? "/admin" : "/");
}

export type SignupState = {
  error: string | null;
  fields: Record<string, string>;
  name: string;
  email: string;
};

/** Creates a reader account, logs it in and goes back to ?next= (or home). */
export async function signup(_prev: SignupState, formData: FormData): Promise<SignupState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = safeRedirect(formData.get("next"));
  const fail = (error: string, fields: Record<string, string> = {}) => ({
    error,
    fields,
    name,
    email,
  });

  if (!name || !email || !password) return fail("Enter your name, email and a password.");
  if (password.length < 8) {
    return fail("Choose a longer password.", { password: "Use at least 8 characters." });
  }

  let res: Response;
  try {
    res = await fetch(`${API_URL}/users/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
  } catch {
    return fail("We can't reach the server right now. Try again shortly.");
  }
  if (res.status === 409) {
    return fail("There's already an account with that email. Log in instead.");
  }
  if (!res.ok) {
    const error = await toApiError(res);
    return fail(error.message, error.fields);
  }

  const session = await startSession(email, password);
  if ("error" in session) return fail(session.error);
  redirect(next ?? "/");
}

/** Logs in with the API and stores the token in the session cookie. */
async function startSession(
  email: string,
  password: string,
): Promise<{ token: string } | { error: string }> {
  let res: Response;
  try {
    // FastAPI's OAuth2 form expects `username`, sent as form-urlencoded.
    res = await fetch(`${API_URL}/login`, {
      method: "POST",
      body: new URLSearchParams({ username: email, password }),
    });
  } catch {
    return { error: "We can't reach the server right now. Try again shortly." };
  }

  if (res.status === 401) return { error: "That email and password don't match." };
  if (!res.ok) return { error: "Something went wrong signing you in. Try again." };

  const { access_token } = (await res.json()) as { access_token: string };
  (await cookies()).set(SESSION_COOKIE, access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: tokenExpiry(access_token),
  });
  return { token: access_token };
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
