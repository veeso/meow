import * as React from "react";
import { hot } from "react-hot-loader/root";
import styled from "styled-components";
import { useMetaMask } from "metamask-react";

import SignUpForm from "../components/SignUpForm";
import SignInForm from "../components/SignInForm";
import Web3Client from "../lib/web3/client";
import UserStorage from "../lib/middleware/UserStorage";

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
  const { account, ethereum, connect } = useMetaMask();

  const onSignIn = async () => {
    connect()
      .then(() => {
        props.onSignedIn();
      })
      .catch((e) => {
        throw new Error(`failed to connect to metamask: ${e.message}`);
      });
  };

  const onSignUp = async (username: string) => {
    if (!account || !ethereum) {
      connect()
        .then(() => {
          signUp(username);
        })
        .catch((e) => {
          throw new Error(`failed to connect to metamask: ${e.message}`);
        });
    } else {
      signUp(username);
    }
  };

  const signUp = async (username: string) => {
    if (account && ethereum) {
      const middleware = new UserStorage(new Web3Client(account, ethereum));
      return await middleware.createProfile(username).then(() => {
        props.onSignedIn();
      });
    }
  };

  return (
    <Container>
      <SignUpForm signUp={onSignUp} />
      <hr />
      <SignInForm signIn={onSignIn} />
    </Container>
  );
};

export default hot(Login);
