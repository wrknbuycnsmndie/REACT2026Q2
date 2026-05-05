import { Component } from 'react';
import { ResultRow } from './ResultRow';
import type { SearchResultItem } from '../../types/search';
import './ResultsSection.css';

type ResultsSectionProps = {
    items: SearchResultItem[];
};

export class ResultsSection extends Component<ResultsSectionProps> {
    public render() {
        const { items } = this.props;

        return (
            <section className="results-section" aria-labelledby="results-title">
                <div className="results-section__header">
                    <h2 id="results-title" className="results-section__title">
                        Results
                    </h2>
                    <p className="results-section__description">
                        Search results will appear here once the data layer is implemented.
                    </p>
                </div>

                <div className="results-section__table">
                    <div className="results-section__row results-section__row--head">
                        <span className="results-section__name">Item Name</span>
                        <span className="results-section__details">Item Description</span>
                    </div>

                    {items.length > 0 ? (
                        <ul className="results-section__list">
                            {items.map((item) => (
                                <ResultRow key={item.id} item={item} />
                            ))}
                        </ul>
                    ) : (
                        <p className="results-section__empty">No results to display yet.</p>
                    )}
                </div>
            </section>
        );
    }
}
