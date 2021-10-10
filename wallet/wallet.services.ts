import axios, { AxiosResponse } from "axios";
import { ethers } from "ethers";
import config from "../config";
import { Transaction, TransactionsResponse } from "../types/responses";

function createEtherScanURL(address: string) {
  const params = {
    module: "account",
    action: "txlist",
    address: address,
    apiKey: config.web3.providerKeys.etherscanKey,
  };
  const queryParams = new URLSearchParams(params);
  return queryParams;
}

export async function fetchWalletTransactions(
  address: string
): Promise<{ transactions: Transaction[] | null; error: string | null }> {
  try {
    const transactionsResponse: AxiosResponse<TransactionsResponse> = await axios.get(
      `${config.etherscanURL}?${createEtherScanURL(address)}`
    );
    return { error: null, transactions: transactionsResponse.data.result };
  } catch (err) {
    const error = err as string;
    return { error: error, transactions: null };
  }
}


