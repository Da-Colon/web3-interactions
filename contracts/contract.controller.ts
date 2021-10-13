import chalk from "chalk";
import { ethers } from "ethers";
import express from "express";
import FetchDataServices from "../services/FetchDataServices";
import { mapAddresses} from "../utils";
import Web3Services from "../web3/Web3Services";
import EtherScanServices, { EtherScanScope } from "../thirdPartyServices/EtherScanServices";
import TokensServices from "../tokens/TokensServices";
import ContractsServices from "./ContractServices";

export async function interactions(req: express.Request, res: express.Response) {
  const provider = req.app.locals.provider as ethers.providers.Provider;
  const contractAddress = req.params.address;
  const sequelize = req.app.locals.sequelize;
  const { numberOfAccounts } = req.query
  let accountsLength: number
  if(numberOfAccounts) {
    accountsLength = Number(numberOfAccounts) > 50 ? 50 : Number(numberOfAccounts);
  } else {
    accountsLength = 100;
  }
  //! return if no address provided
  if (!contractAddress || !ethers.utils.isAddress(contractAddress)) {
    return res.json({ error: "please provide wallet address" });
  }

  //! return if not contract address?
  const isAddressContractResponse = await Web3Services.isAddressContract(contractAddress, provider);
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
  console.info(chalk.blue("step 1 of 10"));
  const fetchedTransactions = await EtherScanServices.fetchTransactions(contractAddress, provider, EtherScanScope.SemiRecent);

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
  console.info(chalk.blue("step 2 of 10"));
  const mappedAddresses = mapAddresses(fetchedTransactions.transactions, contractAddress);
  // filter 10 unique addresses
  console.info(chalk.blue("step 3 of 10"));
  const interactedAddresses = mappedAddresses.filter((_: string, index: number) => index <= accountsLength - 1);

  // for each address retreive token retreive contract interactions
  console.info(chalk.blue("step 4 of 10"));

  const walletsInteractions = await Promise.all(
    interactedAddresses.map(async (walletAddress: string, index: number) => {
      const getInteractions = async () => {
        const step = 0;
        // find last 100000 transactions (quote limit)
        console.info(chalk.blue(`(${index}) address: ${walletAddress} ${step + 1} of 6`));
        const fetchedTransactions = await EtherScanServices.fetchTransactions(walletAddress, provider, EtherScanScope.LifeTime);

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
        console.info(chalk.blue(`address: ${walletAddress} ${step + 2} of 6`));
        const mapppedAddresses = mapAddresses(fetchedTransactions.transactions, walletAddress);

        // check database for known erc20 tokens already verfied and filter known non-erc20 addresses
        console.info(chalk.blue(`address: ${walletAddress} ${step + 3} of 6`));
        const [knownTokenData, unknownAddresses, knownContracts] = await FetchDataServices.checkForTokenData(
          mapppedAddresses,
          sequelize
        );
        const filteredFalse = unknownAddresses.filter((v: any) => v) as string[];
        // const filteredUnknownAddresses = filteredFalse.filter((_: any, i: number) => i <= 40) as string[];

        // for each transaction unknown contract address for erc20 tokens (coin gecko verified)
        console.info(chalk.blue(`address: ${walletAddress} ${step + 4} of 6`));
        const [nonERC20Contracts, erc20Tokens] = await FetchDataServices.checkForUnknownTokenData(
          filteredFalse
        );
        const filteredErc20Tokens = erc20Tokens.filter((v: any) => v);

        // //! if no token interactions detected return error
        if (!filteredErc20Tokens.length && !knownTokenData.length) {
          console.info(chalk.red("no contract interactions with this address"));
          return res.json({ error: "no contract interactions with this address" });
        }

        // save new tokens data to database
        console.info(chalk.blue(`address: ${walletAddress} ${step + 5} of 6`));
        const savedTokenData = await TokensServices.saveTokensData(filteredErc20Tokens, sequelize);
        console.info(chalk.blue(`address: ${walletAddress} ${step + 6} of 6`));
        const savedContractsData = await ContractsServices.saveContractsData(nonERC20Contracts, sequelize);

        // combine token data
        const tokensData = [...savedTokenData, ...knownTokenData];
        const contractData = [...savedContractsData, ...knownContracts];
        return {
          account: walletAddress,
          results: {
            numOfTokens: tokensData.length,
            numOfContracts: contractData.length,
            token: tokensData,
            contracts: contractData,
          },
        };
      };
      return new Promise((resolve) => {
        setTimeout(() => resolve(getInteractions()), index * 3500);
      });
    })
  );
  return res.json({
    success: "~ 🚀 ~",
    numOfAccounts: walletsInteractions.length,
    result: walletsInteractions,
  });
}
