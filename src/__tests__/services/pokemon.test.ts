import { fetchPokemonResults } from '../../services/pokemon';

describe('fetchPokemonResults', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it('requests a single species by trimmed lowercased search term', async () => {
        const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
            ok: true,
            json: async () => ({
                id: 25,
                name: 'pikachu',
                flavor_text_entries: [
                    {
                        flavor_text: 'Electric   mouse\nPokemon.',
                        language: { name: 'en' },
                    },
                ],
            }),
        } as Response);

        await expect(fetchPokemonResults('  PiKaChu  ')).resolves.toEqual([
            {
                id: '25',
                name: 'pikachu',
                description: 'Electric mouse Pokemon.',
            },
        ]);

        expect(fetchSpy).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon-species/pikachu');
    });

    it('loads the default species list and maps each detailed response', async () => {
        const fetchSpy = vi
            .spyOn(globalThis, 'fetch')
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    results: [{ url: 'https://pokeapi.co/api/v2/pokemon-species/1/' }],
                }),
            } as Response)
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    id: 1,
                    name: 'bulbasaur',
                    flavor_text_entries: [
                        {
                            flavor_text: 'Seed Pokemon',
                            language: { name: 'en' },
                        },
                    ],
                }),
            } as Response);

        await expect(fetchPokemonResults('   ')).resolves.toEqual([
            {
                id: '1',
                name: 'bulbasaur',
                description: 'Seed Pokemon',
            },
        ]);

        expect(fetchSpy).toHaveBeenNthCalledWith(
            1,
            'https://pokeapi.co/api/v2/pokemon-species?limit=10&offset=0',
        );
        expect(fetchSpy).toHaveBeenNthCalledWith(2, 'https://pokeapi.co/api/v2/pokemon-species/1/');
    });

    it('returns a fallback description when no english entry exists', async () => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue({
            ok: true,
            json: async () => ({
                id: 150,
                name: 'mewtwo',
                flavor_text_entries: [
                    {
                        flavor_text: 'Descripcion',
                        language: { name: 'es' },
                    },
                ],
            }),
        } as Response);

        await expect(fetchPokemonResults('mewtwo')).resolves.toEqual([
            {
                id: '150',
                name: 'mewtwo',
                description: 'No description available.',
            },
        ]);
    });

    it('throws the mapped not found message for a 404 response', async () => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue({
            ok: false,
            status: 404,
        } as Response);

        await expect(fetchPokemonResults('missingno')).rejects.toThrow(
            'No Pokemon matched that search term.',
        );
    });

    it('throws the mapped service unavailable message for a 5xx response', async () => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue({
            ok: false,
            status: 503,
        } as Response);

        await expect(fetchPokemonResults('pikachu')).rejects.toThrow(
            'The Pokemon service is unavailable right now. Please try again.',
        );
    });
});
