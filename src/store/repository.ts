/**
 * CollectionRepository — the seam between the app and stored data.
 *
 * The UI and the Zustand store only ever talk to this interface.
 * Phase 1 ships LocalCollectionRepository (AsyncStorage, works offline).
 * When Supabase is wired up (Phase 5+), a SupabaseCollectionRepository
 * implements the same interface — the swap happens in one place below
 * and no UI code changes.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Collection, CollectionItem, NewCollectionItem } from '../data/types';

export interface CollectionRepository {
  listCollections(): Promise<Collection[]>;
  createCollection(name: string): Promise<Collection>;
  renameCollection(id: string, name: string): Promise<void>;
  deleteCollection(id: string): Promise<void>;
  listItems(collectionId?: string): Promise<CollectionItem[]>;
  addItem(input: NewCollectionItem): Promise<CollectionItem>;
  updateItem(
    id: string,
    patch: Partial<Omit<CollectionItem, 'id' | 'collectionId' | 'cardId' | 'createdAt'>>,
  ): Promise<CollectionItem>;
  deleteItem(id: string): Promise<void>;
  /** Wipes local data and re-seeds the demo starter set. */
  resetToDemoData(): Promise<void>;
}

const COLLECTIONS_KEY = 'slabvault.collections.v1';
const ITEMS_KEY = 'slabvault.items.v1';
const SEEDED_KEY = 'slabvault.seeded.v1';

function newId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

/** Starter content so the dashboard and collection look alive on first run. */
function demoSeed(): { collections: Collection[]; items: CollectionItem[] } {
  const t = nowIso();
  const myCollection: Collection = {
    id: 'col_my_collection', name: 'My Collection', createdAt: t, updatedAt: t,
  };
  const forSale: Collection = {
    id: 'col_for_sale', name: 'For Sale', createdAt: t, updatedAt: t,
  };
  const items: CollectionItem[] = [
    {
      id: newId('item'), collectionId: myCollection.id, cardId: 'jordan-1986-fleer-57',
      gradeLabel: 'Raw', purchasePrice: 2800, acquiredDate: '2025-06-14',
      source: 'Card show', condition: 'Near Mint', storageLocation: 'Binder 1, page 3',
      notes: 'Clean corners, centered. My grail card.', createdAt: t, updatedAt: t,
    },
    {
      id: newId('item'), collectionId: myCollection.id, cardId: 'trout-2011-topps-update-us175',
      gradeLabel: 'PSA 10', certNumber: '84120397', purchasePrice: 900,
      acquiredDate: '2025-09-02', source: 'eBay', storageLocation: 'Slab case',
      notes: '', createdAt: t, updatedAt: t,
    },
    {
      id: newId('item'), collectionId: forSale.id, cardId: 'mahomes-2017-prizm-269',
      gradeLabel: 'PSA 9', certNumber: '77120554', purchasePrice: 1150,
      acquiredDate: '2026-01-20', source: 'PWCC', storageLocation: 'Slab case',
      notes: 'Listed at $1,400 — holding for offers.', createdAt: t, updatedAt: t,
    },
  ];
  return { collections: [myCollection, forSale], items };
}

export class LocalCollectionRepository implements CollectionRepository {
  private async read<T>(key: string, fallback: T): Promise<T> {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return fallback;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  }

  private write(key: string, value: unknown): Promise<void> {
    return AsyncStorage.setItem(key, JSON.stringify(value));
  }

  private async ensureSeeded(): Promise<void> {
    const seeded = await AsyncStorage.getItem(SEEDED_KEY);
    if (seeded) return;
    const { collections, items } = demoSeed();
    await this.write(COLLECTIONS_KEY, collections);
    await this.write(ITEMS_KEY, items);
    await AsyncStorage.setItem(SEEDED_KEY, '1');
  }

  async listCollections(): Promise<Collection[]> {
    await this.ensureSeeded();
    return this.read<Collection[]>(COLLECTIONS_KEY, []);
  }

  async createCollection(name: string): Promise<Collection> {
    const trimmed = name.trim();
    if (!trimmed) throw new Error('Collection name cannot be empty.');
    const collections = await this.listCollections();
    const collection: Collection = {
      id: newId('col'), name: trimmed, createdAt: nowIso(), updatedAt: nowIso(),
    };
    await this.write(COLLECTIONS_KEY, [...collections, collection]);
    return collection;
  }

  async renameCollection(id: string, name: string): Promise<void> {
    const trimmed = name.trim();
    if (!trimmed) throw new Error('Collection name cannot be empty.');
    const collections = await this.listCollections();
    await this.write(
      COLLECTIONS_KEY,
      collections.map((c) => (c.id === id ? { ...c, name: trimmed, updatedAt: nowIso() } : c)),
    );
  }

  async deleteCollection(id: string): Promise<void> {
    const collections = await this.listCollections();
    const items = await this.listItems();
    await this.write(COLLECTIONS_KEY, collections.filter((c) => c.id !== id));
    // Deleting a collection deletes its items (they live inside it).
    await this.write(ITEMS_KEY, items.filter((i) => i.collectionId !== id));
  }

  async listItems(collectionId?: string): Promise<CollectionItem[]> {
    await this.ensureSeeded();
    const items = await this.read<CollectionItem[]>(ITEMS_KEY, []);
    return collectionId ? items.filter((i) => i.collectionId === collectionId) : items;
  }

  async addItem(input: NewCollectionItem): Promise<CollectionItem> {
    const items = await this.listItems();
    const item: CollectionItem = {
      id: newId('item'),
      ...input,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    await this.write(ITEMS_KEY, [item, ...items]);
    return item;
  }

  async updateItem(
    id: string,
    patch: Partial<Omit<CollectionItem, 'id' | 'collectionId' | 'cardId' | 'createdAt'>>,
  ): Promise<CollectionItem> {
    const items = await this.listItems();
    let updated: CollectionItem | undefined;
    const next = items.map((i) => {
      if (i.id !== id) return i;
      updated = { ...i, ...patch, updatedAt: nowIso() };
      return updated;
    });
    if (!updated) throw new Error('Item not found.');
    await this.write(ITEMS_KEY, next);
    return updated;
  }

  async deleteItem(id: string): Promise<void> {
    const items = await this.listItems();
    await this.write(ITEMS_KEY, items.filter((i) => i.id !== id));
  }

  async resetToDemoData(): Promise<void> {
    const { collections, items } = demoSeed();
    await this.write(COLLECTIONS_KEY, collections);
    await this.write(ITEMS_KEY, items);
    await AsyncStorage.setItem(SEEDED_KEY, '1');
  }
}

let repository: CollectionRepository = new LocalCollectionRepository();

export function getRepository(): CollectionRepository {
  return repository;
}

/** Reserved for the Supabase swap — replaces storage app-wide, UI untouched. */
export function setRepository(next: CollectionRepository): void {
  repository = next;
}
