import { createAppQueryClient } from '../../query/queryClient';

describe('createAppQueryClient', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('uses the default query TTL when no env override is provided', () => {
    vi.stubEnv('NEXT_PUBLIC_POKEMON_QUERY_TTL_MS', '');

    const queryClient = createAppQueryClient();
    const queryDefaults = queryClient.getDefaultOptions().queries;

    expect(queryDefaults?.staleTime).toBe(5 * 60 * 1000);
    expect(queryDefaults?.gcTime).toBe(5 * 60 * 1000);
    expect(queryDefaults?.retry).toBe(false);
    expect(queryDefaults?.refetchOnWindowFocus).toBe(false);
  });

  it('uses the env TTL when a valid override is provided', () => {
    vi.stubEnv('NEXT_PUBLIC_POKEMON_QUERY_TTL_MS', '120000');

    const queryClient = createAppQueryClient();
    const queryDefaults = queryClient.getDefaultOptions().queries;

    expect(queryDefaults?.staleTime).toBe(120000);
    expect(queryDefaults?.gcTime).toBe(120000);
  });

  it('falls back to the default TTL when the env value is invalid', () => {
    vi.stubEnv('NEXT_PUBLIC_POKEMON_QUERY_TTL_MS', '-1');

    const queryClient = createAppQueryClient();
    const queryDefaults = queryClient.getDefaultOptions().queries;

    expect(queryDefaults?.staleTime).toBe(5 * 60 * 1000);
    expect(queryDefaults?.gcTime).toBe(5 * 60 * 1000);
  });

  it('falls back to the default TTL when the env value is not a number', () => {
    vi.stubEnv('NEXT_PUBLIC_POKEMON_QUERY_TTL_MS', 'abc');

    const queryClient = createAppQueryClient();
    const queryDefaults = queryClient.getDefaultOptions().queries;

    expect(queryDefaults?.staleTime).toBe(5 * 60 * 1000);
    expect(queryDefaults?.gcTime).toBe(5 * 60 * 1000);
  });

  it('allows a zero TTL override', () => {
    vi.stubEnv('NEXT_PUBLIC_POKEMON_QUERY_TTL_MS', '0');

    const queryClient = createAppQueryClient();
    const queryDefaults = queryClient.getDefaultOptions().queries;

    expect(queryDefaults?.staleTime).toBe(0);
    expect(queryDefaults?.gcTime).toBe(0);
  });
});
