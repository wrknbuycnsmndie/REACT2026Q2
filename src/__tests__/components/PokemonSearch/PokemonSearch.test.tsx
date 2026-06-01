import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { vi } from 'vitest';
import { PokemonSearch } from '../../../components/PokemonSearch/PokemonSearch';
import { SelectedPokemonFlyout } from '../../../components/SelectedPokemonFlyout/SelectedPokemonFlyout';
import { resetPokemonDetailsStore } from '../../../store/pokemonDetailsStore';
import { resetPokemonSearchStore } from '../../../store/pokemonSearchStore';
import { renderWithQueryClient } from '../../testUtils/renderWithQueryClient';
import {
  mockedFetchPokemonResults,
  mockedGetStoredSearchTerm,
  mockedSetStoredSearchTerm,
  resetPokemonSearchMocks,
} from '../../testUtils/pokemonSearchMocks';

vi.mock('../../../services/pokemon', () => ({
  fetchPokemonDetails: vi.fn(),
  fetchPokemonResults: vi.fn(),
}));

vi.mock('../../../services/localStorageService', () => ({
  getStoredSearchTerm: vi.fn(),
  setStoredSearchTerm: vi.fn(),
}));

describe('PokemonSearch', () => {
  const renderPokemonSearch = (initialEntries = ['/']) =>
    renderWithQueryClient(
      <MemoryRouter initialEntries={initialEntries}>
        <PokemonSearch onTestError={vi.fn()} shouldThrowError={false} />
        <SelectedPokemonFlyout />
      </MemoryRouter>,
    );

  beforeEach(() => {
    resetPokemonSearchMocks();
    resetPokemonDetailsStore();
    resetPokemonSearchStore();
  });

  it('loads initial mocked results on mount', async () => {
    mockedFetchPokemonResults.mockResolvedValue({
      items: [
        {
          id: '25',
          name: 'pikachu',
          url: 'https://pokeapi.co/api/v2/pokemon/25/',
        },
      ],
      page: 1,
      totalPages: 1,
    });

    renderPokemonSearch();

    expect(mockedFetchPokemonResults).toHaveBeenCalledWith('', 1);

    expect(await screen.findByLabelText('pikachu')).toBeInTheDocument();
  });

  it('renders an error state when the mocked initial request fails', async () => {
    mockedFetchPokemonResults.mockRejectedValue(
      new Error('Mocked API failure'),
    );

    renderPokemonSearch();

    expect(mockedFetchPokemonResults).toHaveBeenCalledWith('', 1);

    expect(await screen.findByText('Request failed')).toBeInTheDocument();
    expect(screen.getByText('Mocked API failure')).toBeInTheDocument();
  });

  it('calls the mocked API and updates results after a search submit', async () => {
    const user = userEvent.setup();

    mockedFetchPokemonResults
      .mockResolvedValueOnce({ items: [], page: 1, totalPages: 3 })
      .mockResolvedValueOnce({
        items: [
          {
            id: '133',
            name: 'eevee',
            url: 'https://pokeapi.co/api/v2/pokemon/133/',
          },
        ],
        page: 1,
        totalPages: 1,
      });

    renderPokemonSearch();

    await screen.findByText('No results to display yet.');

    await user.type(
      screen.getByRole('searchbox', { name: 'Pokemon name' }),
      '  Eevee  ',
    );
    await user.click(screen.getByRole('button', { name: 'Search' }));

    await waitFor(() => {
      expect(mockedFetchPokemonResults).toHaveBeenNthCalledWith(2, 'Eevee', 1);
    });

    expect(await screen.findByLabelText('eevee')).toBeInTheDocument();
  });

  it('restores the stored search term on mount and uses it for the initial request', async () => {
    mockedGetStoredSearchTerm.mockReturnValue('snorlax');
    resetPokemonSearchStore();
    mockedFetchPokemonResults.mockResolvedValue({
      items: [
        {
          id: '143',
          name: 'snorlax',
          url: 'https://pokeapi.co/api/v2/pokemon/143/',
        },
      ],
      page: 1,
      totalPages: 1,
    });

    renderPokemonSearch();

    expect(screen.getByRole('searchbox', { name: 'Pokemon name' })).toHaveValue(
      'snorlax',
    );
    expect(mockedFetchPokemonResults).toHaveBeenCalledWith('snorlax', 1);
    expect(await screen.findByLabelText('snorlax')).toBeInTheDocument();
  });

  it('renders a mocked error response after a submitted search fails', async () => {
    const user = userEvent.setup();

    mockedFetchPokemonResults.mockResolvedValueOnce({
      items: [],
      page: 1,
      totalPages: 3,
    });
    mockedFetchPokemonResults.mockRejectedValueOnce(
      new Error('Mocked submit failure'),
    );

    renderPokemonSearch();

    await screen.findByText('No results to display yet.');

    await user.type(
      screen.getByRole('searchbox', { name: 'Pokemon name' }),
      'mew',
    );
    await user.click(screen.getByRole('button', { name: 'Search' }));

    expect(
      await screen.findByText('Mocked submit failure'),
    ).toBeInTheDocument();
    expect(screen.getByText('Request failed')).toBeInTheDocument();
  });

  it('does not call the API again when submitting the same trimmed term', async () => {
    const user = userEvent.setup();

    mockedGetStoredSearchTerm.mockReturnValue('mew');
    resetPokemonSearchStore();
    mockedFetchPokemonResults.mockResolvedValue({
      items: [
        {
          id: '151',
          name: 'mew',
          url: 'https://pokeapi.co/api/v2/pokemon/151/',
        },
      ],
      page: 1,
      totalPages: 1,
    });

    renderPokemonSearch();

    await screen.findByLabelText('mew');

    await user.clear(screen.getByRole('searchbox', { name: 'Pokemon name' }));
    await user.type(
      screen.getByRole('searchbox', { name: 'Pokemon name' }),
      '  mew  ',
    );
    await user.click(screen.getByRole('button', { name: 'Search' }));

    expect(mockedFetchPokemonResults).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('searchbox', { name: 'Pokemon name' })).toHaveValue(
      'mew',
    );
  });

  it('stores the trimmed search term after a successful user search', async () => {
    const user = userEvent.setup();

    mockedFetchPokemonResults
      .mockResolvedValueOnce({ items: [], page: 1, totalPages: 3 })
      .mockResolvedValueOnce({
        items: [
          {
            id: '150',
            name: 'mewtwo',
            url: 'https://pokeapi.co/api/v2/pokemon/150/',
          },
        ],
        page: 1,
        totalPages: 1,
      });

    renderPokemonSearch();

    await screen.findByText('No results to display yet.');

    await user.type(
      screen.getByRole('searchbox', { name: 'Pokemon name' }),
      '  mewtwo ',
    );
    await user.click(screen.getByRole('button', { name: 'Search' }));

    await waitFor(() => {
      expect(mockedSetStoredSearchTerm).toHaveBeenCalledWith('mewtwo');
    });

    expect(await screen.findByLabelText('mewtwo')).toBeInTheDocument();
  });

  it('loads the page from the URL and updates results when navigating pages', async () => {
    const user = userEvent.setup();

    mockedFetchPokemonResults
      .mockResolvedValueOnce({
        items: [
          {
            id: '11',
            name: 'metapod',
            url: 'https://pokeapi.co/api/v2/pokemon/11/',
          },
        ],
        page: 2,
        totalPages: 3,
      })
      .mockResolvedValueOnce({
        items: [
          {
            id: '21',
            name: 'spearow',
            url: 'https://pokeapi.co/api/v2/pokemon/21/',
          },
        ],
        page: 3,
        totalPages: 3,
      });

    renderPokemonSearch(['/?page=2']);

    expect(await screen.findByLabelText('metapod')).toBeInTheDocument();
    expect(screen.getByText('Page 2 of 3')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Next page' }));

    await waitFor(() => {
      expect(mockedFetchPokemonResults).toHaveBeenNthCalledWith(2, '', 3);
    });

    expect(await screen.findByLabelText('spearow')).toBeInTheDocument();
    expect(screen.getByText('Page 3 of 3')).toBeInTheDocument();
  });

  it('keeps the flyout visible after navigating away from a selected item', async () => {
    const user = userEvent.setup();

    mockedFetchPokemonResults
      .mockResolvedValueOnce({
        items: [
          {
            id: '25',
            name: 'pikachu',
            url: 'https://pokeapi.co/api/v2/pokemon/25/',
          },
        ],
        page: 1,
        totalPages: 2,
      })
      .mockResolvedValueOnce({
        items: [
          {
            id: '4',
            name: 'charmander',
            url: 'https://pokeapi.co/api/v2/pokemon/4/',
          },
        ],
        page: 2,
        totalPages: 2,
      });

    renderPokemonSearch();

    await user.click(
      await screen.findByRole('checkbox', { name: 'Select pikachu' }),
    );
    expect(screen.getByText('1 selected')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Next page' }));

    expect(await screen.findByLabelText('charmander')).toBeInTheDocument();
    expect(screen.getByText('1 selected')).toBeInTheDocument();
  });
});
