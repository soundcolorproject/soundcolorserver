
import { v3 as oldV3 } from 'node-hue-api'

import { Bootstrap } from './bootstrap'
import { Discovery } from './discovery'
import { LightStateApi } from './LightState'

export interface V3 {
  api: Bootstrap
  discovery: Discovery
  lightStates: LightStateApi
}

export const v3 = oldV3 as any as V3
export const LightState = v3.lightStates.LightState
export const SceneLightState = v3.lightStates.SceneLightState
export const GroupLightState = v3.lightStates.GroupLightState
