import { Sequelize, DataTypes } from "sequelize";

export function TokenModel(sequelize: Sequelize) {
  const Tokens = sequelize.define(
    "Tokens",
    {
      id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      symbol: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      contractAddress: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      homepageURL: {
        type: DataTypes.STRING,
      },
      twitterScreenName: {
        type: DataTypes.STRING,
      },
      telegramChannelIdentifier: {
        type: DataTypes.STRING,
      },
      subRedditURL: {
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.TEXT,
      },
      totalSupply: {
        type: DataTypes.STRING,
      },
    },
    {
      timestamps: false,
    }
  );
  return Tokens;
}
