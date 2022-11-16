import * as React from "react";
import { hot } from "react-hot-loader/root";
import styled from "styled-components";
import BootstrapImage from "react-bootstrap/Image";
import { Button, Form, Spinner, Toast } from "react-bootstrap";

import Profile from "../../lib/model/profile";

const Image = styled(BootstrapImage)`
  height: 5em;
  margin-right: 12px;
`;

const Username = styled.p`
  align-self: center;
  color: #444;
  font-size: 1.2em;
  font-weight: 200;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: end;
  margin: 16px 0;
  padding: 0 12px;
`;

const ToastHeader = styled(Toast.Header)`
  justify-content: space-around;
  width: 100%;
  button {
    justify-self: end;
  }
`;

interface Props {
  profile: Profile;
  onClose: () => void;
  onSubmit: (amount: number) => Promise<void>;
}

const TipForm = (props: Props) => {
  const [input, setInput] = React.useState<string>("");
  const [pendingTransaction, setPendingTransaction] =
    React.useState<boolean>(false);

  const onType = (event: React.FormEvent<EventTarget>) => {
    const text = (event.target as HTMLInputElement).value;
    setInput(text);
  };

  let amount: number = 0;
  try {
    amount = parseFloat(input);
  } catch (_) {}

  const sendTip = () => {
    if (amount > 0) {
      setPendingTransaction(true);
      props
        .onSubmit(amount)
        .then(() => {
          setPendingTransaction(false);
        })
        .catch(() => {
          setPendingTransaction(false);
        });
    }
  };

  const validForm = isFinite(amount ? amount : NaN) && amount > 0;
  const disabled = input.length === 0 || !validForm || pendingTransaction;

  return (
    <Toast onClose={props.onClose}>
      <ToastHeader>
        <Image roundedCircle thumbnail src={props.profile.avatarURI} />
        <Username>{props.profile.username}</Username>
      </ToastHeader>
      <Toast.Body>
        <Form>
          <Form.Group>
            <Form.Label>Tip amount ($MATIC)</Form.Label>
            <Form.Control
              placeholder="Enter tip amount..."
              onChange={onType}
              size="lg"
              value={input}
              isValid={validForm}
              isInvalid={!validForm && input.length > 0}
            />
          </Form.Group>
          <ButtonContainer>
            <Button variant="primary" onClick={sendTip} disabled={disabled}>
              <Spinner
                hidden={!pendingTransaction}
                animation="grow"
                size="sm"
                role="status"
                aria-hidden="true"
              />
              Send tip
            </Button>
          </ButtonContainer>
        </Form>
      </Toast.Body>
    </Toast>
  );
};

export default hot(TipForm);
