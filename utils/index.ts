import { Token } from "../types/app";
import { Transaction } from "../types/responses";

export function mapAddresses(transactions: Transaction[], address: string) {
  return [
    ...new Set(
      transactions.map((transaction: Transaction) => {
        if (transaction.from.toLowerCase() === address.toLowerCase()) {
          return transaction.to;
        } else return transaction.from;
      })
    ),
  ];
}

export function sanitizeTokenData(tokenData: Token) {
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


