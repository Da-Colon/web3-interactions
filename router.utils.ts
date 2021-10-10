import chalk from "chalk";
import express from "express";
import * as WalletController from "./wallet/wallet.controller";

export function init(app: express.Application) {
  // todo figure out how to seperate this
  const router = express.Router();
  router.get("/ping", (req: express.Request, res: express.Response) => {
    console.log(chalk.green("succesful ping"));
    return res.sendStatus(200).json({ success: "🚀 ~ Ping Successful" });
  });
  router.get("/", (req: express.Request, res: express.Response) => {
    return res.sendStatus(200).json({ success: "ok!" });;
  });
  
  const interactionsRouter = express.Router();
  interactionsRouter.get("/wallet/:address", WalletController.interactions);
  // app.get('/contract/:address', ContractController.interactions)
  app.use("/", router);

  app.use("/interactions", interactionsRouter);
}

