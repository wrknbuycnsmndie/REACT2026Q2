import { useRouteSearchParams } from './useUrlSearchParams';
import {
  getCurrentDetailsId,
  getSearchParamsWithDetails,
} from '../helpers/searchParams';

type UsePokemonDetailsParamResult = {
  closeDetails: () => void;
  openDetails: (detailsId: string) => void;
  selectedPokemonId: string | null;
};

export function usePokemonDetailsParam(): UsePokemonDetailsParamResult {
  const { searchParams, setSearchParams } = useRouteSearchParams();
  const selectedPokemonId = getCurrentDetailsId(searchParams);

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
    openDetails: (detailsId: string) => {
      updateDetails(detailsId);
    },
    selectedPokemonId,
  };
}
