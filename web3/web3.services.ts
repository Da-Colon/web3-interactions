import Axios from "axios";
import chalk from "chalk";
import { ethers } from "ethers";
import config from "../config";

export async function isAddressContract(
  address: string,
  provider: ethers.providers.Provider
): Promise<{ isContract: boolean; error: string | null }> {
  try {
    const response = await provider.getCode(address);
    return { isContract: response !== "0x", error: null };
  } catch (err) {
    const error = err as Error;
    console.info(chalk.red(`There was an error retrieving RPC data`), chalk.gray(error));
    return { error: err, isContract: false };
  }
}
export async function fetchCoinGeckoTokenData(
  address: string
): Promise<{ isToken: boolean; error: string | null; tokenData: any }> {
  try {
    const response = await Axios.get(`${config.coinGeckoURL}/coins/ethereum/contract/${address}`);
    return { isToken: !!response.data, error: null, tokenData: response.data };
  } catch (err) {
    const error = err as Error;
    console.info(chalk.red(`Address: ${address} not found`), chalk.gray(error));
    return { error: err, isToken: false, tokenData: null };
  }
}
