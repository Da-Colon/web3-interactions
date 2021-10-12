import chalk from "chalk";
import { Model, Sequelize } from "sequelize/types";
import { Token } from "../types/app";

function sanitizeTokenData(tokenData: Token) {
  return {
    id: tokenData.contract_address,
    name: tokenData.name,
    symbol: tokenData.symbol,
    image: tokenData.image.large || tokenData.image.small || null,
    contractAddress: tokenData.contract_address,
    homepageURL: tokenData.links.homepage[0] || null,
    twitterScreenName: tokenData.links.twitter_screen_name || null,
    telegramChannelIdentifier: tokenData.links.telegram_channel_identifier || null,
    subRedditURL: tokenData.links.subreddit_url || null,
    description: tokenData.description.en ? tokenData.description.en : null,
    totalSupply: tokenData.market_data.total_supply,
  };
}

export async function fetchTokenData(
  sequelize: Sequelize,
  tokenAddress: string
): Promise<Model<Token> | undefined> {
  try {
    const fetchedTokenData = await sequelize.models.Tokens.findOne({ where: { id: tokenAddress }, raw: true });
    return fetchedTokenData;
  } catch {
    console.info(chalk.red(`${tokenAddress} not currently known`));
    return undefined;
  }
}
export async function fetchContractData(
  sequelize: Sequelize,
  address: string
): Promise<Model<Token> | undefined> {
  try {
    const fetchedContractData = await sequelize.models.Contracts.findOne({ where: { id: address } , raw: true});
    return fetchedContractData;
  } catch {
    console.info(chalk.red(`${address} not currently known`));
    return undefined;
  }
}

export async function saveTokenData(sequelize: Sequelize, token: Token): Promise<Model<Token>> {
  try {
    const sanitizedTokenData = sanitizeTokenData(token);
    const saveToken = await sequelize.models.Tokens.create(sanitizedTokenData);
    return saveToken;
  } catch (error) {
    console.info(chalk.red(`${token.contract_address}: failed to save`), chalk.gray(error));
    return
  }
}

export async function saveContractData(sequelize: Sequelize, address: string): Promise<Model<any>> {
  try {
    const saveContract = await sequelize.models.Contracts.create({ id: address});
    return saveContract;
  } catch (error) {
    console.info(chalk.red(`${address}: failed to save`, chalk.gray(error)));
    return
  }
}
