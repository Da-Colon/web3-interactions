import { Sequelize } from "sequelize/types";
import { ContractModal } from "./contracts";
import { MigrationsModel } from "./migrations";
import { TokenModel } from "./tokens";

export function modalsInit(sequelize: Sequelize) {
  // token modal
  const Tokens = TokenModel(sequelize);
  const Contracts = ContractModal(sequelize)
  Tokens.sync({ alter: true })
  Contracts.sync({ alter: true })
  // migration modal
  const Migrations = MigrationsModel(sequelize);
  Migrations.sync({ alter: true })
  // todo contract modal
  // todo user address modal

}