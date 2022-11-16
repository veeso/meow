import { expect } from "chai";
import { ethers } from "hardhat";
import { UserStorage } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "ethers";
import web3 from "web3";

describe("UserStorage", function () {
  interface Contract {
    userStorage: UserStorage;
    owner: SignerWithAddress;
    otherAccount: SignerWithAddress;
  }

  async function deployContract(): Promise<Contract> {
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
      "UserStorage",
      userStorageContract.address
    );
    console.log("Contract manager configured");
    await userStorageContract.setManagerAddr(contractManager.address);
    console.log("manager address configured into storage");
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();
    return {
      userStorage: userStorageContract,
      owner,
      otherAccount,
    };
  }

  it("Should create profile", async () => {
    const { userStorage } = await deployContract();
    // create test user
    await userStorage.createProfile("veeso_dev97A");
    const profile = await userStorage.getProfile(1);
    expect(profile.id).to.be.equal(1);
    expect(web3.utils.hexToUtf8(profile.username)).to.be.equal("veeso_dev97A");
    expect(profile.avatarURI).to.be.equal("");

    const userProfile = await userStorage.getUserProfile();
    expect(userProfile.id).to.be.equal(1);
    expect(web3.utils.hexToUtf8(userProfile.username)).to.be.equal(
      "veeso_dev97A"
    );
    expect(userProfile.avatarURI).to.be.equal("");
  });

  it("should return error for unexisting profile", async () => {
    const { userStorage } = await deployContract();
    await expect(userStorage.getProfile(2)).to.be.rejectedWith(Error);
    await expect(userStorage.getUserProfile()).to.be.rejectedWith(Error);
  });

  it("should return error for duped profile", async () => {
    const { userStorage } = await deployContract();
    await userStorage.createProfile("veeso_dev");
    await expect(userStorage.createProfile("veeso_dev")).to.be.rejectedWith(
      Error
    );
  });

  it("should return error username too long", async () => {
    const { userStorage } = await deployContract();
    await expect(
      userStorage.createProfile("veeso_dev000000000000000000000000000")
    ).to.be.rejectedWith(Error);
  });

  it("should return error for invalid username", async () => {
    const { userStorage } = await deployContract();
    await expect(userStorage.createProfile("veeso.dev")).to.be.rejectedWith(
      Error
    );
  });

  it("should return last user id", async () => {
    const { userStorage } = await deployContract();
    // create test user
    await userStorage.createProfile("veeso_dev");
    const profile = await userStorage.getLastProfileId();
    expect(profile.toNumber()).to.be.equal(1);
  });

  it("should find profile by username", async () => {
    const { userStorage, otherAccount } = await deployContract();
    // create test user
    await userStorage.createProfile("veeso_dev");
    await userStorage.connect(otherAccount).createProfile("shibe");
    const profile = await userStorage.getProfileByUsername("shibe");
    expect(profile.id.toNumber()).to.be.equal(2);
  });

  it("should fail getting profile by username", async () => {
    const { userStorage } = await deployContract();
    // create test user
    await userStorage.createProfile("veeso_dev");
    await expect(userStorage.getProfileByUsername("omar")).to.be.rejectedWith(
      Error
    );
  });

  it("should follow profile", async () => {
    const { userStorage, otherAccount } = await deployContract();
    // create test user
    await userStorage.createProfile("veeso_dev");
    await userStorage
      .connect(otherAccount)
      .createProfile("shibetoshi_nakamoto");
    await userStorage.follow(2);
    // check following
    const following = await userStorage.getFollowing(1);
    expect(following.length).to.be.equal(1);
    expect(following[0].toNumber()).to.be.equal(2);
    // check followers
    const followers = await userStorage.getFollowers(2);
    expect(followers.length).to.be.equal(1);
    expect(followers[0].toNumber()).to.be.equal(1);
  });

  it("should not follow unexisting profile", async () => {
    const { userStorage } = await deployContract();
    // create test user
    await userStorage.createProfile("veeso_dev");
    await expect(userStorage.follow(2)).to.be.rejectedWith(Error);
  });

  it("should not follow if user profile doesn't exist", async () => {
    const { userStorage, otherAccount } = await deployContract();
    await userStorage.createProfile("veeso_dev");
    await expect(
      userStorage.connect(otherAccount).follow(1)
    ).to.be.rejectedWith(Error);
  });

  it("should not follow himself", async () => {
    const { userStorage } = await deployContract();
    // create test user
    await userStorage.createProfile("veeso_dev");
    await expect(userStorage.follow(1)).to.be.rejectedWith(Error);
  });

  it("should not follow twice", async () => {
    const { userStorage, otherAccount } = await deployContract();
    // create test user
    await userStorage.createProfile("veeso_dev");
    await userStorage
      .connect(otherAccount)
      .createProfile("shibetoshi_nakamoto");
    await userStorage.follow(2);
    await userStorage.follow(2);
    // check following
    const following = await userStorage.getFollowing(1);
    expect(following.length).to.be.equal(1);
    expect(following[0].toNumber()).to.be.equal(2);
    // check followers
    const followers = await userStorage.getFollowers(2);
    expect(followers.length).to.be.equal(1);
    expect(followers[0].toNumber()).to.be.equal(1);
  });

  it("should unfollow profile", async () => {
    const { userStorage, otherAccount } = await deployContract();
    // create test user
    await userStorage.createProfile("veeso_dev");
    await userStorage
      .connect(otherAccount)
      .createProfile("shibetoshi_nakamoto");
    await userStorage.follow(BigNumber.from(2));
    // unfollow
    await userStorage.unfollow(BigNumber.from(2));
    // check following
    const following = await userStorage.getFollowing(1);
    expect(following[0].toNumber()).to.be.equal(0);
    // check followers
    const followers = await userStorage.getFollowers(2);
    expect(followers[0].toNumber()).to.be.equal(0);
  });

  it("should fail unfollowing unexisting profile", async () => {
    const { userStorage } = await deployContract();
    await userStorage.createProfile("veeso_dev");
    await expect(userStorage.unfollow(2)).to.be.rejectedWith(Error);
  });

  it("should fail unfollowing himself", async () => {
    const { userStorage } = await deployContract();
    await userStorage.createProfile("veeso_dev");
    await expect(userStorage.unfollow(1)).to.be.rejectedWith(Error);
  });

  it("should not unfollow if user profile doesn't exist", async () => {
    const { userStorage, otherAccount } = await deployContract();
    await userStorage.createProfile("veeso_dev");
    await expect(
      userStorage.connect(otherAccount).unfollow(1)
    ).to.be.rejectedWith(Error);
  });

  it("should set avatar", async () => {
    const { userStorage } = await deployContract();
    await userStorage.createProfile("veeso_dev");
    await userStorage.setAvatar(
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Giancarlo_Magalli.png/220px-Giancarlo_Magalli.png"
    );
    expect(await userStorage.getAvatar(1)).to.be.equal(
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Giancarlo_Magalli.png/220px-Giancarlo_Magalli.png"
    );
  });

  it("should not set avatar for unexisting account", async () => {
    const { userStorage } = await deployContract();
    await expect(
      userStorage.setAvatar(
        "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Giancarlo_Magalli.png/220px-Giancarlo_Magalli.png"
      )
    ).to.be.rejectedWith(Error);
  });

  it("should set bio", async () => {
    const { userStorage } = await deployContract();
    await userStorage.createProfile("veeso_dev");
    await userStorage.setBiography("my name is veeso");
    const profile = await userStorage.getUserProfile();
    expect(profile.biography).to.be.equal("my name is veeso");
  });

  it("should not set avatar for unexisting account", async () => {
    const { userStorage } = await deployContract();
    await expect(userStorage.setBiography("omar")).to.be.rejectedWith(Error);
  });
});
