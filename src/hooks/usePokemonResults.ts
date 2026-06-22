import { useCallback, useEffect, useMemo, useState } from 'react';
import { getRequestErrorMessage } from '../helpers/getRequestErrorMessage';
import { fetchPokemonResults } from '../services/pokemon';
import type { SearchResultsPage } from '../types/search';

type UsePokemonResultsResult = {
  errorMessage: string;
  isLoading: boolean;
  items: SearchResultsPage['items'];
  refreshResults: () => Promise<void>;
  totalPages: number;
};

const pokemonResultsCache = new Map<string, SearchResultsPage>();

function getPokemonResultsCacheKey(searchTerm: string, page: number) {
  return `${searchTerm.trim().toLowerCase()}::${page}`;
}

function getCachedPokemonResults(
  searchTerm: string,
  page: number,
  initialResults: SearchResultsPage | null | undefined,
) {
  const cacheKey = getPokemonResultsCacheKey(searchTerm, page);

  if (initialResults) {
    pokemonResultsCache.set(cacheKey, initialResults);
    return initialResults;
  }

  return pokemonResultsCache.get(cacheKey) ?? null;
}

export function resetPokemonResultsCache() {
  pokemonResultsCache.clear();
}

export function usePokemonResults(
  searchTerm: string,
  page: number,
  initialResults?: SearchResultsPage | null,
): UsePokemonResultsResult {
  const cacheKey = useMemo(
    () => getPokemonResultsCacheKey(searchTerm, page),
    [searchTerm, page],
  );
  const initialState = useMemo(
    () => getCachedPokemonResults(searchTerm, page, initialResults),
    [searchTerm, page, initialResults],
  );
  const [results, setResults] = useState<SearchResultsPage | null>(initialState);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(!initialState);

  useEffect(() => {
    const cachedResults = getCachedPokemonResults(searchTerm, page, initialResults);

    setResults(cachedResults);
    setErrorMessage('');
    setIsLoading(!cachedResults);
  }, [searchTerm, page, initialResults]);

  const runResultsFetch = useCallback(
    async (force = false) => {
      const cachedResults = pokemonResultsCache.get(cacheKey);

      if (!force && cachedResults) {
        setResults(cachedResults);
        setErrorMessage('');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setErrorMessage('');

      try {
        const nextResults = await fetchPokemonResults(searchTerm, page);
        pokemonResultsCache.set(cacheKey, nextResults);
        setResults(nextResults);
      } catch (error) {
        setResults(null);
        setErrorMessage(getRequestErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    },
    [cacheKey, page, searchTerm],
  );

  useEffect(() => {
    if (results) {
      return;
    }

    void runResultsFetch();
  }, [results, runResultsFetch]);

  return {
    errorMessage,
    isLoading,
    items: results?.items ?? [],
    refreshResults: async () => {
      await runResultsFetch(true);
    },
    totalPages: results?.totalPages ?? 1,
  };
}
