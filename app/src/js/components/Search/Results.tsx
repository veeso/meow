import * as React from "react";
import { hot } from "react-hot-loader/root";
import { Link } from "react-router-dom";
import styled from "styled-components";
import ListGroup from "react-bootstrap/ListGroup";
import { Image as BootStrapImage } from "react-bootstrap";

import SearchResult from "../../lib/model/search";

const Container = styled(ListGroup.Item)`
  font-size: 1.2em;
  text-align: left;
  width: 100%;

  :hover {
    background-color: #eee;
  }
`;

const SearchLink = styled(Link)`
  color: #404040;
  display: block;
  text-decoration: none;
  width: 100%;
  :hover {
    color: dodgerblue;
    text-decoration: underline;
  }
`;

const Image = styled(BootStrapImage)`
  display: inline-block;
  height: 2em;
  margin-right: 8px;
`;

interface Props {
  entries?: Array<SearchResult>;
}

const Results = (props: Props) => {
  const entries = props.entries?.map((entry, i) => {
    const image = entry.image ? (
      <Image src={entry.image} roundedCircle thumbnail />
    ) : (
      <></>
    );
    return (
      <Container key={i}>
        <SearchLink to={entry.uri}>
          {image}
          {entry.text}
        </SearchLink>
      </Container>
    );
  });

  return <ListGroup>{entries}</ListGroup>;
};

export default hot(Results);
