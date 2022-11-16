import * as React from "react";
import { hot } from "react-hot-loader/root";
import styled from "styled-components";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import MetamaskLogo from "./MetamaskConnect/Logo";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/solid";

const Container = styled.div`
  padding: 24px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 24px 8px;
  width: 100%;
  button {
    font-size: 1.5em;
    width: 80%;
  }
`;

const FormTitle = styled.h2`
  font-weight: 200;
  text-align: center;
`;

const Error = styled(Alert)`
  margin: 24px 8px 0px 8px;
`;

interface Props {
  signIn: () => Promise<void>;
}

const SignInform = (props: Props) => {
  const [submitted, setSubmitted] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>();

  const disabled = submitted;

  const submit = () => {
    setSubmitted(true);
  };

  React.useEffect(() => {
    if (submitted) {
      props
        .signIn()
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
        <FormTitle>
          Or sign in with Metamask <MetamaskLogo />
        </FormTitle>
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
            Sign in <ArrowRightOnRectangleIcon width={24} />
          </Button>
        </ButtonContainer>
      </Form>
    </Container>
  );
};

export default hot(SignInform);
