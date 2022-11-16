import * as React from "react";
import { hot } from "react-hot-loader/root";
import styled from "styled-components";
import Spinner from "react-bootstrap/Spinner";
import { Container } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";

import MeowModel from "../../lib/model/meow";
import Meow from "./Meow";
import { BigNumber } from "ethers";
import Profile from "../../lib/model/profile";

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

interface Props {
  loadMoreMeows: () => void;
  meows: Array<MeowModel>;
  loadPerFetch: number;
  onTip: (profile: Profile) => void;
  userProfileId: BigNumber;
}

const List = (props: Props) => {
  const meows = props.meows.map((meow) => (
    <Meow
      key={meow.id.toString()}
      meow={meow}
      onTip={props.onTip}
      userProfileId={props.userProfileId}
    />
  ));
  const [lastMeowLength, setLastMeowLength] = React.useState<number>(
    meows.length
  );

  const refresh = () => {
    const diff = meows.length - lastMeowLength;
    const range = meows.slice(lastMeowLength, diff);
    setLastMeowLength(meows.length);
    return range;
  };

  const hasMore =
    props.meows.length % props.loadPerFetch === 0 && props.meows.length > 0;

  return (
    <Container fluid>
      <InfiniteScroll
        dataLength={props.meows.length}
        hasMore={hasMore}
        next={props.loadMoreMeows}
        loader={
          <SpinnerContainer>
            <Spinner animation="border" variant="primary" />
          </SpinnerContainer>
        }
        refreshFunction={refresh}
        pullDownToRefresh
        pullDownToRefreshThreshold={50}
      >
        {meows}
      </InfiniteScroll>
    </Container>
  );
};

export default hot(List);
