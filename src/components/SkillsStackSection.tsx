import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Bird, Camera, Clapperboard, Film, Sparkles, Trees } from 'lucide-react';
import { CreativeSkillItem, portfolioData, ToolStackItem } from '../data/portfolioData';

gsap.registerPlugin(ScrollTrigger);

function SkillIcon({ iconKey }: { iconKey: CreativeSkillItem['iconKey'] }) {
  switch (iconKey) {
    case 'trees':
      return <Trees className="h-5 w-5" />;
    case 'bird':
      return <Bird className="h-5 w-5" />;
    case 'camera':
      return <Camera className="h-5 w-5" />;
    case 'film':
      return <Film className="h-5 w-5" />;
    case 'clapperboard':
      return <Clapperboard className="h-5 w-5" />;
    case 'sparkles':
    default:
      return <Sparkles className="h-5 w-5" />;
  }
}

function TechBrandIcon({ iconKey }: { iconKey: ToolStackItem['iconKey'] }) {
  switch (iconKey) {
    case 'vn':
      return (
        <svg viewBox="0 0 24 24" className="h-9 w-9" fill="none" aria-hidden="true">
          <rect x="2.5" y="2.5" width="19" height="19" rx="4.5" fill="#14070D" stroke="#F43F5E" strokeWidth="1.5" />
          <path
            d="M6.4 8.2L9.2 15.8L12 8.2"
            stroke="#FFFFFF"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M13.6 15.8V8.2L17.6 15.8V8.2"
            stroke="#FB7185"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'lightroom':
      return (
        <svg viewBox="0 0 24 24" className="h-9 w-9" fill="none" aria-hidden="true">
          <rect x="2.5" y="2.5" width="19" height="19" rx="4.5" fill="#001E36" stroke="#31A8FF" strokeWidth="1.5" />
          <text
            x="12"
            y="15.2"
            textAnchor="middle"
            fill="#31A8FF"
            fontSize="9.5"
            fontWeight="700"
            fontFamily="sans-serif"
          >
            Lr
          </text>
        </svg>
      );
    case 'hypic':
      return (
        <svg viewBox="0 0 24 24" className="h-9 w-9" fill="none" aria-hidden="true">
          <rect x="2.5" y="2.5" width="19" height="19" rx="4.5" fill="#180814" stroke="#E879F9" strokeWidth="1.5" />
          <path
            d="M8.5 7.5V16.5M15.5 7.5V16.5M8.5 12H15.5"
            stroke="#FFFFFF"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <circle cx="17.3" cy="6.7" r="1.1" fill="#F43F5E" />
        </svg>
      );
    case 'photopea':
    default:
      return (
        <svg viewBox="0 0 24 24" className="h-9 w-9" fill="none" aria-hidden="true">
          <rect x="2.5" y="2.5" width="19" height="19" rx="4.5" fill="#0B2220" stroke="#18A497" strokeWidth="1.5" />
          <path
            d="M9 16.5V7.8H12.8C14.7 7.8 15.8 8.9 15.8 10.6C15.8 12.3 14.7 13.4 12.8 13.4H9"
            stroke="#34D399"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
  }
}

export function SkillsStackSection() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.skill-capability-card',
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.skills-grid',
            start: 'top 84%',
            once: true,
          },
        }
      );

      gsap.fromTo(
        '.tech-stack-tile',
        { opacity: 0, scale: 0.9, y: 22 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.55,
          stagger: { amount: 0.4, from: 'center' },
          ease: 'back.out(1.4)',
          scrollTrigger: {
            trigger: '.tech-stack-grid',
            start: 'top 85%',
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const { skillsSection, techStackSection } = portfolioData;

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative z-20 py-20 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Part 1: TECHNICAL SKILLS */}
        <div className="mb-12 text-center">
          <p className="font-mono text-xs font-medium tracking-[0.26em] text-[#f43f5e] uppercase">
            {skillsSection.kicker}
          </p>
          <h2 className="mt-2 font-display text-4xl font-extrabold tracking-tight text-white uppercase sm:text-6xl">
            {skillsSection.title.replace('.', '')}
            <span className="text-[#f43f5e]">.</span>
          </h2>
        </div>

        <div className="skills-grid grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {skillsSection.items.map((skill) => (
            <div
              key={skill.id}
              className="skill-capability-card luminous-card rounded-xl p-6"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#ff3b62]/35 bg-[#e11d48]/15 text-[#fb7185]">
                <SkillIcon iconKey={skill.iconKey} />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold tracking-tight text-white">
                {skill.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-white/65 sm:text-sm">
                {skill.description}
              </p>
            </div>
          ))}
        </div>

        {/* Part 2: MY TECH STACK */}
        <div className="mt-24 lg:mt-28">
          <div className="mb-12 text-center">
            <p className="font-mono text-xs font-medium tracking-[0.26em] text-[#f43f5e] uppercase">
              {techStackSection.kicker}
            </p>
            <h2 className="mt-2 font-display text-4xl font-extrabold tracking-tight text-white uppercase sm:text-5xl">
              {techStackSection.title.replace('.', '')}
              <span className="text-[#f43f5e]">.</span>
            </h2>
          </div>

          <div className="tech-stack-grid mx-auto flex max-w-4xl flex-wrap justify-center gap-5">
            {techStackSection.items.map((tech) => (
              <div
                key={tech.id}
                className="tech-stack-tile luminous-card group flex h-32 w-32 flex-col items-center justify-center gap-3 rounded-2xl p-4 text-center sm:h-36 sm:w-36"
              >
                <div className="transition-transform duration-300 group-hover:scale-110">
                  <TechBrandIcon iconKey={tech.iconKey} />
                </div>
                <div>
                  <p className="font-display text-xs font-bold tracking-wide text-white uppercase">
                    {tech.name}
                  </p>
                  <p className="mt-0.5 font-mono text-[10px] text-white/45">
                    {tech.category}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
