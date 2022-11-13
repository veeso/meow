import * as React from "react";
import { hot } from "react-hot-loader/root";
import Button from "react-bootstrap/Button";
import { useMetaMask } from "metamask-react";
import Logo from "./MetamaskConnect/Logo";

//const POLYGON_NETWORK = "0x89"; // 137
const POLYGON_NETWORK = "0x13881"; // 80001 (mumbai)

const MetamaskConnect = () => {
  const { status, connect, account, chainId, switchChain } = useMetaMask();
  const disabled = () =>
    ["initializing", "unavailable", "connecting", "connected"].includes(status);

  const onClick = () => {
    if (status === "notConnected") {
      if (chainId !== POLYGON_NETWORK) {
        switchChain(POLYGON_NETWORK);
      }
      return connect();
    }
    return undefined;
  };

  const addressText = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  const text = () => {
    if (status === "initializing") return "Initializing...";
    if (status === "unavailable") return "MetaMask not available";
    if (status === "notConnected") return "Connect to MetaMask";
    if (status === "connecting") return "Connecting...";
    if (status === "connected") return addressText(account);
    return undefined;
  };

  return (
    <Button variant="primary" onClick={onClick} disabled={disabled()}>
      <Logo />
      <span>{text()}</span>
    </Button>
  );
};

export default hot(MetamaskConnect);
