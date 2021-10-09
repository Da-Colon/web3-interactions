import { Sequelize } from "sequelize";
import config from "./config";

export function init(): Sequelize {
  const { database } = config;
  const {user, password, host, port, name, dialect} = database
  //postgres:secretsecretpassword@localhost:5432/development-web3-indexer
  const sequelize = new Sequelize(name, user, password, {
    host,
    port: Number(port),
    dialect,
    logging: false
  } )
  return sequelize;
}

// todo migration function to run after connection
// todo define modals