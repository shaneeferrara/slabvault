/** Small formatting helpers used across every screen. */

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const usdPrecise = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** $1,100 — whole dollars, the default for card values. */
export function formatUSD(n: number): string {
  return usd.format(Math.round(n));
}

/** $1,100.50 — for fees / cost basis where cents matter. */
export function formatUSDPrecise(n: number): string {
  return usdPrecise.format(n);
}

/** +$250 / −$250 — signed, for gains and losses. */
export function formatSignedUSD(n: number): string {
  const sign = n > 0 ? '+' : n < 0 ? '−' : '';
  return `${sign}${usd.format(Math.abs(Math.round(n)))}`;
}

/** +12.4% / −3.1% */
export function formatPercent(n: number, digits = 1): string {
  const sign = n > 0 ? '+' : n < 0 ? '−' : '';
  return `${sign}${Math.abs(n).toFixed(digits)}%`;
}

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

/** "Oct 2026" — short label for comp dates and chart axes. */
export function formatMonthYear(isoDate: string): string {
  const d = new Date(isoDate + 'T12:00:00');
  return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/** "Oct 16, 2026" — full label for "as of" stamps. */
export function formatFullDate(isoDate: string): string {
  const d = new Date(isoDate + 'T12:00:00');
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

/** "Today" for the mock data's as-of date. */
export const MOCK_AS_OF_ISO = '2026-10-16';
export const MOCK_AS_OF_LABEL = 'Oct 16, 2026';
