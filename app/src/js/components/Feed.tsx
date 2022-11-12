import * as React from "react";
import { Alert } from "react-bootstrap";
import { hot } from "react-hot-loader/root";
import styled from "styled-components";

import Meow from "../lib/model/meow";
import List from "./Feed/List";
import Loader from "./Feed/Loader";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 32px;
`;

interface Props {
  loadMeows: (offset: number, count: number) => Promise<Array<Meow>>;
}

const Feed = (props: Props) => {
  const [meows, setMeows] = React.useState<Array<Meow>>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<boolean>(false);

  const loadMoreMeows = () => {
    setLoading(true);
  };

  const render = () => {
    if (loading) {
      return <Loader />;
    }
    if (error) {
      return <Alert variant="danger">Failed to load meows</Alert>;
    }
    return <List meows={meows} loadMoreMeows={loadMoreMeows} />;
  };

  React.useEffect(() => loadMoreMeows(), []);
  React.useEffect(() => {
    if (loading) {
      props
        .loadMeows(meows.length, 32)
        .then((newMeows) => {
          setMeows([...newMeows, ...meows]);
          setError(false);
          setLoading(false);
        })
        .catch(() => {
          setError(true);
        });
    }
  }, [loading]);

  return <Container>{render()}</Container>;
};

export default hot(Feed);
