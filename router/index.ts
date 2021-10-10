import chalk from "chalk";
import express from "express";
import * as WalletController from "../wallet/wallet.controller";

export function init(app: express.Application) {
  app.use("/", rootRouter());
  app.use("/interactions", interactionsRouter());
}

function rootRouter() {
  const router = express.Router();
  router.get("/ping", (req: express.Request, res: express.Response) => {
    console.log(chalk.green("succesful ping"));
    return res.json({ success: "🚀 ~ Ping Successful" });
  });
  router.get("/", (req: express.Request, res: express.Response) => {
    return res.json({ success: "ok!" });;
  });
  return router;
}

function interactionsRouter() {
  const router = express.Router()
  router.get("/wallet/:address", WalletController.interactions);
  // app.get('/contract/:address', ContractController.interactions)
  return router
}