import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUp, Instagram } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

gsap.registerPlugin(ScrollTrigger);

interface EndingSectionProps {
  onBackToTop: () => void;
}

export function EndingSection({ onBackToTop }: EndingSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const statementRef = useRef<HTMLDivElement | null>(null);
  const glowBarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      const words = statementRef.current?.querySelectorAll('.ending-word');
      if (words && words.length > 0) {
        gsap.fromTo(
          words,
          { opacity: 0.15, y: 24, filter: 'blur(5px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.7,
            stagger: 0.07,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 78%',
              once: true,
            },
          }
        );
      }

      gsap.fromTo(
        glowBarRef.current,
        { scaleX: 0, opacity: 0 },
        {
          scaleX: 1,
          opacity: 1,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const { brand, introStatement, endingSection, contactSection } = portfolioData;
  const redSet = new Set(introStatement.redWords);

  return (
    <div className="relative z-10">
      {/* Cinematic Final Scene */}
      <section
        ref={sectionRef}
        aria-label="Closing statement"
        className="relative flex flex-col items-center justify-center overflow-hidden border-t border-white/5 px-6 py-24 text-center md:px-16 md:py-32"
      >
        <div className="red-halo opacity-70" aria-hidden="true" />

        <div ref={statementRef} className="relative z-10 mx-auto max-w-5xl">
          <p className="mb-4 text-xs font-bold tracking-[0.24em] text-[#A31515] uppercase md:text-sm">
            {endingSection.kicker}
          </p>

          <h2 className="text-3xl leading-[1.12] font-black tracking-tight text-white uppercase sm:text-5xl lg:text-6xl">
            {introStatement.words.map((word, idx) => (
              <span
                key={`${word}-${idx}`}
                className={`ending-word mx-1.5 inline-block ${
                  redSet.has(word) ? 'text-[#D81E2F] text-glow' : 'text-white'
                }`}
              >
                {word}
              </span>
            ))}
          </h2>

          <div
            ref={glowBarRef}
            aria-hidden="true"
            className="mx-auto mt-8 h-[2px] w-36 origin-center rounded-full bg-gradient-to-r from-transparent via-[#D81E2F] to-transparent shadow-[0_0_20px_rgba(216,30,47,0.8)]"
          />

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href={contactSection.personalInstagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-red inline-flex min-h-[46px] items-center gap-2.5 rounded-full px-7 py-3 text-xs font-bold tracking-wider text-white uppercase"
            >
              <Instagram className="h-4 w-4" />
              <span>Book via Instagram DM</span>
            </a>

            <button
              type="button"
              onClick={onBackToTop}
              className="glass-chip inline-flex min-h-[46px] cursor-pointer items-center gap-2 rounded-full px-6 py-3 text-xs font-bold tracking-wider text-gray-200 uppercase hover:text-white"
            >
              <span>{endingSection.replayLabel}</span>
              <ArrowUp className="h-4 w-4 text-[#FF7887]" />
            </button>
          </div>
        </div>
      </section>

      {/* Exact Reference .glass-bar Footer */}
      <footer className="glass-bar w-full border-t border-white/5 px-6 py-14 text-white md:px-16">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 md:flex-row">
          <div className="flex flex-col items-center gap-1 md:items-start">
            <a
              href="#hero"
              onClick={(e) => {
                e.preventDefault();
                onBackToTop();
              }}
              className="flex items-center text-2xl font-black tracking-tight uppercase"
            >
              <span className="text-[#D81E2F] drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]">
                {brand.firstLetter}
              </span>
              <span>{brand.restName}</span>
            </a>
            <p className="font-mono text-[11px] tracking-widest text-gray-400 uppercase">
              {endingSection.kicker}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {contactSection.socials.map((s) => (
              <a
                key={s.id}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-chip rounded-full px-4 py-2 text-xs font-bold tracking-wider text-gray-300 uppercase transition-all hover:scale-105 hover:text-white"
              >
                {s.label}
              </a>
            ))}
          </div>

          <div className="flex flex-col items-center gap-3 md:items-end">
            <div className="flex flex-wrap items-center justify-center gap-5 text-xs font-bold tracking-widest text-gray-400 uppercase">
              <a href="#about" className="transition-colors hover:text-[#D81E2F]">
                About
              </a>
              <a href="#projects" className="transition-colors hover:text-[#D81E2F]">
                Work
              </a>
              <a href="#services" className="transition-colors hover:text-[#D81E2F]">
                Services
              </a>
              <a href="#skills" className="transition-colors hover:text-[#D81E2F]">
                Skills
              </a>
              <a href="#contact" className="transition-colors hover:text-[#D81E2F]">
                Contact
              </a>
            </div>
            <p className="font-mono text-[11px] tracking-wider text-gray-500 uppercase">
              {endingSection.copyright}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
