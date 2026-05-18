import type { ChangeEvent, SyntheticEvent } from 'react';
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
    searchTerm,
    selectedPokemonId,
    submitSearch,
    totalPages,
  } = usePokemonSearch();

  const handleSearchInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleSearchTermChange(event.target.value);
  };

  const handleSearchSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    void submitSearch();
  };

  if (shouldThrowError) {
    throw new Error('Test error boundary triggered.');
  }

  return (
    <div className='pokemon-search'>
      <SearchSection
        onTestError={onTestError}
        searchTerm={searchTerm}
        onSearchTermChange={handleSearchInputChange}
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
