import express from "express";
import * as Database from "./database.utils";
import * as Application from "./app.utils";


(async () => {
  const app = express();
  // initialize database
  const database = Database.init();
  // todo :initialize redis
  // initialize server
  Application.init(app);
  // initialize cors
  Application.cors(app);
  // initialize services
  Application.logging(app);
  Application.encoding(app);
})();
