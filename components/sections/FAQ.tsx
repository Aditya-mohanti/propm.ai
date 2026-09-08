const QA = [
  { q: "Is this just a GPT wrapper?",       a: "The models are third-party. The product is the workspace: persistent agents with your context and instructions, writing into structured canvases with version history."                                                         },
  { q: "When do I get in?",                  a: "Invites go out weekly in small batches so support stays real. Confirmation email immediately, invite when your workspace is ready."                                                                                          },
  { q: "What happens to my documents?",     a: "Stored encrypted, used only to give your agents context, never used to train models. Delete a workspace and the context goes with it."                                                                                        },
  { q: "Does it replace my PM job?",        a: "No. It removes the assembly work — formatting, chasing numbers, first drafts — and leaves the judgment to you."                                                                                                              },
  { q: "What will it cost?",                a: "Not decided. Early access is free, and anyone on the waitlist gets founder pricing when we do decide."                                                                                                                        },
  { q: "Can I bring my own templates?",     a: "Yes — paste your PRD template into an agent's instructions and it writes in your house format from the first draft."                                                                                                         },
];

export default function FAQ() {
  return (
    <div id="faq" className="section">
      <h2 className="h2" style={{ margin: "0 0 24px" }}>
        Questions a skeptical PM asks
      </h2>
      <div className="faq-grid">
        {QA.map((item, i) => (
          <div key={item.q} style={{
            padding: "16px 0",
            borderTop: "1px solid var(--border)",
            ...(i >= QA.length - 2 ? { borderBottom: "1px solid var(--border)" } : {}),
          }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{item.q}</div>
            <p style={{ fontSize: 13, lineHeight: "20px", color: "var(--fg2)", marginTop: 6, margin: "6px 0 0" }}>{item.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
