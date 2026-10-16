/**
 * MockPriceProvider — realistic sample pricing so the app works on day one
 * with no API keys and no network. Every number is deterministic: the same
 * card always produces the same comps, so the UI is stable and testable.
 *
 * How it works: each card in the catalog has a plausible mock median per
 * grade (see src/data/catalog.ts). This provider derives sold comps,
 * ranges, trends, and confidence from those medians with a seeded
 * pseudo-random generator — so comps look like real market data.
 *
 * REAL PROVIDERS (Phase 5) implement the same PriceProvider interface:
 *   - EbaySoldProvider: eBay Browse API "sold listings" (needs eBay developer
 *     account + OAuth app key; free tier exists, production approval required)
 *   - LicensedPricingProvider: e.g. Card Ladder / Market Movers (paid
 *     subscription + API key, terms prohibit redistribution of raw data)
 *   - GraderCertProvider: PSA/BGS/SGC cert verification (public lookup pages;
 *     official APIs are limited — check each grader's terms before wiring)
 * None of them scrape. Every value keeps its source label + date.
 */

import { BASE_PRICES, getCardById } from '../data/catalog';
import type {
  CardValuation,
  Confidence,
  GradeLabel,
  GradeValue,
  SaleComp,
} from '../data/types';
import { GRADE_LABELS } from '../data/types';
import type { PriceProvider } from './PriceProvider';
import { confidenceForCompCount, median, priceRange } from './valuation';
import { MOCK_AS_OF_ISO, MOCK_AS_OF_LABEL } from '../utils/format';

// Sales window for mock comps: Oct 2025 → Oct 2026.
const WINDOW_START = Date.UTC(2025, 9, 1);
const WINDOW_END = Date.UTC(2026, 9, 16);

const PLATFORMS: SaleComp['platform'][] = ['eBay', 'eBay', 'eBay', 'PWCC', 'Goldin', 'Fanatics Collect', 'MySlabs'];

/** Tiny string hash → uint32 seed. */
function hashSeed(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Deterministic PRNG (mulberry32) so mock data never shifts between renders. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function roundPrice(n: number): number {
  if (n >= 1000) return Math.round(n / 10) * 10;
  if (n >= 100) return Math.round(n);
  return Math.round(n * 100) / 100;
}

function randomDate(rand: () => number): string {
  const t = WINDOW_START + rand() * (WINDOW_END - WINDOW_START);
  return new Date(t).toISOString().slice(0, 10);
}

/** Random-walk series of `points` values ending at `endValue`. */
function randomWalk(rand: () => number, endValue: number, points: number, volatility: number): number[] {
  const out: number[] = [];
  let v = endValue * (0.82 + rand() * 0.3); // start somewhere plausible
  for (let i = 0; i < points; i++) {
    const drift = (endValue - v) * 0.06; // gentle pull toward the end value
    v = Math.max(endValue * 0.2, v + drift + (rand() - 0.5) * endValue * volatility);
    out.push(roundPrice(v));
  }
  out[points - 1] = roundPrice(endValue);
  return out;
}

export class MockPriceProvider implements PriceProvider {
  readonly name = 'SlabVault sample data';

  private cache = new Map<string, CardValuation>();

  async getValuation(cardId: string): Promise<CardValuation> {
    const cached = this.cache.get(cardId);
    if (cached) return cached;

    const card = getCardById(cardId);
    if (!card) throw new Error(`Unknown card id: ${cardId}`);
    const base = BASE_PRICES[cardId];
    if (!base) throw new Error(`No mock prices for card id: ${cardId}`);

    const comps: SaleComp[] = [];
    const graded: GradeValue[] = [];
    let rawValue: GradeValue | undefined;

    for (const label of GRADE_LABELS) {
      const medianPrice = base[label] as number;
      const rand = mulberry32(hashSeed(`${cardId}:${label}`));
      // Liquidity: 5–10 comps normally, 3–4 for scarce vintage.
      const compCount = card.lowLiquidity ? 3 + Math.floor(rand() * 2) : 5 + Math.floor(rand() * 6);

      const prices: number[] = [];
      for (let i = 0; i < compCount; i++) {
        const jitter = 0.86 + rand() * 0.28; // ±~14% around the median
        const price = roundPrice(medianPrice * jitter);
        prices.push(price);
        const platform = PLATFORMS[Math.floor(rand() * PLATFORMS.length)] as SaleComp['platform'];
        comps.push({
          id: `${cardId}-${label}-${i}`,
          cardId,
          gradeLabel: label,
          price,
          date: randomDate(rand),
          platform,
          url: `https://www.ebay.com/itm/sample-${cardId}-${label}-${i}`.replace(/\s/g, ''),
        });
      }

      // Flag 1–2 suspicious sales per card on the headline grade.
      if (label === 'PSA 10' || (label === 'Raw' && graded.length === 0)) {
        if (!card.lowLiquidity) {
          const highOutlier = roundPrice(medianPrice * (2.2 + rand() * 0.5));
          prices.push(highOutlier);
          comps.push({
            id: `${cardId}-${label}-outlier-high`,
            cardId, gradeLabel: label, price: highOutlier,
            date: randomDate(rand), platform: 'eBay',
            url: 'https://www.ebay.com/itm/sample-outlier',
            flagged: 'Outlier — far above recent sales for this grade.',
          });
          const lowOutlier = roundPrice(medianPrice * (0.35 + rand() * 0.15));
          prices.push(lowOutlier);
          comps.push({
            id: `${cardId}-${label}-outlier-low`,
            cardId, gradeLabel: label, price: lowOutlier,
            date: randomDate(rand), platform: 'eBay',
            url: 'https://www.ebay.com/itm/sample-outlier-low',
            flagged: 'Suspicious — far below recent sales. Possible shill bid or mislisted item.',
          });
        }
      }

      const { low, high } = priceRange(prices);
      const volume = prices.length;
      const gv: GradeValue = {
        gradeLabel: label,
        median: median(prices),
        low,
        high,
        volume,
        confidence: confidenceForCompCount(volume) as Confidence,
        trend30: randomWalk(rand, medianPrice, 30, 0.05),
        trend90: randomWalk(rand, medianPrice, 30, 0.08),
        trend365: randomWalk(rand, medianPrice, 12, 0.16),
      };
      if (label === 'Raw') rawValue = gv;
      else graded.push(gv);
    }

    // Newest sales first.
    comps.sort((a, b) => (a.date < b.date ? 1 : -1));

    const valuation: CardValuation = {
      cardId,
      raw: rawValue as GradeValue,
      graded,
      comps,
      asOf: MOCK_AS_OF_LABEL,
      source: this.name,
    };
    this.cache.set(cardId, valuation);
    return valuation;
  }

  async getPortfolioHistory(currentValue: number, points: number): Promise<number[]> {
    const rand = mulberry32(hashSeed(`portfolio:${Math.round(currentValue)}`));
    return randomWalk(rand, currentValue, points, 0.09);
  }
}
