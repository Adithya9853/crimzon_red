import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUp } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

gsap.registerPlugin(ScrollTrigger);

interface EndingSectionProps {
  onBackToTop: () => void;
}

export function EndingSection({ onBackToTop }: EndingSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const counterRef = useRef<HTMLSpanElement | null>(null);
  const statementRef = useRef<HTMLDivElement | null>(null);
  const glowBarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const counterObj = { val: 0 };

      gsap.to(counterObj, {
        val: portfolioData.endingSection.counterTarget,
        duration: 1.5,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 78%',
          once: true,
        },
        onUpdate: () => {
          if (counterRef.current) {
            counterRef.current.textContent = String(Math.round(counterObj.val));
          }
        },
      });

      const words = statementRef.current?.querySelectorAll('.ending-word');
      if (words && words.length > 0) {
        gsap.fromTo(
          words,
          { opacity: 0.12, y: 28, filter: 'blur(6px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.75,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 72%',
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
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const { introStatement, endingSection, contactSection } = portfolioData;

  return (
    <footer
      ref={sectionRef}
      className="relative z-20 mt-10 flex min-h-[85vh] flex-col justify-between border-t border-[#ff2e63]/20 bg-[#040103]/92 px-6 py-12 backdrop-blur-md lg:px-14 lg:py-16"
    >
      {/* Top Row: Counter 100 matching reference finale */}
      <div className="mx-auto flex w-full max-w-7xl items-start justify-between">
        <div>
          <span
            ref={counterRef}
            className="font-display text-6xl font-extrabold tracking-tight text-white tabular-nums sm:text-8xl"
          >
            {endingSection.counterTarget}
          </span>
          <p className="mt-2 font-mono text-[11px] tracking-[0.24em] text-[#fb7185] uppercase">
            {endingSection.kicker}
          </p>
        </div>

        <button
          type="button"
          onClick={onBackToTop}
          className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-md border border-[#ff3b62]/40 bg-[#18060e]/80 px-5 py-2.5 text-xs font-bold tracking-[0.18em] text-white uppercase transition-all hover:border-[#f43f5e] hover:bg-[#e11d48]/25"
        >
          <span>{endingSection.replayLabel}</span>
          <ArrowUp className="h-4 w-4 text-[#fb7185]" />
        </button>
      </div>

      {/* Center Monumental Closing Statement */}
      <div ref={statementRef} className="mx-auto my-16 max-w-5xl text-center">
        <p className="font-display text-3xl leading-[1.15] font-extrabold tracking-wider text-white uppercase sm:text-5xl lg:text-6xl">
          <span className="ending-word inline-block">{introStatement.prefix}</span>{' '}
          <span className="ending-word text-crimson-glow inline-block text-[#f43f5e]">
            {introStatement.highlightOne}
          </span>{' '}
          <span className="ending-word inline-block">{introStatement.middle}</span>{' '}
          <span className="ending-word text-crimson-glow inline-block text-[#f43f5e]">
            {introStatement.highlightTwo}
          </span>
          <br />
          <span className="ending-word inline-block">{introStatement.bridge}</span>{' '}
          <span className="ending-word text-crimson-glow inline-block text-[#f43f5e]">
            {introStatement.highlightThree}
          </span>
        </p>

        <div
          ref={glowBarRef}
          aria-hidden="true"
          className="mx-auto mt-8 h-[2px] w-48 origin-center bg-gradient-to-r from-transparent via-[#f43f5e] to-transparent shadow-[0_0_20px_#f43f5e]"
        />
      </div>

      {/* Bottom Clean Footer */}
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/45 sm:flex-row">
        <p className="font-mono tracking-[0.16em] uppercase">
          {endingSection.copyright}
        </p>
        <div className="flex items-center gap-6">
          {contactSection.socials.map((s) => (
            <a
              key={s.label}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[11px] tracking-[0.18em] text-white/60 uppercase transition-colors hover:text-[#fb7185]"
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
