import "server-only";

/**
 * The public origin of the current request.
 *
 * Behind a reverse proxy — Vercel, Nginx, a load balancer — `req.url` describes
 * the *internal* hop: usually `http://` and sometimes an internal hostname.
 * Trusting it in production breaks two things at once:
 *
 *   1. The OAuth redirect URI is built from the origin. If it comes out as
 *      `http://internal-host/...` it will not match the URI registered with
 *      Google, and every sign-in fails with redirect_uri_mismatch.
 *   2. Session cookies would be issued without `Secure`, so they would travel
 *      over plain HTTP if anything ever downgraded the connection.
 *
 * So the forwarded headers win, and an explicit AUTH_URL wins over everything —
 * the only fully reliable answer when several proxies are chained.
 */

function forwarded(req: Request, header: string): string | null {
  const value = req.headers.get(header);
  if (!value) return null;
  // These headers can carry a comma-separated chain; the first entry is the
  // original client-facing value.
  const first = value.split(",")[0]?.trim();
  return first || null;
}

export function publicOrigin(req: Request): string {
  const configured = process.env.AUTH_URL;
  if (configured) return configured.replace(/\/+$/, "");

  const url = new URL(req.url);
  const proto =
    forwarded(req, "x-forwarded-proto") ?? url.protocol.replace(":", "");
  const host =
    forwarded(req, "x-forwarded-host") ?? req.headers.get("host") ?? url.host;

  return `${proto}://${host}`;
}

/** Whether the browser reached us over HTTPS, for the cookie Secure flag. */
export function isSecureRequest(req: Request): boolean {
  return publicOrigin(req).startsWith("https://");
}
