import { Sequelize, DataTypes } from "sequelize";

export function ContractModal(sequelize: Sequelize) {
  const Contracts = sequelize.define(
    "Contracts",
    {
      id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
    },
    {
      timestamps: false,
    }
  );
  return Contracts;
}
