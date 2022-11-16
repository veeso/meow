import * as React from "react";
import { hot } from "react-hot-loader/root";
import ListGroup from "react-bootstrap/ListGroup";
import { BigNumber } from "ethers";
import styled from "styled-components";
import { Facebook } from "react-content-loader";
import InfiniteScroll from "react-infinite-scroll-component";
import { useConnectedMetaMask } from "metamask-react";
import web3 from "web3";
import { Col, Row, Container, Image, Toast } from "react-bootstrap";

import Profile from "../../lib/model/profile";
import Web3Client from "../../lib/web3/client";
import { Link } from "react-router-dom";
import UserStorage from "../../lib/middleware/UserStorage";

const Username = styled(Link)`
  color: #404040;
  font-size: 2em;
  font-weight: 200;
  text-decoration: none;

  @media screen and (max-width: 640px) {
    font-size: 1.8em;
  }

  :hover {
    cursor: pointer;
    text-decoration: none;
  }
`;

interface Props {
  followersIds: Array<BigNumber>;
  onClose: () => void;
}

const FOLLOWERS_PER_FETCH = 20;

const Followers = (props: Props) => {
  const { account, ethereum } = useConnectedMetaMask();
  const [followers, setFollowers] = React.useState<Array<Profile>>([]);
  const [lastFollowersLength, setLastFollowersLength] = React.useState<number>(
    followers.length
  );

  const refresh = () => {
    const diff = followers.length - lastFollowersLength;
    const range = followers.slice(lastFollowersLength, diff);
    setLastFollowersLength(followers.length);
    return range;
  };

  const hasMore =
    followers.length > 0 && followers.length % FOLLOWERS_PER_FETCH === 0;

  const loadMoreProfiles = () => {
    const middleware = new UserStorage(new Web3Client(account, ethereum));
    const range = props.followersIds.slice(
      lastFollowersLength,
      FOLLOWERS_PER_FETCH
    );
    range.forEach((id) => {
      middleware.getProfile(id).then((profile) => {
        setFollowers([...followers, profile]);
      });
    });
  };

  React.useEffect(() => {
    loadMoreProfiles();
  }, []);

  const profiles = followers.map((profile) => {
    return (
      <ListGroup.Item key={profile.id.toString()}>
        <Container fluid>
          <Row>
            <Col xs={4} lg={3}>
              <Image src={profile.avatarURI} roundedCircle thumbnail />
            </Col>
            <Col xs={8} lg={9}>
              <Username to={`/profile/${profile.id.toString()}`}>
                {profile.username}
              </Username>
            </Col>
          </Row>
        </Container>
      </ListGroup.Item>
    );
  });

  return (
    <Toast onClose={props.onClose}>
      <Toast.Header></Toast.Header>
      <Toast.Body>
        <InfiniteScroll
          dataLength={followers.length}
          hasMore={hasMore}
          next={loadMoreProfiles}
          loader={
            <div>
              {[...Array(3)].map((_, i) => (
                <Facebook key={i} />
              ))}
            </div>
          }
          refreshFunction={refresh}
          pullDownToRefresh
          pullDownToRefreshThreshold={50}
        >
          <ListGroup>{profiles}</ListGroup>
        </InfiniteScroll>
      </Toast.Body>
    </Toast>
  );
};

export default hot(Followers);
