import { create } from 'zustand';
import { getStoredSearchTerm } from '../services/localStorageService';

export type PokemonSearchStoreState = {
  searchTerm: string;
};

export type PokemonSearchStoreActions = {
  resetSearchState: () => void;
  setSearchTerm: (searchTerm: string) => void;
};

export type PokemonSearchStore = PokemonSearchStoreState &
  PokemonSearchStoreActions;

function createInitialPokemonSearchStoreState(): PokemonSearchStoreState {
  const storedSearchTerm = getStoredSearchTerm() ?? '';

  return {
    searchTerm: storedSearchTerm,
  };
}

export const usePokemonSearchStore = create<PokemonSearchStore>((set) => ({
  ...createInitialPokemonSearchStoreState(),
  resetSearchState: () => {
    set(createInitialPokemonSearchStoreState());
  },
  setSearchTerm: (searchTerm) => {
    set({ searchTerm });
  },
}));

export function resetPokemonSearchStore() {
  usePokemonSearchStore.setState(createInitialPokemonSearchStoreState());
}
