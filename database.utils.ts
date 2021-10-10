import { Sequelize } from "sequelize";
import express from 'express';
import config from "./config";
import chalk from "chalk";
import { modalsInit } from "./models";

export function init(app: express.Application) {
  const { database } = config;
  const {user, password, host, port, name, dialect} = database
  const sequelize = new Sequelize(name, user, password, {
    host,
    port: Number(port),
    dialect,
    logging: false
  } )
  sequelize.authenticate().then(() => {
    console.log(chalk.greenBright(`[${dialect}] connection successful`))
    console.log(chalk.greenBright(`[${name}] connected`))
    app.locals.database = sequelize;
    // :define modals
    modalsInit(sequelize)
  })
}
  // todo :initialize migrations