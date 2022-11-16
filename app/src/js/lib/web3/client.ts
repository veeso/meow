import { BigNumber } from "ethers";
import Web3 from "web3";
import { AbiItem } from "web3-utils";

import {
  ABI as MEOW_STORAGE_ABI,
  Meow,
  MeowWithProfile,
  MEOW_STORAGE_ADDRESS,
} from "./contracts/MeowStorage";

import {
  ABI as USER_STORAGE_ABI,
  Profile,
  USER_STORAGE_ADDRESS,
} from "./contracts/UserStorage";

export default class Web3Client {
  private address: string;
  private web3: Web3;

  constructor(address: string, ethereum: any) {
    this.address = address;
    this.web3 = new Web3(ethereum);
  }

  async createProfile(username: string) {
    const contract = this.userStorageContract();
    return contract.methods
      .createProfile(username)
      .send({ from: this.address });
  }

  async getLastProfileId(): Promise<string> {
    const contract = this.userStorageContract();
    return contract.methods.getLastProfileId().call({ from: this.address });
  }

  async getUserProfile(): Promise<Profile> {
    const contract = this.userStorageContract();
    return contract.methods.getUserProfile().call({ from: this.address });
  }

  async getProfile(id: BigNumber): Promise<Profile> {
    const contract = this.userStorageContract();
    return contract.methods.getProfile(id).call({ from: this.address });
  }

  async getProfileByUsername(username: string): Promise<Profile> {
    const contract = this.userStorageContract();
    return contract.methods
      .getProfileByUsername(username)
      .call({ from: this.address });
  }

  async follow(id: BigNumber): Promise<void> {
    const contract = this.userStorageContract();
    return contract.methods.follow(id).send({ from: this.address });
  }

  async unfollow(id: BigNumber): Promise<void> {
    const contract = this.userStorageContract();
    return contract.methods.unfollow(id).send({ from: this.address });
  }

  async getFollowers(id: BigNumber): Promise<Array<string>> {
    const contract = this.userStorageContract();
    return contract.methods.getFollowers(id).call({ from: this.address });
  }

  async getFollowing(id: BigNumber): Promise<Array<string>> {
    const contract = this.userStorageContract();
    return contract.methods.getFollowing(id).call({ from: this.address });
  }

  async setBiography(bio: string): Promise<void> {
    const contract = this.userStorageContract();
    return contract.methods.setBiography(bio).send({ from: this.address });
  }

  async setAvatar(avatarURI: string): Promise<void> {
    const contract = this.userStorageContract();
    return contract.methods.setAvatar(avatarURI).send({ from: this.address });
  }

  async publishMeow(
    text: string,
    hashtags: Array<string>,
    taggedProfiles: Array<BigNumber>,
    date: Date
  ) {
    const contract = this.meowStorageContract();
    return contract.methods
      .publish(text, hashtags, taggedProfiles, date.getTime())
      .send({ from: this.address });
  }

  async remeow(id: BigNumber, date: Date) {
    const contract = this.meowStorageContract();
    return contract.methods
      .remeow(id, date.getTime())
      .send({ from: this.address });
  }

  async getMeowById(id: BigNumber): Promise<MeowWithProfile> {
    const contract = this.meowStorageContract();
    return contract.methods.getMeowById(id).call({ from: this.address });
  }

  async getLastMeowId(): Promise<string> {
    const contract = this.meowStorageContract();
    return contract.methods.getLastMeowId().call({ from: this.address });
  }

  private meowStorageContract() {
    return new this.web3.eth.Contract(
      MEOW_STORAGE_ABI as AbiItem[],
      MEOW_STORAGE_ADDRESS
    );
  }

  private userStorageContract() {
    return new this.web3.eth.Contract(
      USER_STORAGE_ABI as AbiItem[],
      USER_STORAGE_ADDRESS
    );
  }
}
