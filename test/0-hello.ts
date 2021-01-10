import { expect } from "chai";
import { Contract, Signer } from "ethers";
import { ethers } from "hardhat";
import { createChallenge, submitLevel } from "./utils";

let accounts: Signer[];
let eoa: Signer;
let attacker: Contract;
let challenge: Contract; // challenge contract
let tx: any;

const abi = [
  {
    inputs: [{ internalType: "string", name: "_password", type: "string" }],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [{ internalType: "string", name: "passkey", type: "string" }],
    name: "authenticate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0xaa613b29",
  },
  {
    inputs: [],
    name: "getCleared",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
    constant: true,
    signature: "0x3c848d78",
  },
  {
    inputs: [],
    name: "info",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "pure",
    type: "function",
    constant: true,
    signature: "0x370158ea",
  },
  {
    inputs: [],
    name: "info1",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "pure",
    type: "function",
    constant: true,
    signature: "0xd4c3cf44",
  },
  {
    inputs: [{ internalType: "string", name: "param", type: "string" }],
    name: "info2",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "pure",
    type: "function",
    constant: true,
    signature: "0x2133b6a9",
  },
  {
    inputs: [],
    name: "info42",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "pure",
    type: "function",
    constant: true,
    signature: "0x2cbd79a5",
  },
  {
    inputs: [],
    name: "infoNum",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
    constant: true,
    signature: "0xc253aebe",
  },
  {
    inputs: [],
    name: "method7123949",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "pure",
    type: "function",
    constant: true,
    signature: "0xf0bc7081",
  },
  {
    inputs: [],
    name: "password",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
    constant: true,
    signature: "0x224b610b",
  },
  {
    inputs: [],
    name: "theMethodName",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
    constant: true,
    signature: "0xf157a1e3",
  },
];

before(async () => {
  accounts = await ethers.getSigners();
  [eoa] = accounts;
  const challengeAddress = await createChallenge(`0x4E73b858fD5D7A5fc1c3455061dE52a53F35d966`)
  challenge = await ethers.getContractAt(
    abi,
    challengeAddress,
  );
});

it("solves the challenge", async function () {
  const infos = await Promise.all([
    challenge.info(),
    challenge.info1(),
    challenge.info2(`hello`),
    challenge.infoNum(),
    challenge.info42(),
    challenge.theMethodName(),
    challenge.method7123949(),
  ]);
  console.log(infos.join(`\n`));

  const password = await challenge.password()
  console.log(`password = ${password}`)
  // can we somehow get it from constructor arguments? seems to accept a _password
  // const deploymentTx = await eoa.provider!.getTransaction(`0x047c8f63435250a79ede096557b94de95a4c5f282f0c041951b42a2d70bcd149`)
  // console.log(`Tx data:`, deploymentTx.data, Buffer.from(deploymentTx.data, `hex`).toString(`utf8`))

  tx = await challenge.authenticate(password)
  await tx.wait()
});

after(async () => {
  expect(await submitLevel(challenge.address), "level not solved").to.be.true;
});
