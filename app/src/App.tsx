import * as React from "react";
import { hot } from "react-hot-loader/root";
import "bootstrap/dist/css/bootstrap.min.css";
import { MetaMaskProvider } from "metamask-react";
import { BrowserRouter } from "react-router-dom";
import Sandbox from "./js/pages/Sandbox";

const App = () => (
  <MetaMaskProvider>
    <BrowserRouter>
      <Sandbox />
    </BrowserRouter>
  </MetaMaskProvider>
);

export default hot(App);
