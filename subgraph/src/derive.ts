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
  Transfer,
  EventEntity
} from "../generated/schema"

function getTokenId(contractAddress: Bytes, tokenId: BigInt): string {
  return contractAddress.toHex() + "-" + tokenId.toString();
}

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

  let eventEntity = new EventEntity(entity.id);
  eventEntity.eventType = "AccessAdded";
  eventEntity.owner = resource ? resource.owner : Bytes.empty();
  eventEntity.blockNumber = event.block.number;
  eventEntity.blockTimestamp = event.block.timestamp;
  eventEntity.transactionHash = event.transaction.hash;
  eventEntity.accessAdded = entity.id;
  eventEntity.save();
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

  let eventEntity = new EventEntity(entity.id);
  eventEntity.eventType = "Creation";
  eventEntity.owner = event.params.owner;
  eventEntity.blockNumber = event.block.number;
  eventEntity.blockTimestamp = event.block.timestamp;
  eventEntity.transactionHash = event.transaction.hash;
  eventEntity.creation = entity.id;
  eventEntity.save();
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

  const token = Token.load(getTokenId(event.address, event.params.tokenId));

  let eventEntity = new EventEntity(entity.id);
  eventEntity.eventType = "KeyReclaimed";
  eventEntity.owner = token ? token.realOwner : Bytes.empty();
  eventEntity.blockNumber = event.block.number;
  eventEntity.blockTimestamp = event.block.timestamp;
  eventEntity.transactionHash = event.transaction.hash;
  eventEntity.keyReclaimed = entity.id;
  eventEntity.save();
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

  let eventEntity = new EventEntity(entity.id);
  eventEntity.eventType = "RemovedFromList";
  eventEntity.owner = resource ? resource.owner : Bytes.empty();
  eventEntity.blockNumber = event.block.number;
  eventEntity.blockTimestamp = event.block.timestamp;
  eventEntity.transactionHash = event.transaction.hash;
  eventEntity.removedFromList = entity.id;
  eventEntity.save();
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

  let eventEntity = new EventEntity(entity.id);
  eventEntity.eventType = "ResourceAdded";
  eventEntity.owner = event.params.owner;
  eventEntity.blockNumber = event.block.number;
  eventEntity.blockTimestamp = event.block.timestamp;
  eventEntity.transactionHash = event.transaction.hash;
  eventEntity.resourceAdded = entity.id;
  eventEntity.save();
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

  let eventEntity = new EventEntity(entity.id);
  eventEntity.eventType = "ResourceRemoved";
  eventEntity.owner = event.params.owner;
  eventEntity.blockNumber = event.block.number;
  eventEntity.blockTimestamp = event.block.timestamp;
  eventEntity.transactionHash = event.transaction.hash;
  eventEntity.resourceRemoved = entity.id;
  eventEntity.save();
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
    if(token.realOwner == event.params.from){
      let eventEntity = new EventEntity(entity.id);
      eventEntity.eventType = "Transfer";
      eventEntity.owner = token ? token.realOwner : Bytes.empty();
      eventEntity.blockNumber = event.block.number;
      eventEntity.blockTimestamp = event.block.timestamp;
      eventEntity.transactionHash = event.transaction.hash;
      eventEntity.transfer = entity.id;
      eventEntity.save();
    } 
  }
}