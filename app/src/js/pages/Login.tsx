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
  }
`;

interface Props {
  onSignedIn: () => void;
}

const Login = (props: Props) => {
  const { account, ethereum, connect } = useMetaMask();

  const onSignIn = async () => {
    try {
      await connect();
      await getUserProfile();
    } catch (_) {
      throw new Error("cannot find any user associated to your wallet");
    }
  };

  const onSignUp = async (username: string) => {
    if (!account || !ethereum) {
      try {
        await connect();
        await signUp(username);
      } catch (e: any) {
        throw new Error(`failed to connect to metamask: ${e.message}`);
      }
    } else {
      try {
        await signUp(username);
      } catch (e: any) {
        throw new Error(`failed to connect to sign up: ${e.message}`);
      }
    }
  };

  const getUserProfile = async () => {
    if (account && ethereum) {
      const middleware = new UserStorage(new Web3Client(account, ethereum));
      return await middleware.getUserProfile();
    } else {
      throw new Error("metamask not connected");
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
