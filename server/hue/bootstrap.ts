
import { UnauthenticatedApi } from './unauthenticatedApi'
import { HueApi } from './api'

export interface LocalBootstrap {
  connect (): Promise<UnauthenticatedApi>
  connect (
    username: string,
    clientkey?: string,
    timeout?: number,
  ): Promise<HueApi>
}

export interface RemoteBootstrap {
  getAuthCodeUrl (
    deviceId: string,
    appId: string,
    state: string,
  ): string

  connectWithCode (
    code: string,
    username?: string,
    timeout?: number,
    deviceType?: string,
    remoteBridgeId?: number,
  ): Promise<HueApi>

  connectWithTokens (
    accessToken: string,
    refreshToken: string,
    username?: string,
    timeout?: number,
    deviceType?: string,
    remoteBridgeId?: number,
  ): Promise<HueApi>
}

export interface Bootstrap {
  createLocal (host: string, port?: number): LocalBootstrap
  createRemote (clientId: string, clientSecret: string): RemoteBootstrap
}
