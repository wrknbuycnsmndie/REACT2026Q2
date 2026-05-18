import type { ReactNode } from 'react';
import { ResultsError } from './ResultsError';
import { ResultRow } from './ResultRow';
import { ResultsLoader } from './ResultsLoader';
import type { SearchResultItem } from '../../types/search';
import './ResultsSection.css';

type ResultsSectionProps = {
    errorMessage: string;
    isLoading: boolean;
    items: SearchResultItem[];
};

export function ResultsSection({ errorMessage, isLoading, items }: ResultsSectionProps) {
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

                {renderContent(errorMessage, isLoading, items)}
            </div>
        </section>
    );
}

function renderContent(
    errorMessage: string,
    isLoading: boolean,
    items: SearchResultItem[],
): ReactNode {
    if (isLoading) {
        return <ResultsLoader />;
    }

    if (errorMessage !== '') {
        return <ResultsError message={errorMessage} />;
    }

    if (items.length > 0) {
        return (
            <ul className="results-section__list">
                {items.map((item) => (
                    <ResultRow key={item.id} item={item} />
                ))}
            </ul>
        );
    }

    return <p className="results-section__empty">No results to display yet.</p>;
}
