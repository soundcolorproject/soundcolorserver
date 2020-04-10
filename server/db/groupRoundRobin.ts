
import { getDb } from './connection'
import { DbWriteError } from '../errors/DbWriteError'

interface GroupRoundRobinState {
  session: string
  groupId: number
  lightIds: number[]
  currentIndex: number
  lastModified: Date
}
const COLLECTION_NAME = 'groupRoundRobinState'
function getCollection () {
  return getDb().collection<GroupRoundRobinState>(COLLECTION_NAME)
}

const TEN_MINUTES_IN_SECONDS = 60 * 10
export async function initCollection () {
  const collection = await getDb().createCollection<GroupRoundRobinState>(COLLECTION_NAME)

  await collection.createIndex(
    {
      session: 1,
      groupId: 1,
    },
    { unique: true },
  )

  await collection.createIndex(
    'lastModified',
    { expireAfterSeconds: TEN_MINUTES_IN_SECONDS },
  )
}

export async function getNextLightId (session: string, groupId: number): Promise<number> {
  const coll = getCollection()
  const { ok, value } = await coll.findOneAndUpdate(
    {
      session: { $eq: session },
      groupId: { $eq: groupId },
    },
    {
      $inc: { currentIndex: 1 },
      $currentDate: { lastModified: true },
    },
  )

  if (!ok || !value) {
    throw new DbWriteError(COLLECTION_NAME)
  }

  const { currentIndex, lightIds } = value

  const idx = currentIndex % lightIds.length
  return lightIds[idx]
}

export async function setupRoundRobin (session: string, groupId: number, lightIds: number[]): Promise<void> {
  const coll = getCollection()
  const { result: { ok, n } } = await coll.insertOne({
    session,
    groupId,
    lightIds,
    currentIndex: 0,
    lastModified: new Date(),
  })

  if (!ok || n === 0) {
    throw new DbWriteError(COLLECTION_NAME)
  }
}
