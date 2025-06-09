import { Bytes, store } from "@graphprotocol/graph-ts"
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

  let idStr = event.address.toHex() + "-" + event.params.resourceId.toString()
  let idBytes = Bytes.fromUTF8(idStr)

  let resource = Resource.load(idBytes)
  if (resource) {
    let tokenEntityId = Bytes.fromUTF8(
      event.address.toHex() + "-" + event.params.tokenId.toString()
    );
    let tokens = resource.tokens
    tokens.push(tokenEntityId)
    resource.tokens = tokens
    resource.save()
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

  let idStr = event.address.toHex() + "-" + event.params.tokenId.toString()
  let idBytes = Bytes.fromUTF8(idStr)

  const token = new Token(idBytes)
  
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

  let idStr = event.address.toHex() + "-" + event.params.resourceId.toString()
  let idBytes = Bytes.fromUTF8(idStr)

  let resource = Resource.load(idBytes)
  if (resource) {
    let tokenEntityId = Bytes.fromUTF8(
      event.address.toHex() + "-" + event.params.tokenId.toString()
    );
    let updatedTokens: Bytes[] = [];

    for (let i = 0; i < resource.tokens.length; i++) {
      if (!resource.tokens[i].equals(tokenEntityId)) {
        updatedTokens.push(resource.tokens[i]);
      }
    }

    resource.tokens = updatedTokens;
    resource.save()
  }
}

export function handleResourceAdded(event: ResourceAddedEvent): void {
  let entity = new ResourceAdded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.owner = event.params.owner
  entity.resourceId = event.params.resourceId
  entity.name = event.params.name.toString()
  entity.tokenId = event.params.tokenId
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  let idStr = event.address.toHex() + "-" + event.params.resourceId.toString()
  let idBytes = Bytes.fromUTF8(idStr)
  
  let resource = new Resource(idBytes)
  resource.owner = event.params.owner  
  resource.name = event.params.name.toString()
  resource.resourceId = event.params.resourceId
  
  let tokenEntityId = Bytes.fromUTF8(
    event.address.toHex() + "-" + event.params.tokenId.toString()
  );
  resource.tokens = [];
  let tokens = resource.tokens
  tokens.push(tokenEntityId)
  resource.tokens = tokens  // reassign (important for Graph)

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

  let idStr = event.address.toHex() + "-" + event.params.resourceId.toString()
  let idBytes = Bytes.fromUTF8(idStr)

  let resource = Resource.load(idBytes)
  if (resource != null) {
    resource.tokens = []
    resource.save()
    store.remove("Resource", idBytes.toHexString())
  }    
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

  let idStr = event.address.toHex() + "-" + event.params.id.toString()
  let idBytes = Bytes.fromUTF8(idStr)
  let token = Token.load(idBytes)

  if (!token) {
    return
  }

  let ZERO_ADDRESS = Bytes.fromHexString("0x0000000000000000000000000000000000000000");
  if (event.params.to.equals(ZERO_ADDRESS)) {
    store.remove("Token", idBytes.toHexString());
    return;
  }

  token.currentOwner = event.params.to
  token.save()
}