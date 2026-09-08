import {
  GOOGLE_CONFIGURED,
  newState,
  setStateCookie,
} from "@/lib/server/session";

/** Starts the Google authorisation-code flow. */
export const runtime = "nodejs";

export async function GET(req: Request) {
  const origin = new URL(req.url).origin;

  if (!GOOGLE_CONFIGURED) {
    // Nothing to redirect to, so say why rather than bouncing to a broken
    // Google page with a missing client_id.
    return Response.redirect(`${origin}/?auth=unconfigured`, 302);
  }

  const state = newState();
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID as string,
    redirect_uri: `${origin}/api/auth/google/callback`,
    response_type: "code",
    scope: "openid email profile",
    state,
    prompt: "select_account",
  });

  return new Response(null, {
    status: 302,
    headers: {
      Location: `https://accounts.google.com/o/oauth2/v2/auth?${params}`,
      "Set-Cookie": setStateCookie(req, state),
    },
  });
}
