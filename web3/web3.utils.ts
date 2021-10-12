import chalk from "chalk";
import { ethers } from "ethers";
import express from 'express'
import config from '../config'

export function init(app: express.Application) {
  // setup default provider
  const network = ethers.providers.getNetwork(parseInt(config.web3.chainId));
  const defaultProvider = ethers.getDefaultProvider(network, {...config.web3.providerKeys, quorum: 1});
  app.locals.provider = defaultProvider;
}

export async function fetchBlockChainData(app: express.Application) {
  // recursive function update current block
  const provider = app.locals.provider as ethers.providers.Provider
  const currentBlock = await provider.getBlockNumber()
  if(app.locals.currentBlock === currentBlock) {
    setTimeout(async () => await fetchBlockChainData(app), 10000)
    return;
  }
  console.info(chalk.magenta(`current block: ${currentBlock}`))
  app.locals.currentBlock = currentBlock
  setTimeout(async () => await fetchBlockChainData(app), 10000)
}