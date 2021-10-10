import { ethers } from 'ethers';
import express from 'express';
export async function interactions(req: express.Request, res: express.Response) {
  const currentBlock = req.app.locals.currentBlock as number
  const provider = req.app.locals.provider as ethers.providers.Provider
  const address = req.params.address

  // given a address (Contract or wallet address)

  // ! return 400 if wallet address

  // fetch recent transactions (10 wallet address)
  
  // for each of the recent transactions 
  // - - check for wallet addresses (last 10)
  //? - - if wallet address
  // - - - fetch recent transactions (10)
  //? - - - - if known contract address (database)
  //!- - - - - - return contract data (database)
  // - - - - check for Contract Addresses / etherscan
  // - - - - query Contract Addresses on coin gecko for token data
  // - - - - save new Contract into database
  //! - - returns Object(wallet[Contracts[]]])
  // `{"jsonrpc":"2.0","method":"eth_getBlockByNumber","params":["latest",true], "id":1}`
}