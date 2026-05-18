import { fetchPokemonResults } from '../../services/pokemon';

describe('fetchPokemonResults', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    const mockFetch = () => vi.spyOn(globalThis, 'fetch');

    it('requests a single pokemon by trimmed lowercased search term', async () => {
        const fetchSpy = mockFetch().mockResolvedValue({
            ok: true,
            json: async () => ({
                id: 25,
                name: 'pikachu',
            }),
        } as Response);

        await expect(fetchPokemonResults('  PiKaChu  ')).resolves.toEqual({
            items: [
                {
                    id: '25',
                    name: 'pikachu',
                },
            ],
            page: 1,
            totalPages: 1,
        });

        expect(fetchSpy).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon/pikachu');
    });

    it('loads the paginated pokemon list for the requested page', async () => {
        const fetchSpy = mockFetch().mockResolvedValue({
            ok: true,
            json: async () => ({
                count: 25,
                results: Array.from({ length: 10 }, (_, index) => ({
                    name: `pokemon-${index + 11}`,
                    url: `https://pokeapi.co/api/v2/pokemon/${index + 11}/`,
                })),
            }),
        } as Response);

        await expect(fetchPokemonResults('   ', 2)).resolves.toEqual({
            items: Array.from({ length: 10 }, (_, index) => ({
                id: String(index + 11),
                name: `pokemon-${index + 11}`,
                url: `https://pokeapi.co/api/v2/pokemon/${index + 11}/`,
            })),
            page: 2,
            totalPages: 3,
        });

        expect(fetchSpy).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon?limit=10&offset=10');
        expect(fetchSpy).toHaveBeenCalledTimes(1);
    });

    it('throws the mapped not found message for a 404 response', async () => {
        const fetchSpy = mockFetch().mockResolvedValue({
            ok: false,
            status: 404,
        } as Response);

        await expect(fetchPokemonResults('missingno')).rejects.toThrow(
            'No Pokemon matched that search term.',
        );

        expect(fetchSpy).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon/missingno');
    });

    it('throws the mapped service unavailable message for a 5xx response', async () => {
        const fetchSpy = mockFetch().mockResolvedValue({
            ok: false,
            status: 503,
        } as Response);

        await expect(fetchPokemonResults('pikachu')).rejects.toThrow(
            'The Pokemon service is unavailable right now. Please try again.',
        );

        expect(fetchSpy).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon/pikachu');
    });
});
