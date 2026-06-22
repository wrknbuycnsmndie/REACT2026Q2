import { useTranslations } from 'next-intl';

export function ResultsLoader() {
    const t = useTranslations('ResultsSection');

    return (
        <div className="results-loader" aria-live="polite">
            <span className="results-loader__spinner" />
            <p className="results-loader__text">{t('loading')}</p>
        </div>
    );
}
