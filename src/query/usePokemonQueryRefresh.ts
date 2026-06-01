import { useQueryClient } from '@tanstack/react-query';
import {
  getPokemonDetailsQueryKey,
  getPokemonResultsQueryKey,
} from './pokemonQueryKeys';

export function usePokemonQueryRefresh() {
  const queryClient = useQueryClient();

  return {
    refreshPokemonDetails: async (pokemonId: string | null) => {
      if (!pokemonId) {
        return;
      }

      await queryClient.invalidateQueries({
        queryKey: getPokemonDetailsQueryKey(pokemonId),
      });
    },
    refreshPokemonResults: async (searchTerm: string, page: number) => {
      await queryClient.invalidateQueries({
        queryKey: getPokemonResultsQueryKey(searchTerm, page),
      });
    },
  };
}
