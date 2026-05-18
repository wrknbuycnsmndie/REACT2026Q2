import { fetchPokemonDetails, fetchPokemonResults } from '../../services/pokemon';
import { getStoredSearchTerm, setStoredSearchTerm } from '../../services/localStorageService';

export const mockedFetchPokemonDetails = vi.mocked(fetchPokemonDetails);
export const mockedFetchPokemonResults = vi.mocked(fetchPokemonResults);
export const mockedGetStoredSearchTerm = vi.mocked(getStoredSearchTerm);
export const mockedSetStoredSearchTerm = vi.mocked(setStoredSearchTerm);

export function resetPokemonSearchMocks() {
    mockedFetchPokemonDetails.mockReset();
    mockedFetchPokemonResults.mockReset();
    mockedGetStoredSearchTerm.mockReset();
    mockedSetStoredSearchTerm.mockReset();
    mockedGetStoredSearchTerm.mockReturnValue('');
}
