import * as React from "react";
import { hot } from "react-hot-loader/root";
import { useMetaMask } from "metamask-react";
import { Routes, Route, useNavigate } from "react-router-dom";
import web3 from "web3";

import Login from "./js/pages/Login";
import Topbar from "./js/components/Topbar";
import Web3Client from "./js/lib/web3/client";
import Profile from "./js/lib/model/profile";
import Home from "./js/pages/Home";

const App = () => {
  const { account, status, ethereum } = useMetaMask();
  const navigate = useNavigate();
  // states
  const [profile, setProfile] = React.useState<Profile>();

  const getSignedInUser = async () => {
    console.log("vaffanculo", account, ethereum);
    if (account && ethereum) {
      const client = new Web3Client(account, ethereum);
      return await client.getUserProfile();
    }
    return undefined;
  };

  const authUser = () => {
    getSignedInUser()
      .then((profile) => {
        setProfile({
          id: profile.id,
          username: web3.utils.hexToUtf8(profile.username),
          avatarURI:
            profile.avatarURI.length === 0 ? undefined : profile.avatarURI,
        });
      })
      .catch(() => {
        setProfile(undefined);
        navigate("/login");
      });
  };

  // on mount
  React.useEffect(() => {
    if (!profile && status === "connected") {
      authUser();
    } else if (status === "notConnected") {
      navigate("/login");
    }
  }, [status]);

  // on username changed
  React.useEffect(() => {
    if (profile) {
      navigate("/");
    }
  }, [profile]);

  // resolvers

  const onSearch = async (query: string) => {
    throw new Error("TODO: impl");
  };

  const onSignedIn = () => {
    authUser();
  };

  return (
    <>
      <Topbar search={onSearch} profile={profile} />
      <main>
        <Routes>
          <Route
            path="/"
            element={profile ? <Home profile={profile} /> : <></>}
          />
          <Route path="/login" element={<Login onSignedIn={onSignedIn} />} />
          <Route path="/profile/:profileId" element={<></>} />
        </Routes>
      </main>
    </>
  );
};

export default hot(App);
