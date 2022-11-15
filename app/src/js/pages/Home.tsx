import * as React from "react";
import { hot } from "react-hot-loader/root";
import styled from "styled-components";
import { useConnectedMetaMask } from "metamask-react";
import { BigNumber } from "ethers";
import web3 from "web3";

import Feed from "../components/Feed";
import NewMeowForm from "../components/NewMeowForm";
import Profile from "../lib/model/profile";
import Web3Client from "../lib/web3/client";
import Meow from "../lib/model/meow";
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
`;

interface Props {
  profile: Profile;
}

const Home = (props: Props) => {
  const { account, ethereum } = useConnectedMetaMask();

  const loadMeows = async (
    offset: BigNumber,
    count: BigNumber
  ): Promise<Array<Meow>> => {
    const middleware = new MeowStorage(new Web3Client(account, ethereum));
    return await middleware.getMeowsAggregatedByFollowing(
      props.profile,
      offset,
      count
    );
  };

  const publishMeow = async (text: string) => {
    const middleware = new MeowStorage(new Web3Client(account, ethereum));
    return await middleware.publishMeow(text);
  };

  return (
    <Container>
      <NewMeowForm
        profileId={props.profile.id}
        avatarURI={props.profile.avatarURI}
        onSubmit={publishMeow}
      />
      <Feed loadMeows={loadMeows} />
    </Container>
  );
};

export default hot(Home);
