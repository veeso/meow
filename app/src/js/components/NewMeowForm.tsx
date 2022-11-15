import * as React from "react";
import { hot } from "react-hot-loader/root";
import styled from "styled-components";
import autosize from "autosize";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import BootstrapImage from "react-bootstrap/Image";
import Spinner from "react-bootstrap/Spinner";

import Chars from "./NewMeowForm/Chars";
import { Link } from "react-router-dom";
import { BigNumber } from "ethers";

const MAX_MEOW_LENGTH = 256;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  padding: 24px;
`;

const AvatarColumn = styled.div`
  padding: 0 8px;
`;

const FormColumn = styled.div`
  flex-grow: 1;
`;

const Image = styled(BootstrapImage)`
  display: inline-block;
  flex: 1;
  max-width: 64px;
  width: 64px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: end;
  padding: 0 8px;
`;

interface Props {
  profileId: BigNumber;
  avatarURI: string;
  onSubmit: (text: string) => Promise<void>;
}

const NewMeowForm = (props: Props) => {
  const [meow, setMeow] = React.useState<string>("");
  const [error, setError] = React.useState<string>();
  const [publishing, setPublishing] = React.useState<boolean>(false);
  const disabled =
    meow.length == 0 || meow.length > MAX_MEOW_LENGTH || publishing;
  const profileRoute = `/profile/${props.profileId}`;

  const onType = (event: React.FormEvent<EventTarget>) => {
    const text = (event.target as HTMLInputElement).value;
    setMeow(text);
  };

  const resizeTextarea = (e: React.FormEvent<EventTarget>) => {
    autosize(e.target as HTMLInputElement);
  };

  const submitMeow = () => {
    setPublishing(true);
  };
  React.useEffect(() => {
    if (publishing) {
      props
        .onSubmit(meow)
        .then(() => {
          setMeow("");
          setPublishing(false);
        })
        .catch((e) => {
          setError(`Failed to publish post: ${e.message}`);
          setPublishing(false);
        });
    }
  }, [publishing]);

  return (
    <Container>
      <AvatarColumn>
        <Link to={profileRoute}>
          <Image width={64} roundedCircle thumbnail src={props.avatarURI} />
        </Link>
      </AvatarColumn>
      <FormColumn>
        <Form>
          <Form.Group controlId="new-meow-form">
            <Form.Control
              as="textarea"
              style={{ resize: "none", overflowY: "hidden" }}
              placeholder="What's happening?"
              onChange={onType}
              onKeyDown={resizeTextarea}
              size="lg"
              value={meow}
            />
            <Chars chars={meow.length} limit={MAX_MEOW_LENGTH} />
          </Form.Group>
          <Alert variant="danger" hidden={error === undefined}>
            {error}
          </Alert>
          <ButtonContainer>
            <Button variant="primary" onClick={submitMeow} disabled={disabled}>
              <Spinner
                hidden={!publishing}
                animation="grow"
                size="sm"
                role="status"
                aria-hidden="true"
              />
              Meow
            </Button>
          </ButtonContainer>
        </Form>
      </FormColumn>
    </Container>
  );
};

export default hot(NewMeowForm);
