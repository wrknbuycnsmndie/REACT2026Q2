import { fetchPokemonDetails, fetchPokemonResults } from '../../services/pokemon';
import { getStoredSearchTerm } from '../../services/localStorageService';
import { resetPokemonResultsCache } from '../../hooks/usePokemonResults';

export const mockedFetchPokemonDetails = vi.mocked(fetchPokemonDetails);
export const mockedFetchPokemonResults = vi.mocked(fetchPokemonResults);
export const mockedGetStoredSearchTerm = vi.mocked(getStoredSearchTerm);

export function resetPokemonSearchMocks() {
    mockedFetchPokemonDetails.mockReset();
    mockedFetchPokemonResults.mockReset();
    mockedGetStoredSearchTerm.mockReset();
    mockedGetStoredSearchTerm.mockReturnValue('');
    resetPokemonResultsCache();
}
