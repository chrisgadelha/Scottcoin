import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const scottcoin = await ethers.deployContract("Scottcoin");
  await scottcoin.waitForDeployment();

  console.log("Scottcoin deployed to:", await scottcoin.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 