import * as React from "react";
import { hot } from "react-hot-loader/root";
import ListGroup from "react-bootstrap/ListGroup";
import { BigNumber } from "ethers";
import styled from "styled-components";
import { Facebook } from "react-content-loader";
import InfiniteScroll from "react-infinite-scroll-component";
import { useConnectedMetaMask } from "metamask-react";
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

  :hover {
    cursor: pointer;
    text-decoration: none;
  }
`;

interface Props {
  followingIds: Array<BigNumber>;
  onClose: () => void;
}

const FOLLOWING_PER_FETCH = 20;

const Following = (props: Props) => {
  const { account, ethereum } = useConnectedMetaMask();
  const [following, setFollowing] = React.useState<Array<Profile>>([]);
  const [lastFollowingLength, setLastFollowingLength] = React.useState<number>(
    following.length
  );

  const refresh = () => {
    const diff = following.length - lastFollowingLength;
    const range = following.slice(lastFollowingLength, diff);
    setLastFollowingLength(following.length);
    return range;
  };

  const hasMore =
    following.length > 0 && following.length % FOLLOWING_PER_FETCH === 0;

  const loadMoreProfiles = () => {
    const middleware = new UserStorage(new Web3Client(account, ethereum));
    const range = props.followingIds.slice(
      lastFollowingLength,
      FOLLOWING_PER_FETCH
    );
    range.forEach((id) => {
      middleware.getProfile(id).then((profile) => {
        setFollowing([...following, profile]);
      });
    });
  };

  React.useEffect(() => {
    loadMoreProfiles();
  }, []);

  const profiles = following.map((profile) => {
    return (
      <ListGroup.Item key={profile.id.toString()}>
        <Container fluid>
          <Row>
            <Col lg={3}>
              <Image src={profile.avatarURI} roundedCircle thumbnail />
            </Col>
            <Col lg={9}>
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
          dataLength={following.length}
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

export default hot(Following);
