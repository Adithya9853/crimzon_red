interface CinematicBackgroundProps {
  backgroundImage: string;
}

/**
 * Layer 1: Stationary cinematic red/black background stage.
 * Never participates in portrait scattering.
 */
export function CinematicBackground({ backgroundImage }: CinematicBackgroundProps) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      {/* Stationary 16:9-aligned atmospheric backdrop positioned cleanly on right/full hero */}
      <img
        src={backgroundImage}
        alt=""
        referrerPolicy="no-referrer"
        className="h-full w-full object-cover object-right opacity-95 select-none"
      />

      {/* Left negative-space contrast scrim preserving hero typography legibility */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, rgba(5,2,4,0.86) 0%, rgba(5,2,4,0.56) 38%, rgba(5,2,4,0.14) 68%, rgba(5,2,4,0.05) 100%)',
        }}
      />

      {/* Top & bottom edge blends into the dark page canvas */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(5,2,4,0.72) 0%, rgba(5,2,4,0) 18%, rgba(5,2,4,0) 80%, rgba(5,2,4,1) 100%)',
        }}
      />
    </div>
  );
}
