import { redirect } from 'next/navigation';
import { DEFAULT_PAGE } from '../constants/pagination';
import { defaultLocale } from '../i18n/routing';

export default function Page() {
  redirect(`/${defaultLocale}?page=${DEFAULT_PAGE}`);
}
