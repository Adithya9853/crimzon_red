import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

interface NavbarProps {
  onNavigate: (sectionId: string) => void;
}

const NAV_LINKS = [
  { label: 'WORK', target: 'projects' },
  { label: 'ABOUT', target: 'about' },
  { label: 'SERVICES', target: 'services' },
  { label: 'TOOLS', target: 'skills' },
  { label: 'CONTACT', target: 'contact' },
];

export function Navbar({ onNavigate }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLinkClick = (target: string) => {
    setMobileOpen(false);
    onNavigate(target);
  };

  return (
    <header className="fixed top-0 right-0 left-0 z-40 border-b border-[#ff2e63]/15 bg-[#070205]/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-6 py-4 lg:px-10">
        {/* Zone 1: Brand Mark */}
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            handleLinkClick('hero');
          }}
          className="flex shrink-0 items-center gap-3 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-[#ff2e63]"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-md border border-[#ff2e63]/60 bg-gradient-to-br from-[#e11d48] to-[#881337] font-display text-xs font-extrabold tracking-tight text-white shadow-[0_0_16px_rgba(225,29,72,0.5)]">
            {portfolioData.brand.monogram}
          </span>
          <span className="font-display text-sm font-extrabold tracking-[0.18em] text-white uppercase sm:text-base">
            {portfolioData.brand.name}
          </span>
        </a>

        {/* Zone 2: Single-line Nav Links */}
        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-7 md:flex"
        >
          {NAV_LINKS.map((link) => (
            <button
              key={link.target}
              type="button"
              onClick={() => handleLinkClick(link.target)}
              className="group relative shrink-0 cursor-pointer py-1 text-xs font-semibold tracking-[0.18em] text-white/75 uppercase whitespace-nowrap transition-colors duration-200 hover:text-white focus-visible:outline-2 focus-visible:outline-[#ff2e63]"
            >
              {link.label}
              <span className="absolute right-0 -bottom-0.5 left-0 h-[2px] origin-left scale-x-0 bg-[#f43f5e] transition-transform duration-200 group-hover:scale-x-100" />
            </button>
          ))}
        </nav>

        {/* Zone 3: Single Primary Action */}
        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={() => handleLinkClick('contact')}
            className="crimson-cta hidden shrink-0 cursor-pointer rounded-md px-5 py-2 text-xs font-bold tracking-[0.15em] text-white uppercase whitespace-nowrap sm:inline-flex"
          >
            {portfolioData.brand.ctaLabel}
          </button>

          <button
            type="button"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            onClick={() => setMobileOpen((prev) => !prev)}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-md border border-white/15 bg-white/5 text-white md:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="border-t border-[#ff2e63]/20 bg-[#090206]/95 px-6 py-5 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <button
                key={link.target}
                type="button"
                onClick={() => handleLinkClick(link.target)}
                className="flex min-h-[44px] cursor-pointer items-center justify-between border-b border-white/5 text-left text-xs font-semibold tracking-[0.2em] text-white/85 uppercase transition-colors hover:text-[#fb7185]"
              >
                {link.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => handleLinkClick('contact')}
              className="crimson-cta mt-2 flex min-h-[44px] cursor-pointer items-center justify-center rounded-md text-xs font-bold tracking-[0.18em] text-white uppercase"
            >
              {portfolioData.brand.ctaLabel}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
