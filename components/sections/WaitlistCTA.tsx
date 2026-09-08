import WaitlistForm from "@/components/ui/WaitlistForm";

export default function WaitlistCTA() {
  return (
    <div id="waitlist" className="cta-grid" style={{ background: "var(--brand-100)", borderRadius: 12 }}>
      <div>
        <h2 className="h2" style={{
          fontSize: "clamp(26px, 4vw, 36px)",
          color: "var(--stone-50)", maxWidth: "20ch",
        }}>
          Get a product team on your side.
        </h2>
        <p className="body-lg" style={{ color: "rgba(250,250,249,.7)", marginTop: 12, maxWidth: "44ch", textWrap: "pretty" as const }}>
          Sign in with Google and your workspace opens straight away. Free while in beta, founder pricing at launch, and a direct line to the person building it.
        </p>
      </div>

      <div style={{ background: "var(--card)", borderRadius: 8, padding: "clamp(16px, 3vw, 24px)", boxShadow: "var(--shadow-lg)" }}>
        <WaitlistForm variant="cta" />
      </div>
    </div>
  );
}
