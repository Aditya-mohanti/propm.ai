import Reveal from "@/components/ui/Reveal";

export default function StationRow({
  code,
  title,
  description,
  skills,
  reverse = false,
  visual,
}: {
  code: string;
  title: string;
  description: React.ReactNode;
  skills: string[];
  reverse?: boolean;
  visual: React.ReactNode;
}) {
  return (
    <div className={`station${reverse ? " reverse" : ""}`}>
      <Reveal className="station-copy">
        <span className="station-code">{code}</span>
        <h3>{title}</h3>
        <p>{description}</p>
        <div className="station-skills">
          {skills.map((skill) => (
            <span key={skill} className="skill-chip">
              {skill}
            </span>
          ))}
        </div>
      </Reveal>
      <Reveal className="station-visual">{visual}</Reveal>
    </div>
  );
}
