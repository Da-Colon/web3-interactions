import chalk from "chalk";
import { ethers } from "ethers";
import express from "express";
import { Token } from "../types/app";
import { checkForTokenData, checkForUnknownTokenData, mapAddresses, saveTokensData } from "../utils";
import { fetchWalletTransactions } from "../wallet/wallet.services";
import { isAddressContract } from "../web3/web3.services";
import { fetchContractTransactions } from "./contract.services";

export async function interactions(req: express.Request, res: express.Response) {
  const provider = req.app.locals.provider as ethers.providers.Provider;
  const contractAddress = req.params.address;
  const sequelize = req.app.locals.sequelize;
  //! return if no address provided
  if (!contractAddress || !ethers.utils.isAddress(contractAddress)) {
    return res.json({ error: "please provide wallet address" });
  }

  //! return if not contract address?
  const isAddressContractResponse = await isAddressContract(contractAddress, provider);
  if (!isAddressContractResponse.isContract) {
    console.info(chalk.red("invalid address provided, please provide contract address"));
    return res.json({ error: "invalid address provided, please provide contract address" });
  }
  //! return if there has be an RPC error
  if (!!isAddressContractResponse.error) {
    console.info(chalk.red("error with node, please try again"));
    return res.json({ error: isAddressContractResponse.error });
  }

  // find last 100000 transactions (quote limit)
  const fetchedTransactions = await fetchContractTransactions(contractAddress, provider);

  //! if error fetching return error
  if (fetchedTransactions.error) {
    console.info(chalk.red("error with node, please try again"));
    return res.json({ error: fetchedTransactions.error });
  }
  //! if fetchtransactions length is zero return error
  if (!fetchedTransactions.transactions.length) {
    console.info(chalk.red("error with node, please try again"));
    return res.json({ error: "address has made no transactions" });
  }

  // filter out contract addresses and remove duplicates
  const mappedAddresses = mapAddresses(fetchedTransactions.transactions, contractAddress);
  // filter 10 unique addresses
  const interactedAddresses = mappedAddresses.filter((_: string, index: number) => index <= 5);

  // for each address retreive token retreive contract interactions
  const walletsInteractions = await Promise.all(
    interactedAddresses.map(async (walletAddress: string) => {
      // find last 100000 transactions (quote limit)
      const fetchedTransactions = await fetchWalletTransactions(walletAddress).then((response) =>
        new Promise((resolve) => {
          setTimeout(resolve, 1000);
        }).then(() => response)
      );

      //! if error fetching return error
      if (fetchedTransactions.error) {
        console.info(chalk.red("error with node, please try again"));
        return res.json({ error: fetchedTransactions.error });
      }
      //! if fetchtransactions length is zero return error
      if (!fetchedTransactions.transactions.length) {
        console.info(chalk.red("error with node, please try again"));
        return res.json({ error: "address has made no transactions" });
      }

      // map fetchtransactions for interacted addresses (to / from !== walletAddress)
      const mapppedAddresses = mapAddresses(fetchedTransactions.transactions, walletAddress);

      // check database for known erc20 tokens already verfied
      const [knownTokenData, checkedAddresses] = await checkForTokenData(mapppedAddresses, sequelize);
      const unknownAddresses = checkedAddresses.filter((v: any) => v) as string[];

      // for each transaction unknown contract address for erc20 tokens (coin gecko verified)
      const InteractedTokenData = await checkForUnknownTokenData(unknownAddresses);
      const newTokensData = InteractedTokenData.filter((v: any) => v);

      //! if no token interactions detected return error
      if (!newTokensData.length && !knownTokenData.length) {
        console.info(chalk.red("no contract interactions with this address"));
        return res.json({ error: "no contract interactions with this address" });
      }

      // save new tokens data to database
      const savedTokenData = await saveTokensData(newTokensData, sequelize);

      // combine token data
      const tokensData = [...savedTokenData, ...knownTokenData];
      return tokensData.map((token: Token) => {
        return { ...token, walletAddress: walletAddress };
      });
    })
  );
  return res.json({ success: "~ 🚀 ~", result: walletsInteractions });
}
