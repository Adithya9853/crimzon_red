import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ArrowDownRight, Instagram } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';
import { CinematicBackground } from './CinematicBackground';
import { InteractivePortrait } from './InteractivePortrait';

interface HeroSectionProps {
  introDone: boolean;
  onNavigate: (sectionId: string) => void;
}

export function HeroSection({ introDone, onNavigate }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const copyContainerRef = useRef<HTMLDivElement | null>(null);
  const portraitStageRef = useRef<HTMLDivElement | null>(null);
  const [portraitReady, setPortraitReady] = useState(false);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!introDone) {
      setPortraitReady(false);
      return;
    }

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReduced) {
      setPortraitReady(true);
      return;
    }

    const ctx = gsap.context(() => {
      const items = copyContainerRef.current?.querySelectorAll(
        '[data-hero-copy] > span, [data-hero-copy] > h1, [data-hero-copy] > div, [data-hero-copy] > p'
      );
      if (items && items.length > 0) {
        gsap.fromTo(
          items,
          { opacity: 0, y: 26 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            stagger: 0.08,
            ease: 'power3.out',
          }
        );
      }

      gsap.fromTo(
        portraitStageRef.current,
        { opacity: 0, scale: 0.97 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.9,
          ease: 'power3.out',
          onComplete: () => setPortraitReady(true),
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [introDone]);

  // Subtle parallax movement on hero stage when scrolling
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.to(portraitStageRef.current, {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const { hero } = portfolioData;

  return (
    <div id="hero" className="flex w-full flex-col overflow-hidden">
      <section
        ref={sectionRef}
        className="relative h-[100svh] min-h-[640px] w-full overflow-hidden"
        style={{ touchAction: 'pan-y' }}
      >
        {/* Reference Framed Rounded Stage (28px radius, hairline border, shadow-glass) */}
        <div
          ref={portraitStageRef}
          className="shadow-glass absolute overflow-hidden rounded-[28px] border border-white/10"
          style={
            isMobile
              ? {
                  left: 'clamp(16px, 5%, 22px)',
                  right: 'clamp(16px, 5%, 22px)',
                  top: 'max(8.5%, 84px)',
                  height: '49%',
                }
              : {
                  left: '5.5%',
                  right: '5.5%',
                  top: 'max(8.5%, 96px)',
                  bottom: '8.5%',
                }
          }
        >
          <CinematicBackground backgroundImage={hero.backgroundImage} />
          <InteractivePortrait
            cutoutImage={hero.portraitImage}
            alt={hero.portraitAlt}
            entranceReady={portraitReady}
          />
        </div>

        {/* Left Negative-Space Hero Typography & CTAs matching reference [data-hero-copy] */}
        <div
          ref={copyContainerRef}
          className="pointer-events-none absolute flex items-center will-change-transform max-md:items-end [&_a]:pointer-events-auto [&_button]:pointer-events-auto"
          style={
            isMobile
              ? {
                  left: '4%',
                  right: '4%',
                  top: 'calc(max(8.5%, 84px) + 49% + 12px)',
                  bottom: '3%',
                }
              : {
                  left: '5.5%',
                  right: '5.5%',
                  top: 'max(8.5%, 96px)',
                  bottom: '8.5%',
                }
          }
        >
          <div className="max-w-[min(46rem,92%)] pr-6 pl-[6%] max-md:w-full max-md:max-w-full max-md:rounded-3xl max-md:bg-gradient-to-t max-md:from-[#07070a]/95 max-md:via-[#07070a]/65 max-md:to-transparent max-md:pt-4 max-md:pr-3 max-md:pb-1 max-md:pl-3">
            <div data-hero-copy className="flex flex-col gap-2 sm:gap-3.5">
              <span className="text-[11px] font-bold tracking-[0.25em] text-[#ff2a3b] uppercase sm:text-xs md:text-sm">
                {hero.kicker}
              </span>

              <h1 className="text-4xl leading-[0.88] font-black tracking-tight text-white uppercase drop-shadow-md sm:text-6xl md:text-7xl lg:text-8xl">
                {hero.name}
              </h1>

              <div className="mt-0.5 flex flex-wrap items-center gap-2 text-sm font-extrabold tracking-wider text-white uppercase sm:gap-3 sm:text-base md:text-lg lg:text-xl">
                <span>{hero.roleLeft}</span>
                <span className="font-bold text-[#ff2a3b]">/</span>
                <span>{hero.roleRight}</span>
              </div>

              <p className="mt-1 max-w-lg text-xs font-normal tracking-wide text-gray-300 sm:text-sm md:text-base lg:text-lg">
                {hero.intro}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-3 sm:mt-4 sm:gap-4">
                <button
                  type="button"
                  onClick={() => onNavigate('projects')}
                  className="glass-red inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-full px-6 py-2.5 text-xs font-bold tracking-wider text-white uppercase whitespace-nowrap sm:px-7 sm:py-3"
                >
                  <span>{hero.primaryCta}</span>
                  <ArrowDownRight className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('contact')}
                  className="glass-chip inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-full px-6 py-2.5 text-xs font-bold tracking-wider text-gray-200 uppercase whitespace-nowrap hover:text-white sm:px-7 sm:py-3"
                >
                  <Instagram className="h-4 w-4 text-[#FF7887]" />
                  <span>{hero.secondaryCta}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Minimal Scroll Indicator */}
        <button
          type="button"
          onClick={() => onNavigate('stats')}
          aria-label="Scroll to highlights"
          className="absolute bottom-3 left-1/2 hidden -translate-x-1/2 cursor-pointer flex-col items-center gap-1.5 text-[10px] font-bold tracking-[0.26em] text-gray-400 uppercase transition-colors hover:text-white md:flex"
        >
          <span>Scroll</span>
          <span className="h-4 w-[1px] bg-gradient-to-b from-[#D81E2F] to-transparent" />
        </button>
      </section>
    </div>
  );
}
