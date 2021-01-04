# ethernaut

My solutions to [Ethernaut CTF](https://ethernaut.openzeppelin.com/).

## Development

```bash
npm i
```

You need to configure environment variables:

```bash
cp .env.template .env
# fill out
```

Pick a mnemonic and use the resulting first ETH account as the challenger account on capture-the-ether.

#### Hardhat

This repo uses [hardhat](https://hardhat.org/) to run the CTF challenges.
Challenges are implemented as hardhat tests in [`/test`](./test).

To fork the Rinkeby testnet, you need an archive URL like the free ones from [Alchemy](https://alchemyapi.io/).

#### Running challenges

Optionally set the block number in the `hardhat.config.ts` hardhat network configuration to the rinkeby head block number such that the challenge contract is deployed.

```bash
# fork rinkeby but run locally
npx hardhat test test/warmup/call-me.ts
# once everything works, run all txs on rinkeby testnet to gain points
npx hardhat test test/warmup/call-me.ts --network rinkeby
```
