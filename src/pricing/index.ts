/**
 * The app's price source. Every screen imports the provider from here —
 * never `new MockPriceProvider()` directly.
 *
 * PHASE 5 SWAP: implement PriceProvider (see PriceProvider.ts) for a real
 * source, then change the single line below. No UI code changes needed.
 */
import { MockPriceProvider } from './MockPriceProvider';
import type { PriceProvider } from './PriceProvider';

let provider: PriceProvider = new MockPriceProvider();

export function getPriceProvider(): PriceProvider {
  return provider;
}

/** Reserved for Phase 5 — swaps the live pricing source app-wide. */
export function setPriceProvider(next: PriceProvider): void {
  provider = next;
}
