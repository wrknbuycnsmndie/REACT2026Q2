import { useState } from 'react';
import { DEFAULT_PAGE } from '../constants/pagination';
import type { SearchResultItem } from '../types/search';
import { usePokemonDetailsParam } from './usePokemonDetailsParam';
import { usePokemonPageParam } from './usePokemonPageParam';
import { usePokemonResults } from './usePokemonResults';
import { useStoredSearchTerm } from './useStoredSearchTerm';

type UsePokemonSearchResult = {
  currentPage: number;
  errorMessage: string;
  goToPage: (page: number) => void;
  handleSearchTermChange: (value: string) => void;
  isLoading: boolean;
  items: SearchResultItem[];
  openDetails: (detailsId: string) => void;
  searchTerm: string;
  selectedPokemonId: string | null;
  submitSearch: () => Promise<void>;
  totalPages: number;
};

export function usePokemonSearch(): UsePokemonSearchResult {
  const {
    initialStoredSearchTerm,
    persistSubmittedSearchTerm,
    searchTerm,
    setSearchTerm,
  } = useStoredSearchTerm();
  const { openDetails, selectedPokemonId } = usePokemonDetailsParam();
  const { currentPage, goToPage, resetPage } = usePokemonPageParam();
  const [submittedSearchTerm, setSubmittedSearchTerm] = useState(
    initialStoredSearchTerm.trim(),
  );
  const { errorMessage, isLoading, items, totalPages } = usePokemonResults(
    submittedSearchTerm,
    currentPage,
  );

  const handleSearchTermChange = (value: string) => {
    setSearchTerm(value);
  };

  const submitSearch = async () => {
    const trimmedSearchTerm = searchTerm.trim();

    if (trimmedSearchTerm === submittedSearchTerm && currentPage === DEFAULT_PAGE) {
      setSearchTerm(trimmedSearchTerm);
      return;
    }

    const persistedSearchTerm = persistSubmittedSearchTerm(trimmedSearchTerm);

    setSearchTerm(persistedSearchTerm);
    setSubmittedSearchTerm(persistedSearchTerm);

    if (currentPage !== DEFAULT_PAGE) {
      resetPage();
    }
  };

  return {
    currentPage,
    errorMessage,
    goToPage,
    handleSearchTermChange,
    isLoading,
    items,
    openDetails,
    searchTerm,
    selectedPokemonId,
    submitSearch,
    totalPages,
  };
}
