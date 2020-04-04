
import { UnauthenticatedApi } from '../unauthenticatedApi'
import { CapabilitiesApi } from './capabilities'
import { LightsApi } from './lights'
import { UsersApi } from './users'
import { RemoteApi } from './remote'

export interface HueApi extends UnauthenticatedApi {
  capabilities: CapabilitiesApi
  lights: LightsApi
  remote: RemoteApi
  users: UsersApi
}
