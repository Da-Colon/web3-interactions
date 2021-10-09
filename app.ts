import express from "express";
import morgan from "morgan";
import config from './config'
import chalk from "chalk";

const app = express();
app.use(morgan("combined"));
app.use(express.json())
app.use(express.urlencoded({ extended: true }));


app.listen(config.port, () => {
  console.log(chalk.blue(`web3-indexer`), chalk.white(`is running on port ${config.port}.`));
});