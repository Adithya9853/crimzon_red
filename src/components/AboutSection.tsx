import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Camera, Film, Instagram } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

gsap.registerPlugin(ScrollTrigger);

export function AboutSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ rx: -4, ry: 8 });

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.about-reveal',
        { opacity: 0, y: 26 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            once: true,
          },
        }
      );

      gsap.fromTo(
        cardRef.current,
        { opacity: 0, x: 40, rotateY: 16 },
        {
          opacity: 1,
          x: 0,
          rotateY: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 78%',
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rx: -py * 14, ry: px * 16 });
  };

  const handleMouseLeave = () => {
    setTilt({ rx: -4, ry: 8 });
  };

  const { aboutSection } = portfolioData;

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative z-20 py-20 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Heading */}
        <div className="mb-12">
          <p className="about-reveal font-mono text-xs font-medium tracking-[0.26em] text-[#f43f5e] uppercase">
            {aboutSection.kicker}
          </p>
          <h2 className="about-reveal mt-2 font-display text-4xl font-extrabold tracking-tight text-white uppercase sm:text-6xl">
            {aboutSection.title.replace('.', '')}
            <span className="text-[#f43f5e]">.</span>
          </h2>
        </div>

        {/* Two-column Split */}
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-14">
          {/* Left Bio & Info */}
          <div className="lg:col-span-7">
            <p className="about-reveal text-xl leading-relaxed font-medium text-white sm:text-2xl">
              {aboutSection.leadParagraph}
            </p>
            <p className="about-reveal mt-4 text-sm leading-relaxed text-white/70 sm:text-base">
              {aboutSection.secondaryParagraph}
            </p>

            {/* Core Tools Tiles */}
            <div className="about-reveal mt-8">
              <p className="mb-3 font-mono text-[11px] tracking-[0.22em] text-white/50 uppercase">
                Tools I Use
              </p>
              <div className="flex flex-wrap gap-2.5">
                {aboutSection.coreTools.map((tool) => (
                  <span
                    key={tool}
                    className="rounded-md border border-[#ff3b62]/25 bg-[#16060d]/80 px-4 py-2 font-mono text-xs font-medium text-white/90 transition-colors hover:border-[#f43f5e]/70 hover:text-white"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            {/* Photography, Video Editing & Booking Info */}
            <div className="about-reveal mt-9 space-y-5 border-t border-white/10 pt-7">
              <div className="flex items-start gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[#ff3b62]/30 bg-[#e11d48]/15 text-[#fb7185]">
                  <Camera className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-mono text-[11px] tracking-[0.2em] text-[#fb7185] uppercase">
                    Photography Focus
                  </p>
                  <p className="mt-1 text-sm text-white/85">
                    {aboutSection.photographyFocus.join(' · ')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[#ff3b62]/30 bg-[#e11d48]/15 text-[#fb7185]">
                  <Film className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-mono text-[11px] tracking-[0.2em] text-[#fb7185] uppercase">
                    Video Editing Focus
                  </p>
                  <p className="mt-1 text-sm text-white/85">
                    {aboutSection.videoEditingFocus.join(' · ')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[#ff3b62]/30 bg-[#e11d48]/15 text-[#fb7185]">
                  <Instagram className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-mono text-[11px] tracking-[0.2em] text-[#fb7185] uppercase">
                    Bookings
                  </p>
                  <p className="mt-1 text-sm text-white/80">
                    {aboutSection.bookingNote}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Tilted 3D Portrait Card */}
          <div
            ref={cardRef}
            className="flex justify-center lg:col-span-5 lg:justify-end"
            style={{ perspective: '1100px' }}
          >
            <div
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="luminous-card relative w-full max-w-[360px] overflow-hidden rounded-2xl p-3 transition-transform duration-300 ease-out"
              style={{
                transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
              }}
            >
              {/* Subtle Ambient Red Glow Behind Card Frame */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-12 -right-12 h-48 w-48 rounded-full bg-[#e11d48]/30 blur-3xl"
              />

              <div className="relative overflow-hidden rounded-xl border border-[#ff3b62]/25 bg-[#090205]">
                <img
                  src={aboutSection.portraitImage}
                  alt={aboutSection.portraitAlt}
                  referrerPolicy="no-referrer"
                  className="aspect-[4/5] w-full object-cover object-center"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#050204] via-[#050204]/85 to-transparent p-5 pt-14">
                  <p className="font-display text-lg font-extrabold tracking-wider text-white uppercase">
                    {aboutSection.cardName}
                  </p>
                  <p className="mt-0.5 font-mono text-[11px] tracking-[0.2em] text-[#fb7185] uppercase">
                    {aboutSection.cardRole}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
