import * as React from "react";
import { hot } from "react-hot-loader/root";
import "bootstrap/dist/css/bootstrap.min.css";
import { MetaMaskProvider } from "metamask-react";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

const Launcher = () => (
  <MetaMaskProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </MetaMaskProvider>
);

export default hot(Launcher);
