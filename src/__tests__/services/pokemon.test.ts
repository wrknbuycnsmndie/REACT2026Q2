import { fetchPokemonDetails, fetchPokemonResults } from '../../services/pokemon';

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
                    url: 'https://pokeapi.co/api/v2/pokemon/25/',
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

describe('fetchPokemonDetails', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    const mockFetch = () => vi.spyOn(globalThis, 'fetch');

    it('loads pokemon details and normalizes the english description', async () => {
        const fetchSpy = mockFetch()
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    height: 4,
                    id: 25,
                    name: 'pikachu',
                    sprites: {
                        front_default: 'https://example.com/pikachu.png',
                    },
                    types: [{ type: { name: 'electric' } }],
                    weight: 60,
                }),
            } as Response)
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    flavor_text_entries: [
                        {
                            flavor_text: 'Ignored text',
                            language: { name: 'ja' },
                        },
                        {
                            flavor_text: 'Mouse\nPokemon\twith static cheeks.',
                            language: { name: 'en' },
                        },
                    ],
                }),
            } as Response);

        await expect(fetchPokemonDetails('25')).resolves.toEqual({
            description: 'Mouse Pokemon with static cheeks.',
            height: 4,
            id: '25',
            imageUrl: 'https://example.com/pikachu.png',
            name: 'pikachu',
            types: ['electric'],
            weight: 60,
        });

        expect(fetchSpy).toHaveBeenNthCalledWith(1, 'https://pokeapi.co/api/v2/pokemon/25');
        expect(fetchSpy).toHaveBeenNthCalledWith(2, 'https://pokeapi.co/api/v2/pokemon-species/25');
    });

    it('returns a fallback description when no english entry exists', async () => {
        mockFetch()
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    height: 7,
                    id: 133,
                    name: 'eevee',
                    sprites: {
                        front_default: null,
                    },
                    types: [{ type: { name: 'normal' } }],
                    weight: 65,
                }),
            } as Response)
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    flavor_text_entries: [
                        {
                            flavor_text: 'Texto',
                            language: { name: 'es' },
                        },
                    ],
                }),
            } as Response);

        await expect(fetchPokemonDetails('133')).resolves.toEqual({
            description: 'No description available.',
            height: 7,
            id: '133',
            imageUrl: null,
            name: 'eevee',
            types: ['normal'],
            weight: 65,
        });
    });

    it('throws a mapped error when one of the detail requests fails', async () => {
        mockFetch()
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    height: 7,
                    id: 133,
                    name: 'eevee',
                    sprites: {
                        front_default: null,
                    },
                    types: [{ type: { name: 'normal' } }],
                    weight: 65,
                }),
            } as Response)
            .mockResolvedValueOnce({
                ok: false,
                status: 500,
            } as Response);

        await expect(fetchPokemonDetails('133')).rejects.toThrow(
            'The Pokemon service is unavailable right now. Please try again.',
        );
    });
});
