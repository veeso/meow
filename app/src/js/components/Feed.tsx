import * as React from "react";
import { Alert } from "react-bootstrap";
import { hot } from "react-hot-loader/root";
import styled from "styled-components";
import { BigNumber } from "ethers";
import BootstrapContainer from "react-bootstrap/Container";
import { useConnectedMetaMask } from "metamask-react";

import Meow from "../lib/model/meow";
import List from "./Feed/List";
import Loader from "./Feed/Loader";
import Overlay from "./Overlay";
import TipForm from "./Feed/TipForm";
import UserStorage from "../lib/middleware/UserStorage";
import Web3Client from "../lib/web3/client";
import Profile from "../lib/model/profile";

const Container = styled(BootstrapContainer)`
  padding: 0 32px;
  @media screen and (max-width: 640px) {
    padding: 0;
  }
`;

const MEOWS_TO_LOAD_COUNT = 32;

interface Props {
  loadMeows: (offset: BigNumber, count: BigNumber) => Promise<Array<Meow>>;
  profileId: BigNumber;
}

const Feed = (props: Props) => {
  const { account, ethereum } = useConnectedMetaMask();
  const [meows, setMeows] = React.useState<Array<Meow>>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>();
  const [tipFormProfile, setTipFormProfile] = React.useState<Profile>();

  const loadMoreMeows = () => {
    setLoading(true);
  };

  const onTip = (profile: Profile) => {
    setTipFormProfile(profile);
  };

  const onTipSubmit = async (tip: number) => {
    const middleware = new UserStorage(new Web3Client(account, ethereum));
    if (tipFormProfile) {
      try {
        await middleware.sendTip(tip, tipFormProfile.id);
        setTipFormProfile(undefined);
      } catch (e: any) {
        setError(
          `Failed to send tip to ${tipFormProfile.username}: ${e.message}`
        );
        setTipFormProfile(undefined);
      }
    }
  };

  const render = () => {
    if (loading) {
      return <Loader />;
    }
    if (meows.length > 0) {
      return (
        <List
          meows={meows}
          loadMoreMeows={loadMoreMeows}
          loadPerFetch={MEOWS_TO_LOAD_COUNT}
          onTip={onTip}
          userProfileId={props.profileId}
        />
      );
    }
    return <></>;
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
          setError(undefined);
          setLoading(false);
        })
        .catch((e) => {
          setError(`failed to load meows: ${e.message}`);
          setLoading(false);
        });
    }
  }, [loading]);

  const tipForm = tipFormProfile ? (
    <TipForm
      onClose={() => setTipFormProfile(undefined)}
      onSubmit={onTipSubmit}
      profile={tipFormProfile}
    />
  ) : (
    <></>
  );

  let alert = <></>;
  if (error) {
    alert = <Alert variant="danger">{error}</Alert>;
  }

  return (
    <>
      {alert}
      <Container fluid>{render()}</Container>
      <Overlay visible={tipFormProfile !== undefined}>{tipForm}</Overlay>
    </>
  );
};

export default hot(Feed);
