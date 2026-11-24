import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { portfolioData } from '../data/portfolioData';

gsap.registerPlugin(ScrollTrigger);

export function AboutSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const copyRef = useRef<HTMLDivElement | null>(null);
  const portraitWrapRef = useRef<HTMLDivElement | null>(null);
  const toolsRef = useRef<HTMLDivElement | null>(null);

  // Hanging pendulum physics refs
  const rigRef = useRef<HTMLDivElement | null>(null);
  const swingRef = useRef<HTMLDivElement | null>(null);
  const shadowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 76%',
          once: true,
        },
      });

      tl.fromTo(
        headingRef.current,
        { y: 32, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.75, ease: 'power3.out' }
      )
        .fromTo(
          copyRef.current,
          { y: 28, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' },
          '-=0.45'
        )
        .fromTo(
          portraitWrapRef.current,
          { scale: 0.88, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.2)' },
          '-=0.55'
        )
        .fromTo(
          toolsRef.current?.children || [],
          { scale: 0.8, opacity: 0, y: 12 },
          {
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.05,
            ease: 'back.out(1.4)',
          },
          '-=0.5'
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Interactive hanging pendulum physics matching reference .hang-rig
  useEffect(() => {
    const rig = rigRef.current;
    const swing = swingRef.current;
    const shadow = shadowRef.current;
    if (!rig || !swing) return;

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReduced) return;

    let rz = 0;
    let rx = 0;
    let ry = 0;
    let vz = 0;
    let vx = 0;
    let vy = 0;

    let targetZ = 0;
    let targetX = 0;
    let targetY = 0;
    let dragging = false;
    let startX = 0;
    let startY = 0;
    let activePointerId: number | null = null;
    let lastTime = performance.now();
    let rafId = 0;

    const tick = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const t = now / 1000;
      const idleZ = dragging ? 0 : Math.sin(t * 1.15) * 1.4;
      const idleY = dragging ? 0 : Math.cos(t * 0.9) * 2.2;

      const stiffness = dragging ? 260 : 52;
      const damping = dragging ? 22 : 5.4;

      const az = (targetZ + idleZ - rz) * stiffness - vz * damping;
      const ax = (targetX - rx) * stiffness - vx * damping;
      const ay = (targetY + idleY - ry) * stiffness - vy * damping;

      vz += az * dt;
      vx += ax * dt;
      vy += ay * dt;

      rz += vz * dt;
      rx += vx * dt;
      ry += vy * dt;

      swing.style.transform = `rotateZ(${rz.toFixed(2)}deg) rotateX(${rx.toFixed(
        2
      )}deg) rotateY(${ry.toFixed(2)}deg)`;

      if (shadow) {
        shadow.style.transform = `translate3d(${(-rz * 1.8).toFixed(
          1
        )}px, 0, 0) scale(${(1 + Math.abs(rx) * 0.005).toFixed(3)})`;
      }

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);

    const onPointerMove = (e: PointerEvent) => {
      if (dragging && e.pointerId === activePointerId) {
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        targetZ = Math.max(-18, Math.min(18, dx * 0.085));
        targetY = Math.max(-16, Math.min(16, dx * 0.08));
        targetX = Math.max(-12, Math.min(12, -dy * 0.06));
        return;
      }

      if (e.pointerType !== 'mouse') return;
      const rect = rig.getBoundingClientRect();
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        const nx = (e.clientX - rect.left) / rect.width - 0.5;
        const ny = (e.clientY - rect.top) / rect.height - 0.5;
        targetZ = nx * 4.5;
        targetY = nx * 8;
        targetX = -ny * 6;
      } else {
        targetZ = 0;
        targetX = 0;
        targetY = 0;
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      dragging = true;
      activePointerId = e.pointerId;
      startX = e.clientX;
      startY = e.clientY;
      swing.style.cursor = 'grabbing';
      try {
        swing.setPointerCapture(e.pointerId);
      } catch {
        // Ignore if capture unsupported
      }
    };

    const endDrag = () => {
      if (!dragging) return;
      dragging = false;
      activePointerId = null;
      targetZ = 0;
      targetX = 0;
      targetY = 0;
      swing.style.cursor = 'grab';
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    swing.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', onPointerMove);
      swing.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', endDrag);
      window.removeEventListener('pointercancel', endDrag);
    };
  }, []);

  const { aboutSection } = portfolioData;

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative z-10 w-full overflow-hidden border-t border-white/5 py-24 text-gray-100"
    >
      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-start gap-12 px-5 md:px-12 lg:grid-cols-12">
        {/* Left Editorial Column */}
        <div className="flex flex-col gap-8 lg:col-span-7">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-bold tracking-[0.2em] text-[#A31515] uppercase md:text-base">
              {aboutSection.kicker}
            </span>
            <h2
              ref={headingRef}
              className="text-5xl font-black tracking-tight text-white uppercase sm:text-6xl md:text-8xl"
            >
              {aboutSection.title}
            </h2>
            <div className="mt-2 h-1.5 w-24 rounded-full bg-[#A31515]" />
          </div>

          <div className="relative">
            <div className="red-halo" aria-hidden="true" />
            <div className="glass glass-panel-card relative flex flex-col gap-6 rounded-3xl p-6 md:gap-8 md:p-12">
              <div ref={copyRef} className="flex flex-col gap-4 md:gap-5">
                <p className="text-base leading-relaxed font-medium text-gray-200 md:text-2xl">
                  {aboutSection.leadParagraph}
                </p>
                <p className="text-base leading-relaxed text-gray-400 md:text-xl">
                  {aboutSection.secondaryParagraph}
                </p>
              </div>

              <div>
                <h3 className="mb-3 text-xs font-bold tracking-wider text-gray-500 uppercase md:mb-4 md:text-base">
                  Editing Tools
                </h3>
                <div ref={toolsRef} className="flex flex-wrap gap-2.5 md:gap-3">
                  {aboutSection.coreTools.map((tool) => (
                    <span
                      key={tool}
                      className="glass-chip cursor-default rounded-full px-4 py-1.5 text-xs font-bold text-gray-200 md:px-5 md:py-2.5 md:text-base"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-xs font-bold tracking-wider text-gray-500 uppercase md:mb-4 md:text-base">
                  Areas of Focus
                </h3>
                <div className="flex flex-wrap gap-2 md:gap-2.5">
                  {aboutSection.focusAreas.map((area) => (
                    <span
                      key={area}
                      className="rounded-full bg-[#A31515]/10 px-3.5 py-1.5 text-xs font-semibold text-red-300 ring-1 ring-red-500/30 md:px-4 md:py-2 md:text-sm"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sticky Hanging Portrait Rig matching reference .hang-rig */}
        <div className="relative flex justify-center lg:sticky lg:top-28 lg:col-span-5">
          <div ref={portraitWrapRef} className="w-full flex justify-center">
            <div ref={rigRef} className="hang-rig">
              <span className="hang-nail" aria-hidden="true" />
              <div ref={shadowRef} className="hang-shadow" aria-hidden="true" />

              <div ref={swingRef} className="hang-swing">
                <svg
                  className="hang-strings"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <line x1="50" y1="0" x2="12" y2="100" />
                  <line x1="50" y1="0" x2="88" y2="100" />
                </svg>

                <div className="hang-frame">
                  <span className="hang-ring hang-ring-l" aria-hidden="true" />
                  <span className="hang-ring hang-ring-r" aria-hidden="true" />

                  <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-black/40 ring-1 ring-white/15">
                    <img
                      src={aboutSection.portraitImage}
                      alt={aboutSection.portraitAlt}
                      draggable={false}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover object-top transition-all duration-700 select-none"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
                    <div className="hang-glare" aria-hidden="true" />

                    <div className="absolute right-3 bottom-3 left-3 text-center">
                      <span className="block text-base font-black tracking-wider text-white uppercase md:text-xl">
                        {aboutSection.cardName}
                      </span>
                      <span className="text-xs font-bold tracking-widest text-red-400 uppercase md:text-sm">
                        {aboutSection.cardRole}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
