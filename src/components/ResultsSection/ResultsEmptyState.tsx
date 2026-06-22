import { useTranslations } from 'next-intl';

export function ResultsEmptyState() {
    const t = useTranslations('ResultsSection');

    return <p className="results-section__empty">{t('empty')}</p>;
}
