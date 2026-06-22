import { redirect } from 'next/navigation';
import { DEFAULT_PAGE } from '../../constants/pagination';
import { hasValidPageParam } from '../../helpers/searchParams';
import { isLocale } from '../../i18n/routing';
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

  if (isLocale(locale) && !hasValidPageParam(currentSearchParams)) {
    currentSearchParams.set('page', String(DEFAULT_PAGE));
    redirect(`/${locale}?${currentSearchParams.toString()}`);
  }

  return <HomePage />;
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
