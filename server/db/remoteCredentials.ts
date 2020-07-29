
import { getDb } from './connection'
import { RemoteCredentials, Tokens } from '../hue/api/remote'
import { DbWriteError } from '../errors/DbWriteError'
import { config } from '../config'

export interface CredentialData {
  _id: string
  username: string
  tokens: Tokens
  expirationDate: Date
}

const COLLECTION_NAME = 'remoteCredentials'
function getCollection () {
  if (!config.remoteApi) {
    return null
  }
  return getDb()!.collection<CredentialData>(COLLECTION_NAME)
}

export async function initCollection () {
  if (!config.remoteApi) {
    return
  }
  const collection = await getDb()!.createCollection<CredentialData>(COLLECTION_NAME)
  await collection.createIndex(
    'expirationDate',
    { expireAfterSeconds: 0 },
  )
}

export async function saveRemoteCredentials (session: string, { username, tokens }: RemoteCredentials) {
  if (!config.remoteApi) {
    return
  }
  const coll = getCollection()!
  const expirationDate = new Date(tokens.refresh.expiresAt)
  const value: CredentialData = {
    _id: session,
    username,
    tokens,
    expirationDate,
  }

  const found = await coll.findOneAndReplace(
    { _id: { $eq: session } },
    value,
  )

  if (!found.ok || !found.value) {
    const { result } = await coll.insertOne(value)

    if (!result.ok || result.n !== 1) {
      throw new DbWriteError(COLLECTION_NAME)
    }
  }
}

export async function getRemoteCredentials (session: string): Promise<CredentialData | null> {
  if (!config.remoteApi) {
    return null
  }
  const coll = getCollection()!
  return coll.findOne(
    { _id: { $eq: session } },
  )
}

export async function deleteRemoteCredentials (session: string) {
  if (!config.remoteApi) {
    return false
  }

  const coll = getCollection()!
  const { deletedCount = 0 } = await coll.deleteOne(
    { _id: { $eq: session } },
  )

  return deletedCount > 0
}
