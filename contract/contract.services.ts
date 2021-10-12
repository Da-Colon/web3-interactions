import axios, { AxiosResponse } from "axios";
import { ethers } from "ethers";
import config from "../config";
import { Transaction, TransactionsResponse } from "../types/responses";

// todo duplicate file. will update this and wallet.services -> services/etherscan.services.ts
function createEtherScanURL(address: string, currentBlock: number) {
  const params = {
    module: "account",
    action: "txlist",
    address: address,
    fromBlock: (currentBlock - 5000).toString(),
    apiKey: config.web3.providerKeys.etherscan,
  };
  const queryParams = new URLSearchParams(params);
  return queryParams;
}

export async function fetchContractTransactions(
  address: string,
  provider: ethers.providers.Provider
): Promise<{ transactions: Transaction[] | null; error: string | null }> {
  try {
    const currentBlock = await provider.getBlockNumber();
    const transactionsResponse: AxiosResponse<TransactionsResponse> = await axios.get(
      `${config.etherscanURL}?${createEtherScanURL(address, currentBlock)}`
    );
    if(transactionsResponse.data.result  === typeof String) {
      return { error: transactionsResponse.data.result, transactions: null }
    }
    return { error: null, transactions: transactionsResponse.data.result as Transaction[] };
  } catch (err) {
    const error = err as string;
    return { error: error, transactions: null };
  }
}

