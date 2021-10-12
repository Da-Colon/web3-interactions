import { Sequelize } from "sequelize/types";
import DatabaseServices from "../services/DatabaseServices";

class ContractsServices {
   async saveContractsData(newContractsData: string[], sequelize: Sequelize) {
    return await Promise.all(
      newContractsData.map(async (address: string) => {
        const savedData = await DatabaseServices.saveContractData(sequelize, address);
        return savedData;
      })
    );
  }
}

export default new ContractsServices();

