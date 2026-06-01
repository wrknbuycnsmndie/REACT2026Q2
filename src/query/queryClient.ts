import { QueryClient, keepPreviousData } from '@tanstack/react-query';

const DEFAULT_POKEMON_QUERY_TTL_MS = 5 * 60 * 1000;

function getPokemonQueryTtlMs() {
  const parsedValue = Number.parseInt(
    import.meta.env.VITE_POKEMON_QUERY_TTL_MS ?? '',
    10,
  );

  if (!Number.isFinite(parsedValue) || parsedValue < 0) {
    return DEFAULT_POKEMON_QUERY_TTL_MS;
  }

  return parsedValue;
}

export function createAppQueryClient() {
  const queryTtlMs = getPokemonQueryTtlMs();

  return new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: queryTtlMs,
        placeholderData: keepPreviousData,
        refetchOnWindowFocus: false,
        retry: false,
        staleTime: queryTtlMs,
      },
    },
  });
}

export const appQueryClient = createAppQueryClient();
