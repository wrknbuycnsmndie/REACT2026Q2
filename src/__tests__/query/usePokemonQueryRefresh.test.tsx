import { QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { createAppQueryClient } from '../../query/queryClient';
import { usePokemonQueryRefresh } from '../../query/usePokemonQueryRefresh';

describe('usePokemonQueryRefresh', () => {
  function createWrapper() {
    const queryClient = createAppQueryClient();
    const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');

    function Wrapper({ children }: { children: ReactNode }) {
      return (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );
    }

    return {
      invalidateQueriesSpy,
      wrapper: Wrapper,
    };
  }

  it('invalidates the active results query key', async () => {
    const { invalidateQueriesSpy, wrapper } = createWrapper();
    const { result } = renderHook(() => usePokemonQueryRefresh(), {
      wrapper,
    });

    await act(async () => {
      await result.current.refreshPokemonResults('pikachu', 2);
    });

    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: ['pokemon', 'results', 'pikachu', 2],
    });
  });

  it('invalidates results for the default list query key too', async () => {
    const { invalidateQueriesSpy, wrapper } = createWrapper();
    const { result } = renderHook(() => usePokemonQueryRefresh(), {
      wrapper,
    });

    await act(async () => {
      await result.current.refreshPokemonResults('', 1);
    });

    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: ['pokemon', 'results', '', 1],
    });
  });

  it('invalidates the active details query key', async () => {
    const { invalidateQueriesSpy, wrapper } = createWrapper();
    const { result } = renderHook(() => usePokemonQueryRefresh(), {
      wrapper,
    });

    await act(async () => {
      await result.current.refreshPokemonDetails('25');
    });

    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: ['pokemon', 'details', '25'],
    });
  });

  it('does nothing when no Pokemon id is provided for details refresh', async () => {
    const { invalidateQueriesSpy, wrapper } = createWrapper();
    const { result } = renderHook(() => usePokemonQueryRefresh(), {
      wrapper,
    });

    await act(async () => {
      await result.current.refreshPokemonDetails(null);
    });

    expect(invalidateQueriesSpy).not.toHaveBeenCalled();
  });

  it('returns the invalidateQueries promise for a details refresh', async () => {
    const { invalidateQueriesSpy, wrapper } = createWrapper();
    invalidateQueriesSpy.mockResolvedValueOnce();
    const { result } = renderHook(() => usePokemonQueryRefresh(), {
      wrapper,
    });

    await expect(result.current.refreshPokemonDetails('133')).resolves.toBeUndefined();
  });
});
