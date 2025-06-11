import { createConfig, http, cookieStorage, createStorage } from "wagmi";
import { sepolia } from "wagmi/chains"
import { metaMask } from "wagmi/connectors";

export function getConfig() {
    return createConfig({
      ssr: true, // Make sure to enable this for server-side rendering (SSR) applications.
      chains: [sepolia],
      connectors: [metaMask()],
      storage: createStorage({
        storage: cookieStorage,
      }),
      transports: {
        [sepolia.id]: http(),
      },
    });
}