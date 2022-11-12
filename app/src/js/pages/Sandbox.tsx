import { BigNumber } from "ethers";
import * as React from "react";
import { hot } from "react-hot-loader/root";
import styled from "styled-components";
import Feed from "../components/Feed";

import NewMeowForm from "../components/NewMeowForm";

const NewMeowFormContainer = styled.div`
  width: 33%;
`;

const FeedContainer = styled.div`
  width: 33%;
`;

const Sandbox = () => {
  const publishMeow = async (text: string) => {
    throw new Error(text);
  };

  const loadMeows = async (offset: number, count: number) => {
    return [...Array(count)].map((_, i) => ({
      id: BigNumber.from(i + 1 + offset),
      text: "#Lorem ipsum #dolor sit amet, consectetur adipiscing #elit. Nullam commodo.",
      date: new Date(),
      profile: {
        id: BigNumber.from(i + 1),
        username: "shibetoshi",
        avatarURI: "https://via.placeholder.com/64/",
      },
    }));
  };

  return (
    <main>
      <NewMeowFormContainer>
        <NewMeowForm
          onSubmit={publishMeow}
          avatarURI={"https://via.placeholder.com/64/"}
        />
      </NewMeowFormContainer>
      <FeedContainer>
        <Feed loadMeows={loadMeows} />
      </FeedContainer>
    </main>
  );
};

export default hot(Sandbox);
