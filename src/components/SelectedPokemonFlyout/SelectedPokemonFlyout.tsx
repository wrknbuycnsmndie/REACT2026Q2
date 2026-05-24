import { selectSelectedPokemonCount, useSelectedPokemonStore } from '../../store/selectedPokemonStore';
import './SelectedPokemonFlyout.css';

export function SelectedPokemonFlyout() {
  const clearSelectedPokemon = useSelectedPokemonStore(
    (state) => state.clearSelectedPokemon,
  );
  const selectedPokemonCount = useSelectedPokemonStore(selectSelectedPokemonCount);

  if (selectedPokemonCount === 0) {
    return null;
  }

  return (
    <aside className="selected-pokemon-flyout" aria-label="Selected Pokemon">
      <p className="selected-pokemon-flyout__summary">
        {selectedPokemonCount} selected
      </p>
      <div className="selected-pokemon-flyout__actions">
        <button
          className="selected-pokemon-flyout__button"
          type="button"
          onClick={clearSelectedPokemon}
        >
          Unselect all
        </button>
        <button
          className="selected-pokemon-flyout__button selected-pokemon-flyout__button--accent"
          type="button"
        >
          Download
        </button>
      </div>
    </aside>
  );
}
