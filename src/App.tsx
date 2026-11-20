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

  const handleNavigate = useCallback((sectionId: string) => {
    const targetEl = document.getElementById(sectionId);
    if (!targetEl) return;

    if (lenisRef.current) {
      lenisRef.current.scrollTo(targetEl, {
        offset: -68,
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
    <div className="relative min-h-screen bg-[#050204] text-[#f5eff2]">
      <CustomCursor />

      {/* Opening Cinematic Transition */}
      <IntroCurtain onComplete={() => setIntroDone(true)} />

      {/* Dynamic Burgundy / Crimson / Magenta Atmospheric Lighting */}
      <AtmosphericBackground />

      {/* Interactive HTML5 Canvas Particle Field */}
      <ParticleCanvas scrollVelocityRef={scrollVelocityRef} />

      {/* Sticky Top Navigation */}
      <Navbar onNavigate={handleNavigate} />

      {/* Main Content Flow in Reference Section Order */}
      <main>
        {/* 1. Hero Section */}
        <HeroSection introDone={introDone} onNavigate={handleNavigate} />

        {/* Career Metrics Strip */}
        <MetricsBar />

        {/* 2. Projects */}
        <ProjectsSection />

        {/* 3. About Me */}
        <AboutSection />

        {/* 4. Services & Pricing */}
        <ServicesSection onSelectService={handleSelectService} />

        {/* 5. Technical Skills & My Tech Stack */}
        <SkillsStackSection />

        {/* 6. Contact */}
        <ContactSection
          selectedService={selectedService}
          onClearService={() => setSelectedService(null)}
        />
      </main>

      {/* 7. Ending Animation & Footer */}
      <EndingSection onBackToTop={handleBackToTop} />

      {/* Floating Background Music Toggle */}
      <MusicToggle />
    </div>
  );
}
