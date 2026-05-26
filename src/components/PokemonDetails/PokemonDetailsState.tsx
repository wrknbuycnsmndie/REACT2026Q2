type PokemonDetailsStateProps = {
  message: string;
};

export function PokemonDetailsState({ message }: PokemonDetailsStateProps) {
  return <p className='pokemon-details__state'>{message}</p>;
}
