import * as React from "react";
import { hot } from "react-hot-loader/root";
import styled from "styled-components";
import { useConnectedMetaMask } from "metamask-react";
import Feed from "../components/Feed";
import NewMeowForm from "../components/NewMeowForm";
import Profile from "../lib/model/profile";
import Web3Client from "../lib/web3/client";
import { BigNumber } from "ethers";
import Meow from "../lib/model/meow";

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

  const loadMeows = async (offset: number, count: number) => {
    const client = new Web3Client(account, ethereum);
    const meows = await client.getMeowsForProfile(
      props.profile.id,
      offset,
      count
    );

    return meows
      .map((meow: any) => ({
        id: meow.id,
        text: meow.text,
        profile: props.profile,
        date: new Date(meow.epoch),
      }))
      .filter((meow: Meow) => meow.id !== BigNumber.from(0));
  };

  const publishMeow = async (text: string) => {
    const client = new Web3Client(account, ethereum);
    const regex = new RegExp(/#[a-zA-Z0-9_]+/, "g");
    const hashtags = text.match(regex)?.map((hashtag) => hashtag.substring(1));
    return await client.publishMeow(text, hashtags ? hashtags : []);
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
