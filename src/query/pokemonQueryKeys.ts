export function getPokemonDetailsQueryKey(pokemonId: string) {
  return ['pokemon', 'details', pokemonId] as const;
}

export function getPokemonResultsQueryKey(searchTerm: string, page: number) {
  return ['pokemon', 'results', searchTerm, page] as const;
}
