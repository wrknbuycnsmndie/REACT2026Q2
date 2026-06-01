import { usePokemonSearch } from '../../hooks/usePokemonSearch';
import { ResultsSection } from '../ResultsSection/ResultsSection';
import { SearchSection } from '../SearchSection/SearchSection';
import './PokemonSearch.css';

type PokemonSearchProps = {
  onTestError: () => void;
  shouldThrowError: boolean;
};

export function PokemonSearch({
  onTestError,
  shouldThrowError,
}: PokemonSearchProps) {
  const {
    currentPage,
    errorMessage,
    goToPage,
    handleSearchTermChange,
    isLoading,
    items,
    openDetails,
    refreshResults,
    searchTerm,
    selectedPokemonId,
    submitSearch,
    totalPages,
  } = usePokemonSearch();

  const handleSearchSubmit = () => {
    void submitSearch();
  };

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
        onSubmit={handleSearchSubmit}
      />
      <ResultsSection
        currentPage={currentPage}
        errorMessage={errorMessage}
        isLoading={isLoading}
        items={items}
        onItemSelect={openDetails}
        onPageChange={goToPage}
        selectedPokemonId={selectedPokemonId}
        totalPages={totalPages}
      />
    </div>
  );
}
