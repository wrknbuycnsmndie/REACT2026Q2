import { Link } from '../../i18n/navigation';
import { useTranslations } from 'next-intl';

type PaginationProps = {
    currentPage: number;
    getPageHref: (page: number) => string;
    totalPages: number;
};

export function Pagination({
    currentPage,
    getPageHref,
    totalPages,
}: PaginationProps) {
    const t = useTranslations('Pagination');
    const previousPage = currentPage - 1;
    const nextPage = currentPage + 1;

    return (
        <nav className="pagination" aria-label={t('label')}>
            <Link
                className="pagination__button"
                aria-disabled={currentPage === 1 ? 'true' : undefined}
                href={getPageHref(previousPage)}
                onClick={(event) => {
                    if (currentPage === 1) {
                        event.preventDefault();
                    }
                }}
            >
                {t('previous')}
            </Link>
            <p className="pagination__status">
                {t('status', { currentPage, totalPages })}
            </p>
            <Link
                className="pagination__button"
                aria-disabled={currentPage === totalPages ? 'true' : undefined}
                href={getPageHref(nextPage)}
                onClick={(event) => {
                    if (currentPage === totalPages) {
                        event.preventDefault();
                    }
                }}
            >
                {t('next')}
            </Link>
        </nav>
    );
}
