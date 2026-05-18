import { useSearchParams } from 'react-router';
import { DEFAULT_PAGE } from '../constants/pagination';
import { getCurrentPage, getSearchParamsWithPage } from '../helpers/searchParams';

type UsePokemonPageParamResult = {
  currentPage: number;
  goToPage: (page: number) => void;
  resetPage: () => void;
};

export function usePokemonPageParam(): UsePokemonPageParamResult {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = getCurrentPage(searchParams);

  const updatePage = (page: number) => {
    const nextSearchParams = getSearchParamsWithPage(searchParams, page);
    const nextPage = getCurrentPage(nextSearchParams);

    if (nextPage === currentPage) {
      return;
    }

    setSearchParams(nextSearchParams, { replace: true });
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
