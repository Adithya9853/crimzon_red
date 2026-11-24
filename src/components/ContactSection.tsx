import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowRight,
  Camera,
  Check,
  Copy,
  ExternalLink,
  Instagram,
  Send,
} from 'lucide-react';
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
  const headingRef = useRef<HTMLDivElement | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [service, setService] = useState('');
  const [instagramHandle, setInstagramHandle] = useState('');
  const [details, setDetails] = useState('');
  const [copiedId, setCopiedId] = useState<'personal' | 'photo' | null>(null);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (selectedService) {
      setService(selectedService);
      setDetails((prev) =>
        prev.trim().length > 0
          ? prev
          : `Interested in: ${selectedService}\nPreferred dates, location, and creative vision: `
      );
    }
  }, [selectedService]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.65,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 82%',
            once: true,
          },
        }
      );

      gsap.fromTo(
        '.contact-reveal',
        { y: 26, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.65,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleCopyHandle = async (
    e: React.MouseEvent,
    handle: string,
    key: 'personal' | 'photo'
  ) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(handle);
      setCopiedId(key);
      window.setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Ignore if clipboard unavailable
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !details.trim()) {
      setStatus('error');
      setErrorMessage('Please enter your name, email, and project details.');
      return;
    }

    setStatus('sending');
    setErrorMessage('');

    const formData = new FormData(e.currentTarget);
    const composedDetails = service
      ? `Service: ${service}\n\n${details.trim()}`
      : details.trim();

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          instagramHandle: instagramHandle.trim(),
          details: composedDetails,
          company: String(formData.get('company') || ''),
        }),
      });

      const result = (await response.json().catch(() => null)) as
        | { error?: unknown }
        | null;

      if (!response.ok) {
        throw new Error(
          typeof result?.error === 'string'
            ? result.error
            : 'Could not send your inquiry. Please try again in a moment.'
        );
      }

      setStatus('sent');
      setName('');
      setEmail('');
      setService('');
      setInstagramHandle('');
      setDetails('');
      onClearService();
    } catch (error) {
      setStatus('error');
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Could not send your inquiry. Please try again in a moment.'
      );
    }
  };

  const { contactSection, servicesSection } = portfolioData;

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative z-10 flex w-full flex-col items-center justify-center overflow-hidden border-t border-white/5 px-6 py-28 text-gray-100 md:px-16 lg:px-24"
    >
      {/* Reference Heading */}
      <div
        ref={headingRef}
        className="z-10 mb-14 flex flex-col items-center text-center"
      >
        <span className="mb-2 text-sm font-bold tracking-[0.2em] text-[#A31515] uppercase md:text-base">
          {contactSection.kicker}
        </span>
        <h2 className="text-5xl font-black tracking-tight text-white uppercase md:text-7xl">
          {contactSection.title}
        </h2>
        <div className="mt-3 h-1.5 w-20 rounded-full bg-[#A31515]" />
      </div>

      <div className="relative z-10 w-full max-w-4xl">
        {/* Direct Instagram DM Booking Cards (matching reference featured direct contact banner) */}
        <div className="contact-reveal mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Personal Instagram DM Card */}
          <a
            href={contactSection.personalInstagram.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Message Preetham Kumar on Personal Instagram"
            className="ig-direct-card glass glass-hover relative flex items-center justify-between gap-4 rounded-3xl px-6 py-5"
          >
            <div className="flex min-w-0 items-center gap-4">
              <span className="ig-direct-icon grid h-12 w-12 shrink-0 place-items-center rounded-2xl">
                <Instagram className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <span className="block text-[10px] font-bold tracking-[0.18em] text-gray-400 uppercase">
                  Primary Booking · DM
                </span>
                <span className="block truncate text-base font-bold text-white">
                  {contactSection.personalInstagram.handle}
                </span>
                <span className="ig-direct-cta mt-0.5 inline-flex items-center gap-1 text-xs font-bold">
                  <span>Open Instagram DM</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={(e) =>
                handleCopyHandle(
                  e,
                  contactSection.personalInstagram.handle,
                  'personal'
                )
              }
              aria-label="Copy personal Instagram handle"
              className="glass-chip flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-xl text-gray-300 hover:text-white"
            >
              {copiedId === 'personal' ? (
                <Check className="h-4 w-4 text-[#FF7887]" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </a>

          {/* Photography Instagram DM Card */}
          <a
            href={contactSection.photographyInstagram.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View Photography Instagram"
            className="ig-direct-card glass glass-hover relative flex items-center justify-between gap-4 rounded-3xl px-6 py-5"
          >
            <div className="flex min-w-0 items-center gap-4">
              <span className="ig-direct-icon grid h-12 w-12 shrink-0 place-items-center rounded-2xl">
                <Camera className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <span className="block text-[10px] font-bold tracking-[0.18em] text-gray-400 uppercase">
                  Photography Feed
                </span>
                <span className="block truncate text-base font-bold text-white">
                  {contactSection.photographyInstagram.handle}
                </span>
                <span className="ig-direct-cta mt-0.5 inline-flex items-center gap-1 text-xs font-bold">
                  <span>Open Gallery Feed</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={(e) =>
                handleCopyHandle(
                  e,
                  contactSection.photographyInstagram.handle,
                  'photo'
                )
              }
              aria-label="Copy photography Instagram handle"
              className="glass-chip flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-xl text-gray-300 hover:text-white"
            >
              {copiedId === 'photo' ? (
                <Check className="h-4 w-4 text-[#FF7887]" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </a>
        </div>

        {/* Functional Contact Form inside Reference Glass Panel */}
        <div className="contact-reveal relative">
          <div className="red-halo" aria-hidden="true" />
          <div className="glass glass-panel-card relative rounded-3xl p-6 md:p-10">
            <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-bold tracking-tight text-white uppercase md:text-2xl">
                  Send a Project Brief
                </h3>
                <p className="mt-1 text-xs text-gray-400 md:text-sm">
                  {contactSection.bookingNote}
                </p>
              </div>

              {selectedService && (
                <button
                  type="button"
                  onClick={() => {
                    setService('');
                    onClearService();
                  }}
                  className="glass-chip-red cursor-pointer rounded-full px-3.5 py-1 text-xs font-bold text-white"
                >
                  {selectedService} ×
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <input
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute -left-[9999px]"
              />

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="mb-2 block text-xs font-bold tracking-wider text-gray-400 uppercase"
                  >
                    Your Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="glass-input w-full rounded-2xl px-4 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="mb-2 block text-xs font-bold tracking-wider text-gray-400 uppercase"
                  >
                    Email Address
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="glass-input w-full rounded-2xl px-4 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="contact-service"
                    className="mb-2 block text-xs font-bold tracking-wider text-gray-400 uppercase"
                  >
                    Service Selection
                  </label>
                  <select
                    id="contact-service"
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="glass-input w-full rounded-2xl px-4 py-3.5 text-sm text-white focus:outline-none"
                  >
                    <option value="" className="bg-[#101012] text-gray-300">
                      Select a service (optional)
                    </option>
                    {servicesSection.items.map((item) => (
                      <option
                        key={item.id}
                        value={item.title}
                        className="bg-[#101012] text-white"
                      >
                        {item.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="contact-instagram"
                    className="mb-2 block text-xs font-bold tracking-wider text-gray-400 uppercase"
                  >
                    Your Instagram Handle (Optional)
                  </label>
                  <input
                    id="contact-instagram"
                    type="text"
                    value={instagramHandle}
                    onChange={(e) => setInstagramHandle(e.target.value)}
                    placeholder="@yourhandle"
                    className="glass-input w-full rounded-2xl px-4 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="contact-details"
                  className="mb-2 block text-xs font-bold tracking-wider text-gray-400 uppercase"
                >
                  Message / Shoot Details
                </label>
                <textarea
                  id="contact-details"
                  rows={4}
                  required
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Tell me about your shoot or video edit — photography genre, reel/video style, location, and timeline..."
                  className="glass-input w-full resize-none rounded-2xl px-4 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none"
                />
              </div>

              {status === 'error' && errorMessage && (
                <p role="alert" className="text-xs font-semibold text-[#FF7887]">
                  {errorMessage}
                </p>
              )}

              {status === 'sent' && (
                <div
                  role="status"
                  className="flex flex-col gap-3 rounded-2xl border border-[#D81E2F]/40 bg-[#A31515]/15 px-4 py-4 text-xs text-white sm:flex-row sm:items-center sm:justify-between"
                >
                  <span>
                    Thanks! Your inquiry was sent. You can also DM me directly on Instagram:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <a
                      href={contactSection.personalInstagram.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="glass-chip inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-mono text-[11px] font-bold text-white"
                    >
                      <span>{contactSection.personalInstagram.handle}</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="glass-red mt-2 inline-flex min-h-[48px] cursor-pointer items-center justify-center gap-2.5 self-center rounded-full px-8 py-3 text-xs font-bold tracking-wider text-white uppercase disabled:opacity-60"
              >
                <Send className="h-4 w-4" />
                <span>
                  {status === 'sending' ? 'Sending...' : 'Send Message'}
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
