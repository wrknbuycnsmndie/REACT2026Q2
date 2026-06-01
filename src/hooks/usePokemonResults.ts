import { useQuery } from '@tanstack/react-query';
import { getRequestErrorMessage } from '../helpers/getRequestErrorMessage';
import { getPokemonResultsQueryKey } from '../query/pokemonQueryKeys';
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
  const resultsQuery = useQuery({
    queryFn: () => fetchPokemonResults(submittedSearchTerm, currentPage),
    queryKey: getPokemonResultsQueryKey(submittedSearchTerm, currentPage),
  });

  return {
    errorMessage: resultsQuery.error
      ? getRequestErrorMessage(resultsQuery.error)
      : '',
    isLoading: resultsQuery.isPending,
    items: resultsQuery.data?.items ?? [],
    totalPages: resultsQuery.data?.totalPages ?? 1,
  };
}
