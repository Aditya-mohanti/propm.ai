import type { ProviderId } from "@/lib/workspace-context";

export interface ProviderMeta {
  id: ProviderId;
  name: string;
  company: string;
  blurb: string;
  /** Brand colour used for the mark and the selected state. */
  tint: string;
  models: string[];
  /** Shape of the key, used for inline validation before we bother the API. */
  keyPrefix: string;
  keyPlaceholder: string;
  docsUrl: string;
  /** Plan shown after an authorisation handshake. */
  oauthPlan: string;
  /** Plan shown when connected with a raw key — usage-billed, not a subscription. */
  apiKeyPlan: string;
}

export const PROVIDERS: Record<ProviderId, ProviderMeta> = {
  claude: {
    id: "claude",
    name: "Claude",
    company: "Anthropic",
    blurb:
      "Best for long documents — PRDs, decision logs and research writeups. Runs on your existing Claude plan.",
    tint: "#cf6a3c",
    models: ["Claude Sonnet 4.5", "Claude Opus 4.1", "Claude Haiku 4.5"],
    keyPrefix: "sk-ant-",
    keyPlaceholder: "sk-ant-api03-…",
    docsUrl: "https://console.anthropic.com/settings/keys",
    oauthPlan: "Claude Pro",
    apiKeyPlan: "Anthropic API - pay as you go",
  },
  openai: {
    id: "openai",
    name: "ChatGPT",
    company: "OpenAI",
    blurb:
      "Best for quick passes and structured extraction. Runs on your existing OpenAI account.",
    tint: "#10a37f",
    models: ["GPT-5.2", "GPT-5.2 mini", "o4-mini"],
    keyPrefix: "sk-",
    keyPlaceholder: "sk-proj-…",
    docsUrl: "https://platform.openai.com/api-keys",
    oauthPlan: "ChatGPT Plus",
    apiKeyPlan: "OpenAI API - pay as you go",
  },
};

export const PROVIDER_LIST: ProviderMeta[] = [PROVIDERS.claude, PROVIDERS.openai];

/** What the workspace tells the user it will and will not do with the connection. */
export const SCOPES: { allowed: string[]; denied: string[] } = {
  allowed: [
    "Send prompts from your agents and canvases",
    "Read the projects and context you attach to a run",
    "Choose between the models your plan includes",
  ],
  denied: [
    "Read your chat history or anything else in your account",
    "Share your key with anyone, including us — it stays in this browser",
    "Run anything on a schedule or while you are away",
  ],
};

export interface KeyCheck {
  ok: boolean;
  message?: string;
}

/**
 * Cheap client-side shape check so an obvious typo is caught before the
 * dialog goes into its connecting state. It deliberately does not try to
 * be authoritative — only the provider can say whether a key is live.
 */
export function checkKey(provider: ProviderMeta, key: string): KeyCheck {
  const trimmed = key.trim();
  if (!trimmed) return { ok: false, message: "Paste a key to continue." };
  if (/\s/.test(trimmed)) {
    return { ok: false, message: "That key contains a space — check the paste." };
  }
  if (!trimmed.startsWith(provider.keyPrefix)) {
    return {
      ok: false,
      message: `${provider.name} keys start with ${provider.keyPrefix}`,
    };
  }
  if (trimmed.length < 20) {
    return { ok: false, message: "That key looks too short to be complete." };
  }
  return { ok: true };
}

export function keyHint(key: string) {
  return key.trim().slice(-4);
}
