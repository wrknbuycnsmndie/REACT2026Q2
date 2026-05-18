import { PokemonDetailsPanel } from '../components/PokemonDetails/PokemonDetailsPanel';
import { usePokemonDetails } from '../hooks/usePokemonDetails';
import { usePokemonDetailsParam } from '../hooks/usePokemonDetailsParam';

export function PokemonDetailsRoute() {
  const { closeDetails, selectedPokemonId } = usePokemonDetailsParam();
  const { details, errorMessage, isLoading } = usePokemonDetails(
    selectedPokemonId,
  );

  if (!selectedPokemonId) {
    return null;
  }

  return (
    <PokemonDetailsPanel
      details={details}
      errorMessage={errorMessage}
      isLoading={isLoading}
      onClose={closeDetails}
    />
  );
}
