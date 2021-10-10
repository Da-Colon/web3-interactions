export function normalizeAddress(address: string) {
  if(address.startsWith('0x')) {
    return address.substr(2)
  }
  return address
}