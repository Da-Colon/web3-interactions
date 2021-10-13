import express from "express";
import morgan from "morgan";
import http from "http";
import config from ".";
import chalk from "chalk";
import corsOptions from "cors";

export function cors(app: express.Application) {
  app.use(corsOptions());
}

export function logging(app: express.Application) {
  app.use(morgan("dev"));
}

export function encoding(app: express.Application) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
}

export function normalizePort(val: string) {
  const port = parseInt(val, 10);
  if (isNaN(port)) return val;
  if (port >= 0) return port;
  return false;
}

function onError(error: any) {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof config.port === "string" ? "Pipe " + config.port : "Port " + config.port;
  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
    default:
      throw error;
  }
}

export async function init(app: express.Application) {
  const server = http.createServer(app);
  const port = normalizePort(config.port);
  app.set("port", port);
  server.listen(port);
  server.on("error", onError);
  server.on("listening", () => {
    console.info(chalk.bold.white(`[web3-indexer] is listening on ${config.port}.`));
  });
}
