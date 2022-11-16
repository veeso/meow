import * as React from "react";
import { hot } from "react-hot-loader/root";
import { useMetaMask } from "metamask-react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { BigNumber } from "ethers";

import Login from "./js/pages/Login";
import Topbar from "./js/components/Topbar";
import Web3Client from "./js/lib/web3/client";
import ProfileEntity from "./js/lib/model/profile";
import Home from "./js/pages/Home";
import Profile from "./js/pages/Profile";
import UserStorage from "./js/lib/middleware/UserStorage";
import Tag from "./js/pages/Tag";

const App = () => {
  const { account, status, ethereum } = useMetaMask();
  const navigate = useNavigate();
  // states
  const [profile, setProfile] = React.useState<ProfileEntity>();

  const getSignedInUser = async () => {
    if (account && ethereum) {
      const middleware = new UserStorage(new Web3Client(account, ethereum));
      return await middleware.getUserProfile();
    }
    return undefined;
  };

  const authUser = () => {
    getSignedInUser()
      .then((profile) => {
        if (profile) {
          setProfile(profile);
        } else {
          setProfile(undefined);
        }
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
    let results = new Array();
    // push hashtag
    if (query.startsWith("#") && query.length > 1) {
      results.push({
        text: `${query.trim()}`,
        uri: `/tag/${query.substring(1)}`,
      });
    }
    // search user
    if (account && ethereum) {
      const middleware = new UserStorage(new Web3Client(account, ethereum));
      let foundId = BigNumber.from(0);
      try {
        const profile = await middleware.getUserByUsername(query);
        foundId = profile.id;
        results.push({
          image: profile.avatarURI,
          text: profile.username,
          uri: `/profile/${profile.id.toString()}`,
        });
      } catch (_) {}
      const users = (await middleware.searchUser(query, 8))
        .filter((profile) => !profile.id.eq(foundId))
        .map((profile) => ({
          image: profile.avatarURI,
          text: profile.username,
          uri: `/profile/${profile.id.toString()}`,
        }));
      results = [...results, ...users];
    }

    return results;
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
          <Route
            path="/profile/:profileId"
            element={profile ? <Profile userProfile={profile} /> : <></>}
          />
          <Route path="/tag/:tag" element={<Tag />} />
        </Routes>
      </main>
    </>
  );
};

export default hot(App);
