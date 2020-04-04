
import { hostname } from 'os'

import { v3 } from '../hue'
import { config } from '../config'
import { apiCache, oauthTokensCache } from './cache'
import { BridgeInfo } from '../hue/discovery'
import { NewUser } from '../hue/api/users'
import { writeJsonFile, readJsonFile, dataFileExists } from './appData'
import { HueApi } from '../hue/api'
import { getLocalBridges } from './getLocalBridges'

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

function getRemoteApi (session: string | undefined) {
  if (!session) {
    throw new Error('No session found')
  }

  return apiCache.getOrExecute(session, async () => {
    const oauthTokens = oauthTokensCache.get(session)
    if (!oauthTokens) {
      throw new Error('No OAuth tokens found for the current session')
    }

    const { accessToken, refreshToken } = oauthTokens

    return createAccess().connectWithTokens(accessToken, refreshToken)
  })
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
    throw new Error('No hue bridges found on the current network')
  }

  const { username, clientkey } = await getLocalUser(bridge)

  localApi = await v3.api.createLocal(bridge.ipaddress).connect(username, clientkey)
  return localApi
}

export async function createApiFromAccessCode (session: string, accessCode: string) {
  const api = await createAccess().connectWithCode(accessCode)
  const oauthTokens = await api.remote.refreshTokens()
  oauthTokensCache.set(session, oauthTokens)
  apiCache.set(session, api)

  return api
}

export async function getApi (session: string | undefined) {
  if (config.remoteApi) {
    return getRemoteApi(session)
  } else {
    return getLocalApi()
  }
}

if (!config.remoteApi) {
  getLocalApi().catch(() => {
    // noop
  })
}
