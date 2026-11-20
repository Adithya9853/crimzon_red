import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function AtmosphericBackground() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const orbOneRef = useRef<HTMLDivElement | null>(null);
  const orbTwoRef = useRef<HTMLDivElement | null>(null);
  const orbThreeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReduced = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;
      if (prefersReduced) return;

      gsap.to(orbOneRef.current, {
        x: 60,
        y: -45,
        scale: 1.08,
        duration: 9,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      gsap.to(orbTwoRef.current, {
        x: -70,
        y: 55,
        scale: 1.12,
        duration: 11,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      gsap.to(orbThreeRef.current, {
        y: -50,
        scale: 1.06,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      gsap.to(orbOneRef.current, {
        yPercent: -18,
        ease: 'none',
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.2,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#050204]"
    >
      {/* Primary Crimson / Burgundy Top-Right Light Source */}
      <div
        ref={orbOneRef}
        className="absolute -top-[18%] right-[-8%] h-[780px] w-[780px] rounded-full opacity-75 blur-[130px]"
        style={{
          background:
            'radial-gradient(circle, rgba(225,29,72,0.42) 0%, rgba(136,19,55,0.28) 42%, rgba(5,2,4,0) 72%)',
        }}
      />

      {/* Deep Magenta / Burgundy Left Mid Glow */}
      <div
        ref={orbTwoRef}
        className="absolute top-[34%] -left-[14%] h-[720px] w-[720px] rounded-full opacity-65 blur-[140px]"
        style={{
          background:
            'radial-gradient(circle, rgba(190,18,60,0.36) 0%, rgba(112,16,66,0.24) 46%, rgba(5,2,4,0) 74%)',
        }}
      />

      {/* Bottom Crimson Stage Wash */}
      <div
        ref={orbThreeRef}
        className="absolute -bottom-[16%] left-[25%] h-[680px] w-[860px] rounded-full opacity-70 blur-[140px]"
        style={{
          background:
            'radial-gradient(circle, rgba(244,63,94,0.34) 0%, rgba(127,15,47,0.24) 45%, rgba(5,2,4,0) 74%)',
        }}
      />

      {/* Subtle Architectural Grid Mesh */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,75,115,0.45) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,75,115,0.45) 1px, transparent 1px)',
          backgroundSize: '88px 88px',
        }}
      />

      {/* Edge Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 42%, rgba(3,1,2,0.78) 100%)',
        }}
      />
    </div>
  );
}
