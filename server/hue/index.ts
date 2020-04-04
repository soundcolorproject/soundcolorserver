
import { v3 as oldV3 } from 'node-hue-api'

import { Discovery } from './discovery'
import { Bootstrap } from './bootstrap'

export interface V3 {
  api: Bootstrap
  discovery: Discovery
}

export const v3 = oldV3 as any as V3
