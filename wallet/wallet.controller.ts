import chalk from "chalk";
import { ethers } from "ethers";
import express from "express";
import { mapAddresses } from "../utils";
import ContractsServices from "../contracts/ContractServices";
import FetchDataServices from "../services/FetchDataServices";
import EtherScanServices, { EtherScanScope } from "../thirdPartyServices/EtherScanServices";
import TokensServices from "../tokens/TokensServices";
import Web3Services from "../web3/Web3Services";

export async function interactions(req: express.Request, res: express.Response) {
  console.info(chalk.blue("requesting interactions..."));
  const sequelize = req.app.locals.sequelize;
  const provider = req.app.locals.provider as ethers.providers.Provider;
  const walletAddress = req.params.address;

  //! return if no address provided
  if (!walletAddress || !ethers.utils.isAddress(walletAddress)) {
    return res.json({ error: "please provide wallet address" });
  }

  console.info(chalk.blue("step 1 of 7"));
  // filter for contracts
  const isAddressContractResponse = await Web3Services.isAddressContract(walletAddress, provider);

  //! return if not wallet address?
  if (isAddressContractResponse.isContract) {
    console.info(chalk.red("invalid address provided, please provide wallet address"));
    return res.json({ error: "invalid address provided, please provide wallet address" });
  }
  //! return if there has be an RPC error
  if (!!isAddressContractResponse.error) {
    console.info(chalk.red("error with node, please try again"));
    return res.json({ error: isAddressContractResponse.error });
  }

  // find last 100000 transactions (quote limit)
  console.info(chalk.blue("step 2 of 7"));
  const fetchedTransactions = await EtherScanServices.fetchTransactions(
    walletAddress,
    provider,
    EtherScanScope.LifeTime
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
  console.info(chalk.blue("step 3 of 7"));
  const mapppedAddresses = mapAddresses(fetchedTransactions.transactions, walletAddress);

  // check database for known erc20 tokens already verfied and filter known non-erc20 addresses
  console.info(chalk.blue("step 4 of 7"));
  const [knownTokenData, unknownAddresses, knownContracts] = await FetchDataServices.checkForTokenData(
    mapppedAddresses,
    sequelize
  );
  const filteredFalse = unknownAddresses.filter((v: any) => v) as string[];
  // const filteredUnknownAddresses = filteredFalse.filter((_: any, i: number) => i <= 40) as string[];

  // for each transaction unknown contract address for erc20 tokens (coin gecko verified)
  console.info(chalk.blue("step 5 of 7"));
  const [nonERC20Contracts, erc20Tokens] = await FetchDataServices.checkForUnknownTokenData(filteredFalse);
  const filteredErc20Tokens = erc20Tokens.filter((v: any) => v);

  // //! if no token interactions detected return error
  if (!filteredErc20Tokens.length && !knownTokenData.length) {
    console.info(chalk.red("no contract interactions with this address"));
    return res.json({ error: "no contract interactions with this address" });
  }

  // save new tokens data to database
  console.info(chalk.blue("step 6 of 7"));
  const savedTokenData = await TokensServices.saveTokensData(filteredErc20Tokens, sequelize);
  console.info(chalk.blue("step 7 of 7"));
  const savedContractsData = await ContractsServices.saveContractsData(nonERC20Contracts, sequelize);

  // combine token data
  const tokensData = [...savedTokenData, ...knownTokenData];
  const contractData = [...savedContractsData, ...knownContracts];
  return res.json({
    success: "~ 🚀 ~",
    result: {
      numOfTokens: tokensData.length,
      numOfContracts: contractData.length,
      tokens: tokensData,
      contracts: contractData,
    },
  });
}
