import { Dialect } from "sequelize/types";

export interface Config {
  port: string;
  database: DatabaseInitOptions;
}

export interface DatabaseInitOptions {
  host: string;
  user: string;
  password: string;
  name: string;
  port: string;
  dialect: Dialect;
}
