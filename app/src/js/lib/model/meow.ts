import { BigNumber } from "ethers";

import Profile from "./profile";

export default interface Meow {
  id: BigNumber;
  text: string;
  hashtags: Array<string>;
  taggedProfiles: Array<BigNumber>;
  profile: Profile;
  date: Date;
  remeow?: Meow;
}
