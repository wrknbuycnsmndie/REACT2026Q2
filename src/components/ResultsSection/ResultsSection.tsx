import { useTranslations } from 'next-intl';
import { Pagination } from '../Pagination/Pagination';
import { ResultsEmptyState } from './ResultsEmptyState';
import { ResultsError } from './ResultsError';
import { ResultsLoader } from './ResultsLoader';
import { ResultsTable } from './ResultsTable';
import { ResultsTableBody } from './ResultsTableBody';
import type { SearchResultItem } from '../../types/search';

type ResultsSectionProps = {
    getDetailsHref: (detailsId: string | null) => string;
    getPageHref: (page: number) => string;
    currentPage: number;
    errorMessage: string;
    isLoading: boolean;
    items: SearchResultItem[];
    selectedPokemonId: string | null;
    totalPages: number;
};

export function ResultsSection({
    getDetailsHref,
    getPageHref,
    currentPage,
    errorMessage,
    isLoading,
    items,
    selectedPokemonId,
    totalPages,
}: ResultsSectionProps) {
    const t = useTranslations('ResultsSection');
    const showPagination = !isLoading && errorMessage === '' && items.length > 0 && totalPages > 1;

    return (
        <section className="results-section" aria-labelledby="results-title">
            <div className="results-section__header">
                <h2 id="results-title" className="results-section__title">
                    {t('title')}
                </h2>
                <p className="results-section__description">
                    {t('description')}
                </p>
            </div>

            <ResultsTable>
                {isLoading ? <ResultsLoader /> : null}
                {!isLoading && errorMessage !== '' ? <ResultsError message={errorMessage} /> : null}
                {!isLoading && errorMessage === '' && items.length > 0 ? (
                    <ResultsTableBody
                        currentPage={currentPage}
                        getDetailsHref={getDetailsHref}
                        items={items}
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
                    getPageHref={getPageHref}
                    totalPages={totalPages}
                />
            ) : null}
        </section>
    );
}
