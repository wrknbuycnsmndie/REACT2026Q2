import { useState } from 'react';
import { getRequestErrorMessage } from '../../helpers/getRequestErrorMessage';
import { downloadSelectedPokemonCsv } from '../../services/downloadSelectedPokemonCsv';
import {
  selectSelectedPokemonCount,
  selectSelectedPokemonItems,
  useSelectedPokemonStore,
} from '../../store/selectedPokemonStore';

export function SelectedPokemonFlyout() {
  const clearSelectedPokemon = useSelectedPokemonStore(
    (state) => state.clearSelectedPokemon,
  );
  const selectedPokemonCount = useSelectedPokemonStore(
    selectSelectedPokemonCount,
  );
  const [downloadErrorMessage, setDownloadErrorMessage] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);

  if (selectedPokemonCount === 0) {
    return null;
  }

  const handleDownload = async () => {
    setDownloadErrorMessage('');
    setIsDownloading(true);

    try {
      const selectedPokemonItems = selectSelectedPokemonItems(
        useSelectedPokemonStore.getState(),
      );
      await downloadSelectedPokemonCsv(selectedPokemonItems);
    } catch (error) {
      setDownloadErrorMessage(getRequestErrorMessage(error));
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <aside className='selected-pokemon-flyout' aria-label='Selected Pokemon'>
      <div className='selected-pokemon-flyout__status'>
        <p className='selected-pokemon-flyout__summary'>
          {selectedPokemonCount} selected
        </p>
        {downloadErrorMessage ? (
          <p className='selected-pokemon-flyout__error' aria-live='polite'>
            {downloadErrorMessage}
          </p>
        ) : null}
      </div>
      <div className='selected-pokemon-flyout__actions'>
        <button
          className='selected-pokemon-flyout__button'
          type='button'
          disabled={isDownloading}
          onClick={clearSelectedPokemon}
        >
          Unselect all
        </button>
        <button
          className='selected-pokemon-flyout__button selected-pokemon-flyout__button--accent'
          type='button'
          disabled={isDownloading}
          onClick={handleDownload}
        >
          {isDownloading ? 'Preparing...' : 'Download'}
        </button>
      </div>
    </aside>
  );
}
