import config from "../config";
import Axios from "axios";
import chalk from "chalk";

//? example dataString: `{"jsonrpc":"2.0","method":"eth_getBlockByNumber","params":["latest",true], "id":1}`
export async function isAddressContract(
  address: string
): Promise<{ isContract: boolean | null; error: string | null }> {
  try {
    const params = {
      jsonrpc: 2.0,
      method: "eth_getCode",
      params: [address, "lastest"],
      id: 1
    }
    // const dataString = `{"jsonrpc":"2.0","method":"getCode","params":[${address}, "lastest"], "id": 1}`;
    const response = await Axios.post(config.infuraURL, JSON.stringify(params), {
      headers: { "Content-Type": "application/json" },
    });
    return { isContract: !!response, error: null };
  } catch (err) {
    const error = err as Error;
    console.log(chalk.red(`There was an error retrieving RPC data`), chalk.gray(error));
    return { error: err, isContract: null };
  }
}
