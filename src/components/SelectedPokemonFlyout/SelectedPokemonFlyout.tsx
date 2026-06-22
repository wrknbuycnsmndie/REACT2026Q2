'use client';

import { useTranslations } from 'next-intl';
import {
  selectSelectedPokemonCount,
  useSelectedPokemonStore,
} from '../../store/selectedPokemonStore';

export function SelectedPokemonFlyout() {
  const t = useTranslations('SelectedPokemonFlyout');
  const clearSelectedPokemon = useSelectedPokemonStore(
    (state) => state.clearSelectedPokemon,
  );
  const selectedPokemonCount = useSelectedPokemonStore(
    selectSelectedPokemonCount,
  );
  const selectedItemsById = useSelectedPokemonStore(
    (state) => state.selectedItemsById,
  );

  if (selectedPokemonCount === 0) {
    return null;
  }

  return (
    <aside className='selected-pokemon-flyout' aria-label={t('label')}>
      <div className='selected-pokemon-flyout__status'>
        <p className='selected-pokemon-flyout__summary'>
          {t('summary', { count: selectedPokemonCount })}
        </p>
      </div>
      <div className='selected-pokemon-flyout__actions'>
        <button
          className='selected-pokemon-flyout__button'
          type='button'
          onClick={clearSelectedPokemon}
        >
          {t('unselectAll')}
        </button>
        <form action='/api/selected-pokemon-csv' method='post'>
          <input
            type='hidden'
            name='items'
            value={JSON.stringify(Object.values(selectedItemsById))}
          />
          <button
            className='selected-pokemon-flyout__button selected-pokemon-flyout__button--accent'
            type='submit'
          >
            {t('download')}
          </button>
        </form>
      </div>
    </aside>
  );
}
