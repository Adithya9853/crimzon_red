import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ArrowDownRight, Mail } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';
import { CinematicBackground } from './CinematicBackground';
import { InteractivePortrait } from './InteractivePortrait';

interface HeroSectionProps {
  introDone: boolean;
  onNavigate: (sectionId: string) => void;
}

export function HeroSection({ introDone, onNavigate }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const textGroupRef = useRef<HTMLDivElement | null>(null);
  const portraitLayerRef = useRef<HTMLDivElement | null>(null);
  const [portraitReady, setPortraitReady] = useState(false);

  useEffect(() => {
    if (!introDone) return;

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReduced) {
      setPortraitReady(true);
      return;
    }

    const ctx = gsap.context(() => {
      const items = textGroupRef.current?.querySelectorAll('.hero-reveal');
      if (items && items.length > 0) {
        gsap.fromTo(
          items,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            stagger: 0.09,
            ease: 'power3.out',
          }
        );
      }

      gsap.fromTo(
        portraitLayerRef.current,
        { opacity: 0, scale: 0.96, x: 24 },
        {
          opacity: 1,
          scale: 1,
          x: 0,
          duration: 1.0,
          ease: 'power3.out',
          onComplete: () => setPortraitReady(true),
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [introDone]);

  const { hero } = portfolioData;

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative z-20 flex flex-col justify-center overflow-hidden pt-20 pb-10 lg:min-h-screen lg:pt-24 lg:pb-12"
    >
      {/* Unified Dual-Layer Portrait Stage:
          Layer 1 = Stationary CinematicBackground
          Layer 2 = InteractivePortrait (transparent cutout with cursor shatter physics) */}
      <div className="relative h-[340px] w-full overflow-hidden sm:h-[420px] lg:absolute lg:inset-0 lg:h-full">
        <CinematicBackground backgroundImage={hero.backgroundImage} />

        <div ref={portraitLayerRef} className="absolute inset-0 z-10">
          <InteractivePortrait
            cutoutImage={hero.portraitImage}
            alt={hero.portraitAlt}
            entranceReady={portraitReady}
          />
        </div>
      </div>

      {/* Left Negative-Space Hero Typography & CTAs (always crisp and clickable above Layer 1/2) */}
      <div className="pointer-events-none relative z-20 mx-auto w-full max-w-7xl px-6 pt-8 lg:px-10 lg:pt-0">
        <div
          ref={textGroupRef}
          className="pointer-events-auto max-w-xl lg:max-w-2xl"
        >
          <div className="hero-reveal mb-5 flex items-center gap-3">
            <span className="h-[2px] w-8 bg-[#f43f5e] shadow-[0_0_12px_#f43f5e]" />
            <p className="font-mono text-xs font-medium tracking-[0.26em] text-[#fb7185] uppercase">
              {hero.kicker}
            </p>
          </div>

          <h1 className="hero-reveal font-display text-5xl leading-[0.95] font-extrabold tracking-tight text-white uppercase sm:text-7xl xl:text-[5.5rem]">
            {hero.name}
          </h1>

          <p className="hero-reveal mt-4 font-display text-sm font-bold tracking-[0.22em] text-[#f43f5e] uppercase sm:text-base">
            {hero.role}
          </p>

          <p className="hero-reveal mt-5 max-w-lg text-base leading-relaxed text-white/80 sm:text-lg">
            {hero.intro}
          </p>

          <div className="hero-reveal mt-9 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => onNavigate('projects')}
              className="crimson-cta inline-flex min-h-[48px] cursor-pointer items-center gap-2.5 rounded-md px-7 py-3 text-xs font-bold tracking-[0.18em] text-white uppercase whitespace-nowrap"
            >
              <span>{hero.primaryCta}</span>
              <ArrowDownRight className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('contact')}
              className="inline-flex min-h-[48px] cursor-pointer items-center gap-2.5 rounded-md border border-[#ff3b62]/40 bg-[#16060c]/75 px-7 py-3 text-xs font-bold tracking-[0.18em] text-white/90 uppercase whitespace-nowrap backdrop-blur-md transition-all duration-200 hover:border-[#ff3b62] hover:bg-[#2a0a16]/85 hover:text-white"
            >
              <Mail className="h-4 w-4 text-[#fb7185]" />
              <span>{hero.secondaryCta}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
