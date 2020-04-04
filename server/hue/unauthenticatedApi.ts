
import { UnauthenticatedRemoteApi } from './api/remote'
import { UnauthenticatedUsersApi } from './api/users'

export interface UnauthenticatedApi {
  remote: UnauthenticatedRemoteApi
  users: UnauthenticatedUsersApi
}
