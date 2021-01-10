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
  const challengeFactory = await ethers.getContractFactory(`Preservation`);
  const challengeAddress = await createChallenge(
    `0x97E982a15FbB1C28F6B8ee971BEc15C78b3d263F`
  );
  challenge = await challengeFactory.attach(challengeAddress);
  const attackerFactory = await ethers.getContractFactory(
    `PreservationAttacker`
  );
  // attack is done in constructor
  attacker = await attackerFactory.deploy(challenge.address);
});

it("solves the challenge", async function () {
  tx = await attacker.attack();
  await tx.wait();
});

after(async () => {
  expect(await submitLevel(challenge.address), "level not solved").to.be.true;
});
