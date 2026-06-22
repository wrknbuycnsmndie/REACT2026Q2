import { useTranslations } from 'next-intl';

type ResultsErrorProps = {
    message: string;
};

export function ResultsError({ message }: ResultsErrorProps) {
    const t = useTranslations('ResultsSection');

    return (
        <div className="results-error" aria-live="polite">
            <p className="results-error__label">{t('requestFailed')}</p>
            <p className="results-error__message">{message}</p>
        </div>
    );
}
