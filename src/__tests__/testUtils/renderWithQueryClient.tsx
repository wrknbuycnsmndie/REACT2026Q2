import { QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import type { ReactNode } from 'react';
import { createAppQueryClient } from '../../query/queryClient';
import { IntlTestProvider } from './renderWithIntl';

export function renderWithQueryClient(ui: ReactNode) {
  const queryClient = createAppQueryClient();

  function QueryClientWrapper({ children }: { children: ReactNode }) {
    return (
      <IntlTestProvider>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </IntlTestProvider>
    );
  }

  return render(ui, { wrapper: QueryClientWrapper });
}
