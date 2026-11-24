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
      <img
        src={backgroundImage}
        alt=""
        referrerPolicy="no-referrer"
        className="h-full w-full object-cover object-right opacity-95 select-none"
      />

      {/* Left negative-space contrast scrim matching reference hero */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, rgba(7,7,10,0.88) 0%, rgba(7,7,10,0.58) 38%, rgba(7,7,10,0.16) 68%, rgba(7,7,10,0.05) 100%)',
        }}
      />

      {/* Top & bottom edge blends */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(7,7,10,0.65) 0%, rgba(7,7,10,0) 20%, rgba(7,7,10,0) 78%, rgba(7,7,10,0.92) 100%)',
        }}
      />
    </div>
  );
}
