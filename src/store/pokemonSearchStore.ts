import { create } from 'zustand';
import {
  getStoredSearchTerm,
  setStoredSearchTerm,
} from '../services/localStorageService';

export type PokemonSearchStoreState = {
  searchTerm: string;
  submittedSearchTerm: string;
};

export type PokemonSearchStoreActions = {
  resetSearchState: () => void;
  setSearchTerm: (searchTerm: string) => void;
  submitSearchTerm: (searchTerm?: string) => string;
};

export type PokemonSearchStore = PokemonSearchStoreState &
  PokemonSearchStoreActions;

function createInitialPokemonSearchStoreState(): PokemonSearchStoreState {
  const storedSearchTerm = getStoredSearchTerm() ?? '';

  return {
    searchTerm: storedSearchTerm,
    submittedSearchTerm: storedSearchTerm.trim(),
  };
}

export const usePokemonSearchStore = create<PokemonSearchStore>((set, get) => ({
  ...createInitialPokemonSearchStoreState(),
  resetSearchState: () => {
    set(createInitialPokemonSearchStoreState());
  },
  setSearchTerm: (searchTerm) => {
    set({ searchTerm });
  },
  submitSearchTerm: (searchTerm) => {
    const nextSearchTerm = (searchTerm ?? get().searchTerm).trim();

    setStoredSearchTerm(nextSearchTerm);
    set({
      searchTerm: nextSearchTerm,
      submittedSearchTerm: nextSearchTerm,
    });

    return nextSearchTerm;
  },
}));

export function resetPokemonSearchStore() {
  usePokemonSearchStore.setState(createInitialPokemonSearchStoreState());
}
