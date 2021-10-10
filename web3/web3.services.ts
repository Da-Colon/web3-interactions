import chalk from "chalk";
import { ethers } from "ethers";

export async function isAddressContract(
  address: string,
  provider: ethers.providers.Provider
): Promise<{ isContract: boolean | null; error: string | null }> {
  try {
    const response = await provider.getCode(address);
    return { isContract: response !== "0x", error: null };
  } catch (err) {
    const error = err as Error;
    console.log(chalk.red(`There was an error retrieving RPC data`), chalk.gray(error));
    return { error: err, isContract: null };
  }
}
