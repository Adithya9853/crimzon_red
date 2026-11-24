import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { portfolioData, ToolStackItem } from '../data/portfolioData';

gsap.registerPlugin(ScrollTrigger);

function ToolBrandIcon({
  iconKey,
  glowColor,
}: {
  iconKey: ToolStackItem['iconKey'];
  glowColor: string;
}) {
  const dropFilter = `drop-shadow(0 0 12px ${glowColor}66)`;

  switch (iconKey) {
    case 'vn':
      return (
        <svg
          viewBox="0 0 24 24"
          className="h-14 w-14 shrink-0 transition-transform duration-300 group-hover:scale-110 md:h-16 md:w-16"
          style={{ filter: dropFilter }}
          fill="none"
          aria-hidden="true"
        >
          <rect
            x="2.5"
            y="2.5"
            width="19"
            height="19"
            rx="5"
            fill="#14090D"
            stroke="#D81E2F"
            strokeWidth="1.6"
          />
          <path
            d="M6.4 8.2L9.2 15.8L12 8.2"
            stroke="#FFFFFF"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M13.6 15.8V8.2L17.6 15.8V8.2"
            stroke="#FF7887"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'lightroom':
      return (
        <svg
          viewBox="0 0 24 24"
          className="h-14 w-14 shrink-0 transition-transform duration-300 group-hover:scale-110 md:h-16 md:w-16"
          style={{ filter: dropFilter }}
          fill="none"
          aria-hidden="true"
        >
          <rect
            x="2.5"
            y="2.5"
            width="19"
            height="19"
            rx="5"
            fill="#001E36"
            stroke="#31A8FF"
            strokeWidth="1.6"
          />
          <text
            x="12"
            y="15.3"
            textAnchor="middle"
            fill="#31A8FF"
            fontSize="9.5"
            fontWeight="800"
            fontFamily="sans-serif"
          >
            Lr
          </text>
        </svg>
      );
    case 'hypic':
      return (
        <svg
          viewBox="0 0 24 24"
          className="h-14 w-14 shrink-0 transition-transform duration-300 group-hover:scale-110 md:h-16 md:w-16"
          style={{ filter: dropFilter }}
          fill="none"
          aria-hidden="true"
        >
          <rect
            x="2.5"
            y="2.5"
            width="19"
            height="19"
            rx="5"
            fill="#160B12"
            stroke="#FF7887"
            strokeWidth="1.6"
          />
          <path
            d="M8.5 7.5V16.5M15.5 7.5V16.5M8.5 12H15.5"
            stroke="#FFFFFF"
            strokeWidth="1.9"
            strokeLinecap="round"
          />
          <circle cx="17.3" cy="6.8" r="1.15" fill="#D81E2F" />
        </svg>
      );
    case 'photopea':
    default:
      return (
        <svg
          viewBox="0 0 24 24"
          className="h-14 w-14 shrink-0 transition-transform duration-300 group-hover:scale-110 md:h-16 md:w-16"
          style={{ filter: dropFilter }}
          fill="none"
          aria-hidden="true"
        >
          <rect
            x="2.5"
            y="2.5"
            width="19"
            height="19"
            rx="5"
            fill="#0B2220"
            stroke="#18A497"
            strokeWidth="1.6"
          />
          <path
            d="M9 16.5V7.8H12.8C14.7 7.8 15.8 8.9 15.8 10.6C15.8 12.3 14.7 13.4 12.8 13.4H9"
            stroke="#34D399"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
  }
}

export function SkillsStackSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headingRef = useRef<HTMLDivElement | null>(null);
  const stackHeadingRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            once: true,
          },
        })
        .fromTo(
          headingRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.55, ease: 'power3.out' }
        )
        .fromTo(
          '.matrix-skill-item',
          { y: 25, opacity: 0, x: -10 },
          {
            y: 0,
            opacity: 1,
            x: 0,
            duration: 0.45,
            stagger: 0.05,
            ease: 'back.out(1.4)',
          },
          '-=0.25'
        );

      gsap
        .timeline({
          scrollTrigger: {
            trigger: stackHeadingRef.current,
            start: 'top 84%',
            once: true,
          },
        })
        .fromTo(
          stackHeadingRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.55, ease: 'power3.out' }
        )
        .fromTo(
          '.matrix-stack-item',
          { y: 25, opacity: 0, scale: 0.92 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.45,
            stagger: 0.07,
            ease: 'back.out(1.4)',
          },
          '-=0.25'
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - rect.top}px`);
  };

  const { skillsSection, techStackSection } = portfolioData;

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative z-10 flex w-full flex-col items-center justify-center overflow-hidden border-t border-white/5 px-6 py-28 text-gray-100 md:px-12 lg:px-20"
    >
      {/* Part 1: CREATIVE SKILLS */}
      <div
        ref={headingRef}
        className="z-10 mb-16 flex flex-col items-center text-center"
      >
        <span className="mb-2 text-sm font-bold tracking-[0.2em] text-[#A31515] uppercase md:text-base">
          {skillsSection.kicker}
        </span>
        <h2 className="text-5xl font-black tracking-tight text-white uppercase md:text-7xl">
          {skillsSection.title}
        </h2>
        <div className="mt-3 h-1.5 w-20 rounded-full bg-[#A31515]" />
      </div>

      <div className="relative z-10 w-full max-w-6xl">
        <div className="red-halo" aria-hidden="true" />
        <div className="grid-blur relative grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-7">
          {skillsSection.items.map((skill) => (
            <div
              key={skill.id}
              onPointerMove={handlePointerMove}
              className="matrix-skill-item glass glass-grid-card group relative flex items-center justify-between gap-4 overflow-hidden rounded-3xl p-6 md:p-8"
            >
              <div className="card-spotlight" aria-hidden="true" />
              <div className="min-w-0">
                <h3 className="text-lg font-bold text-gray-100 transition-colors group-hover:text-[#FF7887] md:text-2xl">
                  {skill.title}
                </h3>
                <span className="mt-1 block text-xs font-semibold tracking-wider text-gray-500 uppercase md:text-sm">
                  {skill.category}
                </span>
                <p className="mt-2.5 text-xs leading-relaxed text-gray-400 md:text-sm">
                  {skill.description}
                </p>
              </div>
              <span className="glass-chip shrink-0 rounded-full px-4 py-1.5 text-xs font-black tracking-wider text-gray-200 uppercase group-hover:text-white md:text-sm">
                {skill.discipline}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Part 2: TOOLS I USE (Vertical Icon Cards matching reference MY TECH STACK.) */}
      <div className="relative z-10 mt-28 flex w-full max-w-5xl flex-col items-center">
        <div
          ref={stackHeadingRef}
          className="mb-12 flex flex-col items-center text-center"
        >
          <span className="mb-3 text-sm font-bold tracking-[0.2em] text-[#A31515] uppercase md:text-base">
            {techStackSection.kicker}
          </span>
          <h3 className="text-4xl font-black tracking-tight text-white uppercase md:text-6xl">
            {techStackSection.title}
          </h3>
        </div>

        <ul className="grid-blur relative m-0 flex list-none flex-wrap justify-center gap-4 p-0 md:gap-6">
          {techStackSection.items.map((tool) => (
            <li
              key={tool.id}
              onPointerMove={handlePointerMove}
              className="matrix-stack-item glass glass-grid-card group relative flex h-[190px] w-[140px] flex-col items-center justify-center gap-5 overflow-hidden rounded-3xl px-3 md:h-[216px] md:w-[156px] xl:h-[224px] xl:w-[164px]"
            >
              <div className="card-spotlight" aria-hidden="true" />
              <ToolBrandIcon
                iconKey={tool.iconKey}
                glowColor={tool.glowColor}
              />
              <div className="text-center">
                <span className="block text-xs leading-tight font-bold whitespace-pre-line text-gray-200 transition-colors group-hover:text-white md:text-sm">
                  {tool.name}
                </span>
                <span className="mt-1 block font-mono text-[10px] tracking-wider text-gray-500 uppercase">
                  {tool.category}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
