export default function AgentBuilderVisual() {
  return (
    <div className="visual-card">
      <div className="vc-head">
        <span>New agent</span>
        <div className="vc-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <div className="field-row">
        <label>Name</label>
        <div className="field-val">Retention Researcher</div>
      </div>
      <div className="field-row">
        <label>Model</label>
        <div className="field-val">Sonnet 5</div>
      </div>
      <div className="field-row">
        <label>Skills</label>
        <div className="chip-row">
          <span className="chip">Cohort analysis</span>
          <span className="chip">SQL</span>
          <span className="chip">Charting</span>
          <span className="chip plus">+ add skill</span>
        </div>
      </div>
    </div>
  );
}
