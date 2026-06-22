import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ComponentProps } from 'react';
import { vi } from 'vitest';
import { PokemonSearch } from '../../../components/PokemonSearch/PokemonSearch';
import { SelectedPokemonFlyout } from '../../../components/SelectedPokemonFlyout/SelectedPokemonFlyout';
import { resetPokemonSearchStore } from '../../../store/pokemonSearchStore';
import { setMockUrl } from '../../testUtils/nextMocks';
import { renderWithQueryClient } from '../../testUtils/renderWithQueryClient';
import {
  mockedFetchPokemonResults,
  mockedGetStoredSearchTerm,
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

function createDeferredPromise<T>() {
  let resolvePromise!: (value: T) => void;
  let rejectPromise!: (reason?: unknown) => void;

  const promise = new Promise<T>((resolve, reject) => {
    resolvePromise = resolve;
    rejectPromise = reject;
  });

  return {
    promise,
    reject: rejectPromise,
    resolve: resolvePromise,
  };
}

describe('PokemonSearch', () => {
  const renderPokemonSearch = (
    initialUrl = '/',
    props?: Partial<ComponentProps<typeof PokemonSearch>>,
  ) => {
    setMockUrl(initialUrl);

    return renderWithQueryClient(
      <>
        <PokemonSearch
          onTestError={vi.fn()}
          shouldThrowError={false}
          {...props}
        />
        <SelectedPokemonFlyout />
      </>,
    );
  };

  beforeEach(() => {
    resetPokemonSearchMocks();
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
      new TypeError('Failed to fetch'),
    );

    renderPokemonSearch();

    expect(mockedFetchPokemonResults).toHaveBeenCalledWith('', 1);

    expect(await screen.findByText('Request failed')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Unable to reach the Pokemon service. Please check your connection and try again.',
      ),
    ).toBeInTheDocument();
  });

  it('does not trigger a new results request while the user is only typing', async () => {
    const user = userEvent.setup();

    mockedFetchPokemonResults.mockResolvedValueOnce({
      items: [],
      page: 1,
      totalPages: 3,
    });

    renderPokemonSearch();

    await screen.findByText('No results to display yet.');

    await user.type(
      screen.getByRole('searchbox', { name: 'Pokemon name' }),
      '  Eevee  ',
    );

    expect(mockedFetchPokemonResults).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('searchbox', { name: 'Pokemon name' })).toHaveValue(
      '  Eevee  ',
    );
  });

  it('restores the stored search term on mount without changing the initial fetch query', async () => {
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
    expect(mockedFetchPokemonResults).toHaveBeenCalledWith('', 1);
    expect(await screen.findByLabelText('snorlax')).toBeInTheDocument();
  });

  it('renders initial server-provided search data without an extra client request', async () => {
    renderPokemonSearch('/', {
      initialResults: {
        items: [
          {
            id: '150',
            name: 'mewtwo',
            url: 'https://pokeapi.co/api/v2/pokemon/150/',
          },
        ],
        page: 1,
        totalPages: 1,
      },
      initialSearchTerm: 'mewtwo',
    });

    expect(mockedFetchPokemonResults).not.toHaveBeenCalled();
    expect(screen.getByRole('searchbox', { name: 'Pokemon name' })).toHaveValue(
      'mewtwo',
    );
    expect(await screen.findByLabelText('mewtwo')).toBeInTheDocument();
  });

  it('does not persist the search term while the user is only editing the input', async () => {
    const user = userEvent.setup();

    mockedFetchPokemonResults.mockResolvedValue({
      items: [],
      page: 1,
      totalPages: 1,
    });

    renderPokemonSearch();

    await screen.findByText('No results to display yet.');

    await user.type(
      screen.getByRole('searchbox', { name: 'Pokemon name' }),
      '  mewtwo ',
    );
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

    renderPokemonSearch('/?page=2');

    expect(await screen.findByLabelText('metapod')).toBeInTheDocument();
    expect(screen.getByText('Page 2 of 3')).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: 'Next page' }));

    await waitFor(() => {
      expect(mockedFetchPokemonResults).toHaveBeenNthCalledWith(2, '', 3);
    });

    expect(await screen.findByLabelText('spearow')).toBeInTheDocument();
    expect(screen.getByText('Page 3 of 3')).toBeInTheDocument();
  });

  it('shows the loading state while navigating to an uncached page', async () => {
    const user = userEvent.setup();
    const pageThreeResults = createDeferredPromise<{
      items: Array<{ id: string; name: string; url: string }>;
      page: number;
      totalPages: number;
    }>();

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
      .mockImplementationOnce(() => pageThreeResults.promise);

    renderPokemonSearch('/?page=2');

    expect(await screen.findByLabelText('metapod')).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: 'Next page' }));

    expect(await screen.findByText('Loading results...')).toBeInTheDocument();

    pageThreeResults.resolve({
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

    expect(await screen.findByLabelText('spearow')).toBeInTheDocument();
  });

  it('reuses cached page results when returning to a previous page', async () => {
    const user = userEvent.setup();

    mockedFetchPokemonResults
      .mockResolvedValueOnce({
        items: [
          {
            id: '1',
            name: 'bulbasaur',
            url: 'https://pokeapi.co/api/v2/pokemon/1/',
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

    expect(await screen.findByLabelText('bulbasaur')).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: 'Next page' }));
    expect(await screen.findByLabelText('charmander')).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: 'Previous page' }));

    expect(await screen.findByLabelText('bulbasaur')).toBeInTheDocument();
    expect(mockedFetchPokemonResults).toHaveBeenCalledTimes(2);
  });

  it('refreshes the current results query after invalidating its cache', async () => {
    const user = userEvent.setup();

    mockedFetchPokemonResults
      .mockResolvedValueOnce({
        items: [
          {
            id: '1',
            name: 'bulbasaur',
            url: 'https://pokeapi.co/api/v2/pokemon/1/',
          },
        ],
        page: 1,
        totalPages: 1,
      })
      .mockResolvedValueOnce({
        items: [
          {
            id: '7',
            name: 'squirtle',
            url: 'https://pokeapi.co/api/v2/pokemon/7/',
          },
        ],
        page: 1,
        totalPages: 1,
      });

    renderPokemonSearch();

    expect(await screen.findByLabelText('bulbasaur')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Refresh Results' }));

    await waitFor(() => {
      expect(mockedFetchPokemonResults).toHaveBeenCalledTimes(2);
    });

    expect(await screen.findByLabelText('squirtle')).toBeInTheDocument();
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

    await user.click(screen.getByRole('link', { name: 'Next page' }));

    expect(await screen.findByLabelText('charmander')).toBeInTheDocument();
    expect(screen.getByText('1 selected')).toBeInTheDocument();
  });
});
