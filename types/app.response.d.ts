// For Reference

export interface WalletInteractionsResponse {
  success: string,
  result: {
    numOfTokens: number,
    numOfContracts: number,
    tokens: Token[],
    contracts: Contract[]
  }
}
export interface ContractInteractionsResponse {
  success: string,
  numOfAccounts: number,
  result: {
    numOfTokens: number,
    numOfContracts: number,
    tokens: Token[],
    contracts: Contract[]
  }
}

export interface Token {
  id: string,
  name: string | null,
  symbol: string | null,
  image: string | null,
  contractAddress: string,
  homePageUrl: string | null,
  twitterScreenName: string | null,
  telegramChannelIdentifier: string | null,
  subRedditURL: string | null,
  description: string | null,
  totalSupply: string | null
}

export interface Contract {
  id: string,
}