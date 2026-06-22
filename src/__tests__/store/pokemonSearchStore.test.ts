import {
  getStoredSearchTerm,
} from '../../services/localStorageService';
import {
  resetPokemonSearchStore,
  usePokemonSearchStore,
} from '../../store/pokemonSearchStore';

vi.mock('../../services/localStorageService', () => ({
  getStoredSearchTerm: vi.fn(),
}));

describe('pokemonSearchStore', () => {
  beforeEach(() => {
    vi.mocked(getStoredSearchTerm).mockReset();
    vi.mocked(getStoredSearchTerm).mockReturnValue('');
    resetPokemonSearchStore();
  });

  it('initializes editable search state from storage', () => {
    vi.mocked(getStoredSearchTerm).mockReturnValue('pikachu');
    resetPokemonSearchStore();

    expect(usePokemonSearchStore.getState()).toMatchObject({
      searchTerm: 'pikachu',
    });
  });

  it('stores the editable search term', () => {
    usePokemonSearchStore.getState().setSearchTerm('  mewtwo ');

    expect(usePokemonSearchStore.getState()).toMatchObject({
      searchTerm: '  mewtwo ',
    });
  });

  it('resets the editable and submitted search state from storage', () => {
    vi.mocked(getStoredSearchTerm).mockReturnValue('eevee');
    usePokemonSearchStore.getState().setSearchTerm('mew');

    usePokemonSearchStore.getState().resetSearchState();

    expect(usePokemonSearchStore.getState()).toMatchObject({
      searchTerm: 'eevee',
    });
  });
});
