import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

gsap.registerPlugin(ScrollTrigger);

interface ServicesSectionProps {
  onSelectService: (serviceTitle: string) => void;
}

export function ServicesSection({ onSelectService }: ServicesSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headingRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);

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
          '.service-item',
          { y: 24, opacity: 0, x: -10 },
          {
            y: 0,
            opacity: 1,
            x: 0,
            duration: 0.45,
            stagger: 0.07,
            ease: 'back.out(1.3)',
          },
          '-=0.25'
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - rect.top}px`);
  };

  const { servicesSection } = portfolioData;

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative z-10 flex w-full flex-col items-center justify-center overflow-hidden border-t border-white/5 px-6 py-24 text-gray-100 md:px-16 lg:px-24"
    >
      <div
        ref={headingRef}
        className="z-10 mb-12 flex flex-col items-center text-center"
      >
        <span className="mb-2 text-xs font-bold tracking-[0.2em] text-[#A31515] uppercase md:text-sm">
          {servicesSection.kicker}
        </span>
        <h2 className="text-4xl font-black tracking-tight text-white uppercase md:text-6xl">
          {servicesSection.title}
        </h2>
        <div className="mt-3 h-1.5 w-16 rounded-full bg-[#A31515]" />
      </div>

      <div className="relative z-10 w-full max-w-4xl">
        <div className="red-halo" aria-hidden="true" />
        <ul
          ref={listRef}
          className="grid-blur relative m-0 grid list-none grid-cols-1 gap-3.5 p-0 md:flex md:flex-col md:gap-4"
        >
          {servicesSection.items.map((service, index) => (
            <li key={service.id} className="service-item">
              <button
                type="button"
                onPointerMove={handlePointerMove}
                onClick={() => onSelectService(service.title)}
                className="glass glass-grid-card group relative flex h-full w-full cursor-pointer flex-col items-start gap-3 rounded-3xl p-5 text-left outline-none focus-visible:outline-2 focus-visible:outline-[#D81E2F] md:flex-row md:items-center md:gap-6 md:p-5"
              >
                <div className="card-spotlight" aria-hidden="true" />

                <span className="glass-chip flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-black text-gray-200 tabular-nums group-hover:text-white md:h-11 md:w-11 md:text-sm">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <div className="flex min-w-0 flex-1 flex-col gap-2 md:flex-row md:items-center md:justify-between md:gap-6">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h3 className="text-base font-bold text-gray-100 transition-colors group-hover:text-[#ff334b] md:text-xl">
                        {service.title}
                      </h3>
                      {service.featured && (
                        <span className="glass-chip-red inline-block rounded-full px-2.5 py-0.5 text-[10px] font-black tracking-wider text-white uppercase">
                          Specialty
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-gray-400 md:text-sm">
                      {service.description}
                    </p>
                  </div>

                  <div className="shrink-0 md:text-right">
                    <span className="mb-1 block text-[10px] font-semibold tracking-wider text-gray-500 uppercase">
                      Book Via
                    </span>
                    <span className="glass-chip inline-block rounded-full px-3.5 py-1 text-xs font-bold text-gray-100 group-hover:text-white md:text-sm">
                      {service.bookingLabel}
                    </span>
                  </div>
                </div>

                <span
                  aria-hidden="true"
                  className="glass-chip absolute top-4 right-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-300 transition-all group-hover:border-[#D81E2F] group-hover:bg-[#D81E2F] group-hover:text-white md:static md:h-11 md:w-11"
                >
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
