import Reveal from "@/components/ui/Reveal";
import StationRow from "./StationRow";
import AgentBuilderVisual from "./station-visuals/AgentBuilderVisual";
import PlaygroundVisual from "./station-visuals/PlaygroundVisual";
import DocsVisual from "./station-visuals/DocsVisual";
import PrototypeVisual from "./station-visuals/PrototypeVisual";

export default function Stations() {
  return (
    <section id="stations">
      <div className="wrap">
        <Reveal className="section-head">
          <span className="eyebrow">Four stations, one bench</span>
          <h2>Everything you&apos;d normally rent from four different apps.</h2>
          <p>
            Each station is a purpose-built workspace — pick the one that
            fits what you&apos;re doing right now, and move between them
            without losing context.
          </p>
        </Reveal>

        <StationRow
          code="STATION 01 — AGENTS"
          title="Create an agent for exactly the job."
          description={
            <>
              Give an agent a role, a set of skills, and the stations
              it&apos;s allowed to touch — a PRD agent that drafts specs, a
              research agent that pulls market data, a SQL agent that
              answers &ldquo;how many users actually did this.&rdquo; No
              prompt engineering, just configuration.
            </>
          }
          skills={[
            "Market sizing",
            "Competitive analysis",
            "SQL",
            "Spec drafting",
          ]}
          visual={<AgentBuilderVisual />}
        />

        <StationRow
          code="STATION 02 — PLAYGROUND"
          title="A blank canvas that talks back."
          description="Throw out half-formed ideas before they're ready for a doc. The playground pushes on assumptions, asks the question you forgot, and clusters the threads worth keeping — so what reaches a spec has already survived one round of scrutiny."
          skills={["Brainstorm", "Assumption checks", "Clustering"]}
          reverse
          visual={<PlaygroundVisual />}
        />

        <StationRow
          code="STATION 03 — DOCS"
          title="Specs that stay wired to the work."
          description={
            <>
              A living-page workspace for PRDs, GTM briefs, and launch
              plans — nested pages, tables, and comments, but every doc can
              pull straight from an agent&apos;s output or link to a
              prototype instead of a screenshot of one.
            </>
          }
          skills={["Nested pages", "Tables", "Agent-linked"]}
          visual={<DocsVisual />}
        />

        <StationRow
          code="STATION 04 — PROTOTYPE"
          title="From spec to clickable, same afternoon."
          description="Sketch the flow in the same workspace as the spec it came from — no handoff to design, no separate Figma file drifting out of sync while engineering asks which version is real."
          skills={["Click-through flows", "Shareable link", "Spec-linked"]}
          reverse
          visual={<PrototypeVisual />}
        />
      </div>
    </section>
  );
}
