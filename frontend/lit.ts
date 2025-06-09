import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { LIT_NETWORK } from "@lit-protocol/constants";
import { encryptFile } from '@lit-protocol/encryption';

const accessControlConditions = [
  {
    contractAddress: "",
    standardContractType: "",
    chain: "ethereum",
    method: "eth_getBalance",
    parameters: [":userAddress", "latest"],
    returnValueTest: {
      comparator: ">=",
      value: "1000000000000", // 0.000001 ETH
    },
  },
];

export class Lit {
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   public litNodeClient: any;
   public chain: string;

   constructor(chain:string){
     this.chain = chain;
   }

   async connect() {
      this.litNodeClient = new LitJsSdk.LitNodeClient({
        litNetwork: LIT_NETWORK.DatilDev,
      });
      await this.litNodeClient.connect();
   }

   async encryptFile(file:File) {
        if(!file){
            return;
        } 

        const { encryptedFile, symmetricKey } = await encryptFile({
            file,
            accessControlConditions,
            chain:"holesky"
        }, this.litNodeClient);
   }
}