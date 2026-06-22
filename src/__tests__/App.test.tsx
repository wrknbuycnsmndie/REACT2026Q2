import { render, screen } from '@testing-library/react';
import type { ComponentProps, ReactNode } from 'react';
import { vi } from 'vitest';
import { Header } from '../components/Header/Header';
import { PokemonDetailsPanel } from '../components/PokemonDetails/PokemonDetailsPanel';
import { ThemeProvider } from '../context/ThemeProvider';
import { resetPokemonSearchStore } from '../store/pokemonSearchStore';
import { HomePage } from '../views/HomePage/HomePage';
import { setMockUrl } from './testUtils/nextMocks';
import { IntlTestProvider } from './testUtils/renderWithIntl';
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

function renderAppWithHomePage(homePageProps: ComponentProps<typeof HomePage>) {
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <IntlTestProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </IntlTestProvider>
    );
  }

  return render(
    <main className='app'>
      <div className='app__container'>
        <Header />
        <HomePage {...homePageProps} />
      </div>
    </main>,
    { wrapper: Wrapper },
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

  it('renders server-provided selected details without an immediate client details fetch', async () => {
    setMockUrl('/?details=25');

    renderAppWithHomePage({
      detailsPanel: (
        <PokemonDetailsPanel
          closeHref='/?page=1'
          details={{
            description: 'Server-rendered mouse Pokemon.',
            height: 4,
            id: '25',
            imageUrl: 'https://example.com/pikachu.png',
            name: 'pikachu',
            types: ['electric'],
            weight: 60,
          }}
          errorMessage=''
          isLoading={false}
        />
      ),
      hasDetailsPanel: true,
      initialResults: {
        items: [
          {
            id: '25',
            name: 'pikachu',
            url: 'https://pokeapi.co/api/v2/pokemon/25/',
          },
        ],
        page: 1,
        totalPages: 1,
      },
      initialSearchTerm: '',
    });

    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    expect(
      await screen.findByText('Server-rendered mouse Pokemon.'),
    ).toBeInTheDocument();
    expect(mockedFetchPokemonDetails).not.toHaveBeenCalled();
  });
});
