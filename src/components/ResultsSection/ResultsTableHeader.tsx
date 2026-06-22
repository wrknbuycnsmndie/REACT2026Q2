import { useTranslations } from 'next-intl';

export function ResultsTableHeader() {
  const t = useTranslations('ResultsSection');

  return (
    <div className="results-section__row results-section__row--head">
      <span className="results-section__select">{t('select')}</span>
      <span className="results-section__name">{t('pokemonName')}</span>
    </div>
  );
}
