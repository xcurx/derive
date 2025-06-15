import { LitContracts } from "@lit-protocol/contracts-sdk";
import { LIT_NETWORK, LIT_RPC } from "@lit-protocol/constants";
import { providers, Wallet } from 'ethers';

async function mintNFT() {
  const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY;
  console.log(privateKey);
  if (!privateKey) {
    throw new Error("LIT_PAYER_PRIVATE_KEY is not set in your .env file.");
  }

  console.log("Connecting to wallet and Lit Contracts...");

  // This wallet MUST have test-LIT on the Chronicle network
  const wallet = new Wallet(
    privateKey,
    new providers.JsonRpcProvider(LIT_RPC.CHRONICLE_YELLOWSTONE)
  );

  const contractClient = new LitContracts({
    signer: wallet,
    network: LIT_NETWORK.DatilDev,
  });

  await contractClient.connect();
  console.log("Connected. Minting a new Capacity Credits NFT...");

  try {
    const { capacityTokenIdStr } = await contractClient.mintCapacityCreditsNFT({
      requestsPerKilosecond: 30,
      daysUntilUTCMidnightExpiration: 30, // Mint for a longer period, like 30 days
    });

    console.log("\n✅ NFT Minted Successfully!");
    console.log("---------------------------------");
    console.log("Payer Wallet Address:", wallet.address);
    console.log("Capacity Token ID (capacityTokenIdStr):", capacityTokenIdStr);
    console.log("---------------------------------");
    console.log("\nACTION REQUIRED:");
    console.log("Copy this Capacity Token ID and save it in your .env.local file as:");
    console.log(`NEXT_PUBLIC_LIT_CAPACITY_TOKEN_ID=${capacityTokenIdStr}`);

  } catch (err) {
    console.error("Failed to mint NFT:", err);
  }
}

mintNFT();