import { BigNumber } from "ethers";

import Profile from "../model/profile";
import Web3Client from "../web3/client";
import web3 from "web3";
import { Profile as ProfileEth } from "../web3/contracts/UserStorage";
import { DEFAULT_AVATAR_URI } from "../const";

export default class UserStorage {
  private client: Web3Client;

  constructor(client: Web3Client) {
    this.client = client;
  }

  async createProfile(username: string) {
    return this.client.createProfile(username);
  }

  async getUserProfile(): Promise<Profile> {
    const profile = await this.client.getUserProfile();
    return this.adaptProfile(profile);
  }

  async getProfile(id: BigNumber): Promise<Profile> {
    const profile = await this.client.getProfile(id);
    return this.adaptProfile(profile);
  }

  async follow(id: BigNumber): Promise<void> {
    return this.client.follow(id);
  }

  async unfollow(id: BigNumber): Promise<void> {
    return this.client.unfollow(id);
  }

  async getFollowers(id: BigNumber): Promise<Array<BigNumber>> {
    return (await this.client.getFollowers(id)).map((val) =>
      BigNumber.from(val)
    );
  }

  async getFollowing(id: BigNumber): Promise<Array<BigNumber>> {
    return (await this.client.getFollowing(id)).map((val) =>
      BigNumber.from(val)
    );
  }

  async setBiography(bio: string): Promise<void> {
    return this.client.setBiography(bio);
  }

  async setAvatar(avatarURI: string): Promise<void> {
    return this.client.setAvatar(avatarURI);
  }

  private adaptProfile(profile: ProfileEth): Profile {
    return {
      id: profile.id,
      username: web3.utils.hexToUtf8(profile.username),
      biography: profile.biography,
      avatarURI:
        profile.avatarURI.length === 0 ? DEFAULT_AVATAR_URI : profile.avatarURI,
    };
  }
}
