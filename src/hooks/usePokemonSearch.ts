'use client';

import { useEffect } from 'react';
import { usePokemonSearchStore } from '../store/pokemonSearchStore';
import type { SearchResultItem, SearchResultsPage } from '../types/search';
import { usePokemonDetailsParam } from './usePokemonDetailsParam';
import { usePokemonPageParam } from './usePokemonPageParam';
import { usePokemonResults } from './usePokemonResults';

type UsePokemonSearchResult = {
  getPageHref: (page: number) => string;
  getDetailsHref: (detailsId: string | null) => string;
  currentPage: number;
  errorMessage: string;
  handleSearchTermChange: (value: string) => void;
  isLoading: boolean;
  items: SearchResultItem[];
  refreshResults: () => Promise<void>;
  searchTerm: string;
  selectedPokemonId: string | null;
  totalPages: number;
};

export function usePokemonSearch(
  initialSearchTerm?: string,
  initialResults?: SearchResultsPage | null,
): UsePokemonSearchResult {
  const searchTerm = usePokemonSearchStore((state) => state.searchTerm);
  const setSearchTerm = usePokemonSearchStore((state) => state.setSearchTerm);
  const { getDetailsHref, selectedPokemonId } = usePokemonDetailsParam();
  const { currentPage, getPageHref } = usePokemonPageParam();
  const {
    errorMessage,
    isLoading,
    items,
    refreshResults,
    totalPages,
  } = usePokemonResults(
    initialSearchTerm ?? '',
    currentPage,
    initialResults,
  );

  useEffect(() => {
    if (initialSearchTerm === undefined) {
      return;
    }

    setSearchTerm(initialSearchTerm);
  }, [initialSearchTerm, setSearchTerm]);

  const handleSearchTermChange = (value: string) => {
    setSearchTerm(value);
  };

  return {
    getDetailsHref,
    getPageHref,
    currentPage,
    errorMessage,
    handleSearchTermChange,
    isLoading,
    items,
    refreshResults,
    searchTerm,
    selectedPokemonId,
    totalPages,
  };
}
