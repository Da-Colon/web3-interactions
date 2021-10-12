import chalk from "chalk";
import { Model, Sequelize } from "sequelize/types";
import { Token } from "../types/app";
import { sanitizeTokenData } from "../utils";

class DatabaseServices {
  async fetchTokenData(sequelize: Sequelize, tokenAddress: string): Promise<Model<Token> | undefined> {
    try {
      const fetchedTokenData = await sequelize.models.Tokens.findOne({
        where: { id: tokenAddress },
        raw: true,
      });
      return fetchedTokenData;
    } catch {
      console.info(chalk.red(`${tokenAddress} not currently known`));
      return undefined;
    }
  }
  async fetchContractData(sequelize: Sequelize, address: string): Promise<Model<Token> | undefined> {
    try {
      const fetchedContractData = await sequelize.models.Contracts.findOne({
        where: { id: address },
        raw: true,
      });
      return fetchedContractData;
    } catch {
      console.info(chalk.red(`${address} not currently known`));
      return undefined;
    }
  }

  async saveContractData(sequelize: Sequelize, address: string): Promise<Model<any>> {
    try {
      const saveContract = await sequelize.models.Contracts.create({ id: address });
      return saveContract;
    } catch (error) {
      console.info(chalk.red(`${address}: failed to save`, chalk.gray(error)));
      return;
    }
  }
  async saveTokenData(sequelize: Sequelize, token: Token): Promise<Model<Token>> {
    try {
      const sanitizedTokenData = sanitizeTokenData(token);
      const saveToken = await sequelize.models.Tokens.create(sanitizedTokenData);
      return saveToken;
    } catch (error) {
      console.info(chalk.red(`${token.contract_address}: failed to save`), chalk.gray(error));
      return;
    }
  }
}

export default new DatabaseServices();
