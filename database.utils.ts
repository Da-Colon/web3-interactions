import { Sequelize } from "sequelize";
import express from 'express';
import config from "./config";

export function init(app: express.Application) {
  const { database } = config;
  const {user, password, host, port, name, dialect} = database
  const sequelize = new Sequelize(name, user, password, {
    host,
    port: Number(port),
    dialect,
    logging: false
  } )
  app.locals.database = sequelize;
}
  // todo :define modals
  // todo :initialize migrations