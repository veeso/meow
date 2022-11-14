import * as React from "react";
import { hot } from "react-hot-loader/root";
import styled from "styled-components";
import { useMetaMask } from "metamask-react";

import SignUpForm from "../components/SignUpForm";
import Web3Client from "../lib/web3/client";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 33%;
  width: 33%;

  @media screen and (max-width: 640px) {
    margin-left: 0;
    width: 100%;
`;

interface Props {
  onSignedIn: () => void;
}

const Login = (props: Props) => {
  const { account, ethereum } = useMetaMask();

  const signUp = async (username: string) => {
    if (!account || !ethereum) {
      throw new Error("Please, connect your wallet via Metamask first");
    }
    const client = new Web3Client(account, ethereum);
    return await client.createProfile(username).then(() => {
      props.onSignedIn();
    });
  };

  return (
    <Container>
      <SignUpForm signUp={signUp} />
    </Container>
  );
};

export default hot(Login);
