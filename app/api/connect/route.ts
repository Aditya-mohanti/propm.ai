import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import {
  clearCredentialCookie,
  credentialFor,
  hasEnvCredential,
  setCredentialCookie,
  type ProviderId,
} from "@/lib/server/credentials";

/**
 * Taking access for a provider.
 *
 * POST validates the pasted key by making a real, non-billable call to the
 * provider (listing models — authentication without spending tokens). Only a
 * key that actually works is accepted, so "connected" in the UI means the
 * credential has been exercised rather than merely typed.
 *
 * The key is then stored in an httpOnly cookie. It never reaches client
 * JavaScript, and the response carries no echo of it beyond the last four
 * characters the UI shows.
 */

export const runtime = "nodejs";

function bad(status: number, error: string) {
  return Response.json({ error }, { status });
}

function isProvider(v: unknown): v is ProviderId {
  return v === "claude" || v === "openai";
}

/** GET — what is currently connected, for restoring UI state. */
export async function GET(req: Request) {
  const state = (["claude", "openai"] as ProviderId[]).map((provider) => ({
    provider,
    connected: Boolean(credentialFor(req, provider)),
    fromEnvironment: hasEnvCredential(provider),
  }));
  return Response.json({ providers: state });
}

export async function POST(req: Request) {
  let body: { provider?: unknown; apiKey?: unknown };
  try {
    body = await req.json();
  } catch {
    return bad(400, "Could not read the request body.");
  }

  const { provider, apiKey } = body;
  if (!isProvider(provider)) return bad(400, "Unknown provider.");
  if (typeof apiKey !== "string" || !apiKey.trim()) {
    return bad(400, "Paste a key to continue.");
  }

  const key = apiKey.trim();

  try {
    if (provider === "claude") {
      const client = new Anthropic({ apiKey: key });
      // Listing models authenticates without generating any tokens.
      const models = await client.models.list({ limit: 20 });
      return Response.json(
        {
          provider,
          keyHint: key.slice(-4),
          models: models.data.map((m) => m.display_name ?? m.id).slice(0, 6),
        },
        { headers: { "Set-Cookie": setCredentialCookie(req, provider, key) } },
      );
    }

    const client = new OpenAI({ apiKey: key });
    const models = await client.models.list();
    const ids = models.data
      .map((m) => m.id)
      .filter((id) => id.startsWith("gpt") || id.startsWith("o"))
      .sort()
      .slice(0, 6);
    return Response.json(
      { provider, keyHint: key.slice(-4), models: ids },
      { headers: { "Set-Cookie": setCredentialCookie(req, provider, key) } },
    );
  } catch (error) {
    if (
      error instanceof Anthropic.AuthenticationError ||
      error instanceof OpenAI.AuthenticationError
    ) {
      return bad(401, "That key was rejected by the provider.");
    }
    if (
      error instanceof Anthropic.PermissionDeniedError ||
      error instanceof OpenAI.PermissionDeniedError
    ) {
      return bad(403, "That key is valid but lacks permission for this API.");
    }
    if (error instanceof Anthropic.APIError || error instanceof OpenAI.APIError) {
      return bad(error.status ?? 502, error.message);
    }
    // A network failure here is genuinely useful to surface: it usually means
    // no outbound access rather than a bad key.
    const message =
      error instanceof Error ? error.message : "Could not reach the provider.";
    return bad(502, message);
  }
}

/** DELETE — disconnect. */
export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const provider = url.searchParams.get("provider");
  if (!isProvider(provider)) return bad(400, "Unknown provider.");
  return Response.json(
    { provider, connected: false },
    { headers: { "Set-Cookie": clearCredentialCookie(req, provider) } },
  );
}
