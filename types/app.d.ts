import { ethers } from "ethers";
import { Dialect, Sequelize } from "sequelize/types";

export interface Config {
  port: string;
  isDev: boolean;
  database: DatabaseInitOptions;
  web3: WebOptions;
  etherscanURL: string;
  coinGeckoURL: string;
  infuraURL: string;
}

export interface DatabaseInitOptions {
  host: string;
  user: string;
  password: string;
  name: string;
  port: string;
  dialect: Dialect;
}

export interface WebOptions {
  chainId: string;
  network: string;
  providerKeys: ProviderKeys;
}

export interface ProviderKeys {
  infura: string;
  alchemy: string;
  etherscan: string;
}

// for reference; unless I find where to put it.
export interface LocalsOptions {
  database: Sequelize;
  web3Provider: ethers.providers.Provider;
  currentBlock: string;
}

export interface Token {
  id: string;
  symbol: string;
  name: string;
  asset_platform_id: string;
  platforms: { ethereum: string };
  block_time_in_minutes: number;
  hashing_algorithm: null;
  categories: [];
  public_notice: null;
  additional_notices: [];
  localization: {
    en: string;
    de: string;
    es: string;
    fr: string;
    it: string;
    pl: string;
    ro: string;
    hu: string;
    nl: string;
    pt: string;
    sv: string;
    vi: string;
    tr: string;
    ru: string;
    ja: string;
    zh: string;
    "zh-tw": string;
    ko: string;
    ar: string;
    th: string;
    id: string;
  };
  description: {
    en: string;
    de: string;
    es: string;
    fr: string;
    it: string;
    pl: string;
    ro: string;
    hu: string;
    nl: string;
    pt: string;
    sv: string;
    vi: string;
    tr: string;
    ru: string;
    ja: string;
    zh: string;
    "zh-tw": string;
    ko: string;
    ar: string;
    th: string;
    id: string;
  };
  links: {
    homepage: string[];
    blockchain_site: [];
    official_forum_url: [];
    chat_url: [];
    announcement_url: [];
    twitter_screen_name: string;
    facebook_username: string;
    bitcointalk_thread_identifier: null;
    telegram_channel_identifier: string;
    subreddit_url: null;
    repos_url: {};
  };
  image: {
    thumb: string;
    small: string;
    large: string;
  };
  country_origin: string;
  genesis_date: null;
  contract_address: string;
  sentiment_votes_up_percentage: number;
  sentiment_votes_down_percentage: number;
  market_cap_rank: number;
  coingecko_rank: number;
  coingecko_score: number;
  developer_score: number;
  community_score: number;
  liquidity_score: number;
  public_interest_score: number;
  market_data: {
    current_price: {};
    total_value_locked: null;
    mcap_to_tvl_ratio: null;
    fdv_to_tvl_ratio: null;
    roi: null;
    ath: {};
    ath_change_percentage: {};
    ath_date: {};
    atl: {};
    atl_change_percentage: {};
    atl_date: {};
    market_cap: {};
    market_cap_rank: number;
    fully_diluted_valuation: {};
    total_volume: {};
    high_24h: {};
    low_24h: {};
    price_change_24h: number;
    price_change_percentage_24h: number;
    price_change_percentage_7d: number;
    price_change_percentage_14d: number;
    price_change_percentage_30d: number;
    price_change_percentage_60d: number;
    price_change_percentage_200d: number;
    price_change_percentage_1y: number;
    market_cap_change_24h: number;
    market_cap_change_percentage_24h: number;
    price_change_24h_in_currency: {};
    price_change_percentage_1h_in_currency: {};
    price_change_percentage_24h_in_currency: {};
    price_change_percentage_7d_in_currency: {};
    price_change_percentage_14d_in_currency: {};
    price_change_percentage_30d_in_currency: {};
    price_change_percentage_60d_in_currency: {};
    price_change_percentage_200d_in_currency: {};
    price_change_percentage_1y_in_currency: {};
    market_cap_change_24h_in_currency: {};
    market_cap_change_percentage_24h_in_currency: {};
    total_supply: number;
    max_supply: null;
    circulating_supply: number;
    last_updated: string;
  };
  community_data: {
    facebook_likes: null;
    twitter_followers: number;
    reddit_average_posts_48h: number;
    reddit_average_comments_48h: number;
    reddit_subscribers: number;
    reddit_accounts_active_48h: number;
    telegram_channel_user_count: number;
  };
  developer_data: {
    forks: number;
    stars: number;
    subscribers: number;
    total_issues: number;
    closed_issues: number;
    pull_requests_merged: number;
    pull_request_contributors: number;
    code_additions_deletions_4_weeks: {};
    commit_count_4_weeks: number;
    last_4_weeks_commit_activity_series: {};
  };
  public_interest_stats: { alexa_rank: null; bing_matches: null };
  status_updates: [];
  last_updated: string;
  tickers: {};
}
