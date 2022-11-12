import { BigNumber } from "ethers";

export default interface Profile {
  id: BigNumber;
  username: string;
  avatarURI?: string;
}
