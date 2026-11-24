import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  baseAlpha: number;
  pulseSpeed: number;
  pulsePhase: number;
  depth: number;
  spriteIndex: number;
  isBokeh: boolean;
}

interface ParticleCanvasProps {
  scrollVelocityRef?: React.MutableRefObject<number>;
}

const PARTICLE_COLORS = [
  { r: 216, g: 30, b: 47 },   // #D81E2F Accent red
  { r: 163, g: 21, b: 21 },   // #A31515 Primary red
  { r: 255, g: 120, b: 135 }, // #FF7887 Pink-red accent
  { r: 139, g: 17, b: 24 },   // #8B1118 Glass reflection crimson
  { r: 229, g: 9, b: 20 },    // Deep studio crimson
];

export function ParticleCanvas({ scrollVelocityRef }: ParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Pre-render glowing radial sprites for high-FPS rendering
    const sprites: HTMLCanvasElement[] = PARTICLE_COLORS.map((color) => {
      const spriteSize = 128;
      const off = document.createElement('canvas');
      off.width = spriteSize;
      off.height = spriteSize;
      const octx = off.getContext('2d');
      if (octx) {
        const half = spriteSize / 2;
        const grad = octx.createRadialGradient(half, half, 0, half, half, half);
        grad.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, 0.95)`);
        grad.addColorStop(0.25, `rgba(${color.r}, ${color.g}, ${color.b}, 0.55)`);
        grad.addColorStop(0.6, `rgba(${color.r}, ${color.g}, ${color.b}, 0.14)`);
        grad.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);
        octx.fillStyle = grad;
        octx.fillRect(0, 0, spriteSize, spriteSize);
      }
      return off;
    });

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();

    const targetCount = width < 768 ? 72 : 155;
    const particles: Particle[] = [];

    for (let i = 0; i < targetCount; i++) {
      const isBokeh = i < targetCount * 0.28;
      const depth = 0.25 + Math.random() * 0.75;
      const baseAlpha = isBokeh
        ? 0.13 + Math.random() * 0.22
        : 0.34 + Math.random() * 0.56;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.26 * depth,
        vy: -(0.12 + Math.random() * 0.36) * depth,
        radius: isBokeh
          ? 19 + Math.random() * 38
          : 2.4 + Math.random() * 5.8,
        alpha: baseAlpha,
        baseAlpha,
        pulseSpeed: 0.6 + Math.random() * 1.4,
        pulsePhase: Math.random() * Math.PI * 2,
        depth,
        spriteIndex: Math.floor(Math.random() * sprites.length),
        isBokeh,
      });
    }

    const mouse = { x: width * 0.5, y: height * 0.5, tx: width * 0.5, ty: height * 0.5 };

    const handlePointerMove = (e: PointerEvent) => {
      mouse.tx = e.clientX;
      mouse.ty = e.clientY;
    };

    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    let rafId = 0;
    let time = 0;

    const renderFrame = () => {
      time += 0.016;
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;

      const parallaxX = ((mouse.x - width * 0.5) / Math.max(width, 1)) * 28;
      const parallaxY = ((mouse.y - height * 0.5) / Math.max(height, 1)) * 20;
      const scrollVel = scrollVelocityRef ? scrollVelocityRef.current : 0;

      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'lighter';

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!prefersReducedMotion) {
          p.x += p.vx + Math.sin(time * 0.5 + p.pulsePhase) * 0.12;
          p.y += p.vy - scrollVel * 0.08 * p.depth;

          if (p.y < -p.radius * 2) {
            p.y = height + p.radius * 2;
            p.x = Math.random() * width;
          } else if (p.y > height + p.radius * 2) {
            p.y = -p.radius * 2;
            p.x = Math.random() * width;
          }

          if (p.x < -p.radius * 2) p.x = width + p.radius * 2;
          if (p.x > width + p.radius * 2) p.x = -p.radius * 2;

          p.alpha =
            p.baseAlpha *
            (0.68 + 0.32 * Math.sin(time * p.pulseSpeed + p.pulsePhase));
        }

        const drawX = p.x + parallaxX * p.depth;
        const drawY = p.y + parallaxY * p.depth;
        const size = p.radius * 2;

        ctx.globalAlpha = Math.max(0.02, Math.min(1, p.alpha));
        ctx.drawImage(
          sprites[p.spriteIndex],
          drawX - p.radius,
          drawY - p.radius,
          size,
          size
        );
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';

      if (!prefersReducedMotion) {
        rafId = window.requestAnimationFrame(renderFrame);
      }
    };

    renderFrame();

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, [scrollVelocityRef]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-10 h-full w-full"
    />
  );
}
