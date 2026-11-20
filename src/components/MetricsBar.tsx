import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { portfolioData } from '../data/portfolioData';

gsap.registerPlugin(ScrollTrigger);

export function MetricsBar() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const numberRefs = useRef<Array<HTMLSpanElement | null>>([]);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.metric-card',
        { opacity: 0, y: 26 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 86%',
            once: true,
          },
        }
      );

      portfolioData.metrics.forEach((metric, index) => {
        const el = numberRefs.current[index];
        if (!el) return;
        const counter = { val: 0 };
        gsap.to(counter, {
          val: metric.value,
          duration: 1.4,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            once: true,
          },
          onUpdate: () => {
            el.textContent = `${Math.round(counter.val)}${metric.suffix}`;
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Key career highlights"
      className="relative z-20 py-10 lg:py-14"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {portfolioData.metrics.map((metric, idx) => (
            <div
              key={metric.label}
              className="metric-card luminous-card flex flex-col items-center justify-center rounded-xl px-6 py-9 text-center"
            >
              <span
                ref={(el) => {
                  numberRefs.current[idx] = el;
                }}
                className="font-display text-4xl font-extrabold tracking-tight text-white tabular-nums sm:text-5xl"
              >
                {metric.value}
                {metric.suffix}
              </span>
              <span className="mt-2.5 font-mono text-[11px] font-medium tracking-[0.22em] text-[#fb7185] uppercase">
                {metric.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
