import { create } from 'zustand';
import { DEFAULT_PAGE } from '../constants/pagination';
import {
  getStoredSearchTerm,
  setStoredSearchTerm,
} from '../services/localStorageService';
import type { SearchResultItem } from '../types/search';

export type PokemonSearchStoreState = {
  errorMessage: string;
  isLoading: boolean;
  items: SearchResultItem[];
  searchTerm: string;
  submittedSearchTerm: string;
  totalPages: number;
};

export type PokemonSearchStoreActions = {
  clearResultsError: () => void;
  resetResultsState: () => void;
  resetSearchState: () => void;
  setResultsError: (errorMessage: string) => void;
  setResultsLoading: (isLoading: boolean) => void;
  setResultsPage: (items: SearchResultItem[], totalPages: number) => void;
  setSearchTerm: (searchTerm: string) => void;
  submitSearchTerm: (searchTerm?: string) => string;
};

export type PokemonSearchStore = PokemonSearchStoreState &
  PokemonSearchStoreActions;

function createInitialPokemonSearchStoreState(): PokemonSearchStoreState {
  const storedSearchTerm = getStoredSearchTerm() ?? '';

  return {
    errorMessage: '',
    isLoading: true,
    items: [],
    searchTerm: storedSearchTerm,
    submittedSearchTerm: storedSearchTerm.trim(),
    totalPages: DEFAULT_PAGE,
  };
}

export const usePokemonSearchStore = create<PokemonSearchStore>((set, get) => ({
  ...createInitialPokemonSearchStoreState(),
  clearResultsError: () => {
    set({ errorMessage: '' });
  },
  resetResultsState: () => {
    set({
      errorMessage: '',
      isLoading: true,
      items: [],
      totalPages: DEFAULT_PAGE,
    });
  },
  resetSearchState: () => {
    set(createInitialPokemonSearchStoreState());
  },
  setResultsError: (errorMessage) => {
    set({
      errorMessage,
      isLoading: false,
      items: [],
      totalPages: DEFAULT_PAGE,
    });
  },
  setResultsLoading: (isLoading) => {
    set({ isLoading });
  },
  setResultsPage: (items, totalPages) => {
    set({
      errorMessage: '',
      isLoading: false,
      items,
      totalPages,
    });
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
