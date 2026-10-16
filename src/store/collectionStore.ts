/**
 * Global collection state (Zustand). Screens subscribe to exactly the slices
 * they need, so only the parts of the UI that changed re-render.
 *
 * All persistence goes through the repository (see repository.ts) — this
 * store never touches AsyncStorage or Supabase directly.
 */
import { create } from 'zustand';
import type { Collection, CollectionItem, NewCollectionItem } from '../data/types';
import { getRepository } from './repository';

interface CollectionState {
  collections: Collection[];
  items: CollectionItem[];
  loaded: boolean;
  loadError: string | null;
  /** null = show every collection together. */
  activeCollectionId: string | null;

  load: () => Promise<void>;
  setActiveCollection: (id: string | null) => void;
  createCollection: (name: string) => Promise<Collection>;
  renameCollection: (id: string, name: string) => Promise<void>;
  deleteCollection: (id: string) => Promise<void>;
  addItem: (input: NewCollectionItem) => Promise<CollectionItem>;
  updateItem: (
    id: string,
    patch: Partial<Omit<CollectionItem, 'id' | 'collectionId' | 'cardId' | 'createdAt'>>,
  ) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  resetDemo: () => Promise<void>;
}

async function refresh(
  set: (p: Partial<CollectionState>) => void,
  activeCollectionId: string | null,
): Promise<void> {
  const repo = getRepository();
  const [collections, items] = await Promise.all([
    repo.listCollections(),
    repo.listItems(activeCollectionId ?? undefined),
  ]);
  set({ collections, items, loaded: true, loadError: null });
}

export const useCollectionStore = create<CollectionState>()((set, get) => ({
  collections: [],
  items: [],
  loaded: false,
  loadError: null,
  activeCollectionId: null,

  load: async () => {
    try {
      await refresh(set, get().activeCollectionId);
    } catch (e) {
      set({ loaded: true, loadError: e instanceof Error ? e.message : 'Failed to load collection.' });
    }
  },

  setActiveCollection: (id) => {
    set({ activeCollectionId: id, loaded: false });
    void get().load();
  },

  createCollection: async (name) => {
    const collection = await getRepository().createCollection(name);
    await refresh(set, get().activeCollectionId);
    return collection;
  },

  renameCollection: async (id, name) => {
    await getRepository().renameCollection(id, name);
    await refresh(set, get().activeCollectionId);
  },

  deleteCollection: async (id) => {
    await getRepository().deleteCollection(id);
    const nextActive = get().activeCollectionId === id ? null : get().activeCollectionId;
    set({ activeCollectionId: nextActive });
    await refresh(set, nextActive);
  },

  addItem: async (input) => {
    const item = await getRepository().addItem(input);
    await refresh(set, get().activeCollectionId);
    return item;
  },

  updateItem: async (id, patch) => {
    await getRepository().updateItem(id, patch);
    await refresh(set, get().activeCollectionId);
  },

  deleteItem: async (id) => {
    await getRepository().deleteItem(id);
    await refresh(set, get().activeCollectionId);
  },

  resetDemo: async () => {
    await getRepository().resetToDemoData();
    set({ activeCollectionId: null });
    await refresh(set, null);
  },
}));
