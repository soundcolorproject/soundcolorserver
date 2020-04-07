
import { hostname } from 'os'

import { v3 } from '../hue'
import { config } from '../config'
import { apiCache, remoteCredentialsCache, sessionStateCache } from './cache'
import { BridgeInfo } from '../hue/discovery'
import { NewUser } from '../hue/api/users'
import { writeJsonFile, readJsonFile, dataFileExists } from './appData'
import { HueApi } from '../hue/api'
import { getLocalBridges } from './getLocalBridges'
import { logger } from '../../shared/logger'
import { RedirectError } from '../errors/RedirectError'
import { randomString, randomLetter } from '../helpers/random'
import { NoLocalBridgesError } from '../errors/NoLocalBridgesError'

function bridgeUserFile (bridge: BridgeInfo) {
  return `user.${bridge.name}.${bridge.ipaddress}.${bridge.modelid}.json`
}

function writeLocalUser (bridge: BridgeInfo, user: NewUser) {
  return writeJsonFile(bridgeUserFile(bridge), user)
}

function readLocalUser (bridge: BridgeInfo) {
  return readJsonFile<NewUser>(bridgeUserFile(bridge))
}

function localUserFileExists (bridge: BridgeInfo) {
  return dataFileExists(bridgeUserFile(bridge))
}

function createAccess () {
  return v3.api.createRemote(config.clientId, config.clientSecret)
}

async function getRedirectUrl (session: string) {
  const state = await sessionStateCache.getOrExecute(session, async () => (
    (await randomString(24)).replace(/[^a-zA-Z]/g, randomLetter)
  ))
  const access = createAccess()
  return access.getAuthCodeUrl(hostname(), config.appId, state)
}

async function getRemoteApi (session: string) {
  const api = await apiCache.getOrExecute(session, async () => {
    const credentials = remoteCredentialsCache.get(session)
    if (!credentials) {
      throw new RedirectError(await getRedirectUrl(session), 'No OAuth tokens found for the current session')
    }

    const { tokens: { access, refresh }, username } = credentials

    if (refresh.expiresAt < Date.now()) {
      remoteCredentialsCache.del(session)
      throw new RedirectError(await getRedirectUrl(session), 'OAuth tokens for the current session have expired')
    }

    return createAccess().connectWithTokens(access.value, refresh.value, username)
  })

  const { tokens: { access } } = api.remote.getRemoteAccessCredentials()
  if (access.expiresAt < Date.now()) {
    await api.remote.refreshTokens()
    const newCreds = api.remote.getRemoteAccessCredentials()
    remoteCredentialsCache.set(session, newCreds)
  }

  return api
}

async function getLocalUser (bridge: BridgeInfo) {
  if (await localUserFileExists(bridge)) {
    const fileUser = await readLocalUser(bridge)
    if (fileUser && fileUser.clientkey && fileUser.username) {
      return fileUser
    }
  }
  const api = await v3.api.createLocal(bridge.ipaddress).connect()
  const user = await api.users.createUser('soundcolorproject', hostname())

  await writeLocalUser(bridge, user)

  return user
}

let localApi: HueApi | undefined = undefined
export async function getLocalApi () {
  if (localApi) {
    return localApi
  }

  const bridges = await getLocalBridges()
  const bridge = bridges[0]
  if (!bridge) {
    throw new NoLocalBridgesError()
  }

  const { username, clientkey } = await getLocalUser(bridge)

  localApi = await v3.api.createLocal(bridge.ipaddress).connect(username, clientkey)
  return localApi
}

export async function createApiFromAccessCode (session: string, accessCode: string) {
  const api = await createAccess().connectWithCode(accessCode)
  const remoteCredentials = api.remote.getRemoteAccessCredentials()
  logger.info(`Remote API Access Credentials:\n ${JSON.stringify(remoteCredentials, null, 2)}\n`)
  logger.info(`The Access Token is valid until:  ${new Date(remoteCredentials.tokens.access.expiresAt)}`)
  logger.info(`The Refresh Token is valid until: ${new Date(remoteCredentials.tokens.refresh.expiresAt)}`)

  remoteCredentialsCache.set(session, remoteCredentials)
  apiCache.set(session, api)

  return api
}

export async function getApi (session: string) {
  if (config.remoteApi) {
    return getRemoteApi(session)
  } else {
    return getLocalApi()
  }
}

if (!config.remoteApi) {
  getLocalApi().catch(e => {
    logger.info('Local api not initialized. A user probably needs to be created --', e)
  })
}
