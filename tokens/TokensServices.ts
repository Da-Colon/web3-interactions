import { Sequelize } from "sequelize/types";
import DatabaseServices from "../services/DatabaseServices";
import { Token } from "../types/app";

class TokensService {
  async saveTokensData(newTokensData: Token[], sequelize: Sequelize) {
    return await Promise.all(
      newTokensData.map(async (token: Token) => {
        const savedData = await DatabaseServices.saveTokenData(sequelize, token);
        return savedData;
      })
    );
  }
}

export default new TokensService();
