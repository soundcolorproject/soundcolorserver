
import { config } from '../config'
import { SaveRemoteCredentialsFn, GetRemoteCredentialsFn, DeleteRemoteCredentialsFn } from './types/RemoteCredentials'

export * from './types/RemoteCredentials'

export const saveRemoteCredentials: SaveRemoteCredentialsFn = config.remoteApi
  ? require('./mongo/remoteCredentials').saveRemoteCredentials
  : require('./memory/remoteCredentials').saveRemoteCredentials

export const getRemoteCredentials: GetRemoteCredentialsFn = config.remoteApi
  ? require('./mongo/remoteCredentials').getRemoteCredentials
  : require('./memory/remoteCredentials').getRemoteCredentials

export const deleteRemoteCredentials: DeleteRemoteCredentialsFn = config.remoteApi
  ? require('./mongo/remoteCredentials').deleteRemoteCredentials
  : require('./memory/remoteCredentials').deleteRemoteCredentials
