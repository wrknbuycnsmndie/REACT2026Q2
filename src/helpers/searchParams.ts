import { DEFAULT_PAGE } from '../constants/pagination';

export function hasValidPageParam(searchParams: URLSearchParams): boolean {
    const rawPage = searchParams.get('page');
    const parsedPage = Number(rawPage);

    return Boolean(rawPage) && Number.isInteger(parsedPage) && parsedPage >= DEFAULT_PAGE;
}

export function getCurrentPage(searchParams: URLSearchParams): number {
    if (!hasValidPageParam(searchParams)) {
        return DEFAULT_PAGE;
    }

    return Number(searchParams.get('page'));
}

export function getSearchParamsWithPage(
    searchParams: URLSearchParams,
    page: number,
): URLSearchParams {
    const nextSearchParams = new URLSearchParams(searchParams);

    nextSearchParams.set('page', String(Math.max(DEFAULT_PAGE, page)));

    return nextSearchParams;
}
