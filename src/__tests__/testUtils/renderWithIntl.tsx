import { render } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import type { ReactNode } from 'react';
import messages from '../../messages/en.json';

export function IntlTestProvider({ children }: { children: ReactNode }) {
  return (
    <NextIntlClientProvider locale='en' messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}

export function renderWithIntl(ui: ReactNode) {
  return render(ui, { wrapper: IntlTestProvider });
}
