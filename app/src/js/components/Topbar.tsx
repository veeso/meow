import * as React from "react";
import { hot } from "react-hot-loader/root";
import styled from "styled-components";
import SearchResult from "../lib/model/search";
import Logo from "./Topbar/Logo";
import MetamaskConnect from "./MetamaskConnect";
import Search from "./Search";
import Profile from "../lib/model/profile";
import { Link, useNavigate } from "react-router-dom";
import Avatar from "./Topbar/Avatar";
import { DEFAULT_AVATAR_URI } from "../lib/const";
import { Container, Row, Col } from "react-bootstrap";
import { HomeIcon } from "@heroicons/react/24/solid";

const DesktopHeader = styled.header`
  align-items: center;
  background-color: white;
  border-bottom: 1px solid #ccc;
  color: #202020;
  display: flex;
  font-size: 1.5em;
  justify-content: space-between;
  min-height: 8vh;
  width: 100%;

  @media screen and (max-width: 640px) {
    display: none;
  }
`;

const MobileHeader = styled.header`
  display: none;
  @media screen and (max-width: 640px) {
    display: block;
  }
`;

const LogoSection = styled.div`
  padding: 0 24px;
  text-align: left;

  :hover {
    cursor: pointer;
  }
`;

const Title = styled.h1`
  color: #444;
  display: inline-block;
  font-size: 1.2em;
  font-weight: 100;
  margin-left: 24px;
`;

const Profile = styled.div`
  color: #444;
  display: inline-block;
  font-size: 1em;
  font-weight: 100;
  margin-right: 24px;
`;

const ProfileLink = styled(Link)`
  color: #444;
  text-decoration: none;
  :hover {
    text-decoration: underline;
  }
`;

const SearchSection = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: end;
  jusify-self: end;
  gap: 12px;
  text-align: right;
`;

const WalletSection = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;
  padding: 0 24px;
  text-align: right;
`;

const HomeCol = styled(Col)`
  display: flex;
  text-align: center;
  vertical-align: middle;

  :active {
    color: royalblue;
  }
`;

interface Props {
  search: (subject: string) => Promise<Array<SearchResult>>;
  profile?: Profile;
}

const Topbar = (props: Props) => {
  const navigate = useNavigate();
  const avatarURI = props.profile
    ? props.profile.avatarURI
    : DEFAULT_AVATAR_URI;

  return (
    <>
      <DesktopHeader>
        <LogoSection onClick={() => navigate("/")}>
          <Logo />
          <Title>Meow</Title>
        </LogoSection>

        <SearchSection hidden={props.profile === undefined}>
          <Search onSearch={props.search} />
        </SearchSection>
        <WalletSection className="wallet-connect">
          <MetamaskConnect />
        </WalletSection>
        <Profile hidden={props.profile === undefined}>
          <Avatar uri={avatarURI} />
          <ProfileLink to={`/profile/${props.profile?.id}`}>
            {props.profile?.username}
          </ProfileLink>
        </Profile>
      </DesktopHeader>
      <MobileHeader>
        <Container fluid>
          <Row>
            <HomeCol xs={2} onClick={() => navigate("/")}>
              <HomeIcon width={32} />
            </HomeCol>
            <Col xs={10}>
              <div hidden={props.profile === undefined}>
                <Search onSearch={props.search} />
              </div>
            </Col>
          </Row>
        </Container>
      </MobileHeader>
    </>
  );
};

export default hot(Topbar);
