import { setSessionCookie } from "@/lib/server/session";

/**
 * Development-only sign-in, so the workspace can be worked on before Google
 * credentials exist. Refuses outright in production: without this guard it
 * would be an unauthenticated way into every account.
 */
export const runtime = "nodejs";

export async function POST(req: Request) {
  if (process.env.NODE_ENV === "production") {
    return Response.json({ error: "Not available." }, { status: 404 });
  }
  return new Response(
    JSON.stringify({ ok: true, email: "test@propm.local" }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": setSessionCookie(req, {
          name: "Test User",
          email: "test@propm.local",
        }),
      },
    },
  );
}
