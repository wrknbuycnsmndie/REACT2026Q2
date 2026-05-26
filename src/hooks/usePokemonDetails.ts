import { useEffect } from 'react';
import { getRequestErrorMessage } from '../helpers/getRequestErrorMessage';
import { fetchPokemonDetails } from '../services/pokemon';
import { usePokemonDetailsStore } from '../store/pokemonDetailsStore';
import { useSelectedPokemonStore } from '../store/selectedPokemonStore';
import type { PokemonDetails } from '../types/pokemon';

type UsePokemonDetailsResult = {
  details: PokemonDetails | null;
  errorMessage: string;
  isLoading: boolean;
};

export function usePokemonDetails(
  selectedPokemonId: string | null,
): UsePokemonDetailsResult {
  const clearDetails = usePokemonDetailsStore((state) => state.clearDetails);
  const details = usePokemonDetailsStore((state) => state.details);
  const errorMessage = usePokemonDetailsStore((state) => state.errorMessage);
  const setDetails = usePokemonDetailsStore((state) => state.setDetails);
  const setDetailsError = usePokemonDetailsStore(
    (state) => state.setDetailsError,
  );
  const syncSelectedPokemonDetails = useSelectedPokemonStore(
    (state) => state.syncSelectedPokemonDetails,
  );
  const startDetailsRequest = usePokemonDetailsStore(
    (state) => state.startDetailsRequest,
  );
  const isLoading = usePokemonDetailsStore((state) => state.isLoading);

  useEffect(() => {
    if (!selectedPokemonId) {
      clearDetails();
      return;
    }

    let isCancelled = false;
    const detailsId = selectedPokemonId;

    async function loadDetails() {
      startDetailsRequest(detailsId);

      try {
        const nextDetails = await fetchPokemonDetails(detailsId);

        if (isCancelled) {
          return;
        }

        setDetails(nextDetails);
        syncSelectedPokemonDetails(nextDetails);
      } catch (error) {
        if (isCancelled) {
          return;
        }

        setDetailsError(getRequestErrorMessage(error));
      }
    }

    void loadDetails();

    return () => {
      isCancelled = true;
    };
  }, [
    clearDetails,
    selectedPokemonId,
    setDetails,
    setDetailsError,
    syncSelectedPokemonDetails,
    startDetailsRequest,
  ]);

  return {
    details: selectedPokemonId ? details : null,
    errorMessage: selectedPokemonId ? errorMessage : '',
    isLoading: selectedPokemonId ? isLoading : false,
  };
}
