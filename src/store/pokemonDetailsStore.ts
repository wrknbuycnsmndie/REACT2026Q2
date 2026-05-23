import { create } from 'zustand';
import type { PokemonDetails } from '../types/pokemon';

export type PokemonDetailsStoreState = {
  activePokemonId: string | null;
  details: PokemonDetails | null;
  errorMessage: string;
  isLoading: boolean;
};

export type PokemonDetailsStoreActions = {
  clearDetails: () => void;
  clearDetailsError: () => void;
  setActivePokemonId: (pokemonId: string | null) => void;
  setDetails: (details: PokemonDetails) => void;
  setDetailsError: (errorMessage: string) => void;
  setDetailsLoading: (isLoading: boolean) => void;
  startDetailsRequest: (pokemonId: string) => void;
};

export type PokemonDetailsStore = PokemonDetailsStoreState &
  PokemonDetailsStoreActions;

const initialPokemonDetailsStoreState: PokemonDetailsStoreState = {
  activePokemonId: null,
  details: null,
  errorMessage: '',
  isLoading: false,
};

export const usePokemonDetailsStore = create<PokemonDetailsStore>((set) => ({
  ...initialPokemonDetailsStoreState,
  clearDetails: () => {
    set(initialPokemonDetailsStoreState);
  },
  clearDetailsError: () => {
    set({ errorMessage: '' });
  },
  setActivePokemonId: (activePokemonId) => {
    set({ activePokemonId });
  },
  setDetails: (details) => {
    set({
      activePokemonId: details.id,
      details,
      errorMessage: '',
      isLoading: false,
    });
  },
  setDetailsError: (errorMessage) => {
    set({
      details: null,
      errorMessage,
      isLoading: false,
    });
  },
  setDetailsLoading: (isLoading) => {
    set({ isLoading });
  },
  startDetailsRequest: (pokemonId) => {
    set({
      activePokemonId: pokemonId,
      errorMessage: '',
      isLoading: true,
    });
  },
}));

export function resetPokemonDetailsStore() {
  usePokemonDetailsStore.setState(initialPokemonDetailsStoreState);
}
