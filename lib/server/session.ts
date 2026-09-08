import "server-only";
import { createHmac, timingSafeEqual, randomBytes } from "node:crypto";
import { cookies } from "next/headers";

/**
 * Session cookie.
 *
 * The payload is signed with HMAC-SHA256 and stored httpOnly, so the browser
 * cannot read it and cannot forge one. This is a deliberately small
 * implementation: enough to gate the workspace behind a real Google login,
 * without a database. For anything multi-tenant, replace it with a library
 * that handles rotation, refresh tokens and revocation.
 */

export interface SessionUser {
  name: string;
  email: string;
  picture?: string;
}

const COOKIE = "pmpro_session";
const MAX_AGE = 60 * 60 * 24 * 7; // one week

export const GOOGLE_CONFIGURED =
  Boolean(process.env.GOOGLE_CLIENT_ID) &&
  Boolean(process.env.GOOGLE_CLIENT_SECRET);

/**
 * In production a missing secret is fatal — an unsigned session is no session
 * at all. In development we fall back to a fixed string so the app runs before
 * anything is configured; sessions signed with it are not secret.
 */
function secret(): string {
  const configured = process.env.AUTH_SECRET;
  if (configured) return configured;
  if (process.env.NODE_ENV === "production") {
    throw new Error("AUTH_SECRET must be set in production.");
  }
  return "development-only-insecure-session-secret";
}

function b64url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function fromB64url(input: string): Buffer {
  return Buffer.from(input.replace(/-/g, "+").replace(/_/g, "/"), "base64");
}

function sign(payload: string): string {
  return b64url(createHmac("sha256", secret()).update(payload).digest());
}

export function serialiseSession(user: SessionUser): string {
  const body = b64url(
    JSON.stringify({ ...user, exp: Date.now() + MAX_AGE * 1000 }),
  );
  return `${body}.${sign(body)}`;
}

export function parseSession(token: string | undefined): SessionUser | null {
  if (!token) return null;
  const dot = token.lastIndexOf(".");
  if (dot < 1) return null;

  const body = token.slice(0, dot);
  const provided = fromB64url(token.slice(dot + 1));
  const expected = fromB64url(sign(body));

  // Constant-time compare, and length-check first because timingSafeEqual
  // throws on a length mismatch rather than returning false.
  if (provided.length !== expected.length) return null;
  if (!timingSafeEqual(provided, expected)) return null;

  try {
    const parsed = JSON.parse(fromB64url(body).toString()) as SessionUser & {
      exp?: number;
    };
    if (!parsed?.email || typeof parsed.exp !== "number") return null;
    if (Date.now() > parsed.exp) return null;
    return {
      name: parsed.name || parsed.email,
      email: parsed.email,
      picture: parsed.picture,
    };
  } catch {
    return null;
  }
}

/** The signed-in user for the current request, or null. */
export async function getSession(): Promise<SessionUser | null> {
  const store = await cookies();
  return parseSession(store.get(COOKIE)?.value);
}

function cookieHeader(req: Request, value: string, maxAge: number) {
  const parts = [
    `${COOKIE}=${value}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${maxAge}`,
  ];
  if (new URL(req.url).protocol === "https:") parts.push("Secure");
  return parts.join("; ");
}

export function setSessionCookie(req: Request, user: SessionUser) {
  return cookieHeader(req, serialiseSession(user), MAX_AGE);
}

export function clearSessionCookie(req: Request) {
  return cookieHeader(req, "", 0);
}

/* ── OAuth state, to defend the callback against CSRF ── */

const STATE_COOKIE = "pmpro_oauth_state";

export function newState() {
  return randomBytes(16).toString("hex");
}

export function setStateCookie(req: Request, state: string) {
  const parts = [
    `${STATE_COOKIE}=${state}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    "Max-Age=600",
  ];
  if (new URL(req.url).protocol === "https:") parts.push("Secure");
  return parts.join("; ");
}

export function clearStateCookie(req: Request) {
  const parts = [
    `${STATE_COOKIE}=`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    "Max-Age=0",
  ];
  if (new URL(req.url).protocol === "https:") parts.push("Secure");
  return parts.join("; ");
}

export function readStateCookie(req: Request): string | null {
  const header = req.headers.get("cookie");
  if (!header) return null;
  for (const part of header.split(";")) {
    const eq = part.indexOf("=");
    if (eq > 0 && part.slice(0, eq).trim() === STATE_COOKIE) {
      return part.slice(eq + 1).trim() || null;
    }
  }
  return null;
}
