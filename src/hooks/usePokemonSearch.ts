import { DEFAULT_PAGE } from '../constants/pagination';
import { usePokemonSearchStore } from '../store/pokemonSearchStore';
import type { SearchResultItem } from '../types/search';
import { usePokemonDetailsParam } from './usePokemonDetailsParam';
import { usePokemonPageParam } from './usePokemonPageParam';
import { usePokemonResults } from './usePokemonResults';

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
  const searchTerm = usePokemonSearchStore((state) => state.searchTerm);
  const setSearchTerm = usePokemonSearchStore((state) => state.setSearchTerm);
  const submitSearchTerm = usePokemonSearchStore((state) => state.submitSearchTerm);
  const submittedSearchTerm = usePokemonSearchStore(
    (state) => state.submittedSearchTerm,
  );
  const { openDetails, selectedPokemonId } = usePokemonDetailsParam();
  const { currentPage, goToPage, resetPage } = usePokemonPageParam();
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

    submitSearchTerm(trimmedSearchTerm);

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
