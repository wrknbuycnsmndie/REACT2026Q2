import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { vi } from 'vitest';
import { ThemeProvider } from '../context/ThemeProvider';
import { AppRouter } from '../router/AppRouter';
import { resetPokemonDetailsStore } from '../store/pokemonDetailsStore';
import { resetPokemonSearchStore } from '../store/pokemonSearchStore';
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

describe('App', () => {
  beforeEach(() => {
    resetPokemonSearchMocks();
    resetPokemonDetailsStore();
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

    render(
      <ThemeProvider>
        <MemoryRouter initialEntries={['/']}>
          <AppRouter />
        </MemoryRouter>
      </ThemeProvider>,
    );

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

    render(
      <ThemeProvider>
        <MemoryRouter initialEntries={['/']}>
          <AppRouter />
        </MemoryRouter>
      </ThemeProvider>,
    );

    await user.click(await screen.findByRole('button', { name: 'pikachu' }));

    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    expect(await screen.findByText('A mouse Pokemon.')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Close' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
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

    render(
      <ThemeProvider>
        <MemoryRouter initialEntries={['/']}>
          <AppRouter />
        </MemoryRouter>
      </ThemeProvider>,
    );

    await user.click(await screen.findByRole('button', { name: 'pikachu' }));

    const dialog = await screen.findByRole('dialog');
    const panel = dialog.parentElement;

    if (!panel) {
      throw new Error('Expected details panel wrapper to exist.');
    }

    await user.click(panel);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens the about page from the main navigation', async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <MemoryRouter initialEntries={['/']}>
          <AppRouter />
        </MemoryRouter>
      </ThemeProvider>,
    );

    await user.click(screen.getByRole('link', { name: 'About' }));

    expect(
      await screen.findByRole('heading', {
        level: 2,
        name: 'Pokemon Search Workshop',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'RS School React Course' }),
    ).toHaveAttribute('href', 'https://rs.school/courses/reactjs');
    expect(screen.getByRole('link', { name: 'Anton Chapala' })).toHaveAttribute(
      'href',
      'https://github.com/wrknbuycnsmndie',
    );
  });

  it('shows a 404 page for unknown routes and provides a way back to the app', async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <MemoryRouter initialEntries={['/missing-page']}>
          <AppRouter />
        </MemoryRouter>
      </ThemeProvider>,
    );

    expect(
      await screen.findByRole('heading', {
        level: 2,
        name: 'Pikachu used Thunder Shock on this route',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'The page you requested vanished into the tall grass. Head back to the Pokedex and keep your search moving.',
      ),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole('link', { name: 'Return to Pokemon Search' }),
    );

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'Pokemon Search',
      }),
    ).toBeInTheDocument();
  });
});
