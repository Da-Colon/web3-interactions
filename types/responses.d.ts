export interface RPCResponse {
  jsonrpc: string,
  id: number,
  error?: RPCErrorResponse
}

interface RPCErrorResponse {
  code: number,
  message: string
}