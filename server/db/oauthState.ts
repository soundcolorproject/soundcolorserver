
import { getDb } from './connection'
import { DbWriteError } from '../errors/DbWriteError'
import { randomString, randomLetter } from '../helpers/random'

async function generateStateString () {
  let state = await randomString(24)
  state = state.replace(/[^a-zA-Z]/g, randomLetter)
  return state
}

export type OAuthProvider = 'hue'
interface OAuthState {
  session: string
  provider: OAuthProvider
  state: string
  createdDate: Date
}
const COLLECTION_NAME = 'oauthState'
function getCollection () {
  return getDb().collection<OAuthState>(COLLECTION_NAME)
}

const TEN_MINUTES_IN_SECONDS = 60 * 10
export async function initCollection () {
  const collection = await getDb().createCollection<OAuthState>(COLLECTION_NAME)
  await collection.createIndex(
    'createdDate',
    { expireAfterSeconds: TEN_MINUTES_IN_SECONDS },
  )
}

export async function generateOauthState (session: string, provider: OAuthProvider) {
  const coll = getCollection()
  const state = await generateStateString()
  const value: OAuthState = {
    session,
    provider,
    state,
    createdDate: new Date(),
  }
  const { result } = await coll.insertOne(
    value,
  )

  if (!result.ok || result.n !== 1) {
    throw new DbWriteError(COLLECTION_NAME)
  }

  return state
}

export async function verifyOauthState (session: string, state: string, provider: OAuthProvider) {
  const coll = getCollection()
  const found = await coll.findOne({
    session: { $eq: session },
    state: { $eq: state },
    provider: { $eq: provider },
  })

  if (!found) {
    return false
  }

  const { result } = await coll.deleteOne({
    session: { $eq: session },
    state: { $eq: state },
    provider: { $eq: provider },
  })
  if (!result.ok) {
    throw new DbWriteError(COLLECTION_NAME)
  }

  return true
}
