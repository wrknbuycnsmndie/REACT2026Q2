import { Pagination } from '../Pagination/Pagination';
import { ResultsEmptyState } from './ResultsEmptyState';
import { ResultsError } from './ResultsError';
import { ResultsLoader } from './ResultsLoader';
import { ResultsTable } from './ResultsTable';
import { ResultsTableBody } from './ResultsTableBody';
import type { SearchResultItem } from '../../types/search';
import './ResultsSection.css';

type ResultsSectionProps = {
    currentPage: number;
    errorMessage: string;
    isLoading: boolean;
    items: SearchResultItem[];
    onItemSelect: (detailsId: string) => void;
    onPageChange: (page: number) => void;
    selectedPokemonId: string | null;
    totalPages: number;
};

export function ResultsSection({
    currentPage,
    errorMessage,
    isLoading,
    items,
    onItemSelect,
    onPageChange,
    selectedPokemonId,
    totalPages,
}: ResultsSectionProps) {
    const showPagination = !isLoading && errorMessage === '' && items.length > 0 && totalPages > 1;

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

            <ResultsTable>
                {isLoading ? <ResultsLoader /> : null}
                {!isLoading && errorMessage !== '' ? <ResultsError message={errorMessage} /> : null}
                {!isLoading && errorMessage === '' && items.length > 0 ? (
                    <ResultsTableBody
                        items={items}
                        onItemSelect={onItemSelect}
                        selectedPokemonId={selectedPokemonId}
                    />
                ) : null}
                {!isLoading && errorMessage === '' && items.length === 0 ? (
                    <ResultsEmptyState />
                ) : null}
            </ResultsTable>

            {showPagination ? (
                <Pagination
                    currentPage={currentPage}
                    onPageChange={onPageChange}
                    totalPages={totalPages}
                />
            ) : null}
        </section>
    );
}
