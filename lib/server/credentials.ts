import "server-only";

/**
 * Provider credentials.
 *
 * Two ways to give the workspace access, and they bill differently:
 *
 *   "account" — your own Claude account. The Anthropic SDK resolves the OAuth
 *     profile written by `ant auth login`, so runs go against the Pro/Max
 *     subscription you already pay for rather than API credits. Nothing is
 *     stored here but a flag saying to let the SDK resolve it.
 *
 *   "key" — a pasted API key, billed pay-as-you-go. Held in an httpOnly
 *     cookie: browser JavaScript cannot read it, so an XSS bug on the page
 *     cannot exfiltrate it, which localStorage could not promise.
 *
 * Either way the credential is only ever read here, on the server.
 *
 * Account mode reads the profile of whoever runs the server process. That is
 * the right behaviour for a workspace you run locally; it would be wrong for
 * a shared deployment, where every visitor would share one subscription.
 */

export type ProviderId = "claude" | "openai";

export type Credential =
  /** Let the SDK resolve credentials itself (OAuth profile or environment). */
  | { kind: "account" }
  /** Use this explicit API key. */
  | { kind: "key"; key: string };

const KEY_COOKIE: Record<ProviderId, string> = {
  claude: "pmpro_cred_claude",
  openai: "pmpro_cred_openai",
};

const MODE_COOKIE: Record<ProviderId, string> = {
  claude: "pmpro_mode_claude",
  openai: "pmpro_mode_openai",
};

const ENV: Record<ProviderId, string[]> = {
  claude: ["ANTHROPIC_API_KEY", "ANTHROPIC_AUTH_TOKEN"],
  openai: ["OPENAI_API_KEY"],
};

/** Only Anthropic ships a CLI that writes a reusable OAuth profile. */
export const SUPPORTS_ACCOUNT_MODE: Record<ProviderId, boolean> = {
  claude: true,
  openai: false,
};

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

export function hasEnvCredential(provider: ProviderId): boolean {
  return ENV[provider].some((name) => Boolean(process.env[name]));
}

/**
 * What to call the provider with, or null if nothing is configured.
 *
 * An environment variable wins, then an explicitly connected account, then a
 * pasted key — so a developer can always override what the UI connected.
 */
export function credentialFor(
  req: Request,
  provider: ProviderId,
): Credential | null {
  if (hasEnvCredential(provider)) return { kind: "account" };
  if (readCookie(req, MODE_COOKIE[provider]) === "account") {
    return { kind: "account" };
  }
  const key = readCookie(req, KEY_COOKIE[provider]);
  return key ? { kind: "key", key } : null;
}

function cookie(req: Request, name: string, value: string, maxAge: number) {
  const parts = [
    `${name}=${encodeURIComponent(value)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${maxAge}`,
  ];
  // Localhost is served over http, where a Secure cookie would be dropped.
  if (new URL(req.url).protocol === "https:") parts.push("Secure");
  return parts.join("; ");
}

export function setKeyCookie(req: Request, provider: ProviderId, key: string) {
  return [
    cookie(req, KEY_COOKIE[provider], key, MAX_AGE),
    // Connecting by key supersedes a previous account connection.
    cookie(req, MODE_COOKIE[provider], "", 0),
  ];
}

export function setAccountCookie(req: Request, provider: ProviderId) {
  return [
    cookie(req, MODE_COOKIE[provider], "account", MAX_AGE),
    cookie(req, KEY_COOKIE[provider], "", 0),
  ];
}

export function clearCredentialCookies(req: Request, provider: ProviderId) {
  return [
    cookie(req, KEY_COOKIE[provider], "", 0),
    cookie(req, MODE_COOKIE[provider], "", 0),
  ];
}
