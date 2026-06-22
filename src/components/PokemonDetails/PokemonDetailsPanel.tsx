import { Link } from '../../i18n/navigation';
import { PokemonDetailsRefreshButton } from './PokemonDetailsRefreshButton';
import { useTranslations } from 'next-intl';
import { PokemonDetailsContent } from './PokemonDetailsContent';
import { PokemonDetailsState } from './PokemonDetailsState';
import type { PokemonDetails } from '../../types/pokemon';

type PokemonDetailsPanelProps = {
  closeHref: string;
  details: PokemonDetails | null;
  errorMessage: string;
  isLoading: boolean;
};

export function PokemonDetailsPanel({
  closeHref,
  details,
  errorMessage,
  isLoading,
}: PokemonDetailsPanelProps) {
  const t = useTranslations('PokemonDetails');

  return (
    <aside className='pokemon-details'>
      <div
        className='pokemon-details__dialog'
        aria-labelledby='pokemon-details-title'
        aria-modal='false'
        role='dialog'
      >
        <div className='pokemon-details__header'>
          <h2 id='pokemon-details-title' className='pokemon-details__title'>
            {t('title')}
          </h2>
          <div className='pokemon-details__actions'>
            <PokemonDetailsRefreshButton label={t('refresh')} />
            <Link
              className='pokemon-details__close'
              href={closeHref}
            >
              {t('close')}
            </Link>
          </div>
        </div>

        {isLoading ? <PokemonDetailsState message={t('loading')} /> : null}
        {!isLoading && errorMessage ? (
          <PokemonDetailsState message={errorMessage} />
        ) : null}
        {!isLoading && !errorMessage && !details ? (
          <PokemonDetailsState message={t('unableToLoad')} />
        ) : null}
        {!isLoading && !errorMessage && details ? (
          <PokemonDetailsContent details={details} />
        ) : null}
      </div>
    </aside>
  );
}
