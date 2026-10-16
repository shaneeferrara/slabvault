/**
 * Counterfeit telltales — seed data for the Phase 5 "fake warnings" feature.
 *
 * On the card detail screen, commonly-faked cards will show these known
 * telltales so collectors know what to check before buying raw.
 *
 * IMPORTANT: these are educational summaries of widely-known hobby checks,
 * not authentication advice. When in doubt, buy the card already graded by
 * PSA/BGS/SGC/CGC ("buy the slab, not the card"). Nothing here replaces a
 * professional authenticator.
 *
 * Phase 5 work: render `getTelltales(cardId)` as a warning panel on
 * app/card/[id].tsx for cards that have an entry here.
 */

export type FakeRisk = 'high' | 'very-high';

export interface CounterfeitTelltale {
  /** Matches the catalog id in src/data/catalog.ts. */
  cardId: string;
  riskLevel: FakeRisk;
  /** One-line summary of why this card is faked. */
  summary: string;
  /** Concrete things to check, in plain English. */
  telltales: string[];
  /** The safest way to buy this card. */
  advice: string;
}

export const COUNTERFEIT_TELLTALES: CounterfeitTelltale[] = [
  {
    cardId: 'jordan-1986-fleer-57',
    riskLevel: 'very-high',
    summary: 'The most counterfeited sports card in the hobby. Fakes range from obvious reprints to deceptive high-end copies.',
    telltales: [
      'Real Fleer stock is NOT glossy — fakes are often shiny or too thick.',
      'Check print registration under magnification: real cards have a clean rosette dot pattern; fakes look muddy or pixelated.',
      'The red border should be a deep, even red — fakes often print orange-ish or uneven.',
      'Back text should be sharp with correct stat lines; fakes frequently misalign the stats table.',
    ],
    advice: 'Buy graded only. A raw Jordan rookie at a "great price" is the classic trap.',
  },
  {
    cardId: 'gretzky-1979-opc-18',
    riskLevel: 'very-high',
    summary: 'O-Pee-Chee\'s rough-cut blue edges are the whole authentication story — and the first thing fakers get wrong.',
    telltales: [
      'Real OPC Gretzky rookies have rough, fuzzy blue edges from the wire cut. Clean white sharp edges = reprint.',
      'The blue ink on the edges should look soaked into the stock, not printed on top.',
      'Centering is famously bad on real copies — a "perfect" raw copy deserves extra suspicion, not a premium.',
    ],
    advice: 'Buy graded. The edge test is hard to judge from photos, so insist on the slab.',
  },
  {
    cardId: 'mantle-1952-topps-311',
    riskLevel: 'very-high',
    summary: 'Reprints have circulated for decades; some are even marked as reprints in tiny type.',
    telltales: [
      'Real 1952 Topps stock is thick with a slight cream tone — modern reprint stock is bright white and flimsy or overly glossy.',
      'Check the back: real printing is letterpress-crisp; fakes show modern offset dots.',
      'Any "NM" raw Mantle at a fraction of market price is a reprint. Full stop.',
    ],
    advice: 'Buy graded, and only from established auction houses or dealers for this card.',
  },
  {
    cardId: 'brady-2000-contenders-144',
    riskLevel: 'very-high',
    summary: 'The autograph is the target — forged Brady autos on real or reprinted tickets both circulate.',
    telltales: [
      'Study certified Brady exemplars first: his "T" and "B" letterforms are consistent; forgeries wobble on the loops.',
      'The Championship Ticket should have a genuine perforated stub edge — laser-cut "perforations" look too uniform.',
      'Check the serial numbering: stamped numbers should be slightly impressed into the stock, not flat-printed.',
    ],
    advice: 'Buy graded AND authenticated (PSA/DNA or Beckett) — both the card and the auto.',
  },
  {
    cardId: 'charizard-1999-base-4-1st',
    riskLevel: 'very-high',
    summary: 'The 1st Edition stamp is the most faked element in Pokémon — stamps are added to unlimited copies.',
    telltales: [
      'Real 1st Edition stamps are cleanly inked with a specific font; fakes look blobby, too bold, or slightly off-center.',
      'Do the light test: real WOTC cards let a little light through and show a dark blue core layer at the edge.',
      'Holo pattern should be the original "cosmos" starburst — modern reprint holos look like generic rainbow foil.',
    ],
    advice: 'Buy graded. The stamp is nearly impossible to verify from a single photo.',
  },
  {
    cardId: 'charizard-1999-base-4',
    riskLevel: 'high',
    summary: 'Even the unlimited Base Set Charizard is faked outright, not just re-stamped.',
    telltales: [
      'Light test and blue core layer, same as 1st Edition.',
      'Real cards have saturated, slightly dark print; fakes print washed-out or oversaturated.',
      'Energy symbols and text should be razor sharp — blurry text is the fastest fake tell in Pokémon.',
    ],
    advice: 'For anything over a few hundred dollars raw, buy graded.',
  },
  {
    cardId: 'griffey-1989-upper-deck-1',
    riskLevel: 'high',
    summary: 'Counterfeits usually fail on the back hologram — the part fakers skip or botch.',
    telltales: [
      'The real card has an Upper Deck hologram on the back; most fakes have none, or a flat printed imitation.',
      'Real holograms shift and show depth when tilted; printed fakes stay static.',
      'Card stock should feel premium and slightly rigid — thin, floppy stock is a red flag.',
    ],
    advice: 'Check the hologram in person or buy graded.',
  },
  {
    cardId: 'bird-magic-1980-topps-6',
    riskLevel: 'high',
    summary: 'Issued in perforated sheets, so edge texture is the authentication check.',
    telltales: [
      'Real copies show tiny perforation nubs along the edges from the sheet separation.',
      'Perfectly smooth, razor-cut edges on a raw copy = likely trimmed or reprint.',
      'Print dots under magnification should match 1980 Topps offset printing, not modern digital.',
    ],
    advice: 'Buy graded if the price is significant; otherwise check edges in hand first.',
  },
];

/** Telltales for a card, or undefined if the card isn't a known fake target. */
export function getTelltales(cardId: string): CounterfeitTelltale | undefined {
  return COUNTERFEIT_TELLTALES.find((t) => t.cardId === cardId);
}
