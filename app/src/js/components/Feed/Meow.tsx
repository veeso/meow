import * as React from "react";
import { hot } from "react-hot-loader/root";
import styled from "styled-components";
import BootstrapImage from "react-bootstrap/Image";
import { Link } from "react-router-dom";
import { ArrowPathIcon } from "@heroicons/react/24/solid";
import { useConnectedMetaMask } from "metamask-react";
import {
  Alert,
  Col,
  Container as BootstrapContainer,
  Row,
} from "react-bootstrap";

import Meow from "../../lib/model/meow";
import Web3Client from "../../lib/web3/client";
import MeowStorage from "../../lib/middleware/MeowStorage";

const Container = styled(BootstrapContainer)`
  padding: 4px 8px;
  border-bottom: 1px solid #eee;
`;

const RemeowContainer = styled.div`
  padding: 0 4px 4px 4px;
`;

const MeowContainer = styled(BootstrapContainer)``;

const RemeowLink = styled(Link)`
  color: #888;
  font-weight: 100;
  text-decoration: none;

  :hover {
    color: #444;
  }
`;

const AvatarColumn = styled.div`
  padding: 0 8px;
`;

const Image = styled(BootstrapImage)`
  display: inline-block;
  flex: 1;
  max-width: 64px;
  width: 64px;
`;

const ContentColumn = styled.div``;

const Username = styled.span`
  color: #404040;
  font-size: 1.5em;
  font-weight: 500;

  a {
    color: inherit;
    text-decoration: none;
    :hover {
      text-decoration: underline;
    }
  }
`;

const PublishedDate = styled.span`
  color: #888;
  font-size: 0.8em;
  line-height: 1.5em;
`;

const MeowContent = styled.p`
  color: #202020;
  font-size: 1.2em;

  font-weight: 100;
`;

const Hashtag = styled(Link)`
  color: #1e90ff;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  :hover {
    text-decoration: underline;
  }
`;

const ActionContainer = styled.div`
  padding: 8px 4px;
`;

const Action = styled.div`
  cursor: pointer;
  padding: 0px 8px;
  width: fit-content;

  span {
    opacity: 0;
    transition: visibility 0s, opacity 0.5s linear;
    visibility: hidden;
  }

  :hover {
    color: black;
    span {
      opacity: 1;
      visibility: visible;
    }
  }
`;

const ActionLabel = styled.span`
  color: #606060;
  margin-left: 12px;
`;

interface Props {
  meow: Meow;
}

const Meow = (props: Props) => {
  const { account, ethereum } = useConnectedMetaMask();
  const [actionError, setActionError] = React.useState<string>();

  const meow = props.meow.remeow ? props.meow.remeow : props.meow;
  const originalMeow = props.meow;
  const isRemeow = props.meow.remeow !== undefined;

  const formatContent = (
    result: Array<JSX.Element>,
    text: string,
    key: number
  ): Array<JSX.Element> => {
    // base case
    if (text.length === 0) {
      return result;
    }
    let taggedProfileIdx = 0;
    // recursive case
    const matchRegex = new RegExp(/[#@][a-zA-Z0-9_]+/);
    const hashtagRegex = new RegExp(/#[a-zA-Z0-9_]+/);
    const profileRegex = new RegExp(/@[a-zA-Z0-9_]+/);
    const match = text.match(matchRegex);
    if (match) {
      const matchedText = match[0];
      const index = match.index ? match.index : 0;
      result.push(<span key={key++}>{text.substring(0, index)}</span>);
      if (matchedText.match(hashtagRegex)) {
        result.push(
          <Hashtag key={key++} to={`/tag/${matchedText.substring(1)}`}>
            {matchedText}
          </Hashtag>
        );
      } else if (matchedText.match(profileRegex)) {
        result.push(
          <Hashtag
            key={key++}
            to={`/profile/${props.meow.taggedProfiles[taggedProfileIdx++]}`}
          >
            {matchedText}
          </Hashtag>
        );
      } else {
        result.push(<span key={key++}>{matchedText}</span>);
      }
      text = text.substring(index + matchedText.length);
    } else {
      result.push(<span key={key++}>{text}</span>);
      text = "";
    }

    return formatContent(result, text, key);
  };

  const renderContent = (text: string) => {
    return formatContent([], text, 0);
  };

  const remeow = () => {
    const middleware = new MeowStorage(new Web3Client(account, ethereum));
    middleware
      .remeow(meow.id)
      .then(() => {
        setActionError(undefined);
      })
      .catch(() => {
        setActionError("failed to remeow");
      });
  };

  const remeowProfileRoute = `/profile/${originalMeow.profile.id}`;
  const profileRoute = `/profile/${meow.profile.id}`;

  return (
    <Container fluid>
      <RemeowContainer hidden={!isRemeow}>
        <RemeowLink to={remeowProfileRoute}>
          <ArrowPathIcon width={16} /> {originalMeow.profile.username} has
          remeowed
        </RemeowLink>
      </RemeowContainer>
      <MeowContainer fluid>
        <Row>
          <Col lg={2}>
            <AvatarColumn>
              <Link to={profileRoute}>
                <Image
                  width={64}
                  roundedCircle
                  thumbnail
                  src={meow.profile.avatarURI}
                />
              </Link>
            </AvatarColumn>
          </Col>
          <Col>
            <ContentColumn>
              <BootstrapContainer fluid>
                <Row>
                  <Col xs={13} lg={8}>
                    <Username>
                      <Link to={profileRoute}>{meow.profile.username}</Link>
                    </Username>
                  </Col>
                  <Col>
                    <PublishedDate>{meow.date.toLocaleString()}</PublishedDate>
                  </Col>
                </Row>
              </BootstrapContainer>
            </ContentColumn>
          </Col>
        </Row>
        <Row>
          <Col lg={{ offset: 2 }}>
            <MeowContent>{renderContent(meow.text)}</MeowContent>
          </Col>
        </Row>
        <Row>
          <Col lg={{ offset: 2 }}>
            <ContentColumn>
              <ActionContainer>
                <Row>
                  <Col
                    hidden={
                      props.meow.profile.id === props.meow.remeow?.profile.id
                    }
                  >
                    <Action onClick={remeow}>
                      <ArrowPathIcon width={16} />
                      <ActionLabel>Remeow</ActionLabel>
                    </Action>
                  </Col>
                </Row>
              </ActionContainer>
              <Alert hidden={!actionError} variant="danger">
                {actionError}
              </Alert>
            </ContentColumn>
          </Col>
        </Row>
      </MeowContainer>
    </Container>
  );
};

export default hot(Meow);
