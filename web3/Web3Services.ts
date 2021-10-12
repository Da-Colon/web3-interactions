import chalk from "chalk";
import { ethers } from "ethers";

class Web3Services {
  async isAddressContract(
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
}

export default new Web3Services();
