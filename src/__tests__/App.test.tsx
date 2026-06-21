import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { Header } from '../components/Header/Header';
import { ThemeProvider } from '../context/ThemeProvider';
import { resetPokemonSearchStore } from '../store/pokemonSearchStore';
import { HomePage } from '../views/HomePage/HomePage';
import { setMockUrl } from './testUtils/nextMocks';
import { renderWithQueryClient } from './testUtils/renderWithQueryClient';
import {
  mockedFetchPokemonDetails,
  mockedFetchPokemonResults,
  resetPokemonSearchMocks,
} from './testUtils/pokemonSearchMocks';

vi.mock('../services/pokemon', () => ({
  fetchPokemonDetails: vi.fn(),
  fetchPokemonResults: vi.fn(),
}));

vi.mock('../services/localStorageService', () => ({
  getStoredSearchTerm: vi.fn(),
  setStoredSearchTerm: vi.fn(),
}));

function renderApp(initialUrl = '/') {
  setMockUrl(initialUrl);

  return renderWithQueryClient(
    <ThemeProvider>
      <main className='app'>
        <div className='app__container'>
          <Header />
        <HomePage />
        </div>
      </main>
    </ThemeProvider>,
  );
}

describe('App', () => {
  beforeEach(() => {
    resetPokemonSearchMocks();
    resetPokemonSearchStore();
    mockedFetchPokemonResults.mockResolvedValue({
      items: [],
      page: 1,
      totalPages: 3,
    });
    mockedFetchPokemonDetails.mockResolvedValue({
      description: 'A mouse Pokemon.',
      height: 4,
      id: '25',
      imageUrl: 'https://example.com/pikachu.png',
      name: 'pikachu',
      types: ['electric'],
      weight: 60,
    });
  });

  it('shows the error boundary fallback after triggering a test error and recovers on reset', async () => {
    const user = userEvent.setup();
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    renderApp();

    await screen.findByText('No results to display yet.');

    await user.click(screen.getByRole('button', { name: 'Trigger Error' }));

    expect(await screen.findByText('Application error')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Remove Error' }));

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Pokemon Search' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Trigger Error' }),
    ).toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });

  it('opens details after clicking a result and closes them with the close button', async () => {
    const user = userEvent.setup();

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

    renderApp();

    await user.click(await screen.findByRole('button', { name: 'pikachu' }));

    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    expect(await screen.findByText('A mouse Pokemon.')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Close' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('reuses cached details when reopening the same Pokemon', async () => {
    const user = userEvent.setup();

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

    renderApp();

    await user.click(await screen.findByRole('button', { name: 'pikachu' }));
    expect(await screen.findByText('A mouse Pokemon.')).toBeInTheDocument();
    expect(mockedFetchPokemonDetails).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'pikachu' }));

    expect(await screen.findByText('A mouse Pokemon.')).toBeInTheDocument();
    expect(mockedFetchPokemonDetails).toHaveBeenCalledTimes(1);
  });

  it('refreshes the current Pokemon details query after invalidating its cache', async () => {
    const user = userEvent.setup();

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
    mockedFetchPokemonDetails
      .mockResolvedValueOnce({
        description: 'A mouse Pokemon.',
        height: 4,
        id: '25',
        imageUrl: 'https://example.com/pikachu.png',
        name: 'pikachu',
        types: ['electric'],
        weight: 60,
      })
      .mockResolvedValueOnce({
        description: 'A refreshed mouse Pokemon.',
        height: 4,
        id: '25',
        imageUrl: 'https://example.com/pikachu.png',
        name: 'pikachu',
        types: ['electric'],
        weight: 60,
      });

    renderApp();

    await user.click(await screen.findByRole('button', { name: 'pikachu' }));
    expect(await screen.findByText('A mouse Pokemon.')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Refresh' }));

    expect(await screen.findByText('A refreshed mouse Pokemon.')).toBeInTheDocument();
    expect(mockedFetchPokemonDetails).toHaveBeenCalledTimes(2);
  });

  it('shows a clear details error message when loading Pokemon details fails', async () => {
    const user = userEvent.setup();

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
    mockedFetchPokemonDetails.mockRejectedValueOnce(new TypeError('Failed to fetch'));

    renderApp();

    await user.click(await screen.findByRole('button', { name: 'pikachu' }));

    expect(
      await screen.findByText(
        'Unable to reach the Pokemon service. Please check your connection and try again.',
      ),
    ).toBeInTheDocument();
  });

  it('closes details after clicking the outer panel area', async () => {
    const user = userEvent.setup();

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

    renderApp();

    await user.click(await screen.findByRole('button', { name: 'pikachu' }));

    const dialog = await screen.findByRole('dialog');
    const panel = dialog.parentElement;

    if (!panel) {
      throw new Error('Expected details panel wrapper to exist.');
    }

    await user.click(panel);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

});
