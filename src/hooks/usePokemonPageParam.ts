import { useRouteSearchParams } from './useUrlSearchParams';
import { DEFAULT_PAGE } from '../constants/pagination';
import { getCurrentPage, getSearchParamsWithPage } from '../helpers/searchParams';

type UsePokemonPageParamResult = {
  currentPage: number;
  goToPage: (page: number) => void;
  resetPage: () => void;
};

export function usePokemonPageParam(): UsePokemonPageParamResult {
  const { searchParams, setSearchParams } = useRouteSearchParams();
  const currentPage = getCurrentPage(searchParams);

  const updatePage = (page: number) => {
    const nextSearchParams = getSearchParamsWithPage(searchParams, page);
    const nextPage = getCurrentPage(nextSearchParams);

    if (nextPage === currentPage) {
      return;
    }

    setSearchParams(nextSearchParams);
  };

  const resetPage = () => {
    updatePage(DEFAULT_PAGE);
  };

  return {
    currentPage,
    goToPage: updatePage,
    resetPage,
  };
}
