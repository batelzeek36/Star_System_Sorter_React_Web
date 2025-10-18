// Geometric crest icons for each star system
// Export sizes: 24px, 28px, 48px

interface CrestProps {
  size?: 24 | 28 | 48;
  className?: string;
}

export function OrionCrest({ size = 24, className = '' }: CrestProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Orion star system crest"
    >
      <title>Orion Crest</title>
      {/* Three aligned stars forming Orion's belt */}
      <circle cx="24" cy="24" r="3" fill="currentColor" />
      <circle cx="14" cy="20" r="2.5" fill="currentColor" opacity="0.8" />
      <circle cx="34" cy="28" r="2.5" fill="currentColor" opacity="0.8" />
      <path d="M24 8 L24 18 M24 30 L24 40 M8 24 L18 24 M30 24 L40 24" 
            stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
    </svg>
  );
}

export function SiriusCrest({ size = 24, className = '' }: CrestProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Sirius star system crest"
    >
      <title>Sirius Crest</title>
      {/* Bright central star with eight-pointed rays */}
      <circle cx="24" cy="24" r="4" fill="currentColor" />
      <path d="M24 10 L24 16 M24 32 L24 38 M10 24 L16 24 M32 24 L38 24" 
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M15 15 L19 19 M29 29 L33 33 M33 15 L29 19 M19 29 L15 33" 
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function PleiadesCrest({ size = 24, className = '' }: CrestProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Pleiades star system crest"
    >
      <title>Pleiades Crest</title>
      {/* Seven sisters - cluster of seven stars */}
      <circle cx="24" cy="20" r="2.5" fill="currentColor" />
      <circle cx="18" cy="24" r="2" fill="currentColor" opacity="0.9" />
      <circle cx="30" cy="24" r="2" fill="currentColor" opacity="0.9" />
      <circle cx="20" cy="30" r="2" fill="currentColor" opacity="0.8" />
      <circle cx="28" cy="30" r="2" fill="currentColor" opacity="0.8" />
      <circle cx="16" cy="16" r="1.8" fill="currentColor" opacity="0.7" />
      <circle cx="32" cy="16" r="1.8" fill="currentColor" opacity="0.7" />
      <path d="M24 20 L18 24 L20 30 L24 20 L30 24 L28 30 Z" 
            stroke="currentColor" strokeWidth="0.5" opacity="0.2" fill="none" />
    </svg>
  );
}

export function AndromedaCrest({ size = 24, className = '' }: CrestProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Andromeda star system crest"
    >
      <title>Andromeda Crest</title>
      {/* Spiral galaxy representation */}
      <circle cx="24" cy="24" r="3" fill="currentColor" />
      <path d="M24 24 Q 32 20, 36 24 Q 32 28, 24 24" 
            stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.6" />
      <path d="M24 24 Q 20 16, 24 12 Q 28 16, 24 24" 
            stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.6" />
      <path d="M24 24 Q 16 28, 12 24 Q 16 20, 24 24" 
            stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.6" />
      <path d="M24 24 Q 28 32, 24 36 Q 20 32, 24 24" 
            stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.6" />
    </svg>
  );
}

export function LyraCrest({ size = 24, className = '' }: CrestProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Lyra star system crest"
    >
      <title>Lyra Crest</title>
      {/* Lyre/Harp shape with bright Vega star */}
      <circle cx="24" cy="16" r="3" fill="currentColor" />
      <path d="M16 14 Q 24 8, 32 14" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M16 14 L16 32 M32 14 L32 32" stroke="currentColor" strokeWidth="1.5" />
      <path d="M16 32 Q 24 36, 32 32" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M18 20 L30 20 M18 24 L30 24 M18 28 L30 28" 
            stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
    </svg>
  );
}

export function ArcturusCrest({ size = 24, className = '' }: CrestProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Arcturus star system crest"
    >
      <title>Arcturus Crest</title>
      {/* Guardian/Ancient symbol - triangle with center point */}
      <circle cx="24" cy="24" r="3.5" fill="currentColor" />
      <path d="M24 10 L38 34 L10 34 Z" 
            stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.5" />
      <circle cx="24" cy="10" r="1.5" fill="currentColor" opacity="0.7" />
      <circle cx="38" cy="34" r="1.5" fill="currentColor" opacity="0.7" />
      <circle cx="10" cy="34" r="1.5" fill="currentColor" opacity="0.7" />
    </svg>
  );
}

// Map for easy lookup
export const StarSystemCrests = {
  'Orion': OrionCrest,
  'Osirian': OrionCrest, // Alias
  'Sirius': SiriusCrest,
  'Pleiades': PleiadesCrest,
  'Andromeda': AndromedaCrest,
  'Lyra': LyraCrest,
  'Arcturus': ArcturusCrest,
};

export type StarSystemName = keyof typeof StarSystemCrests;
