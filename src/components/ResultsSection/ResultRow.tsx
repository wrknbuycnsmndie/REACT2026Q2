import { Component } from 'react';
import type { SearchResultItem } from '../../types/search';

type ResultRowProps = {
    item: SearchResultItem;
};

export class ResultRow extends Component<ResultRowProps> {
    public render() {
        const { item } = this.props;

        return (
            <li className="results-section__result" aria-label={item.name}>
                <span className="results-section__result-name">{item.name}</span>
                <span className="results-section__result-description">{item.description}</span>
            </li>
        );
    }
}
