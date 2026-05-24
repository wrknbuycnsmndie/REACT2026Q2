import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SelectedPokemonFlyout } from '../../../components/SelectedPokemonFlyout/SelectedPokemonFlyout';
import {
  resetSelectedPokemonStore,
  useSelectedPokemonStore,
} from '../../../store/selectedPokemonStore';

describe('SelectedPokemonFlyout', () => {
  beforeEach(() => {
    resetSelectedPokemonStore();
  });

  it('does not render when there are no selected items', () => {
    render(<SelectedPokemonFlyout />);

    expect(
      screen.queryByRole('complementary', { name: 'Selected Pokemon' }),
    ).not.toBeInTheDocument();
  });

  it('renders the selected count and clears all selected items', async () => {
    const user = userEvent.setup();

    useSelectedPokemonStore.getState().selectPokemon({
      id: '25',
      name: 'pikachu',
      url: 'https://pokeapi.co/api/v2/pokemon/25/',
    });
    useSelectedPokemonStore.getState().selectPokemon({
      id: '133',
      name: 'eevee',
      url: 'https://pokeapi.co/api/v2/pokemon/133/',
    });

    render(<SelectedPokemonFlyout />);

    expect(screen.getByText('2 selected')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Unselect all' }));

    expect(
      screen.queryByRole('complementary', { name: 'Selected Pokemon' }),
    ).not.toBeInTheDocument();
  });

  it('renders a download button when items are selected', () => {
    useSelectedPokemonStore.getState().selectPokemon({
      id: '25',
      name: 'pikachu',
      url: 'https://pokeapi.co/api/v2/pokemon/25/',
    });

    render(<SelectedPokemonFlyout />);

    expect(screen.getByRole('button', { name: 'Download' })).toBeInTheDocument();
  });
});
