import { useTranslations } from 'next-intl';

type PaginationProps = {
    currentPage: number;
    onPageChange: (page: number) => void;
    totalPages: number;
};

export function Pagination({
    currentPage,
    onPageChange,
    totalPages,
}: PaginationProps) {
    const t = useTranslations('Pagination');

    return (
        <nav className="pagination" aria-label={t('label')}>
            <button
                className="pagination__button"
                type="button"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                {t('previous')}
            </button>
            <p className="pagination__status">
                {t('status', { currentPage, totalPages })}
            </p>
            <button
                className="pagination__button"
                type="button"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                {t('next')}
            </button>
        </nav>
    );
}
