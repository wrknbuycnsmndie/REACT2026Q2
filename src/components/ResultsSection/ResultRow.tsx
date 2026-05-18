import type { SearchResultItem } from '../../types/search';

type ResultRowProps = {
    item: SearchResultItem;
};

export function ResultRow({ item }: ResultRowProps) {
    return (
        <li className="results-section__result" aria-label={item.name}>
            <span className="results-section__result-name">{item.name}</span>
        </li>
    );
}
