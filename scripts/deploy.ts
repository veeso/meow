import { ethers } from "hardhat";

async function main() {
  // deploy meow storage
  const MeowStorage = await ethers.getContractFactory("MeowStorage");
  const meowStorageContract = await MeowStorage.deploy();
  await meowStorageContract.deployed();
  console.log(`MeowStorage deployed to ${meowStorageContract.address}`);
  // deploy user
  const UserStorage = await ethers.getContractFactory("UserStorage");
  const userStorageContract = await UserStorage.deploy();
  await userStorageContract.deployed();
  console.log(`UserStorage deployed to ${userStorageContract.address}`);
  // deploy manager
  const ContractManager = await ethers.getContractFactory("ContractManager");
  const contractManager = await ContractManager.deploy();
  await contractManager.deployed();
  console.log(`ContractManager deployed to ${contractManager.address}`);
  await contractManager.setAddress("MeowStorage", meowStorageContract.address);
  await contractManager.setAddress("UserStorage", userStorageContract.address);
  // configure address for manager to storage
  await meowStorageContract.setManagerAddr(contractManager.address);
  await userStorageContract.setManagerAddr(contractManager.address);
  console.log("manager address configured into storage");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
