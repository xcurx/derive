import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Bytes, BigInt, Address } from "@graphprotocol/graph-ts"
import { AccessAdded } from "../generated/schema"
import { AccessAdded as AccessAddedEvent } from "../generated/Derive/Derive"
import { handleAccessAdded } from "../src/derive"
import { createAccessAddedEvent } from "./derive-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#tests-structure

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let resourceId = Bytes.fromI32(1234567890)
    let tokenId = BigInt.fromI32(234)
    let newAccessAddedEvent = createAccessAddedEvent(resourceId, tokenId)
    handleAccessAdded(newAccessAddedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#write-a-unit-test

  test("AccessAdded created and stored", () => {
    assert.entityCount("AccessAdded", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "AccessAdded",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "resourceId",
      "1234567890"
    )
    assert.fieldEquals(
      "AccessAdded",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "tokenId",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#asserts
  })
})
