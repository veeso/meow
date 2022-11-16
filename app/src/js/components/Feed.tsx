import * as React from "react";
import { Alert } from "react-bootstrap";
import { hot } from "react-hot-loader/root";
import styled from "styled-components";
import { BigNumber } from "ethers";
import BootstrapContainer from "react-bootstrap/Container";

import Meow from "../lib/model/meow";
import List from "./Feed/List";
import Loader from "./Feed/Loader";

const Container = styled(BootstrapContainer)`
  padding: 0 32px;
  @media screen and (max-width: 640px) {
    padding: 0;
  }
`;

const MEOWS_TO_LOAD_COUNT = 32;

interface Props {
  loadMeows: (offset: BigNumber, count: BigNumber) => Promise<Array<Meow>>;
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
    return (
      <List
        meows={meows}
        loadMoreMeows={loadMoreMeows}
        loadPerFetch={MEOWS_TO_LOAD_COUNT}
      />
    );
  };

  React.useEffect(() => loadMoreMeows(), []);
  React.useEffect(() => {
    if (loading) {
      props
        .loadMeows(
          BigNumber.from(meows.length),
          BigNumber.from(MEOWS_TO_LOAD_COUNT)
        )
        .then((newMeows) => {
          setMeows([...newMeows, ...meows]);
          setError(false);
          setLoading(false);
        })
        .catch((e) => {
          console.error("error", e);
          setError(true);
          setLoading(false);
        });
    }
  }, [loading]);

  return <Container fluid>{render()}</Container>;
};

export default hot(Feed);
