/* eslint-disable @typescript-eslint/no-explicit-any */
import * as LitJsSdk from "@lit-protocol/lit-node-client-nodejs";
import { LIT_ABILITY, LIT_NETWORK, LIT_RPC } from "@lit-protocol/constants";
import { encryptFile, decryptToFile } from '@lit-protocol/encryption';
import { createSiweMessageWithRecaps, generateAuthSig, LitAccessControlConditionResource } from "@lit-protocol/auth-helpers";
import { providers, Wallet } from 'ethers'

const accessControlConditions = [
  {
    contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    standardContractType: "",
    chain: "sepolia",
    method: "hasAccess",
    parameters: [":userAddress", ":resourceId"],
    functionAbi: {
      "inputs": [
        {
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "internalType": "bytes32",
          "name": "resourceId",
          "type": "bytes32"
        }
      ],
      "name": "hasAccess",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    returnValueTest: {
      comparator: "=",
      value: "true", 
    },
  },
];

export class Lit {
  public litNodeClient!: LitJsSdk.LitNodeClientNodeJs;
  public chain: string;
  private capacityDelegationAuthSig!: any;

  constructor(chain:string){
    this.chain = chain;
  }

  async connect() {
     this.litNodeClient = new LitJsSdk.LitNodeClientNodeJs({
       litNetwork: LIT_NETWORK.DatilDev,
     });
     await this.litNodeClient.connect();
  }

  async #initContractClient() {
    const walletWithCapacityCredit = new Wallet(
      process.env.NEXT_PUBLIC_PRIVATE_KEY as `0x${string}`,
      new providers.JsonRpcProvider(LIT_RPC.CHRONICLE_YELLOWSTONE)
    );
    
    const { capacityDelegationAuthSig } =
    await this.litNodeClient.createCapacityDelegationAuthSig({
      uses: '100',
      dAppOwnerWallet: walletWithCapacityCredit,
      capacityTokenId: process.env.NEXT_PUBLIC_LIT_CAPACITY_TOKEN_ID,
    });

    this.capacityDelegationAuthSig = capacityDelegationAuthSig;
  }

  async #getSessionSignatures() {
    
    const provider = new providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const walletAddress = await signer.getAddress();
    const latestBlockhash = await this.litNodeClient.getLatestBlockhash();
    await this.#initContractClient();

    const authNeededCallback = async(params:any) => {
       if (!params.uri) {
         throw new Error("uri is required");
       }
       if (!params.expiration) {
         throw new Error("expiration is required");
       }
  
       if (!params.resourceAbilityRequests) {
         throw new Error("resourceAbilityRequests is required");
       }
   
       // Create the SIWE message
       const toSign = await createSiweMessageWithRecaps({
         uri: params.uri,
         expiration: params.expiration,
         resources: params.resourceAbilityRequests, 
         walletAddress: walletAddress as string,
         nonce: latestBlockhash,
         litNodeClient: this.litNodeClient,
       });
  
       // Generate the authSig
       const authSig = await generateAuthSig({
         signer: signer,
         toSign,
       });
  
       return authSig;
    }

    const litResource = new LitAccessControlConditionResource('*');

    // Get the session signatures
    const sessionSigs = await this.litNodeClient.getSessionSigs({
        chain: this.chain,
        resourceAbilityRequests: [
            {
                resource: litResource,
                ability: LIT_ABILITY.AccessControlConditionDecryption,
            },
        ],
        authNeededCallback,
        capacityDelegationAuthSig: this.capacityDelegationAuthSig,
    });
    return sessionSigs;
  }

  async encryptFile(file:File, resourceId:string) {
      if(!file){
          return;
      }
      const updatedAccessControlConditions = {
        ...accessControlConditions,
        parameters: [":userAddress", resourceId],
      }

      return await encryptFile({
          file,
          accessControlConditions: updatedAccessControlConditions,
          chain:"sepolia",
          
      }, this.litNodeClient);
  }

  async decryptFile(ciphertext: string, dataToEncryptHash: string, resourceId: string) {
    // await this.connect();
    const sessionSigs = await this.#getSessionSignatures();
    const updatedAccessControlConditions = {
      ...accessControlConditions,
      parameters: [":userAddress", resourceId],
    }

    const decryptedFile = await decryptToFile({
        accessControlConditions: updatedAccessControlConditions,
        chain: this.chain,
        ciphertext,
        dataToEncryptHash,
        sessionSigs,
      },
      this.litNodeClient,
    );

    return decryptedFile;
  }
}