import {
  GOOGLE_CONFIGURED,
  clearStateCookie,
  readStateCookie,
  setSessionCookie,
} from "@/lib/server/session";

/** Exchanges the authorisation code for a profile and opens a session. */
export const runtime = "nodejs";

function fail(origin: string, reason: string, req: Request) {
  return new Response(null, {
    status: 302,
    headers: {
      Location: `${origin}/?auth=${reason}`,
      "Set-Cookie": clearStateCookie(req),
    },
  });
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const origin = url.origin;

  if (!GOOGLE_CONFIGURED) return fail(origin, "unconfigured", req);
  if (url.searchParams.get("error")) return fail(origin, "denied", req);

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  // The state must match the cookie set when the flow started, or this is a
  // forged callback rather than one we initiated.
  if (!code || !state || state !== readStateCookie(req)) {
    return fail(origin, "state", req);
  }

  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID as string,
        client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
        redirect_uri: `${origin}/api/auth/google/callback`,
        grant_type: "authorization_code",
      }),
    });
    if (!tokenRes.ok) return fail(origin, "token", req);

    const { access_token } = (await tokenRes.json()) as {
      access_token?: string;
    };
    if (!access_token) return fail(origin, "token", req);

    const profileRes = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      { headers: { Authorization: `Bearer ${access_token}` } },
    );
    if (!profileRes.ok) return fail(origin, "profile", req);

    const profile = (await profileRes.json()) as {
      email?: string;
      name?: string;
      picture?: string;
      email_verified?: boolean;
    };
    if (!profile.email) return fail(origin, "profile", req);
    // An unverified address is not proof of identity.
    if (profile.email_verified === false) return fail(origin, "unverified", req);

    const headers = new Headers({ Location: `${origin}/workspace` });
    headers.append(
      "Set-Cookie",
      setSessionCookie(req, {
        name: profile.name || profile.email,
        email: profile.email,
        picture: profile.picture,
      }),
    );
    headers.append("Set-Cookie", clearStateCookie(req));
    return new Response(null, { status: 302, headers });
  } catch {
    return fail(origin, "network", req);
  }
}
