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

export interface CreateNFTKeyProps extends RefetchType {
  quickCreate?: boolean;
}

export interface AddResourceProps extends RefetchType {
  quickUpload?: boolean;
}

export interface KeysDialogProps {
  tokens:Token[], 
  resourceId:string
}
export interface ShareDialogProps extends RefetchType {
  token: Token;
}
export interface RemoveDialogProps extends RefetchType {
  resourceId: string;
}
export interface BurnDialogProps extends RefetchType {
  tokenId: number;
}
  