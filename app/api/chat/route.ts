import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { credentialFor } from "@/lib/server/credentials";
import { requireSession } from "@/lib/server/session";

/**
 * Project chat proxy.
 *
 * The browser never sees a credential. Depending on how the provider was
 * connected this either runs on the user's own Claude account (the SDK
 * resolves the `ant auth login` OAuth profile, so runs bill to their Pro/Max
 * subscription) or on a pasted API key held in an httpOnly cookie. Both are
 * read here, on the server, and never shipped to the client.
 *
 * Without a credential the route returns 503 and a message the UI shows
 * verbatim, rather than pretending to answer.
 */

export const runtime = "nodejs";

/**
 * Server-side refusal fallbacks: on a policy decline the API re-runs the same
 * request on a fallback model inside the same call. Set to false if your org
 * does not have the beta enabled and requests start failing with a 400 that
 * names it.
 */
const USE_REFUSAL_FALLBACKS = true;

const CLAUDE_MODEL = "claude-opus-5";
const OPENAI_MODEL = "gpt-5.2";

const MAX_TOKENS = 16000;
/** Trim history so a long-running project chat cannot grow without bound. */
const MAX_TURNS = 40;

interface IncomingMessage {
  role: "user" | "assistant";
  content: string;
}

interface Body {
  provider?: "claude" | "openai";
  messages?: IncomingMessage[];
  /** Short description of the project, used to ground the assistant. */
  projectContext?: string;
}

function systemPrompt(projectContext: string | undefined) {
  return [
    "You are a product management assistant working inside a workspace called PmPro.ai.",
    "You help with research, PRDs, product design, data questions, notes and decisions.",
    "Be concise and concrete. Prefer specifics over generalities.",
    "When you are missing information you would need to answer well, say what is missing rather than guessing.",
    projectContext
      ? `\nThe user is working on this project:\n${projectContext}`
      : "",
  ]
    .filter(Boolean)
    .join(" ");
}

function bad(status: number, error: string) {
  return Response.json({ error }, { status });
}

export async function POST(req: Request) {
  const session = await requireSession();
  if (session instanceof Response) return session;

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return bad(400, "Could not read the request body.");
  }

  const provider = body.provider === "openai" ? "openai" : "claude";
  const history = Array.isArray(body.messages) ? body.messages : [];

  const messages = history
    .filter(
      (m) =>
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim().length > 0,
    )
    .slice(-MAX_TURNS);

  if (messages.length === 0) {
    return bad(400, "Send at least one message.");
  }
  // Both APIs require the exchange to open with a user turn.
  if (messages[0].role !== "user") {
    return bad(400, "The conversation has to start with a user message.");
  }

  const system = systemPrompt(body.projectContext);

  try {
    if (provider === "claude") {
      const cred = credentialFor(req, "claude");
      if (!cred) {
        return bad(
          503,
          "No Claude credential. Connect Claude from the workspace — either with your Claude account or an API key.",
        );
      }

      // Account mode passes no key, so the SDK resolves the signed-in
      // profile and the run bills to that subscription.
      const client =
        cred.kind === "account" ? new Anthropic() : new Anthropic({ apiKey: cred.key });

      const response = USE_REFUSAL_FALLBACKS
        ? await client.beta.messages.create({
            model: CLAUDE_MODEL,
            max_tokens: MAX_TOKENS,
            betas: ["server-side-fallback-2026-07-01"],
            fallbacks: "default",
            system,
            messages,
          })
        : await client.messages.create({
            model: CLAUDE_MODEL,
            max_tokens: MAX_TOKENS,
            system,
            messages,
          });

      if (response.stop_reason === "refusal") {
        return bad(
          422,
          "Claude declined to answer that. Try rephrasing the question.",
        );
      }

      // content is a discriminated union; narrow before reading .text.
      const text = response.content
        .filter((b): b is Anthropic.TextBlock => b.type === "text")
        .map((b) => b.text)
        .join("\n")
        .trim();

      return Response.json({
        text: text || "(empty response)",
        model: response.model,
        provider,
      });
    }

    const cred = credentialFor(req, "openai");
    if (!cred) {
      return bad(
        503,
        "No ChatGPT credential. Connect ChatGPT from the workspace, or set OPENAI_API_KEY.",
      );
    }

    const openai =
      cred.kind === "account" ? new OpenAI() : new OpenAI({ apiKey: cred.key });
    const completion = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      max_completion_tokens: MAX_TOKENS,
      messages: [{ role: "system", content: system }, ...messages],
    });

    const text = completion.choices[0]?.message?.content?.trim();
    return Response.json({
      text: text || "(empty response)",
      model: completion.model,
      provider,
    });
  } catch (error) {
    // Typed errors first, so the UI can say something true about the failure.
    if (error instanceof Anthropic.AuthenticationError) {
      return bad(401, "The Anthropic credential was rejected.");
    }
    if (error instanceof Anthropic.RateLimitError) {
      return bad(429, "Rate limited by Anthropic. Try again in a moment.");
    }
    if (error instanceof Anthropic.APIError) {
      return bad(error.status ?? 502, `Anthropic API error: ${error.message}`);
    }
    if (error instanceof OpenAI.AuthenticationError) {
      return bad(401, "The OpenAI credential was rejected.");
    }
    if (error instanceof OpenAI.RateLimitError) {
      return bad(429, "Rate limited by OpenAI. Try again in a moment.");
    }
    if (error instanceof OpenAI.APIError) {
      return bad(error.status ?? 502, `OpenAI API error: ${error.message}`);
    }
    const message =
      error instanceof Error ? error.message : "Unknown server error.";
    return bad(500, message);
  }
}
