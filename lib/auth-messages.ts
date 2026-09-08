/**
 * Why a sign-in attempt came back unfinished.
 *
 * The auth routes redirect with ?auth=<code> rather than a raw message, so
 * the wording lives in one place and nothing internal leaks into a URL.
 */
export const AUTH_MESSAGES: Record<string, string> = {
  required: "Sign in to open your workspace.",
  expired: "Your session ended. Sign in again to pick up where you left off.",
  unconfigured:
    "Google sign-in is not configured on this server yet. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env.local, then restart.",
  denied: "Sign-in was cancelled.",
  state: "That sign-in link expired before it was used. Try again.",
  token: "Google would not complete the sign-in. Try again.",
  profile: "Could not read your Google profile.",
  unverified:
    "That Google account has no verified email address, so it cannot be used to sign in.",
  network: "Could not reach Google. Check your connection and try again.",
};

export function authMessage(code: string | undefined | null): string | null {
  if (!code) return null;
  return AUTH_MESSAGES[code] ?? "Sign-in did not complete.";
}

/** Codes that are an explanation rather than a failure. */
export function isNeutral(code: string | undefined | null) {
  return code === "required" || code === "expired";
}
