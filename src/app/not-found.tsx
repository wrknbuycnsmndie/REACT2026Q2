import { NextIntlClientProvider } from 'next-intl';
import enMessages from '../messages/en.json';
import { NotFoundPage } from '../views/NotFoundPage/NotFoundPage';

export default function NotFound() {
  return (
    <NextIntlClientProvider locale='en' messages={enMessages}>
      <NotFoundPage />
    </NextIntlClientProvider>
  );
}
