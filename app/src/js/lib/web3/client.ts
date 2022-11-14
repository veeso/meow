import { BigNumber } from "ethers";
import Web3 from "web3";
import { AbiItem } from "web3-utils";

import {
  ABI as MEOW_STORAGE_ABI,
  MEOW_STORAGE_ADDRESS,
} from "./contracts/MeowStorage";

import {
  ABI as USER_STORAGE_ABI,
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
    const contract = new this.web3.eth.Contract(
      USER_STORAGE_ABI as AbiItem[],
      USER_STORAGE_ADDRESS
    );
    return contract.methods
      .createProfile(username)
      .send({ from: this.address });
  }

  async getUserProfile() {
    const contract = new this.web3.eth.Contract(
      USER_STORAGE_ABI as AbiItem[],
      USER_STORAGE_ADDRESS
    );
    return contract.methods.getUserProfile().call({ from: this.address });
  }

  async getUserById(id: BigNumber) {
    const contract = new this.web3.eth.Contract(
      USER_STORAGE_ABI as AbiItem[],
      USER_STORAGE_ADDRESS
    );
    return contract.methods.getProfile(id).call({ from: this.address });
  }

  async publishMeow(text: string, hashtags: Array<string>) {
    const contract = new this.web3.eth.Contract(
      MEOW_STORAGE_ABI as AbiItem[],
      MEOW_STORAGE_ADDRESS
    );
    return contract.methods
      .publish(text, hashtags, new Date().getTime())
      .send({ from: this.address });
  }

  async getMeowsForProfile(
    profileId: BigNumber,
    offset: number,
    count: number
  ) {
    const contract = new this.web3.eth.Contract(
      MEOW_STORAGE_ABI as AbiItem[],
      MEOW_STORAGE_ADDRESS
    );
    return contract.methods.getMeowsForProfile(profileId, offset, count);
  }
}
