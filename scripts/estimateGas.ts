import { ethers } from "hardhat";

async function main() {
  // Get the contract factory
  const ScottcoinFactory = await ethers.getContractFactory("Scottcoin");

  // Get the deployment bytecode
  const deploymentBytecode = ScottcoinFactory.bytecode;

  // Get the deployment transaction
  const deployTx = await ScottcoinFactory.getDeployTransaction();

  // Get the first signer (deployer)
  const [deployer] = await ethers.getSigners();

  // Estimate gas for deployment
  const estimatedGas = await deployer.estimateGas(deployTx);

  // Get current gas price
  const gasPrice = await ethers.provider.getFeeData();
  const gasPriceInGwei = gasPrice.gasPrice! / BigInt(1e9); // Convert to Gwei

  // Calculate total cost in ETH
  const totalCostInWei = estimatedGas * gasPrice.gasPrice!;
  const totalCostInEth = ethers.formatEther(totalCostInWei);

  console.log("\nDeployment Gas Estimation:");
  console.log("---------------------------");
  console.log(`Estimated Gas: ${estimatedGas} units`);
  console.log(`Current Gas Price: ${gasPriceInGwei} Gwei`);
  console.log(`Total Cost: ${totalCostInEth} ETH`);
  console.log(`Contract Size: ${(deploymentBytecode.length - 2) / 2} bytes`); // -2 for '0x' prefix
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 