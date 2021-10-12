export interface RPCResponse {
  jsonrpc: string;
  id: number;
  error?: RPCErrorResponse;
}

interface RPCErrorResponse {
  code: number;
  message: string;
}

export interface TransactionsResponse {
  status: string;
  message: string;
  result: Transaction[] | string;
  error?: RPCErrorResponse;
}

export interface Transaction {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  blockHash: string;
  transactionIndex: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  isError: string;
  txreceipt_status: string;
  input: string;
  contractAddress: string;
  cumulativeGasUsed: string;
  gasUsed: string;
  confirmations: string;
}
