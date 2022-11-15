import { BigNumber } from "ethers";

export default interface Profile {
  id: BigNumber;
  username: string;
  biography: string;
  avatarURI: string;
}
