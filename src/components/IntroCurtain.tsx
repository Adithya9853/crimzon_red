import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { portfolioData } from '../data/portfolioData';

interface IntroCurtainProps {
  onComplete: () => void;
}

export function IntroCurtain({ onComplete }: IntroCurtainProps) {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const counterRef = useRef<HTMLSpanElement | null>(null);
  const statementRef = useRef<HTMLDivElement | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReduced) {
      setDismissed(true);
      onComplete();
      return;
    }

    const counterObj = { val: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        setDismissed(true);
        onComplete();
      },
    });

    tl.fromTo(
      statementRef.current,
      { opacity: 0, y: 18, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: 'power3.out' }
    )
      .to(
        counterObj,
        {
          val: 100,
          duration: 0.85,
          ease: 'power2.out',
          onUpdate: () => {
            if (counterRef.current) {
              counterRef.current.textContent = String(Math.round(counterObj.val));
            }
          },
        },
        0
      )
      .to(
        overlayRef.current,
        {
          yPercent: -100,
          duration: 0.65,
          ease: 'power4.inOut',
        },
        '+=0.28'
      );

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  if (dismissed) return null;

  const { introStatement } = portfolioData;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex flex-col justify-between bg-[#050204] px-6 py-8 md:px-14 md:py-12"
      aria-label="Portfolio intro transition"
    >
      <div className="flex items-start justify-between">
        <span
          ref={counterRef}
          className="font-display text-6xl font-extrabold tracking-tight text-white tabular-nums md:text-8xl"
        >
          0
        </span>
        <button
          type="button"
          onClick={() => {
            setDismissed(true);
            onComplete();
          }}
          className="cursor-pointer border border-white/15 bg-white/5 px-4 py-2 text-xs font-medium tracking-widest text-white/70 uppercase transition-colors hover:border-[#ff2e63]/60 hover:text-white"
        >
          Skip
        </button>
      </div>

      <div ref={statementRef} className="mx-auto max-w-4xl text-center">
        <p className="font-display text-2xl leading-tight font-extrabold tracking-wider text-white uppercase sm:text-4xl md:text-5xl">
          {introStatement.prefix}{' '}
          <span className="text-[#f43f5e] text-crimson-glow">
            {introStatement.highlightOne}
          </span>{' '}
          {introStatement.middle}{' '}
          <span className="text-[#f43f5e] text-crimson-glow">
            {introStatement.highlightTwo}
          </span>
          <br />
          {introStatement.bridge}{' '}
          <span className="text-[#f43f5e] text-crimson-glow">
            {introStatement.highlightThree}
          </span>
        </p>
      </div>

      <div className="flex items-center justify-between text-xs tracking-[0.25em] text-white/35 uppercase">
        <span>{portfolioData.brand.name}</span>
        <span>PORTFOLIO</span>
      </div>
    </div>
  );
}
