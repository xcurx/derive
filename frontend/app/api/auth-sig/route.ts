import { Wallet, providers } from 'ethers';
import { LIT_NETWORK, LIT_RPC } from '@lit-protocol/constants';
import { NextResponse, type NextRequest } from 'next/server';
import * as LitJsSdk from "@lit-protocol/lit-node-client-nodejs";

export async function POST(req: NextRequest) {
  const privateKey = process.env.LIT_PAYER_PRIVATE_KEY;
  const tokenId = process.env.LIT_CAPACITY_TOKEN_ID;
  const litNodeClient = new LitJsSdk.LitNodeClientNodeJs({
    litNetwork: LIT_NETWORK.DatilDev,
  });
  await litNodeClient.connect();

  if (!privateKey || !tokenId) {
    return NextResponse.json({ error: 'Missing config' }, { status: 500 });
  }

  const wallet = new Wallet(
    privateKey as `0x${string}`,
    new providers.JsonRpcProvider(LIT_RPC.CHRONICLE_YELLOWSTONE)
  );

  const { capacityDelegationAuthSig } =
    await litNodeClient.createCapacityDelegationAuthSig({
      uses: '100',
      dAppOwnerWallet: wallet,
      capacityTokenId: tokenId,
      expiration: new Date(Date.now() + 10 * 1000).toISOString(),
    });

  return NextResponse.json({ capacityDelegationAuthSig });
}
