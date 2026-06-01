interface SpeechBridgeLogoProps {
  size?: number;
  className?: string;
}

export function SpeechBridgeLogo({
  size = 32,
  className,
}: SpeechBridgeLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="SpeechBridge logo"
    >
      {/* Left speech bubble */}
      <rect
        x="2"
        y="8"
        width="24"
        height="18"
        rx="6"
        fill="currentColor"
        opacity="0.9"
      />
      <polygon
        points="10,26 16,26 12,32"
        fill="currentColor"
        opacity="0.9"
      />
      {/* Sound waves inside left bubble */}
      <path
        d="M9 14 Q11 11 13 14"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M14 13 Q16 9 18 13"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M19 14 Q21 11 23 14"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Bridge connecting the two bubbles */}
      <path
        d="M26 17 C30 17 34 17 38 17"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="2 3"
        opacity="0.5"
      />
      <circle cx="32" cy="17" r="2.5" fill="currentColor" opacity="0.7" />

      {/* Right speech bubble */}
      <rect
        x="38"
        y="8"
        width="24"
        height="18"
        rx="6"
        fill="currentColor"
      />
      <polygon
        points="48,26 54,26 50,32"
        fill="currentColor"
      />
      {/* Checkmark inside right bubble (understood) */}
      <path
        d="M45 17 L49 21 L57 13"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Bottom arc — connection/understanding */}
      <path
        d="M16 36 Q32 44 48 36"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.3"
      />
    </svg>
  );
}
