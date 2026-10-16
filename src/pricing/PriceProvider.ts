/**
 * PriceProvider — the seam between the app and market data.
 *
 * The UI only ever talks to this interface, never to a specific source.
 * Phase 1 ships MockPriceProvider (realistic sample data, works offline).
 * Phase 5 will add real providers (eBay sold API, licensed pricing APIs, …)
 * that implement this same interface — swapping is a one-line change in
 * src/pricing/index.ts, with zero UI changes.
 */

import type { CardValuation } from '../data/types';

export interface PriceProvider {
  /** Human-readable source name shown next to every number, e.g. "eBay sold listings". */
  readonly name: string;

  /** Full valuation (raw + graded values, comps, trends) for one card. */
  getValuation(cardId: string): Promise<CardValuation>;

  /**
   * A plausible value-over-time series for the whole portfolio, ending at
   * `currentValue`. Used by the dashboard chart.
   */
  getPortfolioHistory(currentValue: number, points: number): Promise<number[]>;
}
