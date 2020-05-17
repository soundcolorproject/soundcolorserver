
import { UnauthenticatedApi } from '../unauthenticatedApi'
import { CapabilitiesApi } from './capabilities'
import { LightsApi } from './lights'
import { UsersApi } from './users'
import { RemoteApi } from './remote'
import { GroupsApi } from './groups'
import { Transport } from './http/Transport'

export interface HueApi extends UnauthenticatedApi {
  readonly capabilities: CapabilitiesApi
  readonly groups: GroupsApi
  readonly lights: LightsApi
  readonly remote: RemoteApi
  readonly users: UsersApi
  readonly _getTransport: () => Transport
}
