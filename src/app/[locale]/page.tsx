import { redirect } from 'next/navigation';
import { PokemonDetailsPanel } from '../../components/PokemonDetails/PokemonDetailsPanel';
import { DEFAULT_PAGE } from '../../constants/pagination';
import {
  getCurrentDetailsId,
  getCurrentPage,
  getCurrentSearchTerm,
  getSearchParamsWithDetails,
  hasValidPageParam,
} from '../../helpers/searchParams';
import { isLocale } from '../../i18n/routing';
import { fetchPokemonDetails, fetchPokemonResults } from '../../services/pokemon';
import { HomePage } from '../../views/HomePage/HomePage';

export const dynamic = 'force-dynamic';

type PageProps = {
  params: Promise<{
    locale: string;
  }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const currentSearchParams = toUrlSearchParams(await searchParams);
  const currentSearchTerm = getCurrentSearchTerm(currentSearchParams);

  if (isLocale(locale) && currentSearchParams.has('query') && currentSearchTerm === '') {
    currentSearchParams.delete('query');
    const queryString = currentSearchParams.toString();

    redirect(queryString ? `/${locale}?${queryString}` : `/${locale}`);
  }

  if (isLocale(locale) && !hasValidPageParam(currentSearchParams)) {
    currentSearchParams.set('page', String(DEFAULT_PAGE));
    redirect(`/${locale}?${currentSearchParams.toString()}`);
  }

  const currentPage = getCurrentPage(currentSearchParams);
  const currentDetailsId = getCurrentDetailsId(currentSearchParams);
  const closeDetailsSearchParams = getSearchParamsWithDetails(
    currentSearchParams,
    null,
  );
  const closeDetailsHref = closeDetailsSearchParams.toString()
    ? `/?${closeDetailsSearchParams.toString()}`
    : '/';
  const [initialResults, initialDetails] = await Promise.all([
    fetchPokemonResults(currentSearchTerm, currentPage).catch(() => null),
    currentDetailsId ? fetchPokemonDetails(currentDetailsId).catch(() => null) : null,
  ]);

  return (
    <HomePage
      detailsPanel={
        currentDetailsId ? (
          <PokemonDetailsPanel
            closeHref={closeDetailsHref}
            details={initialDetails}
            errorMessage=''
            isLoading={false}
          />
        ) : null
      }
      hasDetailsPanel={Boolean(currentDetailsId)}
      initialResults={initialResults}
      initialSearchTerm={currentSearchParams.has('query') ? currentSearchTerm : undefined}
    />
  );
}

function toUrlSearchParams(
  searchParams: Record<string, string | string[] | undefined>,
) {
  const urlSearchParams = new URLSearchParams();

  Object.entries(searchParams).forEach(([key, value]) => {
    if (typeof value === 'string') {
      urlSearchParams.set(key, value);
      return;
    }

    value?.forEach((entry) => {
      urlSearchParams.append(key, entry);
    });
  });

  return urlSearchParams;
}
