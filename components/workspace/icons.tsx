type P = { size?: number };

function S({ size = 20, children }: P & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export const FolderIcon = (p: P) => (
  <S {...p}>
    <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
  </S>
);

export const RobotIcon = (p: P) => (
  <S {...p}>
    <rect x="4" y="7" width="16" height="12" rx="2" />
    <path d="M12 7V4" />
    <circle cx="9" cy="12" r="1" />
    <circle cx="15" cy="12" r="1" />
    <path d="M9 16h6" />
  </S>
);

export const SparkIcon = (p: P) => (
  <S {...p}>
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />
  </S>
);

export const ClockIcon = (p: P) => (
  <S {...p}>
    <circle cx="12" cy="12" r="8" />
    <path d="M12 8v4.5l3 1.8" />
  </S>
);

export const DocIcon = (p: P) => (
  <S {...p}>
    <path d="M6 3h8l4 4v14H6z" />
    <path d="M14 3v4h4" />
    <path d="M9 13h6M9 17h6" />
  </S>
);

export const BranchIcon = (p: P) => (
  <S {...p}>
    <circle cx="7" cy="6" r="2" />
    <circle cx="7" cy="18" r="2" />
    <circle cx="17" cy="12" r="2" />
    <path d="M7 8v8M9 18h3a3 3 0 0 0 3-3v-1M9 6h3a3 3 0 0 1 3 3v1" />
  </S>
);

export const PhoneIcon = (p: P) => (
  <S {...p}>
    <rect x="7" y="3" width="10" height="18" rx="2" />
    <path d="M11 18h2" />
  </S>
);

export const PlugIcon = (p: P) => (
  <S {...p}>
    <path d="M9 3v6M15 3v6" />
    <path d="M6 9h12v3a6 6 0 0 1-12 0z" />
    <path d="M12 18v3" />
  </S>
);

export const CheckIcon = (p: P) => (
  <S {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </S>
);

export const CrossIcon = (p: P) => (
  <S {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </S>
);

export const AlertIcon = (p: P) => (
  <S {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 8v5M12 16v.5" />
  </S>
);

export const KeyIcon = (p: P) => (
  <S {...p}>
    <circle cx="8" cy="12" r="3.5" />
    <path d="M11.5 12H21M18 12v3M15 12v2.5" />
  </S>
);

export const GearIcon = (p: P) => (
  <S {...p}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M18.4 5.6l-1.8 1.8M7.4 16.6l-1.8 1.8" />
  </S>
);

export const ArrowIcon = (p: P) => (
  <S {...p}>
    <path d="M5 12h13M13 7l5 5-5 5" />
  </S>
);

export const SearchIcon = (p: P) => (
  <S {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m16 16 4 4" />
  </S>
);

export const ChartIcon = (p: P) => (
  <S {...p}>
    <path d="M4 20V4M4 20h16" />
    <path d="M8 20v-6M12 20V8M16 20v-9M20 20v-4" />
  </S>
);

export const NoteIcon = (p: P) => (
  <S {...p}>
    <path d="M5 4h14v11l-5 5H5z" />
    <path d="M19 15h-5v5" />
    <path d="M9 9h6M9 12h4" />
  </S>
);

export const GridIcon = (p: P) => (
  <S {...p}>
    <rect x="4" y="4" width="7" height="7" rx="1.5" />
    <rect x="13" y="4" width="7" height="7" rx="1.5" />
    <rect x="4" y="13" width="7" height="7" rx="1.5" />
    <rect x="13" y="13" width="7" height="7" rx="1.5" />
  </S>
);

/** Disclosure caret. Rotated by the caller rather than swapped for a down arrow. */
export const CaretIcon = (p: P) => (
  <S {...p}>
    <path d="m9 6 6 6-6 6" />
  </S>
);

export const PlusIcon = (p: P) => (
  <S {...p}>
    <path d="M12 5v14M5 12h14" />
  </S>
);

export const MenuIcon = (p: P) => (
  <S {...p}>
    <path d="M5 8h14M5 12h14M5 16h14" />
  </S>
);
