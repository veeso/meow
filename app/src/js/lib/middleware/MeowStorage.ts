import { BigNumber } from "ethers";
import web3 from "web3";

import Meow from "../model/meow";
import Profile from "../model/profile";
import Web3Client from "../web3/client";
import { MeowWithProfile } from "../web3/contracts/MeowStorage";
import { DEFAULT_AVATAR_URI } from "../const";

const ZERO = BigNumber.from(0);

export default class MeowStorage {
  private client: Web3Client;

  constructor(client: Web3Client) {
    this.client = client;
  }

  async publishMeow(text: string): Promise<void> {
    const regex = new RegExp(/#[a-zA-Z0-9_]+/, "g");
    const hashtags = text.match(regex)?.map((hashtag) => hashtag.substring(1));
    return await this.client.publishMeow(
      text,
      hashtags ? hashtags : [],
      new Date()
    );
  }

  async getMeowsForProfile(
    profile: Profile,
    offset: BigNumber,
    count: BigNumber
  ): Promise<Array<Meow>> {
    const lastMeowId = BigNumber.from(await this.client.getLastMeowId());
    const result = new Array();
    let resultIndex = BigNumber.from(0);
    console.log(resultIndex.sub(1).toNumber());
    let arrayCursor: BigNumber = lastMeowId.sub(offset);
    for (
      let i = arrayCursor;
      i >= arrayCursor.sub(count) && resultIndex < count && i > ZERO;
      i = i.sub(1)
    ) {
      const meow = this.adaptMeowWithProfile(await this.client.getMeowById(i));
      if (meow.profile.id.eq(profile.id)) {
        result.push(meow);
        resultIndex = resultIndex.add(1);
      }
    }
    return result;
  }

  async getMeowsAggregatedByFollowing(
    profile: Profile,
    offset: BigNumber,
    count: BigNumber
  ): Promise<Array<Meow>> {
    const lastMeowId = BigNumber.from(await this.client.getLastMeowId());
    const result = new Array();
    const following = (await this.client.getFollowing(profile.id)).map((val) =>
      BigNumber.from(val)
    );
    let resultIndex = BigNumber.from(0);
    let cursor = lastMeowId.sub(offset);
    for (
      let i = cursor;
      i >= cursor.sub(count) && resultIndex < count && i > ZERO;
      i = i.sub(1)
    ) {
      const meow = this.adaptMeowWithProfile(await this.client.getMeowById(i));
      let includes = following.some((val) => val.eq(meow.profile.id));
      if (includes || meow.profile.id.eq(profile.id)) {
        result.push(meow);
        resultIndex = resultIndex.add(1);
      }
    }
    return result;
  }

  async getMeowsByHashtag(
    hashtag: string,
    offset: BigNumber,
    count: BigNumber
  ): Promise<Array<Meow>> {
    const lastMeowId = BigNumber.from(await this.client.getLastMeowId());
    const result = new Array();
    let resultIndex = BigNumber.from(0);
    let cursor = lastMeowId.sub(offset);
    for (
      let i = cursor;
      i >= cursor.sub(count) && resultIndex < count && i > ZERO;
      i = i.sub(1)
    ) {
      const meow = await this.client.getMeowById(i);
      console.log(meow.meow.hashtags);
      if (meow.meow.hashtags.includes(hashtag)) {
        result.push(this.adaptMeowWithProfile(meow));
        resultIndex = resultIndex.add(1);
      }
    }
    return result;
  }

  private adaptMeowWithProfile(meow: MeowWithProfile): Meow {
    return {
      id: BigNumber.from(meow.meow.id),
      text: meow.meow.text,
      profile: {
        id: BigNumber.from(meow.profile.id),
        username: web3.utils.hexToUtf8(meow.profile.username),
        biography: meow.profile.biography,
        avatarURI:
          meow.profile.avatarURI.length === 0
            ? DEFAULT_AVATAR_URI.src
            : meow.profile.avatarURI,
      },
      hashtags: meow.meow.hashtags,
      date: new Date(parseInt(meow.meow.epoch)),
    };
  }
}
