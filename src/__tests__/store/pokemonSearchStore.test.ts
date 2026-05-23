import {
  getStoredSearchTerm,
  setStoredSearchTerm,
} from '../../services/localStorageService';
import {
  resetPokemonSearchStore,
  usePokemonSearchStore,
} from '../../store/pokemonSearchStore';

vi.mock('../../services/localStorageService', () => ({
  getStoredSearchTerm: vi.fn(),
  setStoredSearchTerm: vi.fn(),
}));

describe('pokemonSearchStore', () => {
  beforeEach(() => {
    vi.mocked(getStoredSearchTerm).mockReset();
    vi.mocked(setStoredSearchTerm).mockReset();
    vi.mocked(getStoredSearchTerm).mockReturnValue('');
    resetPokemonSearchStore();
  });

  it('initializes editable and submitted search state from storage', () => {
    vi.mocked(getStoredSearchTerm).mockReturnValue('pikachu');
    resetPokemonSearchStore();

    expect(usePokemonSearchStore.getState()).toMatchObject({
      searchTerm: 'pikachu',
      submittedSearchTerm: 'pikachu',
    });
  });

  it('stores a submitted trimmed search term and persists it', () => {
    usePokemonSearchStore.getState().setSearchTerm('  mewtwo ');

    const submittedSearchTerm = usePokemonSearchStore
      .getState()
      .submitSearchTerm();

    expect(submittedSearchTerm).toBe('mewtwo');
    expect(usePokemonSearchStore.getState()).toMatchObject({
      searchTerm: 'mewtwo',
      submittedSearchTerm: 'mewtwo',
    });
    expect(setStoredSearchTerm).toHaveBeenCalledWith('mewtwo');
  });

  it('stores a successful results page', () => {
    usePokemonSearchStore
      .getState()
      .setResultsPage([{ id: '25', name: 'pikachu' }], 3);

    expect(usePokemonSearchStore.getState()).toMatchObject({
      errorMessage: '',
      isLoading: false,
      items: [{ id: '25', name: 'pikachu' }],
      totalPages: 3,
    });
  });

  it('stores a failed results request', () => {
    usePokemonSearchStore.getState().setResultsError('Request failed');

    expect(usePokemonSearchStore.getState()).toMatchObject({
      errorMessage: 'Request failed',
      isLoading: false,
      items: [],
      totalPages: 1,
    });
  });
});
