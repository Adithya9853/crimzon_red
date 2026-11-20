import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Camera, Check, Copy, ExternalLink, Instagram, Send } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

gsap.registerPlugin(ScrollTrigger);

interface ContactSectionProps {
  selectedService: string | null;
  onClearService: () => void;
}

export function ContactSection({
  selectedService,
  onClearService,
}: ContactSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [name, setName] = useState('');
  const [instagramHandle, setInstagramHandle] = useState('');
  const [details, setDetails] = useState('');
  const [copiedId, setCopiedId] = useState<'personal' | 'photo' | null>(null);
  const [status, setStatus] = useState<'idle' | 'preparing' | 'ready' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (selectedService) {
      setDetails((prev) =>
        prev.trim().length > 0
          ? prev
          : `Interested in: ${selectedService}\nPreferred dates, location, and creative vision: `
      );
    }
  }, [selectedService]);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.contact-reveal',
        { opacity: 0, y: 26 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 82%',
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleCopyHandle = async (handle: string, key: 'personal' | 'photo') => {
    try {
      await navigator.clipboard.writeText(handle);
      setCopiedId(key);
      window.setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Fallback ignored if clipboard blocked
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !instagramHandle.trim() || !details.trim()) {
      setStatus('error');
      setErrorMessage('Please enter your name, Instagram handle, and shoot or video details.');
      return;
    }

    setStatus('preparing');
    setErrorMessage('');

    const formattedBrief = `Hi Preetham,\nName: ${name.trim()}\nInstagram: ${instagramHandle.trim()}\nDetails: ${details.trim()}`;
    try {
      await navigator.clipboard.writeText(formattedBrief);
    } catch {
      // Clipboard optional if permission is restricted
    }

    window.setTimeout(() => {
      setStatus('ready');
      onClearService();
    }, 350);
  };

  const { contactSection } = portfolioData;

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative z-20 py-20 lg:py-28"
    >
      <div className="mx-auto max-w-4xl px-6 lg:px-10">
        {/* Heading */}
        <div className="mb-12 text-center">
          <p className="contact-reveal font-mono text-xs font-medium tracking-[0.26em] text-[#f43f5e] uppercase">
            {contactSection.kicker}
          </p>
          <h2 className="contact-reveal mt-2 font-display text-4xl font-extrabold tracking-tight text-white uppercase sm:text-6xl">
            {contactSection.title.replace('.', '')}
            <span className="text-[#f43f5e]">.</span>
          </h2>
        </div>

        {/* Instagram Profile Cards Row */}
        <div className="contact-reveal mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Personal Instagram Card */}
          <div className="luminous-card flex items-center justify-between gap-4 rounded-xl p-5">
            <div className="flex min-w-0 items-center gap-3.5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#ff3b62]/35 bg-[#e11d48]/15 text-[#fb7185]">
                <Instagram className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="font-mono text-[10px] tracking-[0.2em] text-white/50 uppercase">
                  {contactSection.personalInstagram.label}
                </p>
                <a
                  href={contactSection.personalInstagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 truncate text-sm font-semibold text-white transition-colors hover:text-[#fda4af]"
                >
                  <span>{contactSection.personalInstagram.handle}</span>
                  <ExternalLink className="h-3.5 w-3.5 opacity-60" />
                </a>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                handleCopyHandle(contactSection.personalInstagram.handle, 'personal')
              }
              aria-label="Copy personal Instagram handle"
              className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-md border border-white/15 bg-white/5 text-white/75 transition-colors hover:border-[#f43f5e] hover:text-white"
            >
              {copiedId === 'personal' ? (
                <Check className="h-4 w-4 text-[#fda4af]" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Photography Instagram Card */}
          <div className="luminous-card flex items-center justify-between gap-4 rounded-xl p-5">
            <div className="flex min-w-0 items-center gap-3.5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#ff3b62]/35 bg-[#e11d48]/15 text-[#fb7185]">
                <Camera className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="font-mono text-[10px] tracking-[0.2em] text-white/50 uppercase">
                  {contactSection.photographyInstagram.label}
                </p>
                <a
                  href={contactSection.photographyInstagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 truncate text-sm font-semibold text-white transition-colors hover:text-[#fda4af]"
                >
                  <span>{contactSection.photographyInstagram.handle}</span>
                  <ExternalLink className="h-3.5 w-3.5 opacity-60" />
                </a>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                handleCopyHandle(contactSection.photographyInstagram.handle, 'photo')
              }
              aria-label="Copy photography Instagram handle"
              className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-md border border-white/15 bg-white/5 text-white/75 transition-colors hover:border-[#f43f5e] hover:text-white"
            >
              {copiedId === 'photo' ? (
                <Check className="h-4 w-4 text-[#fda4af]" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Instagram DM Booking Brief Composer */}
        <div className="contact-reveal luminous-card rounded-2xl p-6 sm:p-9">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="font-display text-lg font-bold tracking-wide text-white uppercase">
                Book via {contactSection.bookingChannel}
              </h3>
              <p className="mt-1 text-xs text-white/55">
                {contactSection.bookingNote}
              </p>
            </div>

            {selectedService && (
              <button
                type="button"
                onClick={onClearService}
                className="cursor-pointer border border-[#f43f5e]/40 bg-[#e11d48]/15 px-3 py-1 font-mono text-[11px] text-[#fda4af] transition-colors hover:bg-[#e11d48]/25"
              >
                {selectedService} ×
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="contact-name"
                  className="mb-2 block font-mono text-[11px] tracking-[0.2em] text-white/60 uppercase"
                >
                  Your Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full rounded-lg border border-white/12 bg-[#070205]/90 px-4 py-3 text-sm text-white placeholder-white/30 transition-colors focus:border-[#f43f5e] focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-instagram"
                  className="mb-2 block font-mono text-[11px] tracking-[0.2em] text-white/60 uppercase"
                >
                  Your Instagram Handle
                </label>
                <input
                  id="contact-instagram"
                  type="text"
                  value={instagramHandle}
                  onChange={(e) => setInstagramHandle(e.target.value)}
                  placeholder="@yourhandle"
                  className="w-full rounded-lg border border-white/12 bg-[#070205]/90 px-4 py-3 text-sm text-white placeholder-white/30 transition-colors focus:border-[#f43f5e] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="contact-details"
                className="mb-2 block font-mono text-[11px] tracking-[0.2em] text-white/60 uppercase"
              >
                Shoot or Video Details
              </label>
              <textarea
                id="contact-details"
                rows={4}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Tell me about your shoot or video edit — photography genre, reel/video style, and preferred timeline..."
                className="w-full resize-none rounded-lg border border-white/12 bg-[#070205]/90 px-4 py-3 text-sm text-white placeholder-white/30 transition-colors focus:border-[#f43f5e] focus:outline-none"
              />
            </div>

            {status === 'error' && errorMessage && (
              <p role="alert" className="text-xs font-medium text-[#fda4af]">
                {errorMessage}
              </p>
            )}

            {status === 'ready' && (
              <div
                role="status"
                className="flex flex-col gap-3 rounded-lg border border-[#f43f5e]/40 bg-[#e11d48]/15 px-4 py-3.5 text-xs text-white sm:flex-row sm:items-center sm:justify-between"
              >
                <span>
                  Brief copied to clipboard. Send it directly via Instagram DM to complete your booking:
                </span>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={contactSection.personalInstagram.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded border border-white/25 bg-black/40 px-3 py-1.5 font-mono text-[11px] font-semibold text-white transition-colors hover:border-[#f43f5e]"
                  >
                    <span>{contactSection.personalInstagram.handle}</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  <a
                    href={contactSection.photographyInstagram.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded border border-white/25 bg-black/40 px-3 py-1.5 font-mono text-[11px] font-semibold text-white transition-colors hover:border-[#f43f5e]"
                  >
                    <span>{contactSection.photographyInstagram.handle}</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            )}

            <div className="flex justify-center pt-2">
              <button
                type="submit"
                disabled={status === 'preparing'}
                className="crimson-cta inline-flex min-h-[48px] cursor-pointer items-center gap-2.5 rounded-md px-8 py-3 text-xs font-bold tracking-[0.18em] text-white uppercase disabled:opacity-60"
              >
                <Send className="h-4 w-4" />
                <span>
                  {status === 'preparing'
                    ? 'Preparing DM Brief...'
                    : 'Copy Brief for Instagram DM'}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
