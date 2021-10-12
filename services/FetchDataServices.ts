import chalk from "chalk";
import { Sequelize } from "sequelize/types";
import CoinGeckoServices from "../thirdPartyServices/CoinGeckoServices";
import DatabaseServices from "./DatabaseServices";
class FetchDataServices {
  async checkForUnknownTokenData(unknownAddresses: string[]) {
    const nonERC20Contracts = [];
    const erc20Tokens = await Promise.all(
      unknownAddresses.map(async (address: string, index: number) => {
        const { isToken, tokenData }: any = () =>
          new Promise((resolve) => {
            setTimeout(() => resolve(CoinGeckoServices.fetchCoinGeckoTokenData(address)), index * 1000);
          });
        if (isToken) {
          return tokenData;
        }
        nonERC20Contracts.push(address);
        return false;
      })
    );
    return [nonERC20Contracts, erc20Tokens];
  }

  async checkForTokenData(mapppedAddresses: string[], sequelize: Sequelize) {
    const knownTokenData = [];
    const knownContracts = [];
    const checkedAddresses = await Promise.all(
      mapppedAddresses.map(async (address: string, index: number) => {
        const tokenData: any = await DatabaseServices.fetchTokenData(sequelize, address);
        const contractData: any = await DatabaseServices.fetchContractData(sequelize, address);
        if (tokenData) {
          knownTokenData.push(tokenData);
          console.info(chalk.white(`token: ${tokenData.symbol} found`));
          return false;
        }
        if (contractData) {
          console.info(chalk.white(`contract: ${contractData.id} found`));
          knownContracts.push(contractData);
          return false;
        }
        return address;
      })
    );
    return [knownTokenData, checkedAddresses, knownContracts];
  }
}

export default new FetchDataServices();
