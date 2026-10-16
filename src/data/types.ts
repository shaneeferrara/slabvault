/**
 * SlabVault core data model (Phase 1).
 * These TypeScript types mirror the Supabase schema in /supabase/schema.sql.
 * Keep them in sync when the schema changes.
 */

export type Category =
  | 'baseball'
  | 'basketball'
  | 'football'
  | 'hockey'
  | 'soccer'
  | 'tcg';

export type GradeCompany = 'PSA' | 'BGS' | 'SGC' | 'CGC' | 'RAW';

/** Every grade the app can display a value for. 'Raw' = ungraded. */
export type GradeLabel =
  | 'Raw'
  | 'PSA 8'
  | 'PSA 9'
  | 'PSA 10'
  | 'BGS 9'
  | 'BGS 9.5'
  | 'BGS 10'
  | 'SGC 9'
  | 'SGC 10'
  | 'CGC 9'
  | 'CGC 9.5'
  | 'CGC 10';

export const GRADE_LABELS: GradeLabel[] = [
  'Raw',
  'PSA 8',
  'PSA 9',
  'PSA 10',
  'BGS 9',
  'BGS 9.5',
  'BGS 10',
  'SGC 9',
  'SGC 10',
  'CGC 9',
  'CGC 9.5',
  'CGC 10',
];

/** Extract the grading company from a grade label ('PSA 10' → 'PSA', 'Raw' → 'RAW'). */
export function companyOf(label: GradeLabel): GradeCompany {
  if (label === 'Raw') return 'RAW';
  return label.split(' ')[0] as GradeCompany;
}

/** A card in the catalog — the "what is it" (never user-specific). */
export interface CardRecord {
  id: string;
  player: string;
  team: string;
  year: number;
  brand: string;
  set: string;
  number: string;
  /** e.g. 'Base', 'Silver Prizm', 'Championship Ticket Auto /100' */
  variant: string;
  /** Print run for serial-numbered cards, e.g. 100 for "/100". */
  printRun?: number;
  serialNumbered: boolean;
  rookie: boolean;
  auto: boolean;
  memorabilia: boolean;
  category: Category;
  /** [primary, secondary] hex colors used for the stylized card art. */
  teamColors: [string, string];
  /** True for ultra-low-volume cards where comps are scarce. */
  lowLiquidity?: boolean;
}

/** A user-owned copy of a card — the "what I have and what I paid". */
export interface CollectionItem {
  id: string;
  collectionId: string;
  cardId: string;
  gradeLabel: GradeLabel;
  certNumber?: string;
  purchasePrice?: number;
  acquiredDate?: string; // ISO date
  source?: string; // where it was bought: "eBay", "card show", ...
  condition?: string; // for raw cards: "Near Mint", "Excellent", ...
  storageLocation?: string; // e.g. "Safe — top shelf"
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Collection {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface NewCollectionItem {
  collectionId: string;
  cardId: string;
  gradeLabel: GradeLabel;
  certNumber?: string;
  purchasePrice?: number;
  acquiredDate?: string;
  source?: string;
  condition?: string;
  storageLocation?: string;
  notes?: string;
}

/** One verified SOLD listing used to build a value. */
export interface SaleComp {
  id: string;
  cardId: string;
  gradeLabel: GradeLabel;
  price: number;
  /** ISO date of the sale. */
  date: string;
  platform: 'eBay' | 'PWCC' | 'Goldin' | 'Fanatics Collect' | 'MySlabs';
  url: string;
  /** Set when the sale looks like an outlier or possible shill bid. */
  flagged?: string;
}

export type Confidence = 'low' | 'medium' | 'high';

/** Aggregated value for one card at one grade. */
export interface GradeValue {
  gradeLabel: GradeLabel;
  median: number;
  low: number;
  high: number;
  /** Number of sold comps behind these numbers. */
  volume: number;
  confidence: Confidence;
  /** 30 daily-ish points, oldest → newest. */
  trend30: number[];
  /** 30 points covering ~90 days, oldest → newest. */
  trend90: number[];
  /** 12 monthly points covering ~365 days, oldest → newest. */
  trend365: number[];
}

/** Everything the app knows about what a card is worth. */
export interface CardValuation {
  cardId: string;
  raw: GradeValue;
  graded: GradeValue[];
  comps: SaleComp[];
  /** Human-readable date, e.g. "Oct 16, 2026". */
  asOf: string;
  /** Where the numbers came from, e.g. "SlabVault mock data". */
  source: string;
}

// ---- Phase 2+ models (declared now so the schema + types stay aligned) ----

export interface WantlistItem {
  id: string;
  cardId: string;
  gradeLabel: GradeLabel;
  targetPrice?: number;
  createdAt: string;
}

export interface PriceAlert {
  id: string;
  cardId: string;
  gradeLabel: GradeLabel;
  kind: 'price-drop' | 'price-spike' | 'new-comp' | 'population-change';
  threshold?: number;
  createdAt: string;
}
