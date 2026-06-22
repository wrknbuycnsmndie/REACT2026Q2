import { ResultsTableRow } from './ResultsTableRow';
import type { SearchResultItem } from '../../types/search';

type ResultsTableBodyProps = {
  currentPage: number;
  getDetailsHref: (detailsId: string | null) => string;
  items: SearchResultItem[];
  selectedPokemonId: string | null;
};

export function ResultsTableBody({
  currentPage,
  getDetailsHref,
  items,
  selectedPokemonId,
}: ResultsTableBodyProps) {
  return (
    <ul className="results-section__list">
      {items.map((item) => (
        <ResultsTableRow
          currentPage={currentPage}
          detailsHref={getDetailsHref(item.id)}
          key={item.id}
          isActive={item.id === selectedPokemonId}
          item={item}
        />
      ))}
    </ul>
  );
}
