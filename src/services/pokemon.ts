import { PokemonRequestError } from './pokemonRequestError';
import type { SearchResultItem } from '../types/search';

const POKEMON_SPECIES_API_URL = 'https://pokeapi.co/api/v2/pokemon-species';
const INITIAL_RESULTS_LIMIT = 10;

type PokemonSpeciesListEntry = {
    url: string;
};

type PokemonSpeciesListResponse = {
    results: PokemonSpeciesListEntry[];
};

type PokemonSpeciesResponse = {
    flavor_text_entries: Array<{
        flavor_text: string;
        language: {
            name: string;
        };
    }>;
    id: number;
    name: string;
};

export async function fetchPokemonResults(searchTerm: string): Promise<SearchResultItem[]> {
    const trimmedSearchTerm = searchTerm.trim().toLowerCase();

    if (trimmedSearchTerm.length > 0) {
        const species = await requestJson<PokemonSpeciesResponse>(
            `${POKEMON_SPECIES_API_URL}/${trimmedSearchTerm}`,
        );

        return [toSearchResultItem(species)];
    }

    const response = await requestJson<PokemonSpeciesListResponse>(
        `${POKEMON_SPECIES_API_URL}?limit=${INITIAL_RESULTS_LIMIT}&offset=0`,
    );

    const speciesList = await Promise.all(
        response.results.map((entry) => requestJson<PokemonSpeciesResponse>(entry.url)),
    );

    return speciesList.map(toSearchResultItem);
}

async function requestJson<TResponse>(url: string): Promise<TResponse> {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(PokemonRequestError.getMessage(response.status));
    }

    return (await response.json()) as TResponse;
}

function toSearchResultItem(species: PokemonSpeciesResponse): SearchResultItem {
    return {
        id: String(species.id),
        name: species.name,
        description: getEnglishDescription(species),
    };
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
