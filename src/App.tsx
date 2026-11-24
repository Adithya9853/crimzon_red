/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { AtmosphericBackground } from './components/AtmosphericBackground';
import { ParticleCanvas } from './components/ParticleCanvas';
import { IntroCurtain } from './components/IntroCurtain';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { MetricsBar } from './components/MetricsBar';
import { ProjectsSection } from './components/ProjectsSection';
import { AboutSection } from './components/AboutSection';
import { ServicesSection } from './components/ServicesSection';
import { SkillsStackSection } from './components/SkillsStackSection';
import { ContactSection } from './components/ContactSection';
import { EndingSection } from './components/EndingSection';
import { MusicToggle } from './components/MusicToggle';
import { CustomCursor } from './components/CustomCursor';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const lenisRef = useRef<Lenis | null>(null);
  const scrollVelocityRef = useRef<number>(0);
  const [introDone, setIntroDone] = useState(false);
  const [selectedService, setSelectedService] = useState<string | null>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const lenis = new Lenis({
      duration: prefersReduced ? 0.1 : 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: !prefersReduced,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;

    lenis.on('scroll', (e: { velocity: number }) => {
      scrollVelocityRef.current = e.velocity || 0;
      ScrollTrigger.update();
    });

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const handleIntroComplete = useCallback(() => {
    setIntroDone(true);
    window.setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
  }, []);

  const handleNavigate = useCallback((sectionId: string) => {
    const targetEl = document.getElementById(sectionId);
    if (!targetEl) return;

    if (lenisRef.current) {
      lenisRef.current.scrollTo(targetEl, {
        offset: -76,
        duration: 1.15,
      });
    } else {
      targetEl.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleSelectService = useCallback(
    (serviceTitle: string) => {
      setSelectedService(serviceTitle);
      handleNavigate('contact');
    },
    [handleNavigate]
  );

  const handleBackToTop = useCallback(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { duration: 1.35 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  return (
    <div className="relative isolate flex min-h-screen flex-col bg-[#07070a] font-sans text-[#F3F4F6] selection:bg-[#A31515] selection:text-white">
      <CustomCursor />
      {/* Opening Glitch Transition */}
      <IntroCurtain onComplete={handleIntroComplete} />

      {/* Reference Ambient Crimson Orbs & Subtle Grid */}
      <AtmosphericBackground />

      {/* Subtle Interactive Particle Depth Field */}
      <ParticleCanvas scrollVelocityRef={scrollVelocityRef} />

      {/* Floating Liquid Glass Navigation */}
      <Navbar onNavigate={handleNavigate} />

      {/* Main Content Flow in Reference Section Order */}
      <main className="relative z-10 w-full flex-1">
        {/* 1. Framed Hero Section */}
        <HeroSection introDone={introDone} onNavigate={handleNavigate} />

        {/* 2. Unified Stat Panel */}
        <MetricsBar />

        {/* 3. Photography & Video Editing Portfolio */}
        <ProjectsSection />

        {/* 4. About Me & Hanging Pendulum Portrait */}
        <AboutSection />

        {/* 5. Creative Services */}
        <ServicesSection onSelectService={handleSelectService} />

        {/* 6. Creative Skills & Editing Tools */}
        <SkillsStackSection />

        {/* 7. Contact & Instagram Booking */}
        <ContactSection
          selectedService={selectedService}
          onClearService={() => setSelectedService(null)}
        />
      </main>

      {/* 8. Cinematic Finale & Glass Bar Footer */}
      <EndingSection onBackToTop={handleBackToTop} />

      {/* Preserved Background Music Toggle */}
      <MusicToggle />
    </div>
  );
}
