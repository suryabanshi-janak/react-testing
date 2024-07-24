import { PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { CartProvider } from '../src/providers/CartProvider';
import { Theme } from '@radix-ui/themes';
import { Toaster } from 'react-hot-toast';

export const AllProviders = ({ children }: PropsWithChildren) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <Theme>
          {children}
          <Toaster />
        </Theme>
      </CartProvider>
    </QueryClientProvider>
  );
};
