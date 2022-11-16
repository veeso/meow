import * as React from "react";
import { hot } from "react-hot-loader/root";
import styled from "styled-components";
import { useConnectedMetaMask } from "metamask-react";
import { BigNumber } from "ethers";
import { useParams } from "react-router-dom";

import Feed from "../components/Feed";
import Meow from "../lib/model/meow";
import Web3Client from "../lib/web3/client";
import ProfileEntity from "../lib/model/profile";
import ProfileData from "../components/ProfileData";
import UserStorage from "../lib/middleware/UserStorage";
import MeowStorage from "../lib/middleware/MeowStorage";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 25%;
  width: 50%;

  @media screen and (max-width: 640px) {
    margin-left: 0;
    width: 100%;
  }
`;

const Header = styled.div`
  border-bottom: 2px solid #ccc;
  margin-bottom: 24px;
  padding: 8px;
`;

interface Props {
  userProfile: ProfileEntity;
}

const Profile = (props: Props) => {
  const { account, ethereum } = useConnectedMetaMask();
  const [profile, setProfile] = React.useState<ProfileEntity>();
  const params = useParams();

  const getProfile = async () => {
    const profileId = BigNumber.from(params.profileId);
    const middleware = new UserStorage(new Web3Client(account, ethereum));

    let thisProfile = profile;
    if (profile?.id !== profileId) {
      thisProfile = await middleware.getProfile(profileId);
      setProfile(thisProfile);
    }
    return { id: profileId, profile: thisProfile };
  };

  const loadMeows = async (
    offset: BigNumber,
    count: BigNumber
  ): Promise<Array<Meow>> => {
    const { profile: thisProfile } = await getProfile();
    if (thisProfile) {
      const middleware = new MeowStorage(new Web3Client(account, ethereum));
      const meows = await middleware.getMeowsForProfile(
        thisProfile,
        offset,
        count
      );
      return meows;
    }
    return [];
  };

  React.useEffect(() => {
    getProfile();
  }, [params]);

  let profileData = <></>;
  if (profile) {
    profileData = (
      <ProfileData userProfileId={props.userProfile.id} profile={profile} />
    );
  }

  return (
    <Container>
      <Header>{profileData}</Header>
      <Feed loadMeows={loadMeows} />
    </Container>
  );
};

export default hot(Profile);
