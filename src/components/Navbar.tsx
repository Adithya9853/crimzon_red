import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

interface NavbarProps {
  onNavigate: (sectionId: string) => void;
}

const NAV_LINKS = [
  { label: 'Home', target: 'hero' },
  { label: 'About', target: 'about' },
  { label: 'Work', target: 'projects' },
  { label: 'Services', target: 'services' },
  { label: 'Skills', target: 'skills' },
  { label: 'Contact', target: 'contact' },
];

export function Navbar({ onNavigate }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);

      const scrollPos = window.scrollY + 180;
      let current = 'hero';
      for (const link of NAV_LINKS) {
        const el = document.getElementById(link.target);
        if (el && el.offsetTop <= scrollPos) {
          current = link.target;
        }
      }
      setActiveSection(current);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLinkClick = (target: string) => {
    setMobileOpen(false);
    setActiveSection(target);
    onNavigate(target);
  };

  return (
    <nav
      aria-label="Primary navigation"
      className="fixed top-0 left-0 z-50 w-full px-3 pt-3 md:px-6"
    >
      <div
        className={`glass mx-auto flex max-w-7xl items-center justify-between gap-6 rounded-2xl px-5 transition-all duration-300 md:px-8 ${
          scrolled ? 'py-2.5 !bg-[#111113]/85' : 'py-3.5'
        }`}
      >
        {/* Zone 1: Brand Mark matching reference A-SWIN lockup */}
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            handleLinkClick('hero');
          }}
          className="group flex shrink-0 items-center text-xl font-black tracking-tight text-white uppercase whitespace-nowrap focus-visible:outline-2 focus-visible:outline-[#D81E2F] sm:text-2xl"
        >
          <span className="text-[#D81E2F] drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]">
            {portfolioData.brand.firstLetter}
          </span>
          <span className="transition-colors duration-300 group-hover:text-[#FF7887]">
            {portfolioData.brand.restName}
          </span>
        </a>

        {/* Zone 2: Single-line Nav Links with active indicator & crimson hover underline */}
        <div className="hidden items-center gap-6 md:flex lg:gap-8">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.target;
            return (
              <button
                key={link.target}
                type="button"
                onClick={() => handleLinkClick(link.target)}
                className={`group relative shrink-0 cursor-pointer py-1 text-xs font-bold tracking-[0.15em] uppercase whitespace-nowrap transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-[#D81E2F] md:text-[13px] ${
                  isActive ? 'text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-1.5 left-0 h-[2px] bg-[#D81E2F] shadow-[0_0_8px_rgba(220,38,38,0.8)] transition-all duration-300 ease-out ${
                    isActive ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Zone 3: Single Primary Action + Mobile Drawer Toggle */}
        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={() => handleLinkClick('contact')}
            className="glass-red hidden shrink-0 cursor-pointer rounded-full px-5 py-2 text-xs font-bold tracking-wider text-white uppercase whitespace-nowrap sm:inline-block"
          >
            {portfolioData.brand.ctaLabel}
          </button>

          <button
            type="button"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((prev) => !prev)}
            className="glass-chip flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl text-white md:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="glass mx-auto mt-2 max-w-7xl rounded-2xl p-5 md:hidden">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.target;
              return (
                <button
                  key={link.target}
                  type="button"
                  onClick={() => handleLinkClick(link.target)}
                  className={`flex min-h-[44px] cursor-pointer items-center justify-between border-b border-white/5 px-2 text-left text-xs font-bold tracking-[0.18em] uppercase transition-colors ${
                    isActive ? 'text-[#FF7887]' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <span className="h-1.5 w-6 rounded-full bg-[#D81E2F] shadow-[0_0_8px_rgba(220,38,38,0.8)]" />
                  )}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => handleLinkClick('contact')}
              className="glass-red mt-3 flex min-h-[44px] cursor-pointer items-center justify-center rounded-full text-xs font-bold tracking-wider text-white uppercase"
            >
              {portfolioData.brand.ctaLabel}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
