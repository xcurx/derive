import { BigInt, Bytes, store } from "@graphprotocol/graph-ts"
import {
  AccessAdded as AccessAddedEvent,
  Creation as CreationEvent,
  KeyReclaimed as KeyReclaimedEvent,
  RemovedFromList as RemovedFromListEvent,
  ResourceAdded as ResourceAddedEvent,
  ResourceRemoved as ResourceRemovedEvent,
  Transfer as TransferEvent
} from "../generated/Derive/Derive"
import {
  AccessAdded,
  Creation,
  KeyReclaimed,
  RemovedFromList,
  Resource,
  ResourceAdded,
  ResourceRemoved,
  Token,
  Transfer
} from "../generated/schema"

function getTokenId(contractAddress: Bytes, tokenId: BigInt): string {
  return contractAddress.toHex() + "-" + tokenId.toString();
}

// Helper function for consistent Resource ID generation
function getResourceId(contractAddress: Bytes, resourceId: Bytes): string {
  return contractAddress.toHex() + "-" + resourceId.toString();
}

export function handleAccessAdded(event: AccessAddedEvent): void {
  let entity = new AccessAdded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.resourceId = event.params.resourceId
  entity.tokenId = event.params.tokenId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  const resourceId = getResourceId(event.address, event.params.resourceId);
  let resource = Resource.load(resourceId)
  if (resource) {
    const tokenId = getTokenId(event.address, event.params.tokenId);
    let tokens = resource.tokens;
    if (!tokens.includes(tokenId)) {
      tokens.push(tokenId);
      resource.tokens = tokens;
      resource.save();
    }
  }
}

export function handleCreation(event: CreationEvent): void {
  let entity = new Creation(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.owner = event.params.owner
  entity.tokenId = event.params.tokenId
  entity.name = event.params.name

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  const tokenId = getTokenId(event.address, event.params.tokenId);
  const token = new Token(tokenId)
  
  token.name = event.params.name
  token.realOwner = event.params.owner
  token.currentOwner = event.params.owner
  token.tokenId = event.params.tokenId

  token.blockNumber = event.block.number
  token.blockTimestamp = event.block.timestamp
  token.transactionHash = event.transaction.hash
  token.save();
}

export function handleKeyReclaimed(event: KeyReclaimedEvent): void {
  let entity = new KeyReclaimed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.prevOwner = event.params.prevOwner
  entity.tokenId = event.params.tokenId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRemovedFromList(event: RemovedFromListEvent): void {
  let entity = new RemovedFromList(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.resourceId = event.params.resourceId
  entity.tokenId = event.params.tokenId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  const resourceId = getResourceId(event.address, event.params.resourceId);

  let resource = Resource.load(resourceId)
  if (resource) {
    const tokenIdToRemove = getTokenId(event.address, event.params.tokenId);
    let updatedTokens: string[] = [];
    const currentTokens = resource.tokens;

    for (let i = 0; i < currentTokens.length; i++) {
      if (currentTokens[i] != tokenIdToRemove) {
        updatedTokens.push(currentTokens[i]);
      }
    }
    
    resource.tokens = updatedTokens;
    resource.save();
  }
}

export function handleResourceAdded(event: ResourceAddedEvent): void {
  let entity = new ResourceAdded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.owner = event.params.owner
  entity.resourceId = event.params.resourceId
  entity.name = event.params.name
  entity.tokenId = event.params.tokenId
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  let resourceId = getResourceId(event.address, event.params.resourceId);
  let resource = new Resource(resourceId)
  resource.owner = event.params.owner  
  resource.name = event.params.name
  resource.resourceId = event.params.resourceId
  
  let tokenId = getTokenId(event.address, event.params.tokenId);
  resource.tokens = [tokenId];

  resource.blockNumber = event.block.number
  resource.blockTimestamp = event.block.timestamp
  resource.transactionHash = event.transaction.hash
  resource.save()
}

export function handleResourceRemoved(event: ResourceRemovedEvent): void {
  let entity = new ResourceRemoved(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.owner = event.params.owner
  entity.resourceId = event.params.resourceId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  let resourceId = getResourceId(event.address, event.params.resourceId)
  store.remove("Resource", resourceId); 
}

export function handleTransfer(event: TransferEvent): void {
  let entity = new Transfer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.from = event.params.from
  entity.to = event.params.to
  entity.internal_id = event.params.id

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  let tokenId = getTokenId(event.address, event.params.id);
  let token = Token.load(tokenId)

  if(token){
    let ZERO_ADDRESS = Bytes.fromHexString("0x0000000000000000000000000000000000000000");
    if(event.params.to.equals(ZERO_ADDRESS)){
      store.remove("Token", tokenId);
    }else{
      token.currentOwner = event.params.to;
      token.save();
    }
  }
}