-- ============================================================================
-- SlabVault — Supabase schema (Phase 1: schema ready, not yet wired to the app)
-- The app currently persists to AsyncStorage behind the CollectionRepository
-- interface. When this schema is wired up, a SupabaseCollectionRepository
-- will implement the same interface — no UI changes needed.
-- Run this in the Supabase SQL editor, then run seed.sql.
-- ============================================================================

-- --------------------------------------------------------------------------
-- Reference data (public read, service-role write)
-- --------------------------------------------------------------------------

create table if not exists players (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  category text not null check (category in ('baseball','basketball','football','hockey','soccer','tcg')),
  created_at timestamptz not null default now()
);

create table if not exists grade_companies (
  id uuid primary key default gen_random_uuid(),
  code text not null unique check (code in ('PSA','BGS','SGC','CGC')),
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists cards (
  id uuid primary key default gen_random_uuid(),
  -- slug ties a row to the app's catalog id, e.g. 'jordan-1986-fleer-57'
  slug text not null unique,
  player_id uuid not null references players(id) on delete restrict,
  team text,
  year int not null,
  brand text not null,
  set_name text not null,
  number text not null,
  variant text not null default 'Base',
  print_run int,
  serial_numbered boolean not null default false,
  rookie boolean not null default false,
  auto boolean not null default false,
  memorabilia boolean not null default false,
  category text not null check (category in ('baseball','basketball','football','hockey','soccer','tcg')),
  team_colors text[] not null default '{}',
  created_at timestamptz not null default now()
);
create index if not exists cards_player_id_idx on cards(player_id);
create index if not exists cards_category_idx on cards(category);

create table if not exists card_images (
  id uuid primary key default gen_random_uuid(),
  card_id uuid not null references cards(id) on delete cascade,
  side text not null check (side in ('front','back')),
  url text not null,
  -- true = uploaded by a user (theirs to manage); false = licensed/stock art
  is_user_upload boolean not null default true,
  created_at timestamptz not null default now()
);

-- Market data (public read; written by backend jobs, never by clients)
create table if not exists sale_comps (
  id uuid primary key default gen_random_uuid(),
  card_id uuid not null references cards(id) on delete cascade,
  grade_label text not null,
  price numeric(14,2) not null,
  sold_at date not null,
  platform text not null,
  url text,
  -- set when the sale looks like an outlier or possible shill bid
  flagged text,
  source text not null default 'ebay_sold',
  created_at timestamptz not null default now()
);
create index if not exists sale_comps_card_grade_idx on sale_comps(card_id, grade_label, sold_at desc);

create table if not exists price_snapshots (
  id uuid primary key default gen_random_uuid(),
  card_id uuid not null references cards(id) on delete cascade,
  grade_label text not null,
  median numeric(14,2) not null,
  low numeric(14,2) not null,
  high numeric(14,2) not null,
  volume int not null,
  confidence text not null check (confidence in ('low','medium','high')),
  as_of date not null,
  source text not null,
  created_at timestamptz not null default now(),
  unique (card_id, grade_label, as_of, source)
);

create table if not exists checklist_sets (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  year int,
  brand text,
  category text not null check (category in ('baseball','basketball','football','hockey','soccer','tcg')),
  total_cards int,
  created_at timestamptz not null default now()
);

-- --------------------------------------------------------------------------
-- User data (private by default: owners only, via RLS)
-- --------------------------------------------------------------------------

create table if not exists collections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists collections_user_id_idx on collections(user_id);

create table if not exists slabs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  cert_number text,
  grade_company_id uuid references grade_companies(id) on delete set null,
  grade text,
  card_id uuid references cards(id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists slabs_user_id_idx on slabs(user_id);

create table if not exists collection_items (
  id uuid primary key default gen_random_uuid(),
  collection_id uuid not null references collections(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  card_id uuid not null references cards(id) on delete restrict,
  slab_id uuid references slabs(id) on delete set null,
  grade_label text not null,
  purchase_price numeric(14,2),
  acquired_date date,
  source text,
  condition text,
  storage_location text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists collection_items_collection_idx on collection_items(collection_id);
create index if not exists collection_items_user_id_idx on collection_items(user_id);

create table if not exists wantlist_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  card_id uuid not null references cards(id) on delete cascade,
  grade_label text not null,
  target_price numeric(14,2),
  created_at timestamptz not null default now(),
  unique (user_id, card_id, grade_label)
);

create table if not exists alerts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  card_id uuid not null references cards(id) on delete cascade,
  grade_label text not null,
  kind text not null check (kind in ('price-drop','price-spike','new-comp','population-change')),
  threshold numeric(14,2),
  created_at timestamptz not null default now()
);

create table if not exists settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display jsonb not null default '{}',
  notifications jsonb not null default '{}',
  updated_at timestamptz not null default now()
);

-- --------------------------------------------------------------------------
-- Row Level Security
-- --------------------------------------------------------------------------

alter table players enable row level security;
alter table grade_companies enable row level security;
alter table cards enable row level security;
alter table card_images enable row level security;
alter table sale_comps enable row level security;
alter table price_snapshots enable row level security;
alter table checklist_sets enable row level security;
alter table collections enable row level security;
alter table slabs enable row level security;
alter table collection_items enable row level security;
alter table wantlist_items enable row level security;
alter table alerts enable row level security;
alter table settings enable row level security;

-- Public catalog + market data: anyone can read, only the service role writes.
-- (No insert/update/delete policies for anon/authenticated = writes denied.)
create policy "public read" on players for select using (true);
create policy "public read" on grade_companies for select using (true);
create policy "public read" on cards for select using (true);
create policy "public read" on card_images for select using (true);
create policy "public read" on sale_comps for select using (true);
create policy "public read" on price_snapshots for select using (true);
create policy "public read" on checklist_sets for select using (true);

-- User tables: owners only. Collection is private by default.
create policy "owners all" on collections
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "owners all" on slabs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "owners all" on collection_items
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "owners all" on wantlist_items
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "owners all" on alerts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "owners all" on settings
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Keep updated_at fresh
create or replace function touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists collections_touch on collections;
create trigger collections_touch before update on collections
  for each row execute function touch_updated_at();
drop trigger if exists collection_items_touch on collection_items;
create trigger collection_items_touch before update on collection_items
  for each row execute function touch_updated_at();
drop trigger if exists settings_touch on settings;
create trigger settings_touch before update on settings
  for each row execute function touch_updated_at();
