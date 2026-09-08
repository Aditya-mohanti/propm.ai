/**
 * The ProPM mark — ascending bars capped by an arrow.
 *
 * Drawn inline from the supplied artwork rather than loaded as a file so it
 * inherits nothing from the page and stays sharp at any size. The "PRO PM"
 * wordmark in the original file is dropped here: at the 20–28px this mark is
 * used at, that type is unreadable, and every placement already sets the name
 * in real text beside it. The graphic is re-centred to fill the space the
 * wordmark used to occupy.
 */
export default function Logo({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 600 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="ProPM"
      style={{ flex: `0 0 ${size}px` }}
    >
      <defs>
        <linearGradient id="propm-mark" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#059669" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>
      </defs>

      <rect width="600" height="600" rx="88" fill="#0A0F0D" />

      <g transform="translate(130,188)">
        <rect x="0" y="180" width="44" height="70" rx="10" fill="#2A3330" />
        <rect x="66" y="130" width="44" height="120" rx="10" fill="#3E4C47" />
        <rect x="132" y="70" width="44" height="180" rx="10" fill="#57685F" />
        <rect x="198" y="0" width="44" height="250" rx="10" fill="url(#propm-mark)" />

        <path
          d="M 242 0 L 300 -46 L 300 -18 L 340 -18 L 340 14 L 300 14 L 300 42 Z"
          fill="url(#propm-mark)"
          transform="translate(0,20)"
        />
      </g>
    </svg>
  );
}
