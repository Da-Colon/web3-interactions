import chalk from "chalk";
import { ethers } from "ethers";
import express from "express";
import { Transaction } from "../types/responses";
import { isAddressContract, isAddressToken } from "../web3/web3.services";
import { fetchWalletTransactions } from "./wallet.services";

export async function interactions(req: express.Request, res: express.Response) {
  console.log(chalk.blue("requesting interactions..."));

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

  // for each transaction check for token (to / from)
  // todo filter for known address (database | redis) (possibly filter out then rejoin)
  const InteractedTokenData = await Promise.all(
    mapppedAddresses.map(async (address: string) => {
      const { isContract } = await isAddressContract(address, provider);
      if (!isContract) return false;
      const { isToken, tokenData } = await isAddressToken(address);
      if (isToken) return tokenData;
    })
  );
  const tokenData = InteractedTokenData.filter((v: any) => v);

  //! if transactions length is zero return
  if (!tokenData.length) {
    console.log(chalk.red("no contract interactions with this address"));
    return res.json({ error: "no contract interactions with this address" });
  }

  //?- - if known contract address (database)
  //!- - - retreive and return known contract data (database)
  //?- - check for Contract Addresses / etherscan
  //?- - - check for erc20 Contract Addresses on coin gecko for token data
  //!- - - -save new Contract into database
  // - returns Object(recent contract interactions)

  return res.json({ success: "Successful" });
}
