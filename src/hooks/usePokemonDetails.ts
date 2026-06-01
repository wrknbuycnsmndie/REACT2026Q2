import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getRequestErrorMessage } from '../helpers/getRequestErrorMessage';
import { getPokemonDetailsQueryKey } from '../query/pokemonQueryKeys';
import { usePokemonQueryRefresh } from '../query/usePokemonQueryRefresh';
import { fetchPokemonDetails } from '../services/pokemon';
import { useSelectedPokemonStore } from '../store/selectedPokemonStore';
import type { PokemonDetails } from '../types/pokemon';

type UsePokemonDetailsResult = {
  details: PokemonDetails | null;
  errorMessage: string;
  isLoading: boolean;
  refreshDetails: () => Promise<void>;
};

export function usePokemonDetails(
  selectedPokemonId: string | null,
): UsePokemonDetailsResult {
  const { refreshPokemonDetails } = usePokemonQueryRefresh();
  const syncSelectedPokemonDetails = useSelectedPokemonStore(
    (state) => state.syncSelectedPokemonDetails,
  );
  const detailsQuery = useQuery({
    enabled: Boolean(selectedPokemonId),
    queryFn: () => fetchPokemonDetails(selectedPokemonId!),
    queryKey: getPokemonDetailsQueryKey(selectedPokemonId ?? ''),
  });

  useEffect(() => {
    if (!detailsQuery.data) {
      return;
    }

    syncSelectedPokemonDetails(detailsQuery.data);
  }, [detailsQuery.data, syncSelectedPokemonDetails]);

  const refreshDetails = async () => {
    await refreshPokemonDetails(selectedPokemonId);
  };

  return {
    details: selectedPokemonId ? detailsQuery.data ?? null : null,
    errorMessage:
      selectedPokemonId && detailsQuery.error
        ? getRequestErrorMessage(detailsQuery.error)
        : '',
    isLoading: selectedPokemonId ? detailsQuery.isPending : false,
    refreshDetails,
  };
}
