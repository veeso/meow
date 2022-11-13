import * as React from "react";
import { hot } from "react-hot-loader/root";
import { Link } from "react-router-dom";
import styled from "styled-components";

import SearchResult from "../../lib/model/search";

const Container = styled.div`
  padding: 12px 0;
  width: 100%;
`;

interface Props {
  entries?: Array<SearchResult>;
}

const Results = (props: Props) => {
  const entries = props.entries?.map((entry, i) => (
    <Container key={i}>
      <Link to={entry.uri}>{entry.text}</Link>
    </Container>
  ));

  return <>{entries}</>;
};

export default hot(Results);
