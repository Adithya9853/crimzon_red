import { useEffect, useMemo, useRef, useState } from 'react';
import {
  generatePortraitSlices,
  PortraitSliceSpec,
  SliceRuntimeState,
  stepSliceState,
} from './SliceEngine';

interface InteractivePortraitProps {
  cutoutImage: string;
  alt: string;
  entranceReady: boolean;
}

function computePortraitLeftRatio(width: number, height: number): number {
  if (width <= 0 || height <= 0) return 0.52;
  const imgAspect = 1672 / 941;
  const boxAspect = width / height;
  if (boxAspect > imgAspect) {
    return 0.52;
  }
  const drawW = height * imgAspect;
  const offsetX = width - drawW;
  const personLeftPx = offsetX + drawW * 0.52;
  return Math.max(0.05, Math.min(0.85, personLeftPx / width));
}

/**
 * Layer 2: Transparent person portrait with mouse-direction photo slicing.
 * Slices shift smoothly in the exact direction of cursor/touch movement
 * (horizontal, vertical, and diagonal) with layered delay, velocity-scaled
 * displacement, subtle motion blur, and smooth resting reconstruction.
 */
export function InteractivePortrait({
  cutoutImage,
  alt,
  entranceReady,
}: InteractivePortraitProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sliceElRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [layoutMetrics, setLayoutMetrics] = useState(() => ({
    isMobile: typeof window !== 'undefined' ? window.innerWidth < 768 : false,
    personLeftRatio: 0.52,
  }));

  const slices: PortraitSliceSpec[] = useMemo(
    () =>
      generatePortraitSlices(
        layoutMetrics.isMobile,
        layoutMetrics.personLeftRatio
      ),
    [layoutMetrics.isMobile, layoutMetrics.personLeftRatio]
  );

  const runtimeRef = useRef<SliceRuntimeState[]>([]);
  const driveRef = useRef({
    x: 0,
    y: 0,
    pointerX: 0,
    pointerY: 0,
    prevClientX: 0,
    prevClientY: 0,
    hasPrev: false,
    overPortrait: false,
    rafId: 0,
    lastTime: 0,
  });

  // Sync runtime array length with current slice count
  useEffect(() => {
    runtimeRef.current = slices.map(() => ({
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      blur: 0,
    }));
  }, [slices]);

  // Keep layout metrics synced with viewport & container resize
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateMetrics = () => {
      const rect = container.getBoundingClientRect();
      const nextMobile = window.innerWidth < 768;
      const nextRatio = Number(
        computePortraitLeftRatio(rect.width, rect.height).toFixed(2)
      );
      setLayoutMetrics((prev) =>
        prev.isMobile === nextMobile && prev.personLeftRatio === nextRatio
          ? prev
          : { isMobile: nextMobile, personLeftRatio: nextRatio }
      );
    };

    updateMetrics();
    const resizeObs = new ResizeObserver(updateMetrics);
    resizeObs.observe(container);
    window.addEventListener('resize', updateMetrics, { passive: true });
    return () => {
      resizeObs.disconnect();
      window.removeEventListener('resize', updateMetrics);
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const getPortraitBounds = (rect: DOMRect) => {
      const imgAspect = 1672 / 941;
      const boxAspect = rect.width / Math.max(1, rect.height);
      let drawW = rect.width;
      let offsetX = 0;
      if (boxAspect <= imgAspect) {
        drawW = rect.height * imgAspect;
        offsetX = rect.width - drawW;
      }
      const personLeft = offsetX + drawW * 0.5;
      const personRight = offsetX + drawW;
      return { personLeft, personRight };
    };

    const startLoop = () => {
      if (driveRef.current.rafId !== 0) return;
      driveRef.current.lastTime = performance.now();
      driveRef.current.rafId = window.requestAnimationFrame(tick);
    };

    const resetAllTransforms = () => {
      for (let i = 0; i < slices.length; i++) {
        const el = sliceElRefs.current[i];
        const st = runtimeRef.current[i];
        if (st) {
          st.x = 0;
          st.y = 0;
          st.vx = 0;
          st.vy = 0;
          st.blur = 0;
        }
        if (el) {
          el.style.transform = 'translate3d(0px, 0px, 0)';
          el.style.filter = '';
        }
      }
    };

    const tick = (now: number) => {
      const dtMs = Math.min(34, Math.max(8, now - driveRef.current.lastTime));
      driveRef.current.lastTime = now;
      const dtScale = dtMs / 16.6667;

      const rect = container.getBoundingClientRect();
      const drive = driveRef.current;

      // Smoothly decay drive velocity when mouse stops or leaves portrait
      const decayRate = drive.overPortrait ? 0.905 : 0.83;
      const decay = Math.pow(decayRate, dtScale);
      drive.x *= decay;
      drive.y *= decay;

      const spread = layoutMetrics.isMobile ? 165 : 235;
      let maxActivity = Math.max(Math.abs(drive.x), Math.abs(drive.y));

      for (let i = 0; i < slices.length; i++) {
        const spec = slices[i];
        const st = runtimeRef.current[i];
        const el = sliceElRefs.current[i];
        if (!st || !el) continue;

        stepSliceState(spec, st, {
          driveX: drive.x,
          driveY: drive.y,
          pointerX: drive.pointerX,
          pointerY: drive.pointerY,
          containerWidth: rect.width,
          containerHeight: rect.height,
          spread,
          dtScale,
        });

        el.style.transform = `translate3d(${st.x.toFixed(2)}px, ${st.y.toFixed(2)}px, 0)`;
        el.style.filter = st.blur > 0.08 ? `blur(${st.blur.toFixed(2)}px)` : '';

        const offsetMag = Math.max(Math.abs(st.x), Math.abs(st.y));
        if (offsetMag > maxActivity) maxActivity = offsetMag;
      }

      if (maxActivity < 0.05) {
        resetAllTransforms();
        drive.x = 0;
        drive.y = 0;
        drive.rafId = 0;
        return;
      }

      drive.rafId = window.requestAnimationFrame(tick);
    };

    const applyMovement = (clientX: number, clientY: number) => {
      if (!entranceReady || prefersReduced) return;

      const rect = container.getBoundingClientRect();
      const localX = clientX - rect.left;
      const localY = clientY - rect.top;

      if (localX < 0 || localY < 0 || localX > rect.width || localY > rect.height) {
        driveRef.current.overPortrait = false;
        driveRef.current.hasPrev = false;
        return;
      }

      const { personLeft, personRight } = getPortraitBounds(rect);
      const isOverPerson = localX >= personLeft - 24 && localX <= personRight + 24;

      if (!isOverPerson) {
        driveRef.current.overPortrait = false;
        driveRef.current.hasPrev = false;
        return;
      }

      driveRef.current.overPortrait = true;
      driveRef.current.pointerX = localX;
      driveRef.current.pointerY = localY;

      if (!driveRef.current.hasPrev) {
        driveRef.current.prevClientX = clientX;
        driveRef.current.prevClientY = clientY;
        driveRef.current.hasPrev = true;
        return;
      }

      const rawDx = clientX - driveRef.current.prevClientX;
      const rawDy = clientY - driveRef.current.prevClientY;
      driveRef.current.prevClientX = clientX;
      driveRef.current.prevClientY = clientY;

      const deltaX = Math.max(-44, Math.min(44, rawDx));
      const deltaY = Math.max(-44, Math.min(44, rawDy));

      if (Math.abs(deltaX) < 0.05 && Math.abs(deltaY) < 0.05) return;

      const maxShift = layoutMetrics.isMobile ? 22 : 34;
      const gain = layoutMetrics.isMobile ? 0.92 : 1.05;

      driveRef.current.x = Math.max(
        -maxShift,
        Math.min(maxShift, driveRef.current.x + deltaX * gain)
      );
      driveRef.current.y = Math.max(
        -maxShift,
        Math.min(maxShift, driveRef.current.y + deltaY * gain)
      );

      startLoop();
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      applyMovement(e.clientX, e.clientY);
    };

    const onPointerLeave = () => {
      driveRef.current.overPortrait = false;
      driveRef.current.hasPrev = false;
      startLoop();
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const t = e.touches[0];
        driveRef.current.prevClientX = t.clientX;
        driveRef.current.prevClientY = t.clientY;
        driveRef.current.hasPrev = true;
        applyMovement(t.clientX, t.clientY);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const t = e.touches[0];
        applyMovement(t.clientX, t.clientY);
      }
    };

    const onTouchEnd = () => {
      driveRef.current.overPortrait = false;
      driveRef.current.hasPrev = false;
      startLoop();
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('mouseleave', onPointerLeave);
    container.addEventListener('touchstart', onTouchStart, { passive: true });
    container.addEventListener('touchmove', onTouchMove, { passive: true });
    container.addEventListener('touchend', onTouchEnd, { passive: true });
    container.addEventListener('touchcancel', onTouchEnd, { passive: true });

    return () => {
      if (driveRef.current.rafId) {
        window.cancelAnimationFrame(driveRef.current.rafId);
        driveRef.current.rafId = 0;
      }
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('mouseleave', onPointerLeave);
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchmove', onTouchMove);
      container.removeEventListener('touchend', onTouchEnd);
      container.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [slices, layoutMetrics.isMobile, entranceReady]);

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={alt}
      className="pointer-events-auto touch-pan-y absolute inset-0 z-10 overflow-hidden select-none"
    >
      {slices.map((slice, index) => (
        <div
          key={slice.id}
          ref={(el) => {
            sliceElRefs.current[index] = el;
          }}
          className="pointer-events-none absolute inset-0 will-change-transform"
          style={{
            clipPath: `inset(${slice.topPct.toFixed(3)}% ${slice.rightPct.toFixed(3)}% ${slice.bottomPct.toFixed(3)}% ${slice.leftPct.toFixed(3)}%)`,
          }}
        >
          <img
            src={cutoutImage}
            alt=""
            draggable={false}
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover object-right select-none"
          />
        </div>
      ))}
    </div>
  );
}
