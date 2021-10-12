import express from "express";
import * as Database from "./config/database.init";
import * as Application from "./config/app.init";
import * as Web3 from "./web3/web3.utils"
import * as Router from "./router"
(async () => {
  const app = express();
  // initialize database
  Database.init(app);

  // initialize web3 provider
  Web3.init(app);

  // todo :initialize redis
  // initialize cors
  Application.cors(app);
  // initialize services
  Application.logging(app);
  Application.encoding(app);
  // initialize blockchain indexer routes
  Router.init(app);
  // initialize server
  Application.init(app);
})()
