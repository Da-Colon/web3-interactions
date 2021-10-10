import chalk from "chalk";
import { Model, Sequelize } from "sequelize/types";
import { Token } from "../types/app";

function sanitizeTokenData(tokenData: Token) {
  const cleanDescription =  tokenData.description.en ? tokenData.description.en.replace('\r\n', "").trim() : null
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
    description: cleanDescription,
    totalSupply: tokenData.market_data.total_supply,
  }
}

export async function fetchTokenData(sequelize: Sequelize, tokenAddress: string): Promise<Model<Token> | undefined> {
  try {
    const fetchedTokenData = await sequelize.models.Tokens.findOne({ where: { id: tokenAddress } });
    return fetchedTokenData
  } catch {
    console.log(chalk.red(`${tokenAddress} not currently known`))
    return undefined
  }
}

export async function saveTokenData(sequelize: Sequelize, token: Token): Promise<Model<Token>> {
  try {
    const sanitizedTokenData = sanitizeTokenData(token)
    const saveToken = await sequelize.models.Tokens.create(sanitizedTokenData)
    return saveToken
  } catch (error) {    
    console.log(chalk.red(`${token.contract_address}: failed to save`))
  }
}
