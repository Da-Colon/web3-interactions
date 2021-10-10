import { Sequelize, DataTypes }  from "sequelize";

export function MigrationsModel(sequelize: Sequelize){
  const Migrations = sequelize.define('Migrations', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    }
  })

  return Migrations
}