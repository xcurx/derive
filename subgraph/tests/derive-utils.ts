import { newMockEvent } from "matchstick-as"
import { ethereum, Bytes, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  AccessAdded,
  Creation,
  KeyReclaimed,
  RemovedFromList,
  ResourceAdded,
  ResourceRemoved,
  Transfer
} from "../generated/Derive/Derive"

export function createAccessAddedEvent(
  resourceId: Bytes,
  tokenId: BigInt
): AccessAdded {
  let accessAddedEvent = changetype<AccessAdded>(newMockEvent())

  accessAddedEvent.parameters = new Array()

  accessAddedEvent.parameters.push(
    new ethereum.EventParam(
      "resourceId",
      ethereum.Value.fromFixedBytes(resourceId)
    )
  )
  accessAddedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return accessAddedEvent
}

export function createCreationEvent(
  owner: Address,
  tokenId: BigInt,
  name: string
): Creation {
  let creationEvent = changetype<Creation>(newMockEvent())

  creationEvent.parameters = new Array()

  creationEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  creationEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  creationEvent.parameters.push(
    new ethereum.EventParam("name", ethereum.Value.fromString(name))
  )

  return creationEvent
}

export function createKeyReclaimedEvent(
  prevOwner: Address,
  tokenId: BigInt
): KeyReclaimed {
  let keyReclaimedEvent = changetype<KeyReclaimed>(newMockEvent())

  keyReclaimedEvent.parameters = new Array()

  keyReclaimedEvent.parameters.push(
    new ethereum.EventParam("prevOwner", ethereum.Value.fromAddress(prevOwner))
  )
  keyReclaimedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return keyReclaimedEvent
}

export function createRemovedFromListEvent(
  resourceId: Bytes,
  tokenId: BigInt
): RemovedFromList {
  let removedFromListEvent = changetype<RemovedFromList>(newMockEvent())

  removedFromListEvent.parameters = new Array()

  removedFromListEvent.parameters.push(
    new ethereum.EventParam(
      "resourceId",
      ethereum.Value.fromFixedBytes(resourceId)
    )
  )
  removedFromListEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return removedFromListEvent
}

export function createResourceAddedEvent(
  owner: Address,
  resourceId: Bytes,
  name: string,
  tokenId: BigInt,
  dataToEncryptHash: string
): ResourceAdded {
  let resourceAddedEvent = changetype<ResourceAdded>(newMockEvent())

  resourceAddedEvent.parameters = new Array()

  resourceAddedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  resourceAddedEvent.parameters.push(
    new ethereum.EventParam(
      "resourceId",
      ethereum.Value.fromFixedBytes(resourceId)
    )
  )
  resourceAddedEvent.parameters.push(
    new ethereum.EventParam("name", ethereum.Value.fromString(name))
  )
  resourceAddedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  resourceAddedEvent.parameters.push(
    new ethereum.EventParam(
      "dataToEncryptHash",
      ethereum.Value.fromString(dataToEncryptHash)
    )
  )

  return resourceAddedEvent
}

export function createResourceRemovedEvent(
  owner: Address,
  resourceId: Bytes
): ResourceRemoved {
  let resourceRemovedEvent = changetype<ResourceRemoved>(newMockEvent())

  resourceRemovedEvent.parameters = new Array()

  resourceRemovedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  resourceRemovedEvent.parameters.push(
    new ethereum.EventParam(
      "resourceId",
      ethereum.Value.fromFixedBytes(resourceId)
    )
  )

  return resourceRemovedEvent
}

export function createTransferEvent(
  from: Address,
  to: Address,
  id: BigInt
): Transfer {
  let transferEvent = changetype<Transfer>(newMockEvent())

  transferEvent.parameters = new Array()

  transferEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )

  return transferEvent
}
