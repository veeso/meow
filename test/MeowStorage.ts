import { expect } from "chai";
import { ethers } from "hardhat";
import { MeowStorage, UserStorage } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "ethers";

describe("MeowStorage", function () {
  interface Contract {
    meowStorage: MeowStorage;
    userStorage: UserStorage;
    owner: SignerWithAddress;
    otherAccount: SignerWithAddress;
  }

  async function deployContract(): Promise<Contract> {
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
    await contractManager.setAddress(
      "MeowStorage",
      meowStorageContract.address
    );
    await contractManager.setAddress(
      "UserStorage",
      userStorageContract.address
    );
    console.log("Contract manager configured");
    await meowStorageContract.setManagerAddr(contractManager.address);
    await userStorageContract.setManagerAddr(contractManager.address);
    console.log("manager address configured into storage");
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();
    return {
      meowStorage: meowStorageContract,
      userStorage: userStorageContract,
      owner,
      otherAccount,
    };
  }

  it("Should post meow", async () => {
    const { meowStorage, userStorage } = await deployContract();
    // create test user
    await userStorage.createProfile("veeso_dev");

    await meowStorage.publish(
      "Hello, world! I'm sending this from my #polygon wallet! #web3 #solidity #blockchain",
      ["polygon", "web3", "solidity", "blockchain"],
      1668175551
    );
    const meow = await meowStorage.getMeowById(BigNumber.from(1));
    expect(meow.meow.id.toNumber()).to.be.equal(1);
    expect(meow.profile.id.toNumber()).to.be.equal(1);
    expect(meow.meow.text).to.be.equal(
      "Hello, world! I'm sending this from my #polygon wallet! #web3 #solidity #blockchain"
    );
    expect(JSON.stringify(meow.meow.hashtags)).to.be.equal(
      JSON.stringify(["polygon", "web3", "solidity", "blockchain"])
    );
    expect(meow.meow.epoch).to.be.equal(1668175551);
  });

  it("Should emit event on post", async () => {
    const { meowStorage, userStorage } = await deployContract();
    // create test user
    await userStorage.createProfile("veeso_dev");

    await expect(
      meowStorage.publish(
        "Hello, world! I'm sending this from my #polygon wallet! #web3 #solidity #blockchain",
        ["polygon", "web3", "solidity", "blockchain"],
        1668175551
      )
    )
      .to.emit(meowStorage, "MeowPublished")
      .withArgs(1, 1);
  });

  it("should return error on post longer than 256", async () => {
    const { meowStorage, userStorage } = await deployContract();
    // create test user
    await userStorage.createProfile("veeso_dev");
    await expect(
      meowStorage.publish(
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        [],
        1668175551
      )
    ).to.be.rejectedWith(Error);
  });

  it("should return error if user doesn't exist", async () => {
    const { meowStorage } = await deployContract();
    // create test user
    await expect(
      meowStorage.publish("hello!", [], 1668175551)
    ).to.be.rejectedWith(Error);
  });

  it("should return meows by profile", async () => {
    const { meowStorage, userStorage } = await deployContract();
    await userStorage.createProfile("veeso_dev");
    await meowStorage.publish("1", [], 1668175551);
    await meowStorage.publish("2", [], 1668175551);
    await meowStorage.publish("3", [], 1668175551);
    await meowStorage.publish("4", [], 1668175551);
    await meowStorage.publish("5", [], 1668175551);
    let meows = await meowStorage.getMeowsForProfile(
      BigNumber.from(1),
      BigNumber.from(0),
      BigNumber.from(2)
    );
    expect(meows.length).to.be.equal(2);
    expect(meows[0].meow.id.toNumber()).to.be.equal(5);
    expect(meows[1].meow.id.toNumber()).to.be.equal(4);
    meows = await meowStorage.getMeowsForProfile(
      BigNumber.from(1),
      BigNumber.from(2),
      BigNumber.from(3)
    );
    expect(meows.length).to.be.equal(3);
    expect(meows[0].meow.id.toNumber()).to.be.equal(3);
    expect(meows[1].meow.id.toNumber()).to.be.equal(2);
    expect(meows[2].meow.id.toNumber()).to.be.equal(1);
  });

  it("should return meows by following", async () => {
    const { meowStorage, userStorage, otherAccount } = await deployContract();
    const [_, thirdAccount] = await ethers.getSigners();
    await userStorage.createProfile("veeso_dev");
    await userStorage.connect(otherAccount).createProfile("shibetoshi");
    await userStorage.connect(thirdAccount).createProfile("omar");
    await meowStorage.publish("1", ["web3", "ethereum"], 1668175551);
    await userStorage.follow(2);
    await userStorage.follow(3);
    await meowStorage.connect(otherAccount).publish("2", [], 1668175551);
    await meowStorage.connect(thirdAccount).publish("3", [], 1668175551);
    await meowStorage.connect(otherAccount).publish("4", [], 1668175551);
    await meowStorage.connect(otherAccount).publish("5", [], 1668175551);

    const meows = await meowStorage.getMeowsAggregatedByFollowing(1, 2);
    expect(meows.length).to.be.equal(2);
    expect(meows[0].meow.id.toNumber()).to.be.equal(4);
    expect(meows[1].meow.id.toNumber()).to.be.equal(3);
  });

  it("should return meows by hashtags", async () => {
    const { meowStorage, userStorage } = await deployContract();
    await userStorage.createProfile("veeso_dev");
    await meowStorage.publish("1", ["web3", "ethereum"], 1668175551);
    await meowStorage.publish("2", ["javascript", "typescript"], 1668175551);
    await meowStorage.publish("3", ["citiesskylines", "web3"], 1668175551);
    await meowStorage.publish("4", ["bitcoin", "btc"], 1668175551);
    await meowStorage.publish("5", ["web3", "matic"], 1668175551);
    await meowStorage.publish("6", ["web3", "solana"], 1668175551);
    const meows = await meowStorage.getMeowsByHashtag(
      "web3",
      BigNumber.from(1),
      BigNumber.from(2)
    );
    expect(meows.length).to.be.equal(2);
    expect(meows[0].meow.id.toNumber()).to.be.equal(5);
    expect(meows[1].meow.id.toNumber()).to.be.equal(3);
  });
});
