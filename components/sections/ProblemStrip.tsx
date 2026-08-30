import { PROBLEM_TABS } from "@/lib/content";

export default function ProblemStrip() {
  return (
    <div className="strip">
      <div className="wrap strip-row">
        <span>RIGHT NOW, ONE FEATURE SPEC TAKES:</span>
        <div className="tabs">
          {PROBLEM_TABS.map((tab) => (
            <span key={tab} className="strip-tag">
              {tab}
            </span>
          ))}
        </div>
        <span className="strip-arrow">→</span>
        <span className="strip-final">ONE BENCH</span>
      </div>
    </div>
  );
}
