import type { PokemonDetails } from '../../types/pokemon';
import './PokemonDetailsPanel.css';

type PokemonDetailsPanelProps = {
  details: PokemonDetails | null;
  errorMessage: string;
  isLoading: boolean;
  onClose: () => void;
};

export function PokemonDetailsPanel({
  details,
  errorMessage,
  isLoading,
  onClose,
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
          <button
            className='pokemon-details__close'
            type='button'
            onClick={onClose}
          >
            Close
          </button>
        </div>

        {renderContent(details, errorMessage, isLoading)}
      </div>
    </aside>
  );
}

function renderContent(
  details: PokemonDetails | null,
  errorMessage: string,
  isLoading: boolean,
) {
  if (isLoading) {
    return <p className='pokemon-details__state'>Loading details...</p>;
  }

  if (errorMessage) {
    return <p className='pokemon-details__state'>{errorMessage}</p>;
  }

  if (!details) {
    return <p className='pokemon-details__state'>Unable to load details.</p>;
  }

  return (
    <div className='pokemon-details__content'>
      {details.imageUrl ? (
        <img
          className='pokemon-details__image'
          src={details.imageUrl}
          alt={details.name}
        />
      ) : null}

      <div className='pokemon-details__meta'>
        <h3 className='pokemon-details__name'>{details.name}</h3>
        <p className='pokemon-details__description'>{details.description}</p>
        <dl className='pokemon-details__facts'>
          <div className='pokemon-details__fact'>
            <dt>ID</dt>
            <dd>{details.id}</dd>
          </div>
          <div className='pokemon-details__fact'>
            <dt>Height</dt>
            <dd>{details.height}</dd>
          </div>
          <div className='pokemon-details__fact'>
            <dt>Weight</dt>
            <dd>{details.weight}</dd>
          </div>
          <div className='pokemon-details__fact'>
            <dt>Types</dt>
            <dd>{details.types.join(', ')}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
