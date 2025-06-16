/* eslint-disable @typescript-eslint/no-explicit-any */
import * as LitJsSdk from "@lit-protocol/lit-node-client-nodejs";
import { LIT_ABILITY, LIT_NETWORK } from "@lit-protocol/constants";
import { decryptFromJson, encryptToJson } from '@lit-protocol/encryption';
import { createSiweMessageWithRecaps, generateAuthSig, LitAccessControlConditionResource } from "@lit-protocol/auth-helpers";
import { providers } from 'ethers'

const evmContractConditions = [
  {
    contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    chain: "sepolia",
    functionName: "hasAccess",
    functionParams: [
      ":userAddress",
      ":litParam.resourceId" // Use the secure litParam placeholder
    ],
    functionAbi: {
      "inputs": [
        {"internalType": "address", "name": "user", "type": "address"},
        {"internalType": "bytes32", "name": "resourceId", "type": "bytes32"}
      ],
      "name": "hasAccess",
      "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
      "stateMutability": "view",
      "type": "function"
    },
    returnValueTest: {
      key:"",
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
    const res = await fetch(`/api/auth-sig`,{
      method: "POST",
    });
    const { capacityDelegationAuthSig } = await res.json();

    this.capacityDelegationAuthSig = capacityDelegationAuthSig;
  }

  async #getSessionSignatures() {
    this.connect();
    const provider = new providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const walletAddress = await signer.getAddress();
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
      
      const latestBlockhash = await this.litNodeClient.getLatestBlockhash();
       // Create the SIWE message
       const toSign = await createSiweMessageWithRecaps({
         uri: params.uri,
         expiration: params.expiration,
         resources: params.resourceAbilityRequests,
         walletAddress: walletAddress,
         nonce: latestBlockhash,
         litNodeClient: this.litNodeClient,
       });
  
       // Generate the authSig
       const authSig = await generateAuthSig({
         signer,
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
        expiration: new Date(Date.now() + 10 * 1000).toISOString() // 10 seconds
    });
    return sessionSigs;
  }

  async encryptFile(file:File, resourceId:string) {
      if(!file){
          return;
      }
      const updatedEvmContractConditions = [
        {
          ...evmContractConditions[0],
          functionParams: [":userAddress", resourceId],
        }
      ]

      const encryptedFile = await encryptToJson({
          file,
          evmContractConditions: updatedEvmContractConditions,
          chain:"sepolia",
          litNodeClient: this.litNodeClient,
      });
      this.litNodeClient.disconnect();

      return encryptedFile;
  }

  async decryptFile(json:Props) {
    const sessionSigs = await this.#getSessionSignatures();
    const decryptedFile = await decryptFromJson({
        parsedJsonData: json,
        litNodeClient: this.litNodeClient,
        sessionSigs,
      },
    );
    this.litNodeClient.disconnect();

    return decryptedFile;
  }
}

interface Props {
  chain: string;
  string?: string;
  file?: File;
  litNodeClient: LitJsSdk.LitNodeClientNodeJs;
  ciphertext: string;
  dataToEncryptHash: string;
  dataType: "string" | "file";
}