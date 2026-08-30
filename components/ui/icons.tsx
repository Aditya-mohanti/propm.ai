export type IconProps = {
  className?: string;
};

export function AgentsIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" className={className}>
      <rect x="4" y="4" width="16" height="16" rx="1"></rect>
      <circle cx="9" cy="10" r="1.4"></circle>
      <circle cx="15" cy="10" r="1.4"></circle>
      <path d="M8 15h8"></path>
      <path d="M12 4V2"></path>
    </svg>
  );
}

export function PlaygroundIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" className={className}>
      <path d="M9 18h6"></path>
      <path d="M10 21h4"></path>
      <path d="M12 3a6 6 0 0 0-3 11.2c.5.3.8.9.8 1.5V16h4.4v-.3c0-.6.3-1.2.8-1.5A6 6 0 0 0 12 3z"></path>
    </svg>
  );
}

export function DocsIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" className={className}>
      <path d="M6 3h9l3 3v15H6z"></path>
      <path d="M15 3v3h3"></path>
      <path d="M9 12h6"></path>
      <path d="M9 15h6"></path>
      <path d="M9 9h3"></path>
    </svg>
  );
}

export function PrototypeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" className={className}>
      <rect x="3" y="5" width="18" height="13" rx="1"></rect>
      <path d="M3 9h18"></path>
      <path d="M8 13.5l2 2 4-4"></path>
    </svg>
  );
}

export function ModelIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" className={className}>
      <rect x="3" y="3" width="7" height="7"></rect>
      <rect x="14" y="3" width="7" height="7"></rect>
      <rect x="3" y="14" width="7" height="7"></rect>
      <rect x="14" y="14" width="7" height="7"></rect>
    </svg>
  );
}

export function HistoryIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" className={className}>
      <path d="M3 12a9 9 0 1 0 9-9"></path>
      <path d="M3 3v6h6"></path>
    </svg>
  );
}

export function SkillListIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" className={className}>
      <path d="M4 12h16"></path>
      <path d="M4 6h10"></path>
      <path d="M4 18h7"></path>
    </svg>
  );
}

export function TeamIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" className={className}>
      <circle cx="12" cy="8" r="3.2"></circle>
      <path d="M5 21c0-4 3.1-6.5 7-6.5S19 17 19 21"></path>
    </svg>
  );
}

export function LinkIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" className={className}>
      <rect x="4" y="4" width="16" height="16" rx="1"></rect>
      <path d="M8 2v4"></path>
      <path d="M16 2v4"></path>
      <path d="M4 10h16"></path>
    </svg>
  );
}

export function AuditIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" className={className}>
      <path d="M12 2v4"></path>
      <path d="M12 18v4"></path>
      <path d="M4.9 4.9l2.8 2.8"></path>
      <path d="M16.3 16.3l2.8 2.8"></path>
      <circle cx="12" cy="12" r="4"></circle>
    </svg>
  );
}
