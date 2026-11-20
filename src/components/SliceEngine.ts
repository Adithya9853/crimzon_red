export interface PortraitSliceSpec {
  id: number;
  row: number;
  col: number;
  topPct: number;
  rightPct: number;
  bottomPct: number;
  leftPct: number;
  normCenterX: number;
  normCenterY: number;
  depthMultiplier: number;
  ease: number;
  blurWeight: number;
}

export interface SliceRuntimeState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  blur: number;
}

/**
 * Generates thin rectangular portrait slices using a mixture of:
 * - Thin full-width horizontal slices across the upper head/face band (y < 48%)
 *   so facial features stay cohesive, crisp, and recognizable.
 * - Thin horizontal + vertical rectangular slices across the shoulders, suit, and
 *   arms (y >= 48%) aligned to [personLeftRatio .. 100%] for multi-layered fluid motion.
 */
export function generatePortraitSlices(
  isMobile: boolean,
  personLeftRatio = 0.52
): PortraitSliceSpec[] {
  const headRows = isMobile ? 8 : 12;
  const torsoRows = isMobile ? 9 : 14;
  const splitY = 48; // Percentage boundary below the jawline/collar

  const leftStart = Math.max(0, Math.min(0.8, personLeftRatio));
  const span = 1 - leftStart;
  const colCutsPct: Array<[number, number]> = isMobile
    ? [
        [0, (leftStart + span * 0.5) * 100],
        [(leftStart + span * 0.5) * 100, 100],
      ]
    : [
        [0, (leftStart + span * 0.34) * 100],
        [(leftStart + span * 0.34) * 100, (leftStart + span * 0.68) * 100],
        [(leftStart + span * 0.68) * 100, 100],
      ];

  const slices: PortraitSliceSpec[] = [];
  const overlapY = 0.24;
  const overlapX = 0.18;
  let id = 0;

  const pseudoRand = (seed: number) => {
    const v = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
    return v - Math.floor(v);
  };

  // 1. Upper Portrait Horizontal Slices (head & face)
  for (let r = 0; r < headRows; r++) {
    const rawTop = (r / headRows) * splitY;
    const rawBottom = ((r + 1) / headRows) * splitY;
    const topPct = Math.max(0, rawTop - (r === 0 ? 0 : overlapY));
    const bottomInset = Math.max(0, 100 - Math.min(100, rawBottom + overlapY));

    const jitter = pseudoRand(r * 43 + 7);
    const rowNormY = (rawTop + rawBottom) / 200;

    slices.push({
      id: id++,
      row: r,
      col: 0,
      topPct,
      rightPct: 0,
      bottomPct: bottomInset,
      leftPct: 0,
      normCenterX: leftStart + span * 0.5,
      normCenterY: rowNormY,
      depthMultiplier: 0.78 + jitter * 0.34,
      ease: 0.115 + jitter * 0.055,
      blurWeight: 0.55,
    });
  }

  // 2. Lower Portrait Mixed Horizontal + Vertical Slices (shoulders, suit, arms)
  for (let r = 0; r < torsoRows; r++) {
    const rawTop = splitY + (r / torsoRows) * (100 - splitY);
    const rawBottom = splitY + ((r + 1) / torsoRows) * (100 - splitY);
    const topPct = Math.max(0, rawTop - overlapY);
    const bottomInset = Math.max(
      0,
      100 - Math.min(100, rawBottom + (r === torsoRows - 1 ? 0 : overlapY))
    );
    const rowNormY = (rawTop + rawBottom) / 200;

    for (let c = 0; c < colCutsPct.length; c++) {
      const [rawLeft, rawRight] = colCutsPct[c];
      const leftPct = Math.max(0, rawLeft - (c === 0 ? 0 : overlapX));
      const rightInset = Math.max(
        0,
        100 - Math.min(100, rawRight + (c === colCutsPct.length - 1 ? 0 : overlapX))
      );

      const jitter = pseudoRand((headRows + r) * 53 + c * 19 + 3);
      const colCenterPct = c === 0 ? (leftStart * 100 + rawRight) * 0.5 : (rawLeft + rawRight) * 0.5;

      slices.push({
        id: id++,
        row: headRows + r,
        col: c,
        topPct,
        rightPct: rightInset,
        bottomPct: bottomInset,
        leftPct,
        normCenterX: colCenterPct / 100,
        normCenterY: rowNormY,
        depthMultiplier: 0.68 + jitter * 0.68,
        ease: 0.075 + jitter * 0.115,
        blurWeight: 0.95,
      });
    }
  }

  return slices;
}

export interface SliceTickParams {
  driveX: number;
  driveY: number;
  pointerX: number;
  pointerY: number;
  containerWidth: number;
  containerHeight: number;
  spread: number;
  dtScale: number;
}

/**
 * Steps a single slice toward its cursor-direction target with per-slice
 * proximity falloff, depth multiplier, and easing.
 */
export function stepSliceState(
  spec: PortraitSliceSpec,
  st: SliceRuntimeState,
  params: SliceTickParams
): void {
  const sliceX = spec.normCenterX * params.containerWidth;
  const sliceY = spec.normCenterY * params.containerHeight;

  const dx = sliceX - params.pointerX;
  const dy = sliceY - params.pointerY;
  const distSq = dx * dx + dy * dy;
  const spreadSq2 = 2 * params.spread * params.spread;

  const proximity = 0.36 + 0.64 * Math.exp(-distSq / spreadSq2);

  const targetX = params.driveX * proximity * spec.depthMultiplier;
  const targetY = params.driveY * proximity * spec.depthMultiplier * 0.88;

  const ease = 1 - Math.pow(1 - spec.ease, params.dtScale);
  const nextX = st.x + (targetX - st.x) * ease;
  const nextY = st.y + (targetY - st.y) * ease;

  const velX = nextX - st.x;
  const velY = nextY - st.y;
  const speed = Math.hypot(velX, velY);

  st.x = nextX;
  st.y = nextY;
  st.vx = velX;
  st.vy = velY;

  const targetBlur = Math.min(1.25, speed * 0.22 * spec.blurWeight);
  st.blur += (targetBlur - st.blur) * 0.25;
}
