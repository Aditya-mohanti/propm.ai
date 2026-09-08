import { clearSessionCookie } from "@/lib/server/session";

export const runtime = "nodejs";

export async function POST(req: Request) {
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": clearSessionCookie(req),
    },
  });
}
