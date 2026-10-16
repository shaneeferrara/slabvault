# SlabVault (working name)

**Point your camera at a sports card → see what it is, what it's worth, and whether it's going up or down → add it to your collection in one tap.**

SlabVault is a mobile-first app for sports card collectors (and Pokémon TCG collectors). This is **Phase 1**: the foundation — design, sample catalog, sample pricing, collection manager, and dashboard. The camera scanning arrives in Phase 2.

---

## Seeing it on your phone (2 minutes, free)

1. On your phone, install the free **Expo Go** app (App Store on iPhone, Play Store on Android).
2. On your computer, open a terminal in this folder and run:
   ```
   npx expo start
   ```
3. A QR code appears in the terminal. Scan it with your phone's camera (iPhone) or inside the Expo Go app (Android).
4. SlabVault opens on your phone. That's it — no app store, no build step.

## Opening it in a browser instead

```
npx expo start --web
```

Your browser opens with the app running. The phone layout appears as a mobile-sized app.

## What you can do in Phase 1

- **Dashboard** — total portfolio value, what you paid (cost basis), gain/loss, top movers, biggest holdings, a 12-month value chart, and breakdowns by category and grader.
- **Collection** — make unlimited collections ("Jordan PC", "For Sale"), add cards, edit purchase price / grade / notes / storage location, delete cards or whole collections.
- **Scan** — camera scanning arrives in Phase 2, but the manual "add a card" flow works fully today: search 38 famous cards, pick a grade, log what you paid.
- **Card detail** — tap any card for stylized card art (flip it over, tap to zoom), raw vs. graded values side by side, recent sold comps with source + date on every figure, and a 90-day trend chart.
- **Settings** — the legal/disclaimer screen (estimates aren't financial advice), privacy notes, and a demo-data reset button.

The app ships with **3 sample cards** in your collection so every screen has something to show. Delete them and add your own whenever you like.

## Where API keys will go (later — nothing needed now)

Phase 1 needs **zero accounts and zero keys** — all pricing is built-in sample data.

When real market data arrives (Phase 5), keys go in a **`.env` file** in this folder — never pasted into code. It looks like this:

```
# Example — do not commit this file to GitHub
EBAY_APP_KEY=your-key-here
```

The app reads it at startup; the keys never ship inside the app's code.

## Folder map

```
slabvault/
├── app/                      # Screens (Expo Router — the file IS the route)
│   ├── _layout.tsx           # Root: providers + navigation shell
│   ├── (tabs)/
│   │   ├── _layout.tsx       # Bottom tab bar: Dashboard, Collection, Scan, Settings
│   │   ├── index.tsx         # Dashboard
│   │   ├── collection.tsx    # Collection manager
│   │   ├── scan.tsx          # Phase 2 teaser + manual add entry
│   │   └── settings.tsx      # Settings + legal links
│   ├── card/[id].tsx         # Card detail (values, comps, trends)
│   ├── add-card.tsx          # Add / edit a collection item
│   └── legal.tsx             # Disclaimers
├── src/
│   ├── theme/tokens.ts       # Design system: colors, spacing, type, radii
│   ├── components/           # Reusable UI (buttons, cards, charts, states)
│   ├── data/
│   │   ├── types.ts          # The data model (Card, CollectionItem, …)
│   │   ├── catalog.ts        # The 38-card sample catalog + search
│   │   └── counterfeit-telltales.ts  # Known fake telltales (shown in Phase 5)
│   ├── pricing/
│   │   ├── PriceProvider.ts  # THE interface — real data plugs in here later
│   │   ├── MockPriceProvider.ts  # Sample pricing (works offline, no keys)
│   │   ├── valuation.ts      # Math: median, ranges, confidence, trends
│   │   └── index.ts          # One-line swap point for real providers
│   └── store/
│       ├── repository.ts     # THE storage interface (Supabase plugs in here)
│       └── collectionStore.ts# App state (Zustand)
├── supabase/
│   ├── schema.sql            # Full database schema with private-by-default RLS
│   └── seed.sql              # The 38-card catalog as seed data
├── __tests__/
│   └── valuation.test.ts     # Unit tests: `npm test`
└── README.md                 # This file
```

## What's Phase 1 vs. what's next

| Phase | What's in it | Status |
|---|---|---|
| 1 | Scaffold, design system, 38-card catalog, mock pricing, collection CRUD, dashboard | ✅ Done |
| 2 | Camera scan, card identification, batch mode, slab OCR | Next |
| 3 | Valuation screens, grading calculator, full comps explorer | Planned |
| 4 | Wantlist + alerts, set checklists, binder view, **trade mode** (two-sided trade builder — values both sides live, shows who wins the trade) | Planned |
| 5 | Real data: eBay sold comps, grader cert lookup, Supabase sync, **counterfeit/fake warnings** (known telltales on the card detail screen for commonly-faked cards) | Planned |
| 6 | Sharing, insurance PDF, CSV import/export, achievements, **kid mode** (simplified view — big card art, fun player facts, no dollar values) | Planned |
| 7 | Testing, polish, store readiness | Planned |

### Backlog (not committed — ideas for after v1)

- **Grade-everything portfolio report** — what your whole collection would be worth at each grade, to spot grading candidates.
- **Dupe detector** — flags when you own the same card twice across collections.
- **Exist-vs-for-sale scarcity signal** — compares how many copies exist (population reports) against how many are actually listed for sale.
- **Family handoff report** — a clean "what this collection is and what it's worth" document for your family, in case anything ever happens to you.

## Decisions I made for you

Small calls I made solo so you don't have to think about them (big ones I'll always bring to you):

1. **Stack: Expo (React Native) + TypeScript.** One codebase runs on Android, iPhone, and the web. You already use Expo Go, and it matches how your other projects are built.
2. **Navigation: Expo Router with bottom tabs** — Dashboard, Collection, Scan, Settings. Big thumb-friendly targets (48px minimum everywhere), one-handed use at a card show.
3. **Design: dark premium theme** — near-black `#0E0F13`, gold accent `#E8B64C`, green/red for gains/losses tuned for contrast on dark screens.
4. **Card art is stylized, not photos.** Every card face is original art rendered in code (team colors + typography). No copied card images, no league logos — this keeps us clear of trademark trouble.
5. **Pricing starts as built-in sample data** behind a `PriceProvider` interface. Swapping in real data later = changing one line, not rebuilding screens. Same pattern for storage: local now, Supabase later, behind a repository interface.
6. **Every number shows its source and date.** If a figure can't name where it came from, it doesn't ship. Values are always labeled "Estimated value, not a guarantee."
7. **Your collection is private and on your device** in Phase 1 — nothing uploads anywhere. The database schema is ready with "private by default" rules for when sync arrives.

**Your locked decisions (Oct 16, 2026) — these stand unless you change them:**
- **Android-first.** Demos and testing default to your Android phone.
- **Free app, no paid tier in v1.** No paywalls, no subscriptions to build.
- **Phase 5 pricing = free eBay sold comps.** No paid pricing feed in v1; we'll use eBay's free sold-listings data and keep every value sourced + dated.
- **Offline = sync-when-signal is fine.** Your collection stays viewable offline and syncs when you're back online; full offline-first is not a v1 requirement.
- **Pokémon TCG is in scope for v1** as a sixth category alongside the five sports — 8 iconic cards ship in the sample catalog (Base Set Charizard incl. 1st Edition, Blastoise, Venusaur, Pikachu, Neo Genesis Lugia, Neo Discovery Umbreon, Evolving Skies Umbreon VMAX), with PSA/BGS/SGC/CGC grades.

## For developers (commands)

```
npm install          # install dependencies
npx expo start       # run on phone via Expo Go / browser
npx expo start --web # browser only
npm test             # unit tests (must pass)
npx tsc --noEmit     # type check (must be clean)
npx expo export --platform web   # static web build (for the demo link)
```
