import { PropsWithChildren } from 'react';
import {
  QueryClient,
  QueryClientProvider as TanstackQueryClientProvider,
} from '@tanstack/react-query';

const queryClient = new QueryClient();

export const QueryClientProvider = ({ children }: PropsWithChildren) => {
  return (
    <TanstackQueryClientProvider client={queryClient}>
      {children}
    </TanstackQueryClientProvider>
  );
};
