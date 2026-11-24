import { useEffect, useRef } from 'react';

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const trailCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (
      !window.matchMedia('(pointer: fine)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const canvas = trailCanvasRef.current;
    if (!dot || !ring || !canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    document.documentElement.classList.add('has-cinematic-cursor');

    const resizeCanvas = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * ratio;
      canvas.height = window.innerHeight * ratio;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let previousMouseX = mouseX;
    let previousMouseY = mouseY;
    let visible = false;
    let interactive = false;
    let clickShock = 0;

    const trail: Array<{
      x: number;
      y: number;
      life: number;
      size: number;
    }> = [];

    const render = () => {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;

      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;

      const movementX = mouseX - previousMouseX;
      const movementY = mouseY - previousMouseY;
      const speed = Math.min(
        18,
        Math.sqrt(movementX * movementX + movementY * movementY)
      );

      if (visible && speed > 0.35) {
        trail.unshift({
          x: mouseX - movementX * 0.3,
          y: mouseY - movementY * 0.3,
          life: interactive ? 1 : 0.72,
          size: 2.2 + speed * 0.16,
        });
        if (trail.length > 54) trail.pop();
      }

      previousMouseX = mouseX;
      previousMouseY = mouseY;

      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      context.globalCompositeOperation = 'lighter';

      for (let index = 0; index < trail.length; index += 1) {
        const particle = trail[index];
        particle.life *= 0.935;
        particle.x += (particle.x - mouseX) * 0.012;
        particle.y += (particle.y - mouseY) * 0.012;

        if (particle.life < 0.02) continue;

        const radius =
          particle.size * (0.4 + particle.life * 1.15) +
          clickShock * 5 * (index / 42);

        context.beginPath();
        context.arc(particle.x, particle.y, radius, 0, Math.PI * 2);
        context.fillStyle =
          index < 4
            ? `rgba(255, 232, 236, ${particle.life * 1})`
            : `rgba(244, 63, 94, ${particle.life * 0.82})`;
        context.shadowBlur = 18 + speed * 1.5;
        context.shadowColor = 'rgba(244, 63, 94, 0.95)';
        context.fill();
      }

      if (clickShock > 0.08) {
        context.beginPath();
        context.arc(
          mouseX,
          mouseY,
          12 + (1 - clickShock) * 42,
          0,
          Math.PI * 2
        );
        context.strokeStyle = `rgba(255, 145, 166, ${clickShock * 0.95})`;
        context.lineWidth = 2.5;
        context.shadowBlur = 24;
        context.shadowColor = 'rgba(244, 63, 94, 1)';
        context.stroke();
      }

      clickShock *= 0.82;
      context.shadowBlur = 0;

      frameRef.current = window.requestAnimationFrame(render);
    };

    const handlePointerMove = (event: PointerEvent) => {
      mouseX = event.clientX;
      mouseY = event.clientY;

      const target = event.target as HTMLElement | null;
      const nextInteractive = Boolean(
        target?.closest(
          'a, button, [role="button"], input, textarea, select, .project-card-item'
        )
      );

      if (nextInteractive !== interactive) {
        interactive = nextInteractive;
        ring.classList.toggle('cursor-ring-active', interactive);
        dot.classList.toggle('cursor-dot-active', interactive);
      }

      if (!visible) {
        visible = true;
        dot.classList.add('cursor-visible');
        ring.classList.add('cursor-visible');
        canvas.classList.add('cursor-visible');
      }
    };

    const handlePointerLeave = () => {
      visible = false;
      dot.classList.remove('cursor-visible');
      ring.classList.remove('cursor-visible');
      canvas.classList.remove('cursor-visible');
    };

    const handlePointerDown = () => {
      ring.classList.add('cursor-ring-pressed');
      clickShock = 1;
    };

    const handlePointerUp = () => {
      ring.classList.remove('cursor-ring-pressed');
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', handlePointerLeave);
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointerup', handlePointerUp, { passive: true });
    frameRef.current = window.requestAnimationFrame(render);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      document.documentElement.removeEventListener('mouseleave', handlePointerLeave);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('resize', resizeCanvas);
      document.documentElement.classList.remove('has-cinematic-cursor');
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  return (
    <>
      <canvas ref={trailCanvasRef} aria-hidden="true" className="cinematic-cursor-trail" />
      <div ref={ringRef} aria-hidden="true" className="cinematic-cursor-ring" />
      <div ref={dotRef} aria-hidden="true" className="cinematic-cursor-dot" />
    </>
  );
}
