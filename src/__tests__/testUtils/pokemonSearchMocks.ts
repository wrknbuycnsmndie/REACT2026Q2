import { fetchPokemonResults } from '../../services/pokemon';
import { getStoredSearchTerm, setStoredSearchTerm } from '../../services/localStorageService';

export const mockedFetchPokemonResults = vi.mocked(fetchPokemonResults);
export const mockedGetStoredSearchTerm = vi.mocked(getStoredSearchTerm);
export const mockedSetStoredSearchTerm = vi.mocked(setStoredSearchTerm);

export function resetPokemonSearchMocks() {
    vi.clearAllMocks();
    mockedGetStoredSearchTerm.mockReturnValue('');
}
