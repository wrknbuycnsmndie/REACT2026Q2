import { usePathname } from '../i18n/navigation';
import { getCurrentPage, getSearchParamsWithPage } from '../helpers/searchParams';
import { useRouteSearchParams } from './useUrlSearchParams';

type UsePokemonPageParamResult = {
  getPageHref: (page: number) => string;
  currentPage: number;
};

export function usePokemonPageParam(): UsePokemonPageParamResult {
  const pathname = usePathname();
  const { searchParams } = useRouteSearchParams();
  const currentPage = getCurrentPage(searchParams);

  const getPageHref = (page: number) => {
    const nextSearchParams = getSearchParamsWithPage(searchParams, page);
    const queryString = nextSearchParams.toString();

    return queryString ? `${pathname}?${queryString}` : pathname;
  };

  return {
    getPageHref,
    currentPage,
  };
}
