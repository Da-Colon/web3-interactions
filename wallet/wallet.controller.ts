import chalk from "chalk";
import { ethers } from "ethers";
import express from "express";
import { Model } from "sequelize/types";
import { fetchTokenData, saveTokenData } from "../tokens/tokens.services";
import { Token } from "../types/app";
import { Transaction } from "../types/responses";
import { isAddressContract, isAddressToken } from "../web3/web3.services";
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

  // find last 100000 blocks of transactions
  const fetchedTransactions = await fetchWalletTransactions(walletAddress);

  //! if error fetching return
  if (fetchedTransactions.error) {
    console.log(chalk.red("error with node, please try again"));
    return res.json({ error: fetchedTransactions.error });
  }
  //! if transactions length is zero return
  if (!fetchedTransactions.transactions.length) {
    console.log(chalk.red("error with node, please try again"));
    return res.json({ error: "address has made no transactions" });
  }

  const mapppedAddresses = [
    ...new Set(
      fetchedTransactions.transactions.map((transaction: Transaction) => {
        if (transaction.from.toLowerCase() === walletAddress.toLowerCase()) {
          return transaction.to;
        } else return transaction.from;
      })
    ),
  ];

  const knownTokenData = [];
  // check for known address (database | redis) (possibly filter out then rejoin)
  const checkedAddresses = await Promise.all(
    mapppedAddresses.map(async (address: string) => {
      const tokenData: any = await fetchTokenData(sequelize, address);
      if (!tokenData) return address;
      console.log(chalk.white(`token: ${tokenData.contractAddress} found`));
      knownTokenData.push(tokenData);
      return false;
    })
  );
  const unknownAddresses = checkedAddresses.filter((v: any) => v);

  // for each transaction check for token contract (to / from)
  const InteractedTokenData = await Promise.all(
    unknownAddresses.map(async (address: string) => {
      const { isContract } = await isAddressContract(address, provider);
      if (!isContract) return false;
      const { isToken, tokenData } = await isAddressToken(address);
      if (isToken) return tokenData;
    })
  );
  const tokens = InteractedTokenData.filter((v: any) => v);

  //! if transactions length is zero return
  if (!tokens.length && !knownTokenData.length) {
    console.log(chalk.red("no contract interactions with this address"));
    return res.json({ error: "no contract interactions with this address" });
  }

  // save token address
  const savedTokenData = await Promise.all(
    tokens.map(async (token: Token) => {
      const savedData = await saveTokenData(sequelize, token);
      return savedData;
    })
  );

  const tokenData = [...savedTokenData, ...knownTokenData];

  return res.json({ tokens: tokenData });
}
