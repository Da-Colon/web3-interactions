import chalk from "chalk";
import { ethers } from "ethers";
import express from "express";

import { checkForTokenData, checkForUnknownTokenData, mapAddresses, saveTokensData } from "../utils";
import { isAddressContract } from "../web3/web3.services";
import { fetchWalletTransactions } from "./wallet.services";

export async function interactions(req: express.Request, res: express.Response) {
  console.log(chalk.blue("requesting interactions..."));
  const sequelize = req.app.locals.sequelize;
  const provider = req.app.locals.provider as ethers.providers.Provider;
  const walletAddress = req.params.address;

  //! return if no address provided
  if (!walletAddress || !ethers.utils.isAddress(walletAddress)) {
    return res.json({ error: "please provide wallet address" });
  }

  //! return if not wallet address?
  const isAddressContractResponse = await isAddressContract(walletAddress, provider);

  if (isAddressContractResponse.isContract) {
    console.log(chalk.red("invalid address provided, please provide wallet address"));
    return res.json({ error: "invalid address provided, please provide wallet address" });
  }

  //! return if there has be an RPC error
  if (!!isAddressContractResponse.error) {
    console.log(chalk.red("error with node, please try again"));
    return res.json({ error: isAddressContractResponse.error });
  }

  // find last 100000 transactions (quote limit)
  const fetchedTransactions = await fetchWalletTransactions(walletAddress);

  //! if error fetching return error
  if (fetchedTransactions.error) {
    console.log(chalk.red("error with node, please try again"));
    return res.json({ error: fetchedTransactions.error });
  }
  //! if fetchtransactions length is zero return error
  if (!fetchedTransactions.transactions.length) {
    console.log(chalk.red("error with node, please try again"));
    return res.json({ error: "address has made no transactions" });
  }

  // map fetchtransactions for interacted addresses (to / from !== walletAddress)
  const mapppedAddresses = mapAddresses(fetchedTransactions.transactions, walletAddress);

  const knownTokenData = [];
  // check database for known erc20 tokens already verfied
  const checkedAddresses = await checkForTokenData(mapppedAddresses, sequelize, knownTokenData);
  const unknownAddresses = checkedAddresses.filter((v: any) => v) as string[];

  // for each transaction unknown contract address for erc20 tokens (coin gecko verified)
  const InteractedTokenData = await checkForUnknownTokenData(unknownAddresses, provider);
  const newTokensData = InteractedTokenData.filter((v: any) => v);

  //! if no token interactions detected return error
  if (!newTokensData.length && !knownTokenData.length) {
    console.log(chalk.red("no contract interactions with this address"));
    return res.json({ error: "no contract interactions with this address" });
  }

  // save new tokens data to database
  const savedTokenData = await saveTokensData(newTokensData, sequelize);

  // combine token data
  const tokenData = [...savedTokenData, ...knownTokenData];
  return res.json({ tokens: tokenData });
}
