export const POKEMON_QUERY_KEY = ['pokemon'] as const;
export const POKEMON_DETAILS_QUERY_KEY = ['pokemon', 'details'] as const;
export const POKEMON_RESULTS_QUERY_KEY = ['pokemon', 'results'] as const;

export function getPokemonDetailsQueryKey(pokemonId: string) {
  return ['pokemon', 'details', pokemonId] as const;
}

export function getPokemonResultsQueryKey(searchTerm: string, page: number) {
  return ['pokemon', 'results', searchTerm, page] as const;
}
