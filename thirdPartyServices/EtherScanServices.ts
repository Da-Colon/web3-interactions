import Axios, { AxiosResponse } from "axios";
import { ethers } from "ethers";
import config from "../config";
import { Transaction, TransactionsResponse } from "../types/responses";

export enum EtherScanScope {
  SemiRecent,
  LifeTime,
}

interface EtherScanParams {
  module: string;
  action: string;
  address: string;
  apiKey: string;
  fromBlock?: string;
}

class EtherScanServices {
  createEtherScanURL(address: string, currentBlock: number, scope: EtherScanScope) {
    const params: EtherScanParams = {
      module: "account",
      action: "txlist",
      address: address,
      apiKey: config.web3.providerKeys.etherscan,
    };

    if (scope === EtherScanScope.SemiRecent) {
      params.fromBlock = (currentBlock - 5000).toString();
    }
    const queryParams = new URLSearchParams(params as any);
    return queryParams;
  }

  async fetchTransactions(
    address: string,
    provider: ethers.providers.Provider,
    scope: EtherScanScope,
  ): Promise<{ transactions: Transaction[] | null; error: string | null }> {
    try {
      const currentBlock = await provider.getBlockNumber();
      const transactionsResponse: AxiosResponse<TransactionsResponse> = await Axios.get(
        `${config.etherscanURL}?${this.createEtherScanURL(address, currentBlock, scope)}`
      );
      if (transactionsResponse.data.result === typeof String) {
        return { error: transactionsResponse.data.result, transactions: null };
      }
      return { error: null, transactions: transactionsResponse.data.result as any };
    } catch (err) {
      const error = err as string;
      return { error: error, transactions: null };
    }
  }
}

export default new EtherScanServices();
