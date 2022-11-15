import * as React from "react";
import Container from "react-bootstrap/esm/Container";
import { hot } from "react-hot-loader/root";
import BootstrapImage from "react-bootstrap/Image";
import styled from "styled-components";
import { Row, Col, Button } from "react-bootstrap";
import { useConnectedMetaMask } from "metamask-react";
import { BigNumber } from "ethers";

import Profile from "../lib/model/profile";
import UserProfileTools from "./ProfileData/UserProfileTools";
import OtherProfileTools from "./ProfileData/OtherProfileTools";

import Web3Client from "../lib/web3/client";
import Overlay from "./Overlay";
import Followers from "./ProfileData/Followers";
import Following from "./ProfileData/Following";
import UserStorage from "../lib/middleware/UserStorage";

const Image = styled(BootstrapImage)`
  height: 128px;
  margin-right: 8px;
`;

const Username = styled.p`
  font-size: 2em;
  font-weight: 200;
`;

interface Props {
  userProfileId: BigNumber;
  profile: Profile;
}

const ProfileData = (props: Props) => {
  const { account, ethereum } = useConnectedMetaMask();
  const [followers, setFollowers] = React.useState<Array<BigNumber>>([]);
  const [following, setFollowing] = React.useState<Array<BigNumber>>([]);
  const [followersVisible, setFollowersVisible] =
    React.useState<boolean>(false);
  const [followingVisible, setFollowingVisible] =
    React.useState<boolean>(false);

  React.useEffect(() => {
    // load followers and following
    const middleware = new UserStorage(new Web3Client(account, ethereum));
    setFollowersVisible(false);
    setFollowingVisible(false);
    middleware.getFollowers(props.profile.id).then((profiles) => {
      setFollowers([...followers, ...profiles]);
    });
    middleware.getFollowing(props.profile.id).then((profiles) => {
      setFollowing([...following, ...profiles]);
    });
  }, [props.profile]);

  const tools =
    props.profile.id === props.userProfileId ? (
      <UserProfileTools />
    ) : (
      <OtherProfileTools userId={props.userProfileId} id={props.profile.id} />
    );
  return (
    <Container fluid>
      <Row>
        <Col lg={3}>
          <Image roundedCircle src={props.profile.avatarURI} />
        </Col>
        <Col lg={3}>
          <Username>{props.profile.username}</Username>
        </Col>
        <Col style={{ justifyContent: "end" }} lg={6}>
          {tools}
        </Col>
      </Row>
      <Row>
        <Col lg={{ span: 2, offset: 2 }}>
          <Button
            hidden={followers.length === 0}
            onClick={() => setFollowersVisible(!followersVisible)}
            variant="light"
          >
            Followers
          </Button>
        </Col>
        <Col lg={2}>
          <Button
            hidden={following.length === 0}
            onClick={() => setFollowingVisible(!followingVisible)}
            variant="light"
          >
            Following
          </Button>
        </Col>
      </Row>
      <Overlay visible={followersVisible}>
        <Followers
          followersIds={followers}
          onClose={() => setFollowersVisible(false)}
        />
      </Overlay>
      <Overlay visible={followingVisible}>
        <Following
          followingIds={following}
          onClose={() => setFollowingVisible(false)}
        />
      </Overlay>
    </Container>
  );
};

export default hot(ProfileData);
