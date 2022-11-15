import * as React from "react";
import { hot } from "react-hot-loader/root";
import styled from "styled-components";
import { useConnectedMetaMask } from "metamask-react";
import { BigNumber } from "ethers";
import { useParams } from "react-router-dom";

import Feed from "../components/Feed";
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

const Title = styled.p`
  font-size: 2em;
  font-weight: 200;
`;

const Tag = () => {
  const { account, ethereum } = useConnectedMetaMask();
  const params = useParams();

  const loadMeows = async (
    offset: BigNumber,
    count: BigNumber
  ): Promise<Array<Meow>> => {
    if (params.tag) {
      const middleware = new MeowStorage(new Web3Client(account, ethereum));
      return await middleware.getMeowsByHashtag(params.tag, offset, count);
    }
    return [];
  };

  return (
    <Container>
      <Title>#{params.tag}</Title>
      <Feed loadMeows={loadMeows} />
    </Container>
  );
};

export default hot(Tag);
