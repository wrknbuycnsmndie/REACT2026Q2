import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SelectedPokemonFlyout } from '../../../components/SelectedPokemonFlyout/SelectedPokemonFlyout';
import {
  resetSelectedPokemonStore,
  useSelectedPokemonStore,
} from '../../../store/selectedPokemonStore';
import { renderWithIntl } from '../../testUtils/renderWithIntl';

describe('SelectedPokemonFlyout', () => {
  beforeEach(() => {
    resetSelectedPokemonStore();
  });

  it('does not render when there are no selected items', () => {
    renderWithIntl(<SelectedPokemonFlyout />);

    expect(
      screen.queryByRole('complementary', { name: 'Selected Pokemon' }),
    ).not.toBeInTheDocument();
  });

  it('renders the selected count and clears all selected items', async () => {
    const user = userEvent.setup();

    useSelectedPokemonStore.getState().selectPokemon(
      {
        id: '25',
        name: 'pikachu',
        url: 'https://pokeapi.co/api/v2/pokemon/25/',
      },
      1,
    );
    useSelectedPokemonStore.getState().selectPokemon(
      {
        id: '133',
        name: 'eevee',
        url: 'https://pokeapi.co/api/v2/pokemon/133/',
      },
      2,
    );

    renderWithIntl(<SelectedPokemonFlyout />);

    expect(screen.getByText('2 selected')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Unselect all' }));

    expect(
      screen.queryByRole('complementary', { name: 'Selected Pokemon' }),
    ).not.toBeInTheDocument();
  });

  it('submits the selected items to the csv export endpoint', () => {
    useSelectedPokemonStore.getState().selectPokemon(
      {
        id: '25',
        name: 'pikachu',
        url: 'https://pokeapi.co/api/v2/pokemon/25/',
      },
      4,
    );

    renderWithIntl(<SelectedPokemonFlyout />);

    expect(screen.getByRole('button', { name: 'Download' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Download' })).toHaveAttribute(
      'type',
      'submit',
    );
    expect(
      screen.getByDisplayValue(
        JSON.stringify([
          {
            detailsRoute: '/?page=4&details=25',
            id: '25',
            name: 'pikachu',
            sourceUrl: 'https://pokeapi.co/api/v2/pokemon/25/',
          },
        ]),
      ),
    ).toHaveAttribute('name', 'items');
  });
});
