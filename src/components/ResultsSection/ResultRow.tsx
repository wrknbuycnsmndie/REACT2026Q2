import type { SearchResultItem } from '../../types/search';

type ResultRowProps = {
    isSelected: boolean;
    item: SearchResultItem;
    onSelect: (detailsId: string) => void;
};

export function ResultRow({ isSelected, item, onSelect }: ResultRowProps) {
    return (
        <li className="results-section__result" aria-label={item.name}>
            <button
                className={`results-section__result-button${isSelected ? ' results-section__result-button--selected' : ''}`}
                type="button"
                onClick={() => onSelect(item.id)}
            >
                <span className="results-section__result-name">{item.name}</span>
            </button>
        </li>
    );
}
