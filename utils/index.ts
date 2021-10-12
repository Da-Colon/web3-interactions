import chalk from "chalk";
import { Sequelize } from "sequelize/types";
import {
  fetchContractData,
  fetchTokenData,
  saveContractData,
  saveTokenData,
} from "../tokens/tokens.services";
import { Token } from "../types/app";
import { Transaction } from "../types/responses";
import { fetchCoinGeckoTokenData } from "../web3/web3.services";

export function mapAddresses(transactions: Transaction[], address: string) {
  return [
    ...new Set(
      transactions.map((transaction: Transaction) => {
        if (transaction.from.toLowerCase() === address.toLowerCase()) {
          return transaction.to;
        } else return transaction.from;
      })
    ),
  ];
}

export async function checkForTokenData(mapppedAddresses: string[], sequelize: Sequelize) {
  const knownTokenData = [];
  const checkedAddresses = await Promise.all(
    mapppedAddresses.map(async (address: string) => {
      const tokenData: any = await fetchTokenData(sequelize, address);
      const contractData: any = await fetchContractData(sequelize, address);
      if (tokenData) {
        knownTokenData.push(tokenData);
        console.info(chalk.white(`token: ${tokenData.symbol} found`));
        return false;
      }
      if (contractData) {
        console.info(chalk.white(`contract: ${contractData.id} found`));
        return false;
      }
      return address;
    })
  );
  return [knownTokenData, checkedAddresses];
}

export async function checkForUnknownTokenData(unknownAddresses: string[]) {
  const nonERC20Contracts = [];
  const erc20Tokens = await Promise.all(
    unknownAddresses.map(async (address: string) => {
      const { isToken, tokenData } = await fetchCoinGeckoTokenData(address);
      if (isToken) {
        return tokenData;
      }
      nonERC20Contracts.push(address);
      return false;
    })
  );
  return [nonERC20Contracts, erc20Tokens];
}

export async function saveTokensData(newTokensData: Token[], sequelize: Sequelize) {
  return await Promise.all(
    newTokensData.map(async (token: Token) => {
      const savedData = await saveTokenData(sequelize, token);
      return savedData;
    })
  );
}

export async function saveContractsData(newContractsData: string[], sequelize: Sequelize) {
  return await Promise.all(
    newContractsData.map(async (address: string) => {
      const savedData = await saveContractData(sequelize, address);
      return savedData;
    })
  );
}
