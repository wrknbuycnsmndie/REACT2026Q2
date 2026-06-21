'use client';

import {
  usePathname,
  useRouter,
  useSearchParams as useNextSearchParams,
} from 'next/navigation';
import { useCallback, useMemo } from 'react';

type SetSearchParamsOptions = {
  replace?: boolean;
  scroll?: boolean;
};

export function useRouteSearchParams() {
  const pathname = usePathname();
  const router = useRouter();
  const nextSearchParams = useNextSearchParams();
  const searchParams = useMemo(
    () => new URLSearchParams(nextSearchParams.toString()),
    [nextSearchParams],
  );

  const setSearchParams = useCallback(
    (
      nextSearchParams: URLSearchParams,
      { replace = true, scroll = false }: SetSearchParamsOptions = {},
    ) => {
      const queryString = nextSearchParams.toString();
      const href = queryString ? `${pathname}?${queryString}` : pathname;

      if (replace) {
        router.replace(href, { scroll });
        return;
      }

      router.push(href, { scroll });
    },
    [pathname, router],
  );

  return {
    searchParams,
    setSearchParams,
  };
}
