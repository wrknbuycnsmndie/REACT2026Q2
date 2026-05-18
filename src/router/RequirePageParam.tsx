import type { ReactNode } from 'react';
import { Navigate, useSearchParams } from 'react-router';
import { DEFAULT_PAGE } from '../constants/pagination';
import {
  getSearchParamsWithPage,
  hasValidPageParam,
} from '../helpers/searchParams';

type RequirePageParamProps = {
  children: ReactNode;
};

export function RequirePageParam({ children }: RequirePageParamProps) {
  const [searchParams] = useSearchParams();

  if (!hasValidPageParam(searchParams)) {
    const nextSearchParams = getSearchParamsWithPage(
      searchParams,
      DEFAULT_PAGE,
    );

    return <Navigate to={`/?${nextSearchParams.toString()}`} replace />;
  }

  return <>{children}</>;
}
