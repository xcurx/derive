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
  ResourceAdded,
  ResourceRemoved,
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
}

export function handleResourceAdded(event: ResourceAddedEvent): void {
  let entity = new ResourceAdded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.owner = event.params.owner
  entity.resourceId = event.params.resourceId
  entity.name = event.params.name
  entity.tokenId = event.params.tokenId
  entity.dataToEncryptHash = event.params.dataToEncryptHash

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
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
}
