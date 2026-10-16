/**
 * Unit tests for the valuation math (src/pricing/valuation.ts).
 * Run with: npm test
 */
import {
  confidenceForCompCount,
  median,
  priceRange,
  shouldGradeThis,
  trendPercent,
} from '../src/pricing/valuation';

describe('median', () => {
  it('returns 0 for an empty list', () => {
    expect(median([])).toBe(0);
  });

  it('returns the middle value for an odd-length list', () => {
    expect(median([300, 100, 200])).toBe(200);
  });

  it('averages the two middle values for an even-length list', () => {
    expect(median([100, 400, 200, 300])).toBe(250);
  });

  it('is not skewed by a single outlier the way an average would be', () => {
    // Five normal sales + one crazy outlier: median barely moves.
    expect(median([1000, 1050, 980, 1020, 1100, 50000])).toBe(1035);
  });
});

describe('priceRange', () => {
  it('returns zeros for an empty list', () => {
    expect(priceRange([])).toEqual({ low: 0, high: 0 });
  });

  it('finds the low and high', () => {
    expect(priceRange([250, 100, 400, 175])).toEqual({ low: 100, high: 400 });
  });
});

describe('confidenceForCompCount', () => {
  it('is low with fewer than 5 comps', () => {
    expect(confidenceForCompCount(0)).toBe('low');
    expect(confidenceForCompCount(4)).toBe('low');
  });

  it('is medium with 5–7 comps', () => {
    expect(confidenceForCompCount(5)).toBe('medium');
    expect(confidenceForCompCount(7)).toBe('medium');
  });

  it('is high with 8+ comps', () => {
    expect(confidenceForCompCount(8)).toBe('high');
    expect(confidenceForCompCount(50)).toBe('high');
  });
});

describe('trendPercent', () => {
  it('returns 0 when there is nothing to compare', () => {
    expect(trendPercent([])).toBe(0);
    expect(trendPercent([100])).toBe(0);
  });

  it('computes the percentage change first → last', () => {
    expect(trendPercent([100, 110])).toBeCloseTo(10);
    expect(trendPercent([200, 150])).toBeCloseTo(-25);
  });

  it('ignores the middle — only the endpoints matter', () => {
    expect(trendPercent([100, 500, 0, 110])).toBeCloseTo(10);
  });

  it('guards against division by zero', () => {
    expect(trendPercent([0, 100])).toBe(0);
  });
});

describe('shouldGradeThis (grading calculator)', () => {
  const outcomes = [
    { gradeLabel: 'PSA 10' as const, valueIfGraded: 1000, probability: 0.2 },
    { gradeLabel: 'PSA 9' as const, valueIfGraded: 400, probability: 0.5 },
    { gradeLabel: 'PSA 8' as const, valueIfGraded: 150, probability: 0.3 },
  ];
  // expected value = 0.2*1000 + 0.5*400 + 0.3*150 = 200 + 200 + 45 = 445

  it('computes expected value and profit', () => {
    const d = shouldGradeThis(outcomes, 50, 200);
    expect(d.expectedValue).toBeCloseTo(445);
    expect(d.expectedProfit).toBeCloseTo(195); // 445 - 200 - 50
  });

  it('recommends grading when profit comfortably beats cost', () => {
    const d = shouldGradeThis(outcomes, 50, 200);
    expect(d.recommendation).toBe('grade');
  });

  it('recommends against grading when profit is negative', () => {
    const d = shouldGradeThis(outcomes, 50, 400); // expected 445 - 400 - 50 = -5
    expect(d.recommendation).toBe('dont-grade');
  });

  it('calls it a toss-up when the lift barely covers the cost', () => {
    const d = shouldGradeThis(outcomes, 50, 380); // 445 - 380 - 50 = 15 (< 25)
    expect(d.recommendation).toBe('toss-up');
  });
});
