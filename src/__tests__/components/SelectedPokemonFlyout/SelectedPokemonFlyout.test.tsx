import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { SelectedPokemonFlyout } from '../../../components/SelectedPokemonFlyout/SelectedPokemonFlyout';
import { downloadSelectedPokemonCsv } from '../../../services/downloadSelectedPokemonCsv';
import {
  resetSelectedPokemonStore,
  useSelectedPokemonStore,
} from '../../../store/selectedPokemonStore';
import { renderWithIntl } from '../../testUtils/renderWithIntl';

vi.mock('../../../services/downloadSelectedPokemonCsv', () => ({
  downloadSelectedPokemonCsv: vi.fn(),
}));

describe('SelectedPokemonFlyout', () => {
  beforeEach(() => {
    resetSelectedPokemonStore();
    vi.mocked(downloadSelectedPokemonCsv).mockReset();
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

  it('downloads the selected items when requested', async () => {
    const user = userEvent.setup();
    useSelectedPokemonStore.getState().selectPokemon(
      {
        id: '25',
        name: 'pikachu',
        url: 'https://pokeapi.co/api/v2/pokemon/25/',
      },
      4,
    );

    renderWithIntl(<SelectedPokemonFlyout />);

    await user.click(screen.getByRole('button', { name: 'Download' }));

    expect(downloadSelectedPokemonCsv).toHaveBeenCalledWith([
      {
        detailsRoute: '/?page=4&details=25',
        id: '25',
        name: 'pikachu',
        sourceUrl: 'https://pokeapi.co/api/v2/pokemon/25/',
      },
    ]);
  });

  it('shows a request error and skips download when preparing export fails', async () => {
    const user = userEvent.setup();

    useSelectedPokemonStore.getState().selectPokemon(
      {
        id: '25',
        name: 'pikachu',
        url: 'https://pokeapi.co/api/v2/pokemon/25/',
      },
      1,
    );
    vi.mocked(downloadSelectedPokemonCsv).mockRejectedValue(
      new Error(
        'The Pokemon service is unavailable right now. Please try again.',
      ),
    );

    renderWithIntl(<SelectedPokemonFlyout />);

    await user.click(screen.getByRole('button', { name: 'Download' }));

    expect(downloadSelectedPokemonCsv).toHaveBeenCalledWith([
      {
        detailsRoute: '/?page=1&details=25',
        id: '25',
        name: 'pikachu',
        sourceUrl: 'https://pokeapi.co/api/v2/pokemon/25/',
      },
    ]);
    expect(
      screen.getByText(
        'The Pokemon service is unavailable right now. Please try again.',
      ),
    ).toBeInTheDocument();
  });
});
