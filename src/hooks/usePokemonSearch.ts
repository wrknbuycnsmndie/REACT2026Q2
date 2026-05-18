import { useEffect, useState } from 'react';
import { getRequestErrorMessage } from '../helpers/getRequestErrorMessage';
import { fetchPokemonResults } from '../services/pokemon';
import type { SearchResultItem } from '../types/search';
import { useStoredSearchTerm } from './useStoredSearchTerm';

type UsePokemonSearchResult = {
  errorMessage: string;
  isLoading: boolean;
  items: SearchResultItem[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  submitSearch: () => Promise<void>;
};

export function usePokemonSearch(): UsePokemonSearchResult {
  const {
    initialStoredSearchTerm,
    persistSubmittedSearchTerm,
    searchTerm,
    setSearchTerm,
  } = useStoredSearchTerm();
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<SearchResultItem[]>([]);
  const [lastLoadedSearchTerm, setLastLoadedSearchTerm] = useState(
    initialStoredSearchTerm.trim(),
  );

  const runSearch = async (term: string) => {
    try {
      const nextItems = await fetchPokemonResults(term);

      setItems(nextItems);
      setErrorMessage('');
      setLastLoadedSearchTerm(term);
    } catch (error) {
      setItems([]);
      setErrorMessage(getRequestErrorMessage(error));
      setLastLoadedSearchTerm(term);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    async function loadInitialResults() {
      await runSearch(initialStoredSearchTerm);
    }

    void loadInitialResults();
  }, [initialStoredSearchTerm]);

  const submitSearch = async () => {
    const trimmedSearchTerm = searchTerm.trim();

    if (trimmedSearchTerm === lastLoadedSearchTerm) {
      setSearchTerm(trimmedSearchTerm);
      return;
    }

    const persistedSearchTerm = persistSubmittedSearchTerm(trimmedSearchTerm);
    setErrorMessage('');
    setIsLoading(true);
    await runSearch(persistedSearchTerm);
    setSearchTerm(persistedSearchTerm);
  };

  return {
    errorMessage,
    isLoading,
    items,
    searchTerm,
    setSearchTerm,
    submitSearch,
  };
}
