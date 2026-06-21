import { QueryClient } from '@tanstack/react-query';

const DEFAULT_POKEMON_QUERY_TTL_MS = 5 * 60 * 1000;

function getPokemonQueryTtlMs() {
  const parsedValue = Number.parseInt(
    process.env.NEXT_PUBLIC_POKEMON_QUERY_TTL_MS ?? '',
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
        refetchOnWindowFocus: false,
        retry: false,
        staleTime: queryTtlMs,
      },
    },
  });
}

export const appQueryClient = createAppQueryClient();
