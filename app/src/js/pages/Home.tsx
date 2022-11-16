import * as React from "react";
import { hot } from "react-hot-loader/root";
import { useConnectedMetaMask } from "metamask-react";
import { BigNumber } from "ethers";

import Feed from "../components/Feed";
import NewMeowForm from "../components/NewMeowForm";
import Profile from "../lib/model/profile";
import Web3Client from "../lib/web3/client";
import Meow from "../lib/model/meow";
import MeowStorage from "../lib/middleware/MeowStorage";
import { Col, Container, Row } from "react-bootstrap";

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
    <Container fluid>
      <Row>
        <Col sm={12} lg={{ span: 6, offset: 3 }}>
          <NewMeowForm
            profileId={props.profile.id}
            avatarURI={props.profile.avatarURI}
            onSubmit={publishMeow}
          />
          <Feed profileId={props.profile.id} loadMeows={loadMeows} />
        </Col>
        <Col sm={12} lg={3}></Col>
      </Row>
    </Container>
  );
};

export default hot(Home);
