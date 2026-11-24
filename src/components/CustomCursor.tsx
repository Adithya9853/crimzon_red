import { useEffect, useRef } from 'react';

interface ElectricBolt {
  points: Array<{ x: number; y: number }>;
  life: number;
  width: number;
}

function createBolt(x1: number, y1: number, x2: number, y2: number, width = 1): ElectricBolt {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const distance = Math.hypot(dx, dy);
  const steps = Math.max(2, Math.min(12, Math.ceil(distance / 10)));
  const perpendicularX = distance > 0 ? -dy / distance : 0;
  const perpendicularY = distance > 0 ? dx / distance : 0;
  const points = [{ x: x1, y: y1 }];

  for (let step = 1; step < steps; step += 1) {
    const progress = step / steps;
    const jaggedness = Math.min(14, 3 + distance * 0.07);
    const offset = (Math.random() - 0.5) * jaggedness;
    points.push({
      x: x1 + dx * progress + perpendicularX * offset,
      y: y1 + dy * progress + perpendicularY * offset,
    });
  }

  points.push({ x: x2, y: y2 });
  return { points, life: 1, width };
}

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

    const bolts: ElectricBolt[] = [];
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

      for (let index = bolts.length - 1; index >= 0; index -= 1) {
        const bolt = bolts[index];
        bolt.life *= 0.94;
        if (bolt.life < 0.025) {
          bolts.splice(index, 1);
          continue;
        }

        context.beginPath();
        context.moveTo(bolt.points[0].x, bolt.points[0].y);
        for (let point = 1; point < bolt.points.length; point += 1) {
          context.lineTo(bolt.points[point].x, bolt.points[point].y);
        }
        context.lineWidth = bolt.width;
        context.strokeStyle = `rgba(255, 30, 58, ${bolt.life * 0.88})`;
        context.shadowBlur = 16;
        context.shadowColor = 'rgba(255, 28, 55, 0.98)';
        context.stroke();

        context.beginPath();
        context.moveTo(bolt.points[0].x, bolt.points[0].y);
        for (let point = 1; point < bolt.points.length; point += 1) {
          context.lineTo(bolt.points[point].x, bolt.points[point].y);
        }
        context.lineWidth = Math.max(0.45, bolt.width * 0.38);
        context.strokeStyle = `rgba(255, 218, 224, ${bolt.life * 0.76})`;
        context.shadowBlur = 8;
        context.shadowColor = 'rgba(255, 110, 132, 0.95)';
        context.stroke();
      }

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

      if (clickShock > 0.035) {
        for (let wave = 0; wave < 3; wave += 1) {
          const radius = 10 + (1 - clickShock) * 86 + wave * 15;
          context.beginPath();
          context.arc(mouseX, mouseY, radius, wave * 0.8, Math.PI * 2 - wave * 0.45);
          context.strokeStyle = wave === 0
            ? `rgba(255, 225, 232, ${clickShock * 0.92})`
            : `rgba(255, 48, 78, ${clickShock * (0.72 - wave * 0.12)})`;
          context.lineWidth = wave === 0 ? 2.1 : 1.4;
          context.shadowBlur = 22;
          context.shadowColor = 'rgba(255, 30, 58, 1)';
          context.stroke();
        }
      }

      clickShock *= 0.87;
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

      const dx = mouseX - previousMouseX;
      const dy = mouseY - previousMouseY;
      const distance = Math.hypot(dx, dy);
      if (visible && distance > 3) {
        bolts.unshift(createBolt(previousMouseX, previousMouseY, mouseX, mouseY, 0.9 + Math.min(1.2, distance * 0.035)));
        if (distance > 12 && Math.random() > 0.42) {
          const branchStart = 0.25 + Math.random() * 0.55;
          const branchX = previousMouseX + dx * branchStart;
          const branchY = previousMouseY + dy * branchStart;
          const branchLength = 24 + Math.random() * Math.min(120, distance * 4 + 48);
          const branchAngle = Math.atan2(dy, dx) + (Math.random() > 0.5 ? 1 : -1) * (0.55 + Math.random() * 0.95);
          bolts.unshift(createBolt(
            branchX,
            branchY,
            branchX + Math.cos(branchAngle) * branchLength,
            branchY + Math.sin(branchAngle) * branchLength,
            0.55 + Math.random() * 0.65
          ));
        }
        if (bolts.length > 70) bolts.length = 70;
      }

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
      for (let ray = 0; ray < 20; ray += 1) {
        const angle = (ray / 20) * Math.PI * 2 + (Math.random() - 0.5) * 0.16;
        const length = 22 + Math.random() * 70;
        bolts.unshift(createBolt(
          mouseX + Math.cos(angle) * 7,
          mouseY + Math.sin(angle) * 7,
          mouseX + Math.cos(angle) * length,
          mouseY + Math.sin(angle) * length,
          0.65 + Math.random() * 1.25
        ));
      }
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
