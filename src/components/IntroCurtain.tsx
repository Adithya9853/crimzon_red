import { useEffect, useRef, useState } from 'react';
import { portfolioData } from '../data/portfolioData';

interface IntroCurtainProps {
  onComplete: () => void;
}

const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

export function IntroCurtain({ onComplete }: IntroCurtainProps) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'loading' | 'reveal' | 'done'>('loading');
  const completedRef = useRef(false);
  const tensRef = useRef<HTMLSpanElement | null>(null);
  const onesRef = useRef<HTMLSpanElement | null>(null);

  const finishIntro = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    document.body.style.overflow = '';
    setPhase('done');
    onComplete();
  };

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReduced) {
      finishIntro();
      return;
    }

    const start = performance.now();
    const duration = 1250; // Snappy 1.25s count-up — avoids excessive delay
    let rafId = 0;
    let revealTimer = 0;

    const tick = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / duration);
      // Smooth easeOutQuart curve
      const eased = 1 - Math.pow(1 - t, 4);
      const val = Math.round(eased * 100);
      setProgress(val);

      if (tensRef.current && onesRef.current && val < 100) {
        const tens = Math.floor(val / 10);
        const ones = val % 10;
        tensRef.current.style.transform = `translate3d(0, -${tens * 10}%, 0)`;
        onesRef.current.style.transform = `translate3d(0, -${(9 - ones) * 10}%, 0)`;
      }

      if (t < 1) {
        rafId = window.requestAnimationFrame(tick);
      } else {
        setPhase('reveal');
        revealTimer = window.setTimeout(finishIntro, 820);
      }
    };

    rafId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(revealTimer);
      document.body.style.overflow = '';
    };
  }, []);

  if (phase === 'done') return null;

  const { introStatement } = portfolioData;
  const redSet = new Set(introStatement.redWords);
  const u = progress / 100;

  return (
    <div
      className={`glitch-loader ${phase === 'reveal' ? 'is-revealing' : ''}`}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progress}
      aria-label={introStatement.fullStatement}
    >
      <div className="glitch-loader__veil" />

      {/* Rolling 2-digit counter transitioning to 100 */}
      <div className="glitch-loader__count" aria-hidden="true">
        {progress >= 100 ? (
          <span className="glitch-loader__final">100</span>
        ) : (
          <>
            <span className="glitch-loader__digit">
              <span ref={tensRef} className="glitch-loader__digit-strip">
                {DIGITS.map((d) => (
                  <span key={d}>{d}</span>
                ))}
              </span>
            </span>
            <span className="glitch-loader__digit">
              <span ref={onesRef} className="glitch-loader__digit-strip">
                {[...DIGITS].reverse().map((d) => (
                  <span key={d}>{d}</span>
                ))}
              </span>
            </span>
          </>
        )}
      </div>

      {/* Top-right Skip button for instant access */}
      <button
        type="button"
        onClick={finishIntro}
        className="glass-chip absolute top-5 right-5 z-10 cursor-pointer rounded-full px-4 py-2 text-xs font-bold tracking-widest text-gray-200 uppercase transition-colors hover:text-white md:top-8 md:right-8"
      >
        Skip
      </button>

      {/* Center Statement + 5 Glitch Fragments */}
      <div className="glitch-loader__center">
        <p
          className="glitch-loader__statement"
          style={{ filter: `blur(${((1 - u) * 5).toFixed(2)}px)` }}
          aria-hidden="true"
        >
          {introStatement.words.map((word, idx) => {
            const threshold = idx / introStatement.words.length;
            const opacity = Math.max(0.08, Math.min(1, (u - threshold * 0.65) * 3));
            return (
              <span
                key={`${word}-${idx}`}
                className={`glitch-loader__word${
                  redSet.has(word) ? ' glitch-loader__word--red' : ''
                }`}
                style={{ opacity }}
              >
                {word}
              </span>
            );
          })}
        </p>

        {[0, 1, 2, 3, 4].map((fragIdx) => (
          <p
            key={fragIdx}
            className={`glitch-loader__frag glitch-loader__frag--${fragIdx}`}
            aria-hidden="true"
          >
            {introStatement.fullStatement}
          </p>
        ))}
      </div>
    </div>
  );
}
