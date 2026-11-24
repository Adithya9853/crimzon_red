import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface InteractivePortraitProps {
  cutoutImage: string;
  alt: string;
  entranceReady: boolean;
}

const PORTRAIT_SHARDS = [
  { clip: 'polygon(0 0, 34% 0, 25% 38%, 0 52%)', x: -1.12, y: -0.72, rotate: -18, tilt: -18 },
  { clip: 'polygon(34% 0, 70% 0, 57% 39%, 25% 38%)', x: -0.28, y: -1.14, rotate: 13, tilt: -12 },
  { clip: 'polygon(70% 0, 100% 0, 100% 48%, 57% 39%)', x: 1.12, y: -0.62, rotate: 17, tilt: 18 },
  { clip: 'polygon(0 52%, 25% 38%, 44% 100%, 0 100%)', x: -1.16, y: 0.78, rotate: -15, tilt: -20 },
  { clip: 'polygon(25% 38%, 57% 39%, 100% 48%, 100% 100%, 44% 100%)', x: 0.18, y: 1.18, rotate: 11, tilt: 14 },
];

export function InteractivePortrait({
  cutoutImage,
  alt,
  entranceReady,
}: InteractivePortraitProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const shardRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const container = containerRef.current;
    const section = container?.closest('section');
    const shards = shardRefs.current.filter(
      (shard): shard is HTMLDivElement => shard !== null
    );
    if (!entranceReady || !section || shards.length !== PORTRAIT_SHARDS.length) return;

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReduced) return;

    const context = gsap.context(() => {
      gsap.set(shards, { transformOrigin: '50% 50%', force3D: true });
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      PORTRAIT_SHARDS.forEach((shard, index) => {
        timeline.to(
          shards[index],
          {
            x: () => shard.x * window.innerWidth,
            y: () => shard.y * window.innerHeight,
            z: () => -220 - index * 42,
            rotation: shard.rotate,
            rotationY: shard.tilt,
            rotationX: shard.tilt * -0.55,
            scale: 1.08,
            opacity: 0,
            filter: 'blur(5px)',
            ease: 'none',
            duration: 1,
          },
          0
        );
      });
    }, container);

    return () => context.revert();
  }, [cutoutImage, entranceReady]);

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={alt}
      className="pointer-events-none absolute inset-0 z-10 overflow-hidden select-none"
    >
      {PORTRAIT_SHARDS.map((shard, index) => (
        <div
          key={shard.clip}
          ref={(element) => {
            shardRefs.current[index] = element;
          }}
          aria-hidden="true"
          className="absolute inset-0 will-change-transform"
          style={{ clipPath: shard.clip }}
        >
          <img
            src={cutoutImage}
            alt=""
            draggable={false}
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover object-right select-none"
          />
        </div>
      ))}
    </div>
  );
}
