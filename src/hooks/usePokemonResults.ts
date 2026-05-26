import { useEffect } from 'react';
import { getRequestErrorMessage } from '../helpers/getRequestErrorMessage';
import { fetchPokemonResults } from '../services/pokemon';
import { usePokemonSearchStore } from '../store/pokemonSearchStore';
import type { SearchResultItem } from '../types/search';

type UsePokemonResultsResult = {
  errorMessage: string;
  isLoading: boolean;
  items: SearchResultItem[];
  totalPages: number;
};

export function usePokemonResults(
  submittedSearchTerm: string,
  currentPage: number,
): UsePokemonResultsResult {
  const errorMessage = usePokemonSearchStore((state) => state.errorMessage);
  const isLoading = usePokemonSearchStore((state) => state.isLoading);
  const items = usePokemonSearchStore((state) => state.items);
  const setResultsError = usePokemonSearchStore(
    (state) => state.setResultsError,
  );
  const setResultsLoading = usePokemonSearchStore(
    (state) => state.setResultsLoading,
  );
  const setResultsPage = usePokemonSearchStore((state) => state.setResultsPage);
  const totalPages = usePokemonSearchStore((state) => state.totalPages);

  useEffect(() => {
    let isCancelled = false;

    async function loadResults() {
      setResultsLoading(true);

      try {
        const nextResults = await fetchPokemonResults(
          submittedSearchTerm,
          currentPage,
        );

        if (isCancelled) {
          return;
        }

        setResultsPage(nextResults.items, nextResults.totalPages);
      } catch (error) {
        if (isCancelled) {
          return;
        }

        setResultsError(getRequestErrorMessage(error));
      }
    }

    void loadResults();

    return () => {
      isCancelled = true;
    };
  }, [
    currentPage,
    setResultsError,
    setResultsLoading,
    setResultsPage,
    submittedSearchTerm,
  ]);

  return {
    errorMessage,
    isLoading,
    items,
    totalPages,
  };
}
