import * as React from "react";
import { hot } from "react-hot-loader/root";
import styled from "styled-components";
import BootstrapImage from "react-bootstrap/Image";
import { Link } from "react-router-dom";

import Meow from "../../lib/model/meow";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  gap: 24px;
  padding: 0 8px;
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

const MeowHeader = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  gap: 24px;
`;

const Username = styled.span`
  font-size: 1.5em;
  font-weight: 500;
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

interface Props {
  meow: Meow;
}

const Meow = (props: Props) => {
  const renderContent = (text: string) => {
    const regex = new RegExp(/#[a-zA-Z0-9_]+/, "g");
    const output = text
      .split(regex)
      .map((value, i) => <span key={i}>{value}</span>);
    const matches = text.match(regex)?.map((value, i) => (
      <Hashtag key={i} to={`/tag/${value.substring(1)}`}>
        {value}
      </Hashtag>
    ));

    let result = [];
    let i = 0;
    for (const span of output) {
      result.push(span);
      if (matches) {
        result.push(matches[i]);
        i++;
      }
    }
    return result;
  };

  return (
    <Container>
      <AvatarColumn>
        <Image
          width={64}
          roundedCircle
          thumbnail
          src={props.meow.profile.avatarURI}
        />
      </AvatarColumn>
      <ContentColumn>
        <MeowHeader>
          <Username>{props.meow.profile.username}</Username>
          <PublishedDate>{props.meow.date.toLocaleString()}</PublishedDate>
        </MeowHeader>
        <MeowContent>{renderContent(props.meow.text)}</MeowContent>
      </ContentColumn>
    </Container>
  );
};

export default hot(Meow);
