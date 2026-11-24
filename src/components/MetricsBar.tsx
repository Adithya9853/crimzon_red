import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { portfolioData } from '../data/portfolioData';

gsap.registerPlugin(ScrollTrigger);

export function MetricsBar() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>('.stat-item');
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 78%',
          once: true,
        },
      });

      tl.fromTo(
        panelRef.current,
        { y: 40, opacity: 0, scale: 0.97 },
        { y: 0, opacity: 1, scale: 1, duration: 0.85, ease: 'power3.out' }
      );

      items.forEach((item, idx) => {
        const numEl = item.querySelector<HTMLElement>('.stat-num');
        const figEl = item.querySelector<HTMLElement>('.stat-fig');
        const barEl = item.querySelector<HTMLElement>('.stat-bar');
        const labelEl = item.querySelector<HTMLElement>('.stat-label');
        if (!numEl || !figEl || !barEl || !labelEl) return;

        const targetVal = Number(item.dataset.value || 0);
        const counter = { v: 0 };
        const at = 0.25 + idx * 0.16;

        numEl.textContent = '0';

        tl.fromTo(
          figEl,
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.75, ease: 'power3.out' },
          at
        )
          .fromTo(
            counter,
            { v: 0 },
            {
              v: targetVal,
              duration: 1.8,
              ease: 'power3.out',
              onUpdate: () => {
                numEl.textContent = String(Math.round(counter.v));
              },
            },
            at
          )
          .fromTo(
            barEl,
            { scaleX: 0 },
            { scaleX: 1, duration: 1.8, ease: 'power3.out' },
            at
          )
          .fromTo(
            labelEl,
            { y: 12, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.55, ease: 'power3.out' },
            at + 0.22
          );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Cursor-tracking spotlight + rim illumination matching reference .stat-panel
  useEffect(() => {
    const section = sectionRef.current;
    const panel = panelRef.current;
    if (!section || !panel) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    const target = { x: panel.clientWidth * 0.5, y: panel.clientHeight * 0.2, o: 0.35 };
    const current = { ...target };
    let lastTime = performance.now();
    let rafId = 0;

    const step = () => {
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const kPos = 1 - Math.exp(-(prefersReduced ? 40 : 9) * dt);
      const kOp = 1 - Math.exp(-(prefersReduced ? 40 : 5.5) * dt);

      current.x += (target.x - current.x) * kPos;
      current.y += (target.y - current.y) * kPos;
      current.o += (target.o - current.o) * kOp;

      panel.style.setProperty('--mx', `${current.x.toFixed(1)}px`);
      panel.style.setProperty('--my', `${current.y.toFixed(1)}px`);
      panel.style.setProperty('--lo', current.o.toFixed(3));

      if (
        Math.abs(target.x - current.x) > 0.2 ||
        Math.abs(target.y - current.y) > 0.2 ||
        Math.abs(target.o - current.o) > 0.005
      ) {
        rafId = window.requestAnimationFrame(step);
      } else {
        rafId = 0;
      }
    };

    const start = () => {
      if (!rafId) {
        lastTime = performance.now();
        rafId = window.requestAnimationFrame(step);
      }
    };

    const onMove = (e: PointerEvent) => {
      const rect = panel.getBoundingClientRect();
      target.x = e.clientX - rect.left;
      target.y = e.clientY - rect.top;
      target.o = 0.95;
      start();
    };

    const onLeave = () => {
      target.o = 0.35;
      start();
    };

    panel.addEventListener('pointermove', onMove, { passive: true });
    panel.addEventListener('pointerleave', onLeave);

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      panel.removeEventListener('pointermove', onMove);
      panel.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <section
      id="stats"
      ref={sectionRef}
      aria-label="Key portfolio metrics"
      className="relative z-10 w-full px-5 py-16 md:px-12 md:py-24"
    >
      <div className="mx-auto max-w-6xl">
        <div
          ref={panelRef}
          className="stat-panel glass relative overflow-hidden rounded-3xl"
        >
          <div className="stat-light" aria-hidden="true" />
          <div className="stat-rim" aria-hidden="true" />

          <dl className="relative z-10 grid grid-cols-1 divide-y divide-white/10 md:grid-cols-3 md:divide-x md:divide-y-0">
            {portfolioData.metrics.map((metric) => (
              <div
                key={metric.id}
                data-value={metric.value}
                className="stat-item stat-cq flex flex-col justify-between p-8 md:p-12"
              >
                <dt className="stat-label mb-8 text-xs font-semibold tracking-[0.16em] leading-snug text-gray-300 uppercase">
                  {metric.label}
                </dt>
                <dd className="m-0">
                  <span className="sr-only">
                    {metric.value}
                    {metric.suffix}
                  </span>
                  <div
                    aria-hidden="true"
                    className="stat-fig font-black text-white uppercase tabular-nums"
                  >
                    <span className="relative inline-block">
                      <span className="invisible">{metric.value}</span>
                      <span className="stat-num absolute top-0 right-0">
                        {metric.value}
                      </span>
                    </span>
                    {metric.suffix && (
                      <span className="stat-suffix">{metric.suffix}</span>
                    )}
                  </div>
                  <div
                    aria-hidden="true"
                    className="stat-bar mt-6 h-1 w-12 origin-left rounded-full bg-[#A31515]"
                  />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
