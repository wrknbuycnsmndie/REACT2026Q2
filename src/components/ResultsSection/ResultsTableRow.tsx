import { Link } from '../../i18n/navigation';
import { selectIsPokemonSelected, useSelectedPokemonStore } from '../../store/selectedPokemonStore';
import type { SearchResultItem } from '../../types/search';
import { ResultsTableRowCheckbox } from './ResultsTableRowCheckbox';

type ResultsTableRowProps = {
  currentPage: number;
  detailsHref: string;
  isActive: boolean;
  item: SearchResultItem;
};

export function ResultsTableRow({
  currentPage,
  detailsHref,
  isActive,
  item,
}: ResultsTableRowProps) {
  const isSelected = useSelectedPokemonStore(selectIsPokemonSelected(item.id));
  const togglePokemonSelection = useSelectedPokemonStore(
    (state) => state.togglePokemonSelection,
  );

  return (
    <li className="results-section__result" aria-label={item.name}>
      <div className="results-section__row">
        <ResultsTableRowCheckbox
          checked={isSelected}
          itemName={item.name}
          onChange={() => togglePokemonSelection(item, currentPage)}
        />
        <Link
          className={`results-section__result-button${isActive ? ' results-section__result-button--active' : ''}`}
          href={detailsHref}
        >
          <span className="results-section__result-name">{item.name}</span>
        </Link>
      </div>
    </li>
  );
}
