import Reveal from "@/components/ui/Reveal";
import { FEATURES, type FeatureIconName } from "@/lib/content";
import {
  AuditIcon,
  HistoryIcon,
  LinkIcon,
  ModelIcon,
  SkillListIcon,
  TeamIcon,
  type IconProps,
} from "@/components/ui/icons";

const ICONS: Record<FeatureIconName, (props: IconProps) => React.ReactElement> = {
  model: ModelIcon,
  history: HistoryIcon,
  skills: SkillListIcon,
  team: TeamIcon,
  link: LinkIcon,
  audit: AuditIcon,
};

export default function Features() {
  return (
    <section id="features">
      <div className="wrap">
        <Reveal className="section-head">
          <span className="eyebrow">Built for the job, not the demo</span>
          <h2>What&apos;s actually on the bench.</h2>
        </Reveal>
        <Reveal>
          <div className="feature-grid">
            {FEATURES.map((feature) => {
              const Icon = ICONS[feature.icon];
              return (
                <div className="feature" key={feature.title}>
                  <Icon className="f-icon" />
                  <h4>{feature.title}</h4>
                  <p>{feature.body}</p>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
