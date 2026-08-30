import WaitlistForm from "@/components/ui/WaitlistForm";

export default function Waitlist() {
  return (
    <section className="waitlist" id="waitlist">
      <div className="wrap waitlist-inner">
        <span className="eyebrow" style={{ color: "rgba(239,240,236,0.6)" }}>
          Early access
        </span>
        <h2>Get on the bench.</h2>
        <p>
          We&apos;re rolling out access in small weekly batches so every new
          PM gets real onboarding, not a locked demo.
        </p>
        <WaitlistForm />
      </div>
    </section>
  );
}
