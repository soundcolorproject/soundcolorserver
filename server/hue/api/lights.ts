
import { LightState } from '../LightState'

export interface Light {
  readonly id: number
  name: string
  readonly type: string
  readonly modelid: string
  readonly manufacturername: string
  readonly uniqueid: string
  readonly productid: string
  readonly productname: string
  readonly swversion: string
  readonly swupdate: string
  readonly state: any
  readonly capabilities: any
  readonly colorGamut: {
    red: number[]
    green: number[]
    blue: number[]
  }

  getSupportedStates (): string[]
}

export interface LightsApi {
  // GET
  getAll (): Promise<Light[]>
  getLight (id: number | Light): Promise<Light>
  getLightByName (name: string): Promise<Light[]>
  getLightAttributesAndState (id: number | Light): Promise<any>

  // SEARCH
  searchForNew (): Promise<boolean>
  getNew (): Promise<Light[]>

  // STATE
  getLightState (id: number | Light): Promise<LightState>
  setLightState (id: number | Light, state: LightState): Promise<void>

  // MODIFY
  renameLight (light: Light): Promise<boolean>
  rename (id: number, name: string): Promise<void>

  // DELETE
  deleteLight (id: number | Light): Promise<boolean>
}
