/**
 * Valuation math — pure functions with no dependencies.
 * Covered by unit tests in __tests__/valuation.test.ts.
 */

import type { Confidence, GradeLabel } from '../data/types';

/** Median of a list of sale prices. Returns 0 for an empty list. */
export function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 1
    ? (sorted[mid] as number)
    : ((sorted[mid - 1] as number) + (sorted[mid] as number)) / 2;
}

/** Low/high of a list of sale prices. Returns zeros for an empty list. */
export function priceRange(values: number[]): { low: number; high: number } {
  if (values.length === 0) return { low: 0, high: 0 };
  return { low: Math.min(...values), high: Math.max(...values) };
}

/**
 * Confidence in a valuation, based purely on how many sold comps back it.
 * Fewer comps = easier for one weird sale to skew the number.
 */
export function confidenceForCompCount(count: number): Confidence {
  if (count < 5) return 'low';
  if (count < 8) return 'medium';
  return 'high';
}

/**
 * Percentage change from the first to the last point of a price series.
 * Returns 0 when there aren't at least two points (nothing to compare).
 */
export function trendPercent(series: number[]): number {
  if (series.length < 2) return 0;
  const first = series[0] as number;
  const last = series[series.length - 1] as number;
  if (first === 0) return 0;
  return ((last - first) / first) * 100;
}

// ---------------------------------------------------------------------------
// "Should I grade this?" calculator (used by the valuation screens, Phase 3)
// ---------------------------------------------------------------------------

export interface GradeProbability {
  gradeLabel: GradeLabel;
  /** Estimated value if the card comes back at this grade. */
  valueIfGraded: number;
  /** Your honest probability (0–1) of getting this grade. Must sum to ~1. */
  probability: number;
}

export interface GradeDecision {
  expectedValue: number;
  gradingCost: number;
  rawValue: number;
  expectedProfit: number;
  /** Plain-English recommendation. */
  recommendation: 'grade' | 'dont-grade' | 'toss-up';
  recommendationText: string;
}

/**
 * Expected-value math for the grading decision:
 *   expected value = Σ (probability of grade × value at that grade)
 *   expected profit = expected value − raw value − grading cost
 */
export function shouldGradeThis(
  outcomes: GradeProbability[],
  gradingCost: number,
  rawValue: number,
): GradeDecision {
  const expectedValue = outcomes.reduce(
    (sum, o) => sum + o.probability * o.valueIfGraded,
    0,
  );
  const expectedProfit = expectedValue - rawValue - gradingCost;

  let recommendation: GradeDecision['recommendation'];
  let recommendationText: string;
  if (expectedProfit > gradingCost * 0.5) {
    recommendation = 'grade';
    recommendationText =
      'Worth grading — the expected lift comfortably beats the grading cost.';
  } else if (expectedProfit < 0) {
    recommendation = 'dont-grade';
    recommendationText =
      'Probably not worth grading — expected profit is negative after fees.';
  } else {
    recommendation = 'toss-up';
    recommendationText =
      'Close call — the expected lift barely covers grading. Only grade if you want the slab for your PC.';
  }

  return { expectedValue, gradingCost, rawValue, expectedProfit, recommendation, recommendationText };
}
