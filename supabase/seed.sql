-- ============================================================================
-- SlabVault — seed data: the 38-card sample catalog.
-- Run AFTER supabase/schema.sql in the Supabase SQL editor.
-- Players/cards/market data are public-read reference data (see schema RLS).
-- ============================================================================

-- Grading companies
insert into grade_companies (code, name) values
  ('PSA', 'Professional Sports Authenticator'),
  ('BGS', 'Beckett Grading Services'),
  ('SGC', 'Sportscard Guaranty Corporation'),
  ('CGC', 'Certified Guaranty Company')
on conflict (code) do nothing;

-- Players (one row per player; the two Charizard cards share a player)
insert into players (name, category) values
  ('Mickey Mantle', 'baseball'),
  ('Mike Trout', 'baseball'),
  ('Ken Griffey Jr.', 'baseball'),
  ('Shohei Ohtani', 'baseball'),
  ('Aaron Judge', 'baseball'),
  ('Babe Ruth', 'baseball'),
  ('Derek Jeter', 'baseball'),
  ('Cal Ripken Jr.', 'baseball'),
  ('Michael Jordan', 'basketball'),
  ('Luka Dončić', 'basketball'),
  ('LeBron James', 'basketball'),
  ('Stephen Curry', 'basketball'),
  ('Kobe Bryant', 'basketball'),
  ('Victor Wembanyama', 'basketball'),
  ('Larry Bird / Julius Erving / Magic Johnson', 'basketball'),
  ('Nikola Jokić', 'basketball'),
  ('Tom Brady', 'football'),
  ('Patrick Mahomes', 'football'),
  ('Joe Burrow', 'football'),
  ('Josh Allen', 'football'),
  ('Justin Herbert', 'football'),
  ('Barry Sanders', 'football'),
  ('Wayne Gretzky', 'hockey'),
  ('Connor McDavid', 'hockey'),
  ('Sidney Crosby', 'hockey'),
  ('Connor Bedard', 'hockey'),
  ('Pelé', 'soccer'),
  ('Kylian Mbappé', 'soccer'),
  ('Erling Haaland', 'soccer'),
  ('Lionel Messi', 'soccer'),
  ('Charizard', 'tcg'),
  ('Blastoise', 'tcg'),
  ('Venusaur', 'tcg'),
  ('Pikachu', 'tcg'),
  ('Lugia', 'tcg'),
  ('Umbreon', 'tcg'),
  ('Umbreon VMAX', 'tcg')
on conflict (name) do nothing;

-- Cards: one row per catalog entry, joined to players by name.
-- Columns: player_name, slug, team, year, brand, set_name, number, variant,
--           print_run, serial_numbered, rookie, auto, memorabilia, category, team_colors
insert into cards
  (player_id, slug, team, year, brand, set_name, number, variant,
   print_run, serial_numbered, rookie, auto, memorabilia, category, team_colors)
select
  p.id, v.slug, v.team, v.year, v.brand, v.set_name, v.number, v.variant,
  v.print_run, v.serial_numbered, v.rookie, v.auto, v.memorabilia, v.category, v.team_colors
from (values
  ('Mickey Mantle', 'mantle-1952-topps-311', 'New York Yankees', 1952, 'Topps', '1952 Topps', '311', 'Base', null, false, false, false, false, 'baseball', '{#0C2340,#C4CED4}'),
  ('Mike Trout', 'trout-2011-topps-update-us175', 'Los Angeles Angels', 2011, 'Topps', 'Topps Update', 'US175', 'Base', null, false, true, false, false, 'baseball', '{#BA0021,#862633}'),
  ('Ken Griffey Jr.', 'griffey-1989-upper-deck-1', 'Seattle Mariners', 1989, 'Upper Deck', 'Upper Deck', '1', 'Base', null, false, true, false, false, 'baseball', '{#0C2C56,#005C5C}'),
  ('Shohei Ohtani', 'ohtani-2018-topps-chrome-150', 'Los Angeles Angels', 2018, 'Topps', 'Topps Chrome', '150', 'Base', null, false, true, false, false, 'baseball', '{#BA0021,#862633}'),
  ('Aaron Judge', 'judge-2017-topps-chrome-169', 'New York Yankees', 2017, 'Topps', 'Topps Chrome', '169', 'Base', null, false, true, false, false, 'baseball', '{#0C2340,#C4CED4}'),
  ('Babe Ruth', 'ruth-1933-goudey-53', 'New York Yankees', 1933, 'Goudey', 'Goudey', '53', 'Base', null, false, false, false, false, 'baseball', '{#0C2340,#C4CED4}'),
  ('Derek Jeter', 'jeter-1993-sp-279', 'New York Yankees', 1993, 'Upper Deck', 'SP', '279', 'Foil', null, false, true, false, false, 'baseball', '{#0C2340,#C4CED4}'),
  ('Cal Ripken Jr.', 'ripken-1982-topps-21', 'Baltimore Orioles', 1982, 'Topps', 'Topps', '21', 'Base', null, false, true, false, false, 'baseball', '{#DF4601,#000000}'),
  ('Michael Jordan', 'jordan-1986-fleer-57', 'Chicago Bulls', 1986, 'Fleer', 'Fleer', '57', 'Base', null, false, true, false, false, 'basketball', '{#CE1141,#000000}'),
  ('Luka Dončić', 'doncic-2018-prizm-280', 'Dallas Mavericks', 2018, 'Panini', 'Prizm', '280', 'Silver Prizm', null, false, true, false, false, 'basketball', '{#00538C,#B8C4CA}'),
  ('LeBron James', 'lebron-2003-topps-chrome-111', 'Cleveland Cavaliers', 2003, 'Topps', 'Topps Chrome', '111', 'Base', null, false, true, false, false, 'basketball', '{#6F263D,#FFB81C}'),
  ('Stephen Curry', 'curry-2009-topps-chrome-101', 'Golden State Warriors', 2009, 'Topps', 'Topps Chrome', '101', 'Base', null, false, true, false, false, 'basketball', '{#1D428A,#FFC72C}'),
  ('Kobe Bryant', 'kobe-1996-topps-chrome-138', 'Los Angeles Lakers', 1996, 'Topps', 'Topps Chrome', '138', 'Base', null, false, true, false, false, 'basketball', '{#552583,#FDB927}'),
  ('Victor Wembanyama', 'wemby-2023-prizm-136', 'San Antonio Spurs', 2023, 'Panini', 'Prizm', '136', 'Silver Prizm', null, false, true, false, false, 'basketball', '{#C4CED4,#000000}'),
  ('Larry Bird / Julius Erving / Magic Johnson', 'bird-magic-1980-topps-6', 'Celtics / 76ers / Lakers', 1980, 'Topps', 'Topps', '6', 'Base', null, false, true, false, false, 'basketball', '{#007A33,#552583}'),
  ('Nikola Jokić', 'jokic-2015-prizm-335', 'Denver Nuggets', 2015, 'Panini', 'Prizm', '335', 'Silver Prizm', null, false, true, false, false, 'basketball', '{#0E2240,#FEC524}'),
  ('Tom Brady', 'brady-2000-contenders-144', 'New England Patriots', 2000, 'Playoff', 'Contenders', '144', 'Championship Ticket Auto /100', 100, true, true, true, false, 'football', '{#002244,#C60C30}'),
  ('Patrick Mahomes', 'mahomes-2017-prizm-269', 'Kansas City Chiefs', 2017, 'Panini', 'Prizm', '269', 'Silver Prizm', null, false, true, false, false, 'football', '{#E31837,#FFB81C}'),
  ('Joe Burrow', 'burrow-2020-prizm-145', 'Cincinnati Bengals', 2020, 'Panini', 'Prizm', '145', 'Silver Prizm', null, false, true, false, false, 'football', '{#FB4F14,#000000}'),
  ('Josh Allen', 'allen-2018-prizm-205', 'Buffalo Bills', 2018, 'Panini', 'Prizm', '205', 'Silver Prizm', null, false, true, false, false, 'football', '{#00338D,#C60C30}'),
  ('Justin Herbert', 'herbert-2020-prizm-325', 'Los Angeles Chargers', 2020, 'Panini', 'Prizm', '325', 'Silver Prizm', null, false, true, false, false, 'football', '{#0080C6,#FFC20E}'),
  ('Barry Sanders', 'sanders-1989-score-257', 'Detroit Lions', 1989, 'Score', 'Score', '257', 'Base', null, false, true, false, false, 'football', '{#0076B6,#B0B7BC}'),
  ('Wayne Gretzky', 'gretzky-1979-opc-18', 'Edmonton Oilers', 1979, 'O-Pee-Chee', 'O-Pee-Chee', '18', 'Base', null, false, true, false, false, 'hockey', '{#FC4C02,#003777}'),
  ('Connor McDavid', 'mcdavid-2015-upper-deck-201', 'Edmonton Oilers', 2015, 'Upper Deck', 'Upper Deck', '201', 'Young Guns', null, false, true, false, false, 'hockey', '{#FC4C02,#003777}'),
  ('Sidney Crosby', 'crosby-2005-upper-deck-201', 'Pittsburgh Penguins', 2005, 'Upper Deck', 'Upper Deck', '201', 'Young Guns', null, false, true, false, false, 'hockey', '{#000000,#FCB514}'),
  ('Connor Bedard', 'bedard-2023-upper-deck-451', 'Chicago Blackhawks', 2023, 'Upper Deck', 'Upper Deck', '451', 'Young Guns', null, false, true, false, false, 'hockey', '{#CF0A2C,#000000}'),
  ('Pelé', 'pele-1958-alifabolaget-635', 'Brazil', 1958, 'Alifabolaget', 'Alifabolaget', '635', 'Base', null, false, true, false, false, 'soccer', '{#FFDF00,#009C3B}'),
  ('Kylian Mbappé', 'mbappe-2018-prizm-world-cup-80', 'France', 2018, 'Panini', 'Prizm World Cup', '80', 'Base', null, false, false, false, false, 'soccer', '{#0055A4,#EF4135}'),
  ('Erling Haaland', 'haaland-2019-topps-chrome-74', 'Borussia Dortmund', 2019, 'Topps', 'Topps Chrome UCL', '74', 'Base', null, false, true, false, false, 'soccer', '{#FDE100,#000000}'),
  ('Lionel Messi', 'messi-2004-megacracks-71', 'FC Barcelona', 2004, 'Panini', 'Mega Cracks', '71', 'Sticker', null, false, true, false, false, 'soccer', '{#A50044,#004D98}'),
  ('Charizard', 'charizard-1999-base-4-1st', 'Pokémon TCG', 1999, 'Wizards of the Coast', 'Base Set', '4', '1st Edition Holo', null, false, false, false, false, 'tcg', '{#EE8130,#B3401E}'),
  ('Charizard', 'charizard-1999-base-4', 'Pokémon TCG', 1999, 'Wizards of the Coast', 'Base Set', '4', 'Holo', null, false, false, false, false, 'tcg', '{#EE8130,#B3401E}'),
  ('Blastoise', 'blastoise-1999-base-2', 'Pokémon TCG', 1999, 'Wizards of the Coast', 'Base Set', '2', 'Holo', null, false, false, false, false, 'tcg', '{#6890F0,#2C4E9E}'),
  ('Venusaur', 'venusaur-1999-base-15', 'Pokémon TCG', 1999, 'Wizards of the Coast', 'Base Set', '15', 'Holo', null, false, false, false, false, 'tcg', '{#78C850,#3E7A2E}'),
  ('Pikachu', 'pikachu-1999-base-58', 'Pokémon TCG', 1999, 'Wizards of the Coast', 'Base Set', '58', 'Non-Holo', null, false, false, false, false, 'tcg', '{#F8D030,#A68A1B}'),
  ('Lugia', 'lugia-2000-neo-genesis-9', 'Pokémon TCG', 2000, 'Wizards of the Coast', 'Neo Genesis', '9', 'Holo', null, false, false, false, false, 'tcg', '{#B8C4D0,#5B7A99}'),
  ('Umbreon', 'umbreon-2001-neo-discovery-13', 'Pokémon TCG', 2001, 'Wizards of the Coast', 'Neo Discovery', '13', 'Holo', null, false, false, false, false, 'tcg', '{#3B3B4D,#C9A227}'),
  ('Umbreon VMAX', 'umbreon-vmax-2021-evolving-skies-215', 'Pokémon TCG', 2021, 'Pokémon', 'Evolving Skies', '215', 'Alternate Art', null, false, false, false, false, 'tcg', '{#2B2B3A,#E8B64C}')
) as v(player_name, slug, team, year, brand, set_name, number, variant,
        print_run, serial_numbered, rookie, auto, memorabilia, category, team_colors)
join players p on p.name = v.player_name
on conflict (slug) do nothing;

-- Sample sold comps (shape demo — real comps arrive via backend jobs in Phase 5)
insert into sale_comps (card_id, grade_label, price, sold_at, platform, url, source)
select c.id, v.grade_label, v.price, v.sold_at::date, v.platform, v.url, 'seed'
from cards c
join (values
  ('jordan-1986-fleer-57', 'PSA 10', 258000, '2026-10-02', 'eBay', 'https://www.ebay.com/itm/sample-1'),
  ('jordan-1986-fleer-57', 'PSA 10', 271500, '2026-09-18', 'Goldin', 'https://goldin.co/sample-2'),
  ('jordan-1986-fleer-57', 'PSA 10', 249000, '2026-08-30', 'eBay', 'https://www.ebay.com/itm/sample-3'),
  ('jordan-1986-fleer-57', 'PSA 10', 266000, '2026-07-12', 'PWCC', 'https://www.pwccmarketplace.com/sample-4'),
  ('jordan-1986-fleer-57', 'PSA 10', 261200, '2026-06-05', 'eBay', 'https://www.ebay.com/itm/sample-5'),
  ('jordan-1986-fleer-57', 'PSA 9', 28400, '2026-09-25', 'eBay', 'https://www.ebay.com/itm/sample-6'),
  ('charizard-1999-base-4', 'PSA 10', 10800, '2026-10-08', 'eBay', 'https://www.ebay.com/itm/sample-7'),
  ('charizard-1999-base-4', 'PSA 10', 11400, '2026-09-02', 'Goldin', 'https://goldin.co/sample-8'),
  ('trout-2011-topps-update-us175', 'PSA 10', 1020, '2026-10-11', 'eBay', 'https://www.ebay.com/itm/sample-9')
) as v(slug, grade_label, price, sold_at, platform, url)
  on c.slug = v.slug;

-- Sample price snapshots (shape demo)
insert into price_snapshots (card_id, grade_label, median, low, high, volume, confidence, as_of, source)
select c.id, v.grade_label, v.median, v.low, v.high, v.volume, v.confidence, v.as_of::date, 'seed'
from cards c
join (values
  ('jordan-1986-fleer-57', 'PSA 10', 264000, 249000, 271500, 5, 'medium', '2026-10-16'),
  ('jordan-1986-fleer-57', 'Raw', 3200, 2750, 3680, 8, 'high', '2026-10-16'),
  ('charizard-1999-base-4', 'PSA 10', 11000, 10200, 11800, 6, 'medium', '2026-10-16'),
  ('trout-2011-topps-update-us175', 'PSA 10', 1050, 920, 1180, 9, 'high', '2026-10-16')
) as v(slug, grade_label, median, low, high, volume, confidence, as_of)
  on c.slug = v.slug
on conflict (card_id, grade_label, as_of, source) do nothing;
