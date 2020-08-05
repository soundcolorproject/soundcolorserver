
import { DeleteRemoteCredentialsFn, GetRemoteCredentialsFn, SaveRemoteCredentialsFn } from '../types/RemoteCredentials'

export const saveRemoteCredentials: SaveRemoteCredentialsFn = async function () {
  // noop
}

export const getRemoteCredentials: GetRemoteCredentialsFn = async function () {
  return null
}

export const deleteRemoteCredentials: DeleteRemoteCredentialsFn = async function () {
  return false
}
