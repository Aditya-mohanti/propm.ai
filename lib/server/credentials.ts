import "server-only";

/**
 * Provider credentials.
 *
 * The key the user pastes into the connect dialog is held in an httpOnly
 * cookie. That matters: httpOnly means browser JavaScript cannot read it, so
 * an XSS bug on the page cannot exfiltrate it — which localStorage could not
 * promise. The browser sends it back automatically, and only this server ever
 * reads it or forwards it to the provider.
 *
 * An environment variable takes priority when set, so a developer can run the
 * whole workspace without connecting anything.
 */

export type ProviderId = "claude" | "openai";

const COOKIE: Record<ProviderId, string> = {
  claude: "pmpro_cred_claude",
  openai: "pmpro_cred_openai",
};

const ENV: Record<ProviderId, string[]> = {
  claude: ["ANTHROPIC_API_KEY", "ANTHROPIC_AUTH_TOKEN"],
  openai: ["OPENAI_API_KEY"],
};

/** 30 days, matching how long we tell the user the connection lasts. */
const MAX_AGE = 60 * 60 * 24 * 30;

function readCookie(req: Request, name: string): string | null {
  const header = req.headers.get("cookie");
  if (!header) return null;
  for (const part of header.split(";")) {
    const eq = part.indexOf("=");
    if (eq < 0) continue;
    if (part.slice(0, eq).trim() !== name) continue;
    try {
      return decodeURIComponent(part.slice(eq + 1).trim()) || null;
    } catch {
      return null;
    }
  }
  return null;
}

/** The key to call the provider with, or null if there is none. */
export function credentialFor(
  req: Request,
  provider: ProviderId,
): string | null {
  for (const name of ENV[provider]) {
    const value = process.env[name];
    if (value) return value;
  }
  return readCookie(req, COOKIE[provider]);
}

export function hasEnvCredential(provider: ProviderId): boolean {
  return ENV[provider].some((name) => Boolean(process.env[name]));
}

function isSecure(req: Request) {
  // Localhost is served over http, where a Secure cookie would be dropped.
  return new URL(req.url).protocol === "https:";
}

export function setCredentialCookie(
  req: Request,
  provider: ProviderId,
  key: string,
): string {
  const parts = [
    `${COOKIE[provider]}=${encodeURIComponent(key)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${MAX_AGE}`,
  ];
  if (isSecure(req)) parts.push("Secure");
  return parts.join("; ");
}

export function clearCredentialCookie(
  req: Request,
  provider: ProviderId,
): string {
  const parts = [
    `${COOKIE[provider]}=`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    "Max-Age=0",
  ];
  if (isSecure(req)) parts.push("Secure");
  return parts.join("; ");
}
