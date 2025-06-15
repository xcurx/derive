"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";
import { type State, WagmiProvider } from "wagmi";
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

import { getConfig } from "../wagmi.config";
import { Provider } from "react-redux";
import store from "@/store/store";

type Props = {
  children: ReactNode;
  initialState: State | undefined;
};

export function Providers({ children, initialState }: Props) {
  const [config] = useState(() => getConfig());
  const [queryClient] = useState(() => new QueryClient());

  const client = new ApolloClient({
    uri: 'https://api.studio.thegraph.com/query/112592/derive/version/latest',
    cache: new InMemoryCache(),
  }); 

  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <ApolloProvider client={client}>
            {children}
          </ApolloProvider>
        </Provider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}