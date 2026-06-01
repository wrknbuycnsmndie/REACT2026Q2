import { QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import type { ReactNode } from 'react';
import { createAppQueryClient } from '../../query/queryClient';

export function renderWithQueryClient(ui: ReactNode) {
  const queryClient = createAppQueryClient();

  function QueryClientWrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  }

  return render(ui, { wrapper: QueryClientWrapper });
}
