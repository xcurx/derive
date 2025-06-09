import { createConfig, http, cookieStorage, createStorage } from "wagmi";
import { holesky } from "wagmi/chains"
import { metaMask } from "wagmi/connectors";

export function getConfig() {
    return createConfig({
      ssr: true, // Make sure to enable this for server-side rendering (SSR) applications.
      chains: [holesky],
      connectors: [metaMask()],
      storage: createStorage({
        storage: cookieStorage,
      }),
      transports: {
        [holesky.id]: http(),
      },
    });
}