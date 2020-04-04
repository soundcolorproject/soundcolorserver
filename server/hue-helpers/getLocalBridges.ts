
import { v3 } from '../hue'

export async function getLocalBridges () {
  return v3.discovery.nupnpSearch()
}
