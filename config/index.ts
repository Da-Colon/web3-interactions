import { Config } from "../types/app"
require("dotenv").config();

const devConfig: Config = {
  port: '8080',
  database: {
    host: process.env.POSTGRES_HOST || 'localhost',
    user: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD,
    name: process.env.POSTGRES_DB || 'development-web3-indexer',
    port: process.env.POSTGRES_PORT || '5432',
    dialect: 'postgres'
  }
}

const prodConfig: Config = {
  port: process.env.PORT || '8080',
  database: {
    host: process.env.POSTGRES_HOST || '',
    user: process.env.POSTGRES_USER || '',
    password: process.env.POSTGRES_PASSWORD || '',
    name: process.env.POSTGRES_NAME || '',
    port: process.env.POSTGRES_PORT || '',
    dialect: 'postgres'
  }
}

const isDev = process.env.NODE_ENV === 'development'
const config = isDev ? devConfig : prodConfig
export default config