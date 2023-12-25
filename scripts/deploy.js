// Import necessary modules
const { ethers } = require("hardhat");
const fs = require("fs");

// Main function for deploying the smart contract
async function main() {
  // Deploy the "NFTMarketplace" smart contract using Hardhat
  const nftMarketplace = await ethers.deployContract("NFTMarketplace");

  // Wait for the deployment of the smart contract to complete
  await nftMarketplace.waitForDeployment();

  // Log a message indicating that the contract has been deployed
  console.log("Contract deployed");

  // Read the content of the ".env.local" file
  const envFile = fs.readFileSync(".env.local", "utf8");

  // Check if NEXT_PUBLIC_NFT_MARKETPLACE_ADDRESS key already exists in the file
  if (envFile.includes("NEXT_PUBLIC_NFT_MARKETPLACE_ADDRESS")) {
    // Replace the existing value with the new contract address
    const updatedEnvFile = envFile.replace(
      /NEXT_PUBLIC_NFT_MARKETPLACE_ADDRESS=.*/,
      `NEXT_PUBLIC_NFT_MARKETPLACE_ADDRESS=${nftMarketplace.target}`
    );
    // Write the updated content back to the ".env.local" file
    fs.writeFileSync(".env.local", updatedEnvFile);
  } else {
    // If the NEXT_PUBLIC_NFT_MARKETPLACE_ADDRESS key doesn't exist, append it to the ".env.local" file
    fs.appendFileSync(
      ".env.local",
      `\nNEXT_PUBLIC_NFT_MARKETPLACE_ADDRESS=${nftMarketplace.target}`
    );
  }
}

// Execute the "main" function
main()
  .then(() => process.exit(0)) // Exit with code 0 for success
  .catch(() => process.exit(1)); // Exit with code 1 for failure
