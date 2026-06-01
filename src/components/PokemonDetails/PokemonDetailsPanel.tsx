import { PokemonDetailsContent } from './PokemonDetailsContent';
import { PokemonDetailsState } from './PokemonDetailsState';
import type { PokemonDetails } from '../../types/pokemon';
import './PokemonDetailsPanel.css';

type PokemonDetailsPanelProps = {
  details: PokemonDetails | null;
  errorMessage: string;
  isLoading: boolean;
  onClose: () => void;
  onRefresh: () => void;
};

export function PokemonDetailsPanel({
  details,
  errorMessage,
  isLoading,
  onClose,
  onRefresh,
}: PokemonDetailsPanelProps) {
  return (
    <aside className='pokemon-details' onClick={onClose}>
      <div
        className='pokemon-details__dialog'
        aria-labelledby='pokemon-details-title'
        aria-modal='false'
        role='dialog'
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <div className='pokemon-details__header'>
          <h2 id='pokemon-details-title' className='pokemon-details__title'>
            Details
          </h2>
          <div className='pokemon-details__actions'>
            <button
              className='pokemon-details__close'
              type='button'
              onClick={onRefresh}
            >
              Refresh
            </button>
            <button
              className='pokemon-details__close'
              type='button'
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>

        {isLoading ? <PokemonDetailsState message='Loading details...' /> : null}
        {!isLoading && errorMessage ? (
          <PokemonDetailsState message={errorMessage} />
        ) : null}
        {!isLoading && !errorMessage && !details ? (
          <PokemonDetailsState message='Unable to load details.' />
        ) : null}
        {!isLoading && !errorMessage && details ? (
          <PokemonDetailsContent details={details} />
        ) : null}
      </div>
    </aside>
  );
}
