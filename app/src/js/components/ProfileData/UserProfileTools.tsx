import * as React from "react";
import Container from "react-bootstrap/esm/Container";
import { hot } from "react-hot-loader/root";
import { Row, Col, Button, Popover, Form, Toast } from "react-bootstrap";
import { useConnectedMetaMask } from "metamask-react";
import { CameraIcon } from "@heroicons/react/24/outline";
import Spinner from "react-bootstrap/Spinner";

import Web3Client from "../../lib/web3/client";
import Overlay from "../Overlay";
import UserStorage from "../../lib/middleware/UserStorage";

const UserProfileTools = () => {
  const { account, ethereum } = useConnectedMetaMask();
  const [pendingTransaction, setPendingTransaction] =
    React.useState<boolean>(false);
  const [avatarURI, setAvatarURI] = React.useState<string>();
  const [formVisible, setFormVisible] = React.useState<boolean>(false);

  const setAvatar = () => {
    if (avatarURI) {
      setPendingTransaction(true);
      setFormVisible(false);
      const middlware = new UserStorage(new Web3Client(account, ethereum));
      middlware
        .setAvatar(avatarURI)
        .then(() => {
          setPendingTransaction(false);
        })
        .catch(() => {
          setPendingTransaction(false);
        });
    }
  };

  const onType = (event: React.FormEvent<EventTarget>) => {
    const text = (event.target as HTMLInputElement).value;
    setAvatarURI(text);
  };

  return (
    <Container fluid>
      <Row>
        <Col md={{ span: 8, offset: 6 }}>
          <Button
            disabled={pendingTransaction}
            variant="light"
            onClick={() => setFormVisible(true)}
          >
            <Spinner
              hidden={!pendingTransaction}
              animation="grow"
              size="sm"
              role="status"
              aria-hidden="true"
            />
            <CameraIcon width={24} /> Update avatar
          </Button>
        </Col>
      </Row>
      <Overlay visible={formVisible}>
        <Toast onClose={() => setFormVisible(false)}>
          <Toast.Header></Toast.Header>
          <Toast.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Avatar URI</Form.Label>
                <Form.Control
                  placeholder="Enter avatar URI"
                  onChange={onType}
                  size="lg"
                  value={avatarURI}
                />
              </Form.Group>
              <Button variant="primary" onClick={setAvatar}>
                Update avatar
              </Button>
            </Form>
          </Toast.Body>
        </Toast>
      </Overlay>
    </Container>
  );
};

export default hot(UserProfileTools);
