import * as React from "react";
import Container from "react-bootstrap/esm/Container";
import { hot } from "react-hot-loader/root";
import { useConnectedMetaMask } from "metamask-react";
import { Row, Col, Button } from "react-bootstrap";
import { BigNumber } from "ethers";
import Spinner from "react-bootstrap/Spinner";

import Web3Client from "../../lib/web3/client";
import UserStorage from "../../lib/middleware/UserStorage";

interface Props {
  id: BigNumber;
  userId: BigNumber;
}

const OtherProfileTools = (props: Props) => {
  const { account, ethereum } = useConnectedMetaMask();
  const [following, setFollowing] = React.useState<boolean>(false);
  const [pendingTransaction, setPendingTransaction] =
    React.useState<boolean>(false);

  React.useEffect(() => {
    const middleware = new UserStorage(new Web3Client(account, ethereum));
    middleware.getFollowers(props.id).then((followers) => {
      if (followers.includes(props.userId)) {
        setFollowing(true);
      }
    });
  }, []);

  const follow = () => {
    setPendingTransaction(true);
    const middleware = new UserStorage(new Web3Client(account, ethereum));
    middleware
      .follow(props.id)
      .then(() => {
        setFollowing(true);
        setPendingTransaction(false);
      })
      .catch(() => {
        setPendingTransaction(false);
      });
  };

  const unfollow = () => {
    setPendingTransaction(true);
    const client = new Web3Client(account, ethereum);
    client
      .unfollow(props.id)
      .then(() => {
        setFollowing(false);
        setPendingTransaction(false);
      })
      .catch(() => {
        setPendingTransaction(false);
      });
  };

  const followAction = following ? (
    <Button variant="light" onClick={unfollow} disabled={pendingTransaction}>
      <Spinner
        hidden={!pendingTransaction}
        animation="grow"
        size="sm"
        role="status"
        aria-hidden="true"
      />
      Unfollow
    </Button>
  ) : (
    <Button variant="light" onClick={follow} disabled={pendingTransaction}>
      <Spinner
        hidden={!pendingTransaction}
        animation="grow"
        size="sm"
        role="status"
        aria-hidden="true"
      />
      Start following
    </Button>
  );

  return (
    <Container fluid>
      <Row>
        <Col md={{ span: 8, offset: 6 }}>{followAction}</Col>
      </Row>
    </Container>
  );
};

export default hot(OtherProfileTools);
