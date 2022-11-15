import * as React from "react";
import { hot } from "react-hot-loader/root";
import { Link } from "react-router-dom";
import styled from "styled-components";
import ListGroup from "react-bootstrap/ListGroup";

import SearchResult from "../../lib/model/search";

const Container = styled.div`
  font-size: 1.5em;
  padding: 12px 12px;
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

interface Props {
  entries?: Array<SearchResult>;
}

const Results = (props: Props) => {
  const entries = props.entries?.map((entry, i) => (
    <ListGroup.Item key={i}>
      <SearchLink to={entry.uri}>{entry.text}</SearchLink>
    </ListGroup.Item>
  ));

  return <ListGroup>{entries}</ListGroup>;
};

export default hot(Results);
