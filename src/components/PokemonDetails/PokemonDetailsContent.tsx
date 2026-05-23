import type { PokemonDetails } from '../../types/pokemon';

type PokemonDetailsContentProps = {
  details: PokemonDetails;
};

export function PokemonDetailsContent({ details }: PokemonDetailsContentProps) {
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
