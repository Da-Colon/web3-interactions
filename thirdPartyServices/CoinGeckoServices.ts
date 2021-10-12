import Axios from "axios";
import chalk from "chalk";
import config from "../config";

class CoinGeckoServices {
  public async fetchCoinGeckoTokenData(
    address: string
  ): Promise<{ isToken: boolean; error: string | null; tokenData: any }> {
    try {
      const response = await Axios.get(`${config.coinGeckoURL}/coins/ethereum/contract/${address}`);
      return { isToken: !!response.data, error: null, tokenData: response.data };
    } catch (err) {
      const error = err as string;
      if (error === "Request failed with status code 429") {
        throw "ereoreroreore";
      }
      console.info(chalk.red(`Address: ${address} not found`), chalk.gray(error));
      return { error: err, isToken: false, tokenData: null };
    }
  }
}

export default new CoinGeckoServices();
