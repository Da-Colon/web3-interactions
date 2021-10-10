import chalk from "chalk";
import { ethers } from "ethers";
import express from "express";
import { isAddressContract } from "../web3/web3.services";

export async function interactions(req: express.Request, res: express.Response) {
  console.log(chalk.blue("requesting interactions..."));
  // const currentBlock = req.app.locals.currentBlock as number
  // const provider = req.app.locals.provider as ethers.providers.Provider
  const walletAddress = req.params.address;

  // given a address (Contract or wallet address)
  //! return (400) if no address provided
  if (!walletAddress) {
    return res.json({ error: "please provide wallet address" });
  }
  //! return (400) if not wallet address?
  const isAddressContractResponse = await isAddressContract(walletAddress);
  if (!!isAddressContractResponse.isContract) {
    return res.json({ error: "invalid address provided, please provide wallet address" });
  }

  if (!!isAddressContractResponse.error) {
    return res.json({ error: isAddressContractResponse.error})
  }

  return res.sendStatus(200).json({ success: "Successful" });

  // for each of the recent transactions
  //?- - if known contract address (database)
  //!- - - retreive and return known contract data (database)
  //?- - check for Contract Addresses / etherscan
  //?- - - check for erc20 Contract Addresses on coin gecko for token data
  //!- - - -save new Contract into database
  // - returns Object(recent contract interactions)

  // `{"jsonrpc":"2.0","method":"eth_getBlockByNumber","params":["latest",true], "id":1}`
}
