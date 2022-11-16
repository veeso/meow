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
    const hashtagRegex = new RegExp(/#[a-zA-Z0-9_]+/, "g");
    const hashtags = text
      .match(hashtagRegex)
      ?.map((hashtag) => hashtag.substring(1));
    const profileRegex = new RegExp(/@[a-zA-Z0-9_]+/, "g");
    let profileMatch = text.match(profileRegex);
    let profiles: Array<BigNumber> = new Array();
    if (profileMatch) {
      profiles = await Promise.all(
        profileMatch.map(async (username) => {
          try {
            const profile = await this.client.getProfileByUsername(
              username.substring(1)
            );
            return BigNumber.from(profile.id);
          } catch (_) {
            throw new Error(`No such username: ${username}`);
          }
        })
      );
    }

    return await this.client.publishMeow(
      text,
      hashtags ? hashtags : [],
      profiles,
      new Date()
    );
  }

  async remeow(id: BigNumber): Promise<void> {
    return await this.client.remeow(id, new Date());
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
      const meow = await this.adaptMeowWithProfile(
        await this.client.getMeowById(i)
      );
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
      const meow = await this.adaptMeowWithProfile(
        await this.client.getMeowById(i)
      );
      // from followed profile
      let fromFollowed = following.some((val) => val.eq(meow.profile.id));
      // am I tagged?
      let tagged = meow.taggedProfiles.some((id) => id.eq(profile.id));
      // did I write this meow?
      const isFromMe = meow.profile.id.eq(profile.id);
      if (fromFollowed || isFromMe || tagged) {
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
        result.push(await this.adaptMeowWithProfile(meow));
        resultIndex = resultIndex.add(1);
      }
    }
    return result;
  }

  private async adaptMeowWithProfile(meow: MeowWithProfile): Promise<Meow> {
    const remeowId = BigNumber.from(meow.remeowedId);
    const taggedProfiles = meow.meow.taggedProfiles.map((id) =>
      BigNumber.from(id)
    );
    const adapted = {
      id: BigNumber.from(meow.meow.id),
      text: meow.meow.text,
      profile: {
        id: BigNumber.from(meow.profile.id),
        username: web3.utils.hexToUtf8(meow.profile.username),
        biography: meow.profile.biography,
        avatarURI:
          meow.profile.avatarURI.length === 0
            ? DEFAULT_AVATAR_URI
            : meow.profile.avatarURI,
      },
      hashtags: meow.meow.hashtags,
      taggedProfiles,
      date: new Date(parseInt(meow.meow.epoch)),
    };
    if (remeowId.eq(ZERO)) {
      return adapted;
    }
    // resolve remow
    const originalMeow = await this.adaptMeowWithProfile(
      await this.client.getMeowById(remeowId)
    );
    return { ...adapted, remeow: originalMeow };
  }
}
