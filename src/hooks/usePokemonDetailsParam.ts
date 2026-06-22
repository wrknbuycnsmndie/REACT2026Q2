import { usePathname } from '../i18n/navigation';
import { useRouteSearchParams } from './useUrlSearchParams';
import {
  getCurrentDetailsId,
  getSearchParamsWithDetails,
} from '../helpers/searchParams';

type UsePokemonDetailsParamResult = {
  closeDetails: () => void;
  getDetailsHref: (detailsId: string | null) => string;
  openDetails: (detailsId: string) => void;
  selectedPokemonId: string | null;
};

export function usePokemonDetailsParam(): UsePokemonDetailsParamResult {
  const pathname = usePathname();
  const { searchParams, setSearchParams } = useRouteSearchParams();
  const selectedPokemonId = getCurrentDetailsId(searchParams);

  const getDetailsHref = (detailsId: string | null) => {
    const nextSearchParams = getSearchParamsWithDetails(searchParams, detailsId);
    const queryString = nextSearchParams.toString();

    return queryString ? `${pathname}?${queryString}` : pathname;
  };

  const updateDetails = (detailsId: string | null) => {
    const nextSearchParams = getSearchParamsWithDetails(
      searchParams,
      detailsId,
    );
    const nextDetailsId = getCurrentDetailsId(nextSearchParams);

    if (nextDetailsId === selectedPokemonId) {
      return;
    }

    setSearchParams(nextSearchParams);
  };

  return {
    closeDetails: () => {
      updateDetails(null);
    },
    getDetailsHref,
    openDetails: (detailsId: string) => {
      updateDetails(detailsId);
    },
    selectedPokemonId,
  };
}
