import chalk from "chalk";
import { Config } from "../types/app";
require("dotenv").config();

const config: Config = {
  port: "8080",
  isDev: process.env.NODE_ENV === 'development',
  etherscanURL: "https://api.etherscan.io/api",
  coinGeckoURL: "https://api.coingecko.com/api/v3",
  infuraURL: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
  database: {
    host: process.env.POSTGRES_HOST || "localhost",
    user: process.env.POSTGRES_USER || "postgres",
    password: process.env.POSTGRES_PASSWORD,
    name: process.env.POSTGRES_DB || "",
    port: process.env.POSTGRES_PORT || "5432",
    dialect: "postgres",
  },
  web3: {
    chainId: "1",
    network: "mainnet",
    providerKeys: {
      infura: process.env.INFURA_API_KEY,
      alchemy: process.env.ALCHEMY_API_KEY,
      etherscan: process.env.ETHERSCAN_API_KEY,
    },
  },
};

console.info(chalk.bold.blue(`[${process.env.NODE_ENV}] environment`));

export default config;
