import * as React from "react";
import { hot } from "react-hot-loader/root";
import styled from "styled-components";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";

const Container = styled.div`
  padding: 24px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: end;
  padding: 24px 8px;
`;

const FormTitle = styled.h2`
  font-weight: 200;
  text-align: center;
`;

const Error = styled(Alert)`
  margin: 24px 8px 0px 8px;
`;

interface Props {
  signUp: (username: string) => Promise<void>;
}

const SignUpForm = (props: Props) => {
  const [username, setUsername] = React.useState<string>("");
  const [submitted, setSubmitted] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>();

  const disabled = username.length === 0 || submitted;

  const onType = (event: React.FormEvent<EventTarget>) => {
    const text = (event.target as HTMLInputElement).value;
    setUsername(text);
  };

  const submit = () => {
    setSubmitted(true);
  };

  React.useEffect(() => {
    if (submitted) {
      props
        .signUp(username)
        .then(() => {
          setError(undefined);
          setSubmitted(false);
        })
        .catch((e) => {
          setError(e.message);
          setSubmitted(false);
        });
    }
  }, [submitted]);

  return (
    <Container>
      <Form>
        <FormTitle>Sign up</FormTitle>
        <Form.Group controlId="sign-in">
          <Form.Label>Username</Form.Label>
          <Form.Control
            placeholder="Enter username"
            onChange={onType}
            size="lg"
            value={username}
          />
        </Form.Group>
        <Error variant="danger" hidden={error === undefined}>
          {error}
        </Error>
        <ButtonContainer>
          <Button variant="primary" onClick={submit} disabled={disabled}>
            <Spinner
              hidden={!submitted}
              animation="grow"
              size="sm"
              role="status"
              aria-hidden="true"
            />
            Sign up
          </Button>
        </ButtonContainer>
      </Form>
    </Container>
  );
};

export default hot(SignUpForm);
