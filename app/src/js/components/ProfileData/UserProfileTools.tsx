import * as React from "react";
import Container from "react-bootstrap/esm/Container";
import { hot } from "react-hot-loader/root";
import { Row, Col, Button, Popover, Form, Toast } from "react-bootstrap";
import { useConnectedMetaMask } from "metamask-react";
import { CameraIcon, PencilIcon } from "@heroicons/react/24/outline";
import Spinner from "react-bootstrap/Spinner";

import Web3Client from "../../lib/web3/client";
import Overlay from "../Overlay";
import UserStorage from "../../lib/middleware/UserStorage";

const UserProfileTools = () => {
  const { account, ethereum } = useConnectedMetaMask();
  const [pendingTransaction, setPendingTransaction] =
    React.useState<boolean>(false);
  const [avatarURI, setAvatarURI] = React.useState<string>();
  const [avatarFormVisible, setAvatarFormVisible] =
    React.useState<boolean>(false);
  const [biography, setBiography] = React.useState<string>();
  const [bioFormVisible, setBioFormVisible] = React.useState<boolean>(false);

  const setAvatar = () => {
    if (avatarURI) {
      setPendingTransaction(true);
      setAvatarFormVisible(false);
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

  const updateBiography = () => {
    if (biography) {
      setPendingTransaction(true);
      setBioFormVisible(false);
      const middlware = new UserStorage(new Web3Client(account, ethereum));
      middlware
        .setBiography(biography)
        .then(() => {
          setPendingTransaction(false);
        })
        .catch(() => {
          setPendingTransaction(false);
        });
    }
  };

  const onAvatarType = (event: React.FormEvent<EventTarget>) => {
    const text = (event.target as HTMLInputElement).value;
    setAvatarURI(text);
  };

  const onBiographyType = (event: React.FormEvent<EventTarget>) => {
    const text = (event.target as HTMLInputElement).value;
    setBiography(text);
  };

  return (
    <Container fluid>
      <Row>
        <Col>
          <Button
            disabled={pendingTransaction}
            variant="light"
            onClick={() => setBioFormVisible(true)}
          >
            <Spinner
              hidden={!pendingTransaction}
              animation="grow"
              size="sm"
              role="status"
              aria-hidden="true"
            />
            <PencilIcon width={24} /> Update biography
          </Button>
        </Col>
        <Col>
          <Button
            disabled={pendingTransaction}
            variant="light"
            onClick={() => setAvatarFormVisible(true)}
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
      <Overlay visible={avatarFormVisible}>
        <Toast
          style={{ width: "80vw" }}
          onClose={() => setAvatarFormVisible(false)}
        >
          <Toast.Header></Toast.Header>
          <Toast.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Avatar URI</Form.Label>
                <Form.Control
                  placeholder="Enter avatar URI"
                  onChange={onAvatarType}
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
      <Overlay visible={bioFormVisible}>
        <Toast
          style={{ width: "80vw" }}
          onClose={() => setBioFormVisible(false)}
        >
          <Toast.Header></Toast.Header>
          <Toast.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Biography</Form.Label>
                <Form.Control
                  placeholder="Enter biography"
                  onChange={onBiographyType}
                  size="lg"
                  value={biography}
                />
              </Form.Group>
              <Button variant="primary" onClick={updateBiography}>
                Update biography
              </Button>
            </Form>
          </Toast.Body>
        </Toast>
      </Overlay>
    </Container>
  );
};

export default hot(UserProfileTools);
