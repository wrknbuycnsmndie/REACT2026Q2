import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { AboutPage } from '../../../views/AboutPage/AboutPage';
import { isLocale } from '../../../i18n/routing';

type PageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return <AboutPage />;
}
