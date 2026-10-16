/**
 * Sample catalog — 38 real, famous cards across baseball, basketball,
 * football, hockey, soccer, and Pokémon TCG. Every screen in Phase 1 runs on this data.
 *
 * PRICING NOTE: the `basePrices` below are plausible mock medians (Oct 2026)
 * used to seed the MockPriceProvider. They are NOT live market data.
 * Real providers (Phase 5) will replace these entirely.
 */

import type { CardRecord, GradeLabel } from './types';

export const CATALOG: CardRecord[] = [
  // ------------------------------- BASEBALL -------------------------------
  {
    id: 'mantle-1952-topps-311', player: 'Mickey Mantle', team: 'New York Yankees',
    year: 1952, brand: 'Topps', set: '1952 Topps', number: '311', variant: 'Base',
    serialNumbered: false, rookie: false, auto: false, memorabilia: false,
    category: 'baseball', teamColors: ['#0C2340', '#C4CED4'], lowLiquidity: true,
  },
  {
    id: 'trout-2011-topps-update-us175', player: 'Mike Trout', team: 'Los Angeles Angels',
    year: 2011, brand: 'Topps', set: 'Topps Update', number: 'US175', variant: 'Base',
    serialNumbered: false, rookie: true, auto: false, memorabilia: false,
    category: 'baseball', teamColors: ['#BA0021', '#862633'],
  },
  {
    id: 'griffey-1989-upper-deck-1', player: 'Ken Griffey Jr.', team: 'Seattle Mariners',
    year: 1989, brand: 'Upper Deck', set: 'Upper Deck', number: '1', variant: 'Base',
    serialNumbered: false, rookie: true, auto: false, memorabilia: false,
    category: 'baseball', teamColors: ['#0C2C56', '#005C5C'],
  },
  {
    id: 'ohtani-2018-topps-chrome-150', player: 'Shohei Ohtani', team: 'Los Angeles Angels',
    year: 2018, brand: 'Topps', set: 'Topps Chrome', number: '150', variant: 'Base',
    serialNumbered: false, rookie: true, auto: false, memorabilia: false,
    category: 'baseball', teamColors: ['#BA0021', '#862633'],
  },
  {
    id: 'judge-2017-topps-chrome-169', player: 'Aaron Judge', team: 'New York Yankees',
    year: 2017, brand: 'Topps', set: 'Topps Chrome', number: '169', variant: 'Base',
    serialNumbered: false, rookie: true, auto: false, memorabilia: false,
    category: 'baseball', teamColors: ['#0C2340', '#C4CED4'],
  },
  {
    id: 'ruth-1933-goudey-53', player: 'Babe Ruth', team: 'New York Yankees',
    year: 1933, brand: 'Goudey', set: 'Goudey', number: '53', variant: 'Base',
    serialNumbered: false, rookie: false, auto: false, memorabilia: false,
    category: 'baseball', teamColors: ['#0C2340', '#C4CED4'], lowLiquidity: true,
  },
  {
    id: 'jeter-1993-sp-279', player: 'Derek Jeter', team: 'New York Yankees',
    year: 1993, brand: 'Upper Deck', set: 'SP', number: '279', variant: 'Foil',
    serialNumbered: false, rookie: true, auto: false, memorabilia: false,
    category: 'baseball', teamColors: ['#0C2340', '#C4CED4'],
  },
  {
    id: 'ripken-1982-topps-21', player: 'Cal Ripken Jr.', team: 'Baltimore Orioles',
    year: 1982, brand: 'Topps', set: 'Topps', number: '21', variant: 'Base',
    serialNumbered: false, rookie: true, auto: false, memorabilia: false,
    category: 'baseball', teamColors: ['#DF4601', '#000000'],
  },
  // ------------------------------ BASKETBALL ------------------------------
  {
    id: 'jordan-1986-fleer-57', player: 'Michael Jordan', team: 'Chicago Bulls',
    year: 1986, brand: 'Fleer', set: 'Fleer', number: '57', variant: 'Base',
    serialNumbered: false, rookie: true, auto: false, memorabilia: false,
    category: 'basketball', teamColors: ['#CE1141', '#000000'],
  },
  {
    id: 'doncic-2018-prizm-280', player: 'Luka Dončić', team: 'Dallas Mavericks',
    year: 2018, brand: 'Panini', set: 'Prizm', number: '280', variant: 'Silver Prizm',
    serialNumbered: false, rookie: true, auto: false, memorabilia: false,
    category: 'basketball', teamColors: ['#00538C', '#B8C4CA'],
  },
  {
    id: 'lebron-2003-topps-chrome-111', player: 'LeBron James', team: 'Cleveland Cavaliers',
    year: 2003, brand: 'Topps', set: 'Topps Chrome', number: '111', variant: 'Base',
    serialNumbered: false, rookie: true, auto: false, memorabilia: false,
    category: 'basketball', teamColors: ['#6F263D', '#FFB81C'],
  },
  {
    id: 'curry-2009-topps-chrome-101', player: 'Stephen Curry', team: 'Golden State Warriors',
    year: 2009, brand: 'Topps', set: 'Topps Chrome', number: '101', variant: 'Base',
    serialNumbered: false, rookie: true, auto: false, memorabilia: false,
    category: 'basketball', teamColors: ['#1D428A', '#FFC72C'],
  },
  {
    id: 'kobe-1996-topps-chrome-138', player: 'Kobe Bryant', team: 'Los Angeles Lakers',
    year: 1996, brand: 'Topps', set: 'Topps Chrome', number: '138', variant: 'Base',
    serialNumbered: false, rookie: true, auto: false, memorabilia: false,
    category: 'basketball', teamColors: ['#552583', '#FDB927'],
  },
  {
    id: 'wemby-2023-prizm-136', player: 'Victor Wembanyama', team: 'San Antonio Spurs',
    year: 2023, brand: 'Panini', set: 'Prizm', number: '136', variant: 'Silver Prizm',
    serialNumbered: false, rookie: true, auto: false, memorabilia: false,
    category: 'basketball', teamColors: ['#C4CED4', '#000000'],
  },
  {
    id: 'bird-magic-1980-topps-6', player: 'Larry Bird / Julius Erving / Magic Johnson',
    team: 'Celtics / 76ers / Lakers', year: 1980, brand: 'Topps', set: 'Topps',
    number: '6', variant: 'Base',
    serialNumbered: false, rookie: true, auto: false, memorabilia: false,
    category: 'basketball', teamColors: ['#007A33', '#552583'],
  },
  {
    id: 'jokic-2015-prizm-335', player: 'Nikola Jokić', team: 'Denver Nuggets',
    year: 2015, brand: 'Panini', set: 'Prizm', number: '335', variant: 'Silver Prizm',
    serialNumbered: false, rookie: true, auto: false, memorabilia: false,
    category: 'basketball', teamColors: ['#0E2240', '#FEC524'],
  },
  // ------------------------------- FOOTBALL -------------------------------
  {
    id: 'brady-2000-contenders-144', player: 'Tom Brady', team: 'New England Patriots',
    year: 2000, brand: 'Playoff', set: 'Contenders', number: '144',
    variant: 'Championship Ticket Auto /100', printRun: 100,
    serialNumbered: true, rookie: true, auto: true, memorabilia: false,
    category: 'football', teamColors: ['#002244', '#C60C30'], lowLiquidity: true,
  },
  {
    id: 'mahomes-2017-prizm-269', player: 'Patrick Mahomes', team: 'Kansas City Chiefs',
    year: 2017, brand: 'Panini', set: 'Prizm', number: '269', variant: 'Silver Prizm',
    serialNumbered: false, rookie: true, auto: false, memorabilia: false,
    category: 'football', teamColors: ['#E31837', '#FFB81C'],
  },
  {
    id: 'burrow-2020-prizm-145', player: 'Joe Burrow', team: 'Cincinnati Bengals',
    year: 2020, brand: 'Panini', set: 'Prizm', number: '145', variant: 'Silver Prizm',
    serialNumbered: false, rookie: true, auto: false, memorabilia: false,
    category: 'football', teamColors: ['#FB4F14', '#000000'],
  },
  {
    id: 'allen-2018-prizm-205', player: 'Josh Allen', team: 'Buffalo Bills',
    year: 2018, brand: 'Panini', set: 'Prizm', number: '205', variant: 'Silver Prizm',
    serialNumbered: false, rookie: true, auto: false, memorabilia: false,
    category: 'football', teamColors: ['#00338D', '#C60C30'],
  },
  {
    id: 'herbert-2020-prizm-325', player: 'Justin Herbert', team: 'Los Angeles Chargers',
    year: 2020, brand: 'Panini', set: 'Prizm', number: '325', variant: 'Silver Prizm',
    serialNumbered: false, rookie: true, auto: false, memorabilia: false,
    category: 'football', teamColors: ['#0080C6', '#FFC20E'],
  },
  {
    id: 'sanders-1989-score-257', player: 'Barry Sanders', team: 'Detroit Lions',
    year: 1989, brand: 'Score', set: 'Score', number: '257', variant: 'Base',
    serialNumbered: false, rookie: true, auto: false, memorabilia: false,
    category: 'football', teamColors: ['#0076B6', '#B0B7BC'],
  },
  // -------------------------------- HOCKEY -------------------------------
  {
    id: 'gretzky-1979-opc-18', player: 'Wayne Gretzky', team: 'Edmonton Oilers',
    year: 1979, brand: 'O-Pee-Chee', set: 'O-Pee-Chee', number: '18', variant: 'Base',
    serialNumbered: false, rookie: true, auto: false, memorabilia: false,
    category: 'hockey', teamColors: ['#FC4C02', '#003777'], lowLiquidity: true,
  },
  {
    id: 'mcdavid-2015-upper-deck-201', player: 'Connor McDavid', team: 'Edmonton Oilers',
    year: 2015, brand: 'Upper Deck', set: 'Upper Deck', number: '201', variant: 'Young Guns',
    serialNumbered: false, rookie: true, auto: false, memorabilia: false,
    category: 'hockey', teamColors: ['#FC4C02', '#003777'],
  },
  {
    id: 'crosby-2005-upper-deck-201', player: 'Sidney Crosby', team: 'Pittsburgh Penguins',
    year: 2005, brand: 'Upper Deck', set: 'Upper Deck', number: '201', variant: 'Young Guns',
    serialNumbered: false, rookie: true, auto: false, memorabilia: false,
    category: 'hockey', teamColors: ['#000000', '#FCB514'],
  },
  {
    id: 'bedard-2023-upper-deck-451', player: 'Connor Bedard', team: 'Chicago Blackhawks',
    year: 2023, brand: 'Upper Deck', set: 'Upper Deck', number: '451', variant: 'Young Guns',
    serialNumbered: false, rookie: true, auto: false, memorabilia: false,
    category: 'hockey', teamColors: ['#CF0A2C', '#000000'],
  },
  // -------------------------------- SOCCER -------------------------------
  {
    id: 'pele-1958-alifabolaget-635', player: 'Pelé', team: 'Brazil',
    year: 1958, brand: 'Alifabolaget', set: 'Alifabolaget', number: '635', variant: 'Base',
    serialNumbered: false, rookie: true, auto: false, memorabilia: false,
    category: 'soccer', teamColors: ['#FFDF00', '#009C3B'], lowLiquidity: true,
  },
  {
    id: 'mbappe-2018-prizm-world-cup-80', player: 'Kylian Mbappé', team: 'France',
    year: 2018, brand: 'Panini', set: 'Prizm World Cup', number: '80', variant: 'Base',
    serialNumbered: false, rookie: false, auto: false, memorabilia: false,
    category: 'soccer', teamColors: ['#0055A4', '#EF4135'],
  },
  {
    id: 'haaland-2019-topps-chrome-74', player: 'Erling Haaland', team: 'Borussia Dortmund',
    year: 2019, brand: 'Topps', set: 'Topps Chrome UCL', number: '74', variant: 'Base',
    serialNumbered: false, rookie: true, auto: false, memorabilia: false,
    category: 'soccer', teamColors: ['#FDE100', '#000000'],
  },
  {
    id: 'messi-2004-megacracks-71', player: 'Lionel Messi', team: 'FC Barcelona',
    year: 2004, brand: 'Panini', set: 'Mega Cracks', number: '71', variant: 'Sticker',
    serialNumbered: false, rookie: true, auto: false, memorabilia: false,
    category: 'soccer', teamColors: ['#A50044', '#004D98'],
  },
  // ------------------------------- POKÉMON TCG -------------------------------
  {
    id: 'charizard-1999-base-4-1st', player: 'Charizard', team: 'Pokémon TCG',
    year: 1999, brand: 'Wizards of the Coast', set: 'Base Set', number: '4',
    variant: '1st Edition Holo',
    serialNumbered: false, rookie: false, auto: false, memorabilia: false,
    category: 'tcg', teamColors: ['#EE8130', '#B3401E'], lowLiquidity: true,
  },
  {
    id: 'charizard-1999-base-4', player: 'Charizard', team: 'Pokémon TCG',
    year: 1999, brand: 'Wizards of the Coast', set: 'Base Set', number: '4',
    variant: 'Holo',
    serialNumbered: false, rookie: false, auto: false, memorabilia: false,
    category: 'tcg', teamColors: ['#EE8130', '#B3401E'],
  },
  {
    id: 'blastoise-1999-base-2', player: 'Blastoise', team: 'Pokémon TCG',
    year: 1999, brand: 'Wizards of the Coast', set: 'Base Set', number: '2',
    variant: 'Holo',
    serialNumbered: false, rookie: false, auto: false, memorabilia: false,
    category: 'tcg', teamColors: ['#6890F0', '#2C4E9E'],
  },
  {
    id: 'venusaur-1999-base-15', player: 'Venusaur', team: 'Pokémon TCG',
    year: 1999, brand: 'Wizards of the Coast', set: 'Base Set', number: '15',
    variant: 'Holo',
    serialNumbered: false, rookie: false, auto: false, memorabilia: false,
    category: 'tcg', teamColors: ['#78C850', '#3E7A2E'],
  },
  {
    id: 'pikachu-1999-base-58', player: 'Pikachu', team: 'Pokémon TCG',
    year: 1999, brand: 'Wizards of the Coast', set: 'Base Set', number: '58',
    variant: 'Non-Holo',
    serialNumbered: false, rookie: false, auto: false, memorabilia: false,
    category: 'tcg', teamColors: ['#F8D030', '#A68A1B'],
  },
  {
    id: 'lugia-2000-neo-genesis-9', player: 'Lugia', team: 'Pokémon TCG',
    year: 2000, brand: 'Wizards of the Coast', set: 'Neo Genesis', number: '9',
    variant: 'Holo',
    serialNumbered: false, rookie: false, auto: false, memorabilia: false,
    category: 'tcg', teamColors: ['#B8C4D0', '#5B7A99'],
  },
  {
    id: 'umbreon-2001-neo-discovery-13', player: 'Umbreon', team: 'Pokémon TCG',
    year: 2001, brand: 'Wizards of the Coast', set: 'Neo Discovery', number: '13',
    variant: 'Holo',
    serialNumbered: false, rookie: false, auto: false, memorabilia: false,
    category: 'tcg', teamColors: ['#3B3B4D', '#C9A227'],
  },
  {
    id: 'umbreon-vmax-2021-evolving-skies-215', player: 'Umbreon VMAX', team: 'Pokémon TCG',
    year: 2021, brand: 'Pokémon', set: 'Evolving Skies', number: '215',
    variant: 'Alternate Art',
    serialNumbered: false, rookie: false, auto: false, memorabilia: false,
    category: 'tcg', teamColors: ['#2B2B3A', '#E8B64C'],
  },
];

/**
 * Plausible mock median values (USD, Oct 2026) per card per grade.
 * Used by MockPriceProvider to derive comps, trends, and ranges.
 * Order: Raw, PSA 8, PSA 9, PSA 10, BGS 9, BGS 9.5, BGS 10, SGC 9, SGC 10.
 */
const PRICE_ROWS: Array<[string, number[]]> = [
  ['mantle-1952-topps-311', [120000, 950000, 4200000, 12600000, 800000, 2600000, 7500000, 750000, 3200000]],
  ['trout-2011-topps-update-us175', [150, 280, 520, 1050, 480, 880, 1750, 450, 950]],
  ['griffey-1989-upper-deck-1', [45, 85, 170, 430, 150, 330, 680, 140, 360]],
  ['ohtani-2018-topps-chrome-150', [60, 120, 240, 640, 210, 520, 1100, 200, 560]],
  ['judge-2017-topps-chrome-169', [40, 80, 150, 380, 135, 300, 620, 130, 340]],
  ['ruth-1933-goudey-53', [22000, 175000, 850000, 2800000, 150000, 600000, 1800000, 140000, 700000]],
  ['jeter-1993-sp-279', [350, 850, 2400, 17500, 2000, 9000, 28000, 1800, 12000]],
  ['ripken-1982-topps-21', [25, 50, 100, 290, 90, 220, 480, 85, 250]],
  ['jordan-1986-fleer-57', [3200, 9500, 29000, 264000, 25000, 95000, 480000, 21000, 190000]],
  ['doncic-2018-prizm-280', [180, 350, 850, 3100, 750, 2400, 5200, 700, 2600]],
  ['lebron-2003-topps-chrome-111', [450, 900, 1900, 6800, 1700, 5200, 12000, 1600, 5800]],
  ['curry-2009-topps-chrome-101', [300, 600, 1300, 4300, 1150, 3400, 7800, 1100, 3700]],
  ['kobe-1996-topps-chrome-138', [280, 550, 1200, 3900, 1050, 3000, 7000, 1000, 3400]],
  ['wemby-2023-prizm-136', [120, 220, 480, 1350, 420, 1050, 2300, 400, 1150]],
  ['bird-magic-1980-topps-6', [400, 900, 2200, 11500, 1900, 7500, 22000, 1750, 9000]],
  ['jokic-2015-prizm-335', [60, 120, 280, 900, 250, 700, 1500, 240, 780]],
  ['brady-2000-contenders-144', [900000, 1200000, 1800000, 3400000, 2200000, 2800000, 4200000, 1600000, 2600000]],
  ['mahomes-2017-prizm-269', [250, 480, 1050, 2800, 950, 2200, 4600, 900, 2400]],
  ['burrow-2020-prizm-145', [90, 170, 360, 850, 320, 680, 1400, 300, 740]],
  ['allen-2018-prizm-205', [110, 210, 450, 1100, 400, 880, 1800, 380, 950]],
  ['herbert-2020-prizm-325', [70, 130, 280, 620, 250, 500, 1000, 240, 540]],
  ['sanders-1989-score-257', [30, 60, 130, 400, 115, 300, 650, 110, 340]],
  ['gretzky-1979-opc-18', [25000, 62000, 350000, 1500000, 300000, 900000, 2200000, 280000, 1100000]],
  ['mcdavid-2015-upper-deck-201', [180, 340, 750, 2200, 680, 1700, 3600, 640, 1900]],
  ['crosby-2005-upper-deck-201', [150, 280, 620, 1800, 560, 1400, 3000, 530, 1550]],
  ['bedard-2023-upper-deck-451', [90, 170, 380, 950, 340, 760, 1600, 320, 820]],
  ['pele-1958-alifabolaget-635', [8000, 45000, 200000, 900000, 180000, 550000, 1200000, 170000, 700000]],
  ['mbappe-2018-prizm-world-cup-80', [40, 80, 170, 500, 150, 380, 800, 145, 430]],
  ['haaland-2019-topps-chrome-74', [35, 70, 150, 420, 135, 330, 700, 130, 360]],
  ['messi-2004-megacracks-71', [900, 2200, 6000, 25000, 5200, 16000, 42000, 4800, 20000]],
  ['charizard-1999-base-4-1st', [8000, 25000, 90000, 420000, 80000, 220000, 600000, 75000, 350000]],
  ['charizard-1999-base-4', [350, 900, 2800, 11000, 2400, 6000, 18000, 2200, 8000]],
  ['blastoise-1999-base-2', [120, 300, 900, 3800, 800, 2200, 6000, 750, 3000]],
  ['venusaur-1999-base-15', [100, 260, 800, 3200, 700, 1900, 5200, 650, 2600]],
  ['pikachu-1999-base-58', [25, 60, 180, 900, 160, 450, 1200, 150, 700]],
  ['lugia-2000-neo-genesis-9', [150, 400, 1200, 6500, 1100, 3200, 9000, 1000, 5200]],
  ['umbreon-2001-neo-discovery-13', [90, 240, 750, 2800, 680, 1800, 4800, 620, 2300]],
  ['umbreon-vmax-2021-evolving-skies-215', [400, 700, 1100, 1800, 1000, 1500, 2600, 950, 1600]],
];

export const BASE_PRICES: Record<string, Record<GradeLabel, number>> = Object.fromEntries(
  PRICE_ROWS.map(([id, prices]) => {
    const sgc9 = prices[7] as number;
    const sgc10 = prices[8] as number;
    // CGC values are a rough mock approximation off SGC (documented as such).
    // Real CGC data arrives with the Phase 5 providers.
    const base = {
      Raw: prices[0],
      'PSA 8': prices[1],
      'PSA 9': prices[2],
      'PSA 10': prices[3],
      'BGS 9': prices[4],
      'BGS 9.5': prices[5],
      'BGS 10': prices[6],
      'SGC 9': sgc9,
      'SGC 10': sgc10,
      'CGC 9': Math.round(sgc9 * 0.95),
      'CGC 9.5': Math.round(sgc10 * 0.8),
      'CGC 10': Math.round(sgc10 * 0.92),
    } as Record<GradeLabel, number>;
    return [id, base];
  }),
);

export function getCardById(id: string): CardRecord | undefined {
  return CATALOG.find((c) => c.id === id);
}

/**
 * Manual search fallback: match a free-text query against player, team,
 * year, brand, set, and card number. Case-insensitive, all words must match.
 */
export function searchCatalog(query: string): CardRecord[] {
  const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return CATALOG;
  return CATALOG.filter((card) => {
    const haystack =
      `${card.player} ${card.team} ${card.year} ${card.brand} ${card.set} ${card.number} ${card.variant} ${card.category}`.toLowerCase();
    return words.every((w) => haystack.includes(w));
  });
}

export const CATEGORY_LABELS: Record<CardRecord['category'], string> = {
  baseball: 'Baseball',
  basketball: 'Basketball',
  football: 'Football',
  hockey: 'Hockey',
  soccer: 'Soccer',
  tcg: 'Pokémon TCG',
};
