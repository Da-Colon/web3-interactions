import chalk from "chalk";
import { Sequelize } from "sequelize/types";
import { fetchTokenData, saveTokenData } from "../tokens/tokens.services";
import { Token } from "../types/app";
import { Transaction } from "../types/responses";
import { isAddressContract, isAddressToken } from "../web3/web3.services";

export function mapAddresses(transactions: Transaction[], walletAddress: string) {
  return [
    ...new Set(
      transactions.map((transaction: Transaction) => {
        if (transaction.from.toLowerCase() === walletAddress.toLowerCase()) {
          return transaction.to;
        } else return transaction.from;
      })
    ),
  ];
}

export async function checkForTokenData(
  mapppedAddresses: string[],
  sequelize: Sequelize,
  knownTokenData: any[]
) {
  return await Promise.all(
    mapppedAddresses.map(async (address: string) => {
      const tokenData: any = await fetchTokenData(sequelize, address);
      if (!tokenData) return address;
      console.log(chalk.white(`token: ${tokenData.name} found`));
      knownTokenData.push(tokenData);
      return false;
    })
  );
}

export async function checkForUnknownTokenData(unknownAddresses: string[], provider) {
  return await Promise.all(
    unknownAddresses.map(async (address: string) => {
      const { isContract } = await isAddressContract(address, provider);
      if (!isContract) return false;
      const { isToken, tokenData } = await isAddressToken(address);
      if (isToken) return tokenData;
    })
  );
}

export async function saveTokensData(newTokensData: Token[], sequelize: Sequelize) {
  return await Promise.all(
    newTokensData.map(async (token: Token) => {
      const savedData = await saveTokenData(sequelize, token);
      return savedData;
    })
  );
}
