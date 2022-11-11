import * as React from "react";
import { hot } from "react-hot-loader/root";
import "bootstrap/dist/css/bootstrap.min.css";
import { MetaMaskProvider } from "metamask-react";

const App = () => (
  <MetaMaskProvider>
    <h1>Ciao</h1>
  </MetaMaskProvider>
);

export default hot(App);
