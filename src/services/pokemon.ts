import { PokemonRequestError } from './pokemonRequestError';
import { DEFAULT_PAGE, POKEMON_RESULTS_PAGE_SIZE } from '../constants/pagination';
import type { PokemonDetails } from '../types/pokemon';
import type { SearchResultItem, SearchResultsPage } from '../types/search';

const POKEMON_API_URL = 'https://pokeapi.co/api/v2/pokemon';

type PokemonListEntry = {
    name: string;
    url: string;
};

type PokemonListResponse = {
    count: number;
    results: PokemonListEntry[];
};

type PokemonResponse = {
    height: number;
    id: number;
    name: string;
    sprites: {
        front_default: string | null;
    };
    types: Array<{
        type: {
            name: string;
        };
    }>;
    weight: number;
};

type PokemonSpeciesResponse = {
    flavor_text_entries: Array<{
        flavor_text: string;
        language: {
            name: string;
        };
    }>;
};

export async function fetchPokemonResults(searchTerm: string, page = 1): Promise<SearchResultsPage> {
    const trimmedSearchTerm = searchTerm.trim().toLowerCase();

    if (trimmedSearchTerm.length > 0) {
        const pokemon = await requestJson<PokemonResponse>(`${POKEMON_API_URL}/${trimmedSearchTerm}`);

        return {
            items: [
                {
                    id: String(pokemon.id),
                    name: pokemon.name,
                    url: `${POKEMON_API_URL}/${pokemon.id}/`,
                },
            ],
            page: DEFAULT_PAGE,
            totalPages: DEFAULT_PAGE,
        };
    }

    const currentPage = Math.max(DEFAULT_PAGE, page);
    const offset = (currentPage - DEFAULT_PAGE) * POKEMON_RESULTS_PAGE_SIZE;
    const response = await requestJson<PokemonListResponse>(
        `${POKEMON_API_URL}?limit=${POKEMON_RESULTS_PAGE_SIZE}&offset=${offset}`,
    );

    return {
        items: response.results.map(toSearchResultItem),
        page: currentPage,
        totalPages: Math.max(DEFAULT_PAGE, Math.ceil(response.count / POKEMON_RESULTS_PAGE_SIZE)),
    };
}

export async function fetchPokemonDetails(id: string): Promise<PokemonDetails> {
    const [pokemon, species] = await Promise.all([
        requestJson<PokemonResponse>(`${POKEMON_API_URL}/${id}`),
        requestJson<PokemonSpeciesResponse>(`${POKEMON_API_URL}-species/${id}`),
    ]);

    return {
        description: getEnglishDescription(species),
        height: pokemon.height,
        id: String(pokemon.id),
        imageUrl: pokemon.sprites.front_default,
        name: pokemon.name,
        types: pokemon.types.map((entry) => entry.type.name),
        weight: pokemon.weight,
    };
}

async function requestJson<TResponse>(url: string): Promise<TResponse> {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(PokemonRequestError.getMessage(response.status));
    }

    return (await response.json()) as TResponse;
}

function toSearchResultItem(pokemon: PokemonListEntry): SearchResultItem {
    return {
        id: getPokemonIdFromUrl(pokemon.url),
        name: pokemon.name,
        url: pokemon.url,
    };
}

function getPokemonIdFromUrl(url: string): string {
    const segments = url.split('/').filter(Boolean);
    return segments.at(-1) ?? '';
}

function getEnglishDescription(species: PokemonSpeciesResponse): string {
    const englishEntry = species.flavor_text_entries.find((entry) => {
        return entry.language.name === 'en';
    });

    if (!englishEntry) {
        return 'No description available.';
    }

    return englishEntry.flavor_text.replace(/\s+/g, ' ').trim();
}
