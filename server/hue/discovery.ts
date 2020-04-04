
export interface BridgeInfo {
  name: string
  ipaddress: string
  modelid: string
  swversion: string
}

export interface Discovery {
  nupnpSearch (): Promise<BridgeInfo[]>
}
