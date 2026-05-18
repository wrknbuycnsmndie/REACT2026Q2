import type { ChangeEvent, SyntheticEvent } from 'react';
import { usePokemonSearch } from '../../hooks/usePokemonSearch';
import { ResultsSection } from '../ResultsSection/ResultsSection';
import { SearchSection } from '../SearchSection/SearchSection';

type PokemonSearchProps = {
  onTestError: () => void;
  shouldThrowError: boolean;
};

export function PokemonSearch({
  onTestError,
  shouldThrowError,
}: PokemonSearchProps) {
  const {
    errorMessage,
    isLoading,
    items,
    searchTerm,
    setSearchTerm,
    submitSearch,
  } = usePokemonSearch();

  const handleSearchTermChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    void submitSearch();
  };

  if (shouldThrowError) {
    throw new Error('Test error boundary triggered.');
  }

  return (
    <>
      <SearchSection
        onTestError={onTestError}
        searchTerm={searchTerm}
        onSearchTermChange={handleSearchTermChange}
        onSubmit={handleSearchSubmit}
      />
      <ResultsSection
        errorMessage={errorMessage}
        isLoading={isLoading}
        items={items}
      />
    </>
  );
}
