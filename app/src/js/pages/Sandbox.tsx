import { BigNumber } from "ethers";
import * as React from "react";
import { hot } from "react-hot-loader/root";
import styled from "styled-components";

import Feed from "../components/Feed";
import MetamaskConnect from "../components/MetamaskConnect";
import NewMeowForm from "../components/NewMeowForm";
import Search from "../components/Search";
import SearchResult from "../lib/model/search";

const Main = styled.main`
  display: flex;
  flex-direction: row;
  width: 100%;
`;

const Column = styled.div`
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

  const delay = (t: number) => {
    return new Promise((resolve) => setTimeout(resolve, t));
  };

  const onSearch = async (query: string): Promise<Array<SearchResult>> => {
    return delay(1500).then(() => {
      return [
        {
          text: query,
          uri: "/profile/23",
        },
        {
          text: "Stokatsu",
          uri: "/profile/42",
        },
        {
          text: "Pippo",
          uri: "/profile/41",
        },
      ];
    });
  };

  return (
    <Main>
      <Column>
        <MetamaskConnect />
        <div>
          <NewMeowForm
            onSubmit={publishMeow}
            profileId={BigNumber.from(1)}
            avatarURI={"https://via.placeholder.com/64/"}
          />
        </div>
        <div>
          <Feed loadMeows={loadMeows} />
        </div>
      </Column>
      <Column>
        <Search onSearch={onSearch} />
      </Column>
    </Main>
  );
};

export default hot(Sandbox);
