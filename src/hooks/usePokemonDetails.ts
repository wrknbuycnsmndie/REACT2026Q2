import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getRequestErrorMessage } from '../helpers/getRequestErrorMessage';
import { getPokemonDetailsQueryKey } from '../query/pokemonQueryKeys';
import { fetchPokemonDetails } from '../services/pokemon';
import { useSelectedPokemonStore } from '../store/selectedPokemonStore';
import type { PokemonDetails } from '../types/pokemon';

type UsePokemonDetailsResult = {
  details: PokemonDetails | null;
  errorMessage: string;
  isLoading: boolean;
  refreshDetails: () => Promise<void>;
};

type UsePokemonDetailsOptions = {
  enabled?: boolean;
};

export function usePokemonDetails(
  selectedPokemonId: string | null,
  { enabled = true }: UsePokemonDetailsOptions = {},
): UsePokemonDetailsResult {
  const syncSelectedPokemonDetails = useSelectedPokemonStore(
    (state) => state.syncSelectedPokemonDetails,
  );
  const detailsQuery = useQuery({
    enabled: Boolean(selectedPokemonId) && enabled,
    queryFn: () => fetchPokemonDetails(selectedPokemonId!),
    queryKey: getPokemonDetailsQueryKey(selectedPokemonId ?? ''),
  });

  useEffect(() => {
    if (!detailsQuery.data) {
      return;
    }

    syncSelectedPokemonDetails(detailsQuery.data);
  }, [detailsQuery.data, syncSelectedPokemonDetails]);

  return {
    details: selectedPokemonId ? detailsQuery.data ?? null : null,
    errorMessage:
      selectedPokemonId && detailsQuery.error
        ? getRequestErrorMessage(detailsQuery.error)
        : '',
    isLoading: selectedPokemonId ? detailsQuery.isPending : false,
    refreshDetails: async () => {
      if (!selectedPokemonId) {
        return;
      }

      await detailsQuery.refetch();
    },
  };
}
