import { create } from 'zustand';
import type { PokemonDetails } from '../types/pokemon';
import type { SearchResultItem } from '../types/search';
import type { SelectedPokemonItem } from '../types/pokemonSelection';

export type SelectedPokemonStoreState = {
  selectedItemsById: Record<string, SelectedPokemonItem>;
};

export type SelectedPokemonStoreActions = {
  clearSelectedPokemon: () => void;
  selectPokemon: (item: SearchResultItem, currentPage: number) => void;
  syncSelectedPokemonDetails: (details: PokemonDetails) => void;
  togglePokemonSelection: (item: SearchResultItem, currentPage: number) => void;
  unselectPokemon: (pokemonId: string) => void;
};

export type SelectedPokemonStore = SelectedPokemonStoreState &
  SelectedPokemonStoreActions;

const initialSelectedPokemonStoreState: SelectedPokemonStoreState = {
  selectedItemsById: {},
};

export const useSelectedPokemonStore = create<SelectedPokemonStore>((set) => ({
  ...initialSelectedPokemonStoreState,
  clearSelectedPokemon: () => {
    set(initialSelectedPokemonStoreState);
  },
  selectPokemon: (item, currentPage) => {
    set((state) => ({
      selectedItemsById: {
        ...state.selectedItemsById,
        [item.id]: toSelectedPokemonItem(item, currentPage),
      },
    }));
  },
  syncSelectedPokemonDetails: (details) => {
    set((state) => {
      const selectedItem = state.selectedItemsById[details.id];

      if (!selectedItem) {
        return state;
      }

      return {
        selectedItemsById: {
          ...state.selectedItemsById,
          [details.id]: {
            ...selectedItem,
            description: details.description,
            height: details.height,
            imageUrl: details.imageUrl,
            types: details.types,
            weight: details.weight,
          },
        },
      };
    });
  },
  togglePokemonSelection: (item, currentPage) => {
    set((state) => {
      if (state.selectedItemsById[item.id]) {
        const nextSelectedItemsById = { ...state.selectedItemsById };

        delete nextSelectedItemsById[item.id];

        return {
          selectedItemsById: nextSelectedItemsById,
        };
      }

      return {
        selectedItemsById: {
          ...state.selectedItemsById,
          [item.id]: toSelectedPokemonItem(item, currentPage),
        },
      };
    });
  },
  unselectPokemon: (pokemonId) => {
    set((state) => {
      if (!state.selectedItemsById[pokemonId]) {
        return state;
      }

      const nextSelectedItemsById = { ...state.selectedItemsById };

      delete nextSelectedItemsById[pokemonId];

      return {
        selectedItemsById: nextSelectedItemsById,
      };
    });
  },
}));

export function resetSelectedPokemonStore() {
  useSelectedPokemonStore.setState(initialSelectedPokemonStoreState);
}

export function selectIsPokemonSelected(pokemonId: string) {
  return (state: SelectedPokemonStoreState) =>
    Boolean(state.selectedItemsById[pokemonId]);
}

export function selectSelectedPokemonCount(state: SelectedPokemonStoreState) {
  return Object.keys(state.selectedItemsById).length;
}

export function selectSelectedPokemonItems(state: SelectedPokemonStoreState) {
  return Object.values(state.selectedItemsById);
}

function toSelectedPokemonItem(
  item: SearchResultItem,
  currentPage: number,
): SelectedPokemonItem {
  return {
    detailsRoute: `/?page=${currentPage}&details=${item.id}`,
    id: item.id,
    name: item.name,
    sourceUrl: item.url,
  };
}
