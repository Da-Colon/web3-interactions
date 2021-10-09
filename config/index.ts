import { Config } from "../types/app"

const devConfig: Config = {
  port: '8080',
  database: {
    host: process.env.DATABASE_HOST || 'localhost',
    user: process.env.DATABASE_USER || '',
    password: process.env.DATABASE_PASSWORD || '',
    name: process.env.DATABASE_NAME || 'development',
    port: process.env.DATABASE_PORT || '5432',
  }
}

const prodConfig: Config = {
  port: process.env.PORT || '8080',
  database: {
    host: process.env.DATABASE_HOST || '',
    user: process.env.DATABASE_USER || '',
    password: process.env.DATABASE_PASSWORD || '',
    name: process.env.DATABASE_NAME || '',
    port: process.env.DATABASE_PORT || '',
  }
}

const isDev = process.env.NODE_ENV === 'development'
const config = isDev ? devConfig : prodConfig
export default config