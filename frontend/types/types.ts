import { ApolloQueryResult, OperationVariables } from '@apollo/client';

export interface RefetchType {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  refetch: (variables?: Partial<OperationVariables> | undefined) => Promise<ApolloQueryResult<any>>
} 

export interface Transfer {
  from: string;
  to: string;
  internal_id: string;
}

export interface Resource {
  id: string;
  owner: string;
  name: string;
  tokens?: Token[];
  resourceId: string
  cid?: string
}

export interface Token {
  id: string
  name: string
  realOwner: string
  currentOwner: string
  tokenId: number
  resources?: Resource[]
  blockNumber: number
  blockTimestamp: number
  transactionHash: string
}
export interface PinataReturnType extends JSON {
  encryptedFile: string,
  name?: string,
}