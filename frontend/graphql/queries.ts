import { gql } from "@apollo/client";

export const GET_SHARED_NFT_KEYS = gql`
  query GetTokens($currentOwner: String!) {
    tokens(where: {currentOwner: $currentOwner, realOwner_not: $currentOwner}) {
      id
      name
      realOwner
      tokenId
      currentOwner
    }
  }
`;

export const GET_OWNED_NFT_KEYS = gql`
  query GetTokens($realOwner: String!) {
    tokens(where: {currentOwner: $realOwner, realOwner: $realOwner}) {
      id
      name
      realOwner
      tokenId
      currentOwner
    }
  }
`;

export const GET_SHARED_TO_OTHERS_NFT_KEYS = gql`
  query GetTokens($realOwner: String!) {
    tokens(where: {currentOwner_not: $realOwner, realOwner: $realOwner}) {
      id
      name
      realOwner
      tokenId
      currentOwner
    }
  }
`;

export const GET_NFT_KEYS = gql`
  query GetNFTKeys($add: String!) {
    sharedNFTKeys: tokens(where: {currentOwner: $add, realOwner_not: $add}) {
      id
      name
      realOwner
      tokenId
      currentOwner
    }   

    ownedNFTKeys: tokens(where: {currentOwner: $add, realOwner: $add}) {
      id
      name
      realOwner
      tokenId
      currentOwner
    }

    sharedToOthersNFTKeys: tokens(where: {currentOwner_not: $add, realOwner: $add}) {
      id
      name
      realOwner
      tokenId
      currentOwner
    }
  }
`

export const GET_MY_NFT_KEYS = gql`
  query GetTokens($realOwner: String!) {
    tokens(where: {realOwner: $realOwner}) {
      id
      name
      realOwner
      tokenId
      currentOwner
    }
  }
`

export const GET_RESOURCES = gql`
  query GetResources($owner: String!) {
    resources(where: {owner: $owner}) {
      id
      owner
      name
      resourceId
      tokens {
        id
        name
        realOwner
        tokenId
        currentOwner
      }
    }
  }
`;

export const GET_SHARED_RESOURCES = gql`
  query GetSharedResources($add: String!) {
  resources(
    where: {tokens_: {currentOwner: $add, realOwner_not: $add}}
  ) {
    id
    name
    owner
    resourceId
  }}
`;