import WaitlistForm from "@/components/ui/WaitlistForm";

export default function WaitlistCTA() {
  return (
    <div id="waitlist" style={{
      background: "var(--brand-100)", borderRadius: 12,
      padding: "56px 40px",
      display: "grid", gridTemplateColumns: "1fr 460px", gap: 48, alignItems: "center",
    }}>
      <div>
        <h2 style={{
          fontFamily: "var(--font-serif)", fontSize: 36, fontWeight: 600,
          letterSpacing: "-0.01em", color: "var(--stone-50)", maxWidth: "20ch", margin: 0,
        }}>
          Get a product team on your side.
        </h2>
        <p style={{ fontSize: 16, lineHeight: "26px", color: "rgba(250,250,249,.7)", marginTop: 12, maxWidth: "44ch", textWrap: "pretty" as const }}>
          Sign in with Google and your workspace opens straight away. Free while in beta, founder pricing at launch, and a direct line to the person building it.
        </p>
      </div>

      <div style={{ background: "var(--card)", borderRadius: 8, padding: 24, boxShadow: "var(--shadow-lg)" }}>
        <WaitlistForm variant="cta" />
      </div>
    </div>
  );
}
