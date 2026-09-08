import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import {
  clearCredentialCookies,
  credentialFor,
  hasEnvCredential,
  setAccountCookie,
  setKeyCookie,
  SUPPORTS_ACCOUNT_MODE,
  type ProviderId,
} from "@/lib/server/credentials";
import { requireSession } from "@/lib/server/session";

/**
 * Taking access for a provider.
 *
 * Both modes are verified against the provider before being accepted, by
 * listing models — that authenticates without spending tokens. "Connected"
 * therefore means the credential has been exercised, not merely supplied.
 *
 *   mode "account" — uses your own Claude account via the OAuth profile that
 *     `ant auth login` writes. Runs bill to your Pro/Max subscription. No
 *     credential is stored by us at all; the SDK resolves it each time.
 *
 *   mode "key" — a pasted API key, billed pay-as-you-go, kept in an httpOnly
 *     cookie the browser cannot read.
 */

export const runtime = "nodejs";

const ACCOUNT_HELP =
  "No Claude account is signed in on this machine. Install the Anthropic CLI and run `ant auth login`, then try again. Alternatively connect with an API key.";

function bad(status: number, error: string) {
  return Response.json({ error }, { status });
}

function isProvider(v: unknown): v is ProviderId {
  return v === "claude" || v === "openai";
}

function withCookies(body: unknown, cookies: string[]) {
  const headers = new Headers({ "Content-Type": "application/json" });
  for (const c of cookies) headers.append("Set-Cookie", c);
  return new Response(JSON.stringify(body), { status: 200, headers });
}

/** GET — what is currently connected, and which modes are available. */
export async function GET(req: Request) {
  const session = await requireSession();
  if (session instanceof Response) return session;

  const providers = (["claude", "openai"] as ProviderId[]).map((provider) => {
    const cred = credentialFor(req, provider);
    return {
      provider,
      connected: cred !== null,
      mode: cred?.kind ?? null,
      fromEnvironment: hasEnvCredential(provider),
      supportsAccount: SUPPORTS_ACCOUNT_MODE[provider],
    };
  });
  return Response.json({ providers });
}

export async function POST(req: Request) {
  const session = await requireSession();
  if (session instanceof Response) return session;

  let body: { provider?: unknown; mode?: unknown; apiKey?: unknown };
  try {
    body = await req.json();
  } catch {
    return bad(400, "Could not read the request body.");
  }

  const { provider, apiKey } = body;
  const mode = body.mode === "account" ? "account" : "key";
  if (!isProvider(provider)) return bad(400, "Unknown provider.");

  if (mode === "account" && !SUPPORTS_ACCOUNT_MODE[provider]) {
    return bad(
      400,
      "That provider has no account sign-in. Connect it with an API key.",
    );
  }

  try {
    if (provider === "claude") {
      // Account mode passes no key: the SDK resolves the `ant auth login`
      // profile (or an environment variable) on its own.
      const client =
        mode === "account"
          ? new Anthropic()
          : new Anthropic({ apiKey: String(apiKey ?? "").trim() });

      if (mode === "key" && !String(apiKey ?? "").trim()) {
        return bad(400, "Paste a key to continue.");
      }

      const models = await client.models.list({ limit: 20 });
      const names = models.data.map((m) => m.display_name ?? m.id).slice(0, 6);

      if (mode === "account") {
        return withCookies(
          { provider, mode, models: names },
          setAccountCookie(req, provider),
        );
      }
      const key = String(apiKey).trim();
      return withCookies(
        { provider, mode, keyHint: key.slice(-4), models: names },
        setKeyCookie(req, provider, key),
      );
    }

    const key = String(apiKey ?? "").trim();
    if (!key) return bad(400, "Paste a key to continue.");

    const client = new OpenAI({ apiKey: key });
    const models = await client.models.list();
    const ids = models.data
      .map((m) => m.id)
      .filter((id) => id.startsWith("gpt") || id.startsWith("o"))
      .sort()
      .slice(0, 6);
    return withCookies(
      { provider, mode: "key", keyHint: key.slice(-4), models: ids },
      setKeyCookie(req, provider, key),
    );
  } catch (error) {
    const isAuth =
      error instanceof Anthropic.AuthenticationError ||
      error instanceof OpenAI.AuthenticationError;

    if (isAuth) {
      return bad(401, mode === "account" ? ACCOUNT_HELP : "That key was rejected by the provider.");
    }
    if (
      error instanceof Anthropic.PermissionDeniedError ||
      error instanceof OpenAI.PermissionDeniedError
    ) {
      return bad(403, "That credential is valid but lacks permission for this API.");
    }
    if (error instanceof Anthropic.APIError || error instanceof OpenAI.APIError) {
      return bad(error.status ?? 502, error.message);
    }
    // With no credential at all the SDK throws before any request is made,
    // which in account mode almost always means nobody has signed in.
    if (mode === "account") return bad(401, ACCOUNT_HELP);

    const message =
      error instanceof Error ? error.message : "Could not reach the provider.";
    return bad(502, message);
  }
}

/** DELETE — disconnect. */
export async function DELETE(req: Request) {
  const session = await requireSession();
  if (session instanceof Response) return session;

  const provider = new URL(req.url).searchParams.get("provider");
  if (!isProvider(provider)) return bad(400, "Unknown provider.");
  return withCookies(
    { provider, connected: false },
    clearCredentialCookies(req, provider),
  );
}
