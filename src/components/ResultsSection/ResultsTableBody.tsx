import { ResultsTableRow } from './ResultsTableRow';
import type { SearchResultItem } from '../../types/search';

type ResultsTableBodyProps = {
  currentPage: number;
  items: SearchResultItem[];
  onItemSelect: (detailsId: string) => void;
  selectedPokemonId: string | null;
};

export function ResultsTableBody({
  currentPage,
  items,
  onItemSelect,
  selectedPokemonId,
}: ResultsTableBodyProps) {
  return (
    <ul className="results-section__list">
      {items.map((item) => (
        <ResultsTableRow
          currentPage={currentPage}
          key={item.id}
          isActive={item.id === selectedPokemonId}
          item={item}
          onSelect={onItemSelect}
        />
      ))}
    </ul>
  );
}
