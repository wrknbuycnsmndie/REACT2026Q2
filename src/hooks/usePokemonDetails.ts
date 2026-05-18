import { useEffect, useState } from 'react';
import { getRequestErrorMessage } from '../helpers/getRequestErrorMessage';
import { fetchPokemonDetails } from '../services/pokemon';
import type { PokemonDetails } from '../types/pokemon';

type UsePokemonDetailsResult = {
  details: PokemonDetails | null;
  errorMessage: string;
  isLoading: boolean;
};

export function usePokemonDetails(
  selectedPokemonId: string | null,
): UsePokemonDetailsResult {
  const [details, setDetails] = useState<PokemonDetails | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!selectedPokemonId) {
      return;
    }

    let isCancelled = false;
    const detailsId = selectedPokemonId;

    async function loadDetails() {
      setIsLoading(true);

      try {
        const nextDetails = await fetchPokemonDetails(detailsId);

        if (isCancelled) {
          return;
        }

        setDetails(nextDetails);
        setErrorMessage('');
      } catch (error) {
        if (isCancelled) {
          return;
        }

        setDetails(null);
        setErrorMessage(getRequestErrorMessage(error));
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadDetails();

    return () => {
      isCancelled = true;
    };
  }, [selectedPokemonId]);

  return {
    details: selectedPokemonId ? details : null,
    errorMessage: selectedPokemonId ? errorMessage : '',
    isLoading: selectedPokemonId ? isLoading : false,
  };
}
