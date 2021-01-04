import hre, { ethers } from "hardhat"
import { task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";

async function main() {
  const signers = await ethers.getSigners();
  const [deployer] = signers;

  signers.slice(0, 5).forEach((account, index) => {
    console.log(`Key ${index}: ${account.address}`)
  })
  
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // const Token = await ethers.getContractFactory("Token");
  // const token = await Token.deploy();

  // console.log("Token address:", token.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
