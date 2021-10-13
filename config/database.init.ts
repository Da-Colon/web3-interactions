import { Sequelize } from "sequelize";
import express from 'express';
import config from ".";
import chalk from "chalk";
import { modalsInit } from "../models";

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
    console.info(chalk.greenBright(`[${dialect}] connection successful`))
    console.info(chalk.greenBright(`[${name}] connected`))
    // :define modals
    modalsInit(sequelize)
    app.locals.sequelize = sequelize;
  })
}
  // todo :initialize migrations