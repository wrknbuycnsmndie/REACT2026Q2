import { useEffect, useState } from 'react';
import { DEFAULT_PAGE } from '../constants/pagination';
import { getRequestErrorMessage } from '../helpers/getRequestErrorMessage';
import { fetchPokemonResults } from '../services/pokemon';
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
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<SearchResultItem[]>([]);
  const [totalPages, setTotalPages] = useState(DEFAULT_PAGE);

  useEffect(() => {
    let isCancelled = false;

    async function loadResults() {
      setIsLoading(true);

      try {
        const nextResults = await fetchPokemonResults(
          submittedSearchTerm,
          currentPage,
        );

        if (isCancelled) {
          return;
        }

        setItems(nextResults.items);
        setErrorMessage('');
        setTotalPages(nextResults.totalPages);
      } catch (error) {
        if (isCancelled) {
          return;
        }

        setItems([]);
        setErrorMessage(getRequestErrorMessage(error));
        setTotalPages(DEFAULT_PAGE);
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadResults();

    return () => {
      isCancelled = true;
    };
  }, [currentPage, submittedSearchTerm]);

  return {
    errorMessage,
    isLoading,
    items,
    totalPages,
  };
}
