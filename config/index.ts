import chalk from "chalk";
import { Config } from "../types/app";
require("dotenv").config();

const devConfig: Config = {
  port: "8080",
  etherscanURL: "https://api.etherscan.io/api",
  coinGeckoURL: "https://api.coingecko.io/api/v3",
  infuraURL: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
  database: {
    host: process.env.POSTGRES_HOST || "localhost",
    user: process.env.POSTGRES_USER || "postgres",
    password: process.env.POSTGRES_PASSWORD,
    name: process.env.POSTGRES_DB || "development-web3-indexer",
    port: process.env.POSTGRES_PORT || "5432",
    dialect: "postgres",
  },
  web3: {
    chainId: "1",
    network: "mainnet",
    providerKeys: {
      infuraKey: process.env.INFURA_API_KEY,
      alchemyKey: process.env.ALCHEMY_API_KEY,
      etherscanKey: process.env.ETHERSCAN_API_KEY,
    },
  },
};

console.log(chalk.bold.blue(`[${process.env.NODE_ENV}] environment`));
const config = devConfig;
export default config;
