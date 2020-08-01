
import { UnauthenticatedApi } from '../unauthenticatedApi'

import { CapabilitiesApi } from './capabilities'
import { GroupsApi } from './groups'
import { Transport } from './http/Transport'
import { LightsApi } from './lights'
import { RemoteApi } from './remote'
import { UsersApi } from './users'

export interface HueApi extends UnauthenticatedApi {
  readonly capabilities: CapabilitiesApi
  readonly groups: GroupsApi
  readonly lights: LightsApi
  readonly remote: RemoteApi
  readonly users: UsersApi
  readonly _getTransport: () => Transport
}
