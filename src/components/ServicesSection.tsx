import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Aperture, ArrowRight, Camera, ChevronDown, Clapperboard, Film, Sparkles } from 'lucide-react';
import { portfolioData, ServiceItem } from '../data/portfolioData';

gsap.registerPlugin(ScrollTrigger);

interface ServicesSectionProps {
  onSelectService: (serviceTitle: string) => void;
}

const SERVICE_ICONS = [Camera, Aperture, Film, Clapperboard, Sparkles];

export function ServicesSection({ onSelectService }: ServicesSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.services-header-reveal',
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 82%',
            once: true,
          },
        }
      );

      gsap.fromTo(
        '.service-row-item',
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.services-list',
            start: 'top 84%',
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleToggle = (item: ServiceItem) => {
    setExpandedId((prev) => (prev === item.id ? null : item.id));
  };

  const { servicesSection } = portfolioData;

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative z-20 py-20 lg:py-28"
    >
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        {/* Heading */}
        <div className="mb-12 text-center">
          <p className="services-header-reveal font-mono text-xs font-medium tracking-[0.26em] text-[#f43f5e] uppercase">
            {servicesSection.kicker}
          </p>
          <h2 className="services-header-reveal mt-2 font-display text-4xl font-extrabold tracking-tight text-white uppercase sm:text-6xl">
            {servicesSection.title.replace('.', '')}
            <span className="text-[#f43f5e]">.</span>
          </h2>
        </div>

        {/* Stacked Service & Pricing Rows */}
        <div className="services-list space-y-4">
          {servicesSection.items.map((service, index) => {
            const Icon = SERVICE_ICONS[index % SERVICE_ICONS.length];
            const isExpanded = expandedId === service.id;

            return (
              <div
                key={service.id}
                className="service-row-item luminous-card overflow-hidden rounded-xl"
              >
                <div className="flex flex-col justify-between gap-5 p-6 sm:flex-row sm:items-center sm:px-8 sm:py-6">
                  {/* Left: Icon + Title + Desc */}
                  <button
                    type="button"
                    onClick={() => handleToggle(service)}
                    aria-expanded={isExpanded}
                    className="flex flex-1 cursor-pointer items-start gap-4 text-left focus-visible:outline-2 focus-visible:outline-[#ff2e63]"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[#ff3b62]/35 bg-[#e11d48]/15 text-[#fb7185]">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-display text-lg font-bold tracking-tight text-white sm:text-xl">
                          {service.title}
                        </h3>
                        <ChevronDown
                          className={`h-4 w-4 text-white/45 transition-transform duration-200 ${
                            isExpanded ? 'rotate-180 text-[#fb7185]' : ''
                          }`}
                        />
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-white/65 sm:text-sm">
                        {service.description}
                      </p>
                    </div>
                  </button>

                  {/* Right: Booking Channel & Inquiry CTA */}
                  <div className="flex shrink-0 items-center justify-between gap-5 border-t border-white/10 pt-4 sm:justify-end sm:border-t-0 sm:pt-0">
                    <div className="text-left sm:text-right">
                      <span className="block font-mono text-[10px] tracking-[0.2em] text-white/45 uppercase">
                        Book Via
                      </span>
                      <span className="font-display text-lg font-extrabold text-white sm:text-xl">
                        {service.bookingLabel}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onSelectService(service.title)}
                      className="crimson-cta inline-flex min-h-[42px] cursor-pointer items-center gap-2 rounded-md px-4 py-2 text-xs font-bold tracking-[0.14em] text-white uppercase whitespace-nowrap"
                    >
                      <span>Book</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Expandable Deliverables Drawer */}
                {isExpanded && (
                  <div className="border-t border-[#ff3b62]/15 bg-[#090205]/70 px-6 py-4 sm:px-8">
                    <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-white/75">
                        <span className="font-mono text-[11px] tracking-[0.18em] text-[#fb7185] uppercase">
                          Included:
                        </span>
                        <span>{service.deliverables.join(' · ')}</span>
                      </div>
                      <span className="font-mono text-[11px] tracking-[0.15em] text-white/55 uppercase">
                        {service.focusNote}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
