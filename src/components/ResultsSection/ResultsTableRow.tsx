import { selectIsPokemonSelected, useSelectedPokemonStore } from '../../store/selectedPokemonStore';
import type { SearchResultItem } from '../../types/search';
import { ResultsTableRowCheckbox } from './ResultsTableRowCheckbox';

type ResultsTableRowProps = {
  isActive: boolean;
  item: SearchResultItem;
  onSelect: (detailsId: string) => void;
};

export function ResultsTableRow({
  isActive,
  item,
  onSelect,
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
          onChange={() => togglePokemonSelection(item)}
        />
        <button
          className={`results-section__result-button${isActive ? ' results-section__result-button--active' : ''}`}
          type="button"
          onClick={() => onSelect(item.id)}
        >
          <span className="results-section__result-name">{item.name}</span>
        </button>
      </div>
    </li>
  );
}
