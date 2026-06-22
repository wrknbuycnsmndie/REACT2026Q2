import { usePokemonSearch } from '../../hooks/usePokemonSearch';
import type { SearchResultsPage } from '../../types/search';
import { ResultsSection } from '../ResultsSection/ResultsSection';
import { SearchSection } from '../SearchSection/SearchSection';

type PokemonSearchProps = {
  initialResults?: SearchResultsPage | null;
  initialSearchTerm?: string;
  onTestError: () => void;
  shouldThrowError: boolean;
};

export function PokemonSearch({
  initialResults = null,
  initialSearchTerm,
  onTestError,
  shouldThrowError,
}: PokemonSearchProps) {
  const {
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
  } = usePokemonSearch(initialSearchTerm, initialResults);

  const handleRefresh = () => {
    void refreshResults();
  };

  if (shouldThrowError) {
    throw new Error('Test error boundary triggered.');
  }

  return (
    <div className='pokemon-search'>
      <SearchSection
        onTestError={onTestError}
        onRefresh={handleRefresh}
        searchTerm={searchTerm}
        onSearchTermChange={handleSearchTermChange}
      />
      <ResultsSection
        getDetailsHref={getDetailsHref}
        getPageHref={getPageHref}
        currentPage={currentPage}
        errorMessage={errorMessage}
        isLoading={isLoading}
        items={items}
        selectedPokemonId={selectedPokemonId}
        totalPages={totalPages}
      />
    </div>
  );
}
