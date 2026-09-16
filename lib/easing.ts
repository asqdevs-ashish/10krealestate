/**
 * Cubic-bézier easing, evaluated in JavaScript.
 *
 * CSS can express `cubic-bezier(...)` and Framer Motion accepts the same
 * four numbers, but Lenis and GSAP need the curve as a plain function so a
 * programmatic scroll can share the exact easing the rest of the site uses.
 * Rather than approximate it, this solves the curve the way browsers do:
 * invert x(t) for t, then read y(t).
 *
 * Pure functions, no DOM, safe on the server.
 */

/** Newton-Raphson converges in a handful of steps for well-behaved curves. */
const NEWTON_ITERATIONS = 8;
/** Below this slope Newton can overshoot, so fall back to bisection. */
const NEWTON_MINIMUM_SLOPE = 0.001;
const SUBDIVISION_PRECISION = 1e-7;
const SUBDIVISION_MAX_ITERATIONS = 24;

type Coordinates = readonly [x1: number, y1: number, x2: number, y2: number];

/** B(t) for the x axis, with the curve anchored at 0 and 1. */
function sampleCurveX(t: number, x1: number, x2: number): number {
  const a = 1 - 3 * x2 + 3 * x1;
  const b = 3 * x2 - 6 * x1;
  const c = 3 * x1;
  return ((a * t + b) * t + c) * t;
}

/** B(t) for the y axis. */
function sampleCurveY(t: number, y1: number, y2: number): number {
  const a = 1 - 3 * y2 + 3 * y1;
  const b = 3 * y2 - 6 * y1;
  const c = 3 * y1;
  return ((a * t + b) * t + c) * t;
}

/** B'(t) for the x axis. */
function sampleCurveDerivativeX(t: number, x1: number, x2: number): number {
  const a = 1 - 3 * x2 + 3 * x1;
  const b = 3 * x2 - 6 * x1;
  const c = 3 * x1;
  return (3 * a * t + 2 * b) * t + c;
}

function solveCurveX(x: number, x1: number, x2: number): number {
  let t = x;

  for (let i = 0; i < NEWTON_ITERATIONS; i += 1) {
    const slope = sampleCurveDerivativeX(t, x1, x2);
    if (Math.abs(slope) < NEWTON_MINIMUM_SLOPE) break;
    const error = sampleCurveX(t, x1, x2) - x;
    if (Math.abs(error) < SUBDIVISION_PRECISION) return t;
    t -= error / slope;
  }

  // Bisection: guaranteed to converge when Newton cannot.
  let lower = 0;
  let upper = 1;
  t = x;

  for (let i = 0; i < SUBDIVISION_MAX_ITERATIONS; i += 1) {
    const current = sampleCurveX(t, x1, x2);
    if (Math.abs(current - x) < SUBDIVISION_PRECISION) return t;
    if (current < x) lower = t;
    else upper = t;
    t = (lower + upper) / 2;
  }

  return t;
}

/**
 * Build an easing function from four control-point coordinates, the same
 * values you would hand to CSS `cubic-bezier()`.
 *
 * @example
 * const easeOut = cubicBezier(0.16, 1, 0.3, 1); // expo-out, the house curve
 * easeOut(0.5);
 */
export function cubicBezier(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): (progress: number) => number {
  return (progress: number): number => {
    if (progress <= 0) return 0;
    if (progress >= 1) return 1;
    return sampleCurveY(solveCurveX(progress, x1, x2), y1, y2);
  };
}

/**
 * The house curves. These mirror the literal `cubic-bezier()` values used in
 * the stylesheets and the Framer Motion transitions, so a Lenis scroll and a
 * CSS reveal decelerate identically.
 */
export const EASE_LUXE: Coordinates = [0.16, 1, 0.3, 1];
export const EASE_CURTAIN: Coordinates = [0.76, 0, 0.24, 1];

/** Eased interpolators, ready for Lenis, GSAP or a rAF loop. */
export const easeLuxe = cubicBezier(...EASE_LUXE);
export const easeCurtain = cubicBezier(...EASE_CURTAIN);
