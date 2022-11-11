import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
require("dotenv").config();

const { API_URL, PRIVATE_KEY } = process.env;

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks: {
    mumbai: {
      url: API_URL,
      accounts: [`0x${PRIVATE_KEY}`],
    },
  },
  gasReporter: {
    currency: "USD",
    gasPriceApi:
      "https://api.polygonscan.com/api?module=proxy&action=eth_gasPrice",
  },
};

export default config;
