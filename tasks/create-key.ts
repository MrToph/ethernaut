import hre from "hardhat";
import { task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";

// follows ETH/BTC's BIP 39 protocol
// https://iancoleman.io/bip39/
// and matches the one hardhat uses when using { accounts: { mnemonic }}
task(
  "create-key",
  "creates an ETH private / public key pair that can be used for EOAs"
)
  .addParam(
    "mnemonic",
    "The mnemonic used for BIP39 key derivation: See https://iancoleman.io/bip39"
  )
  .setAction(async function (taskArgs, hre, runSuper) {
    console.log("Hello, World!", taskArgs);
    const { mnemonic } = taskArgs;
    const masterKey = hre.ethers.utils.HDNode.fromMnemonic(mnemonic);
    
    console.log(masterKey)
    // "m/44'/60'/0'/0/0" first account
    const getPathForIndex = (index:number) => `m/44'/60'/0'/0/${index}`

    Array.from({ length: 5 }).forEach((_, index) => {
      const key = masterKey.derivePath(getPathForIndex(index));
      console.log(`Key ${getPathForIndex(index)}: ${key.address} (PK: ${key.publicKey}) (sk: ${key.privateKey})`)
    })
  });
