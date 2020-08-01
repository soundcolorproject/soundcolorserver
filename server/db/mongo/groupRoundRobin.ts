
import { config } from '../../config'
import { DbWriteError } from '../../errors/DbWriteError'
import { GetNextLightIdFn, GroupRoundRobinState, SetupRoundRobinFn } from '../types/GroupRoundRobin'

import { getDb } from './connection'

const COLLECTION_NAME = 'groupRoundRobinState'
function getCollection () {
  if (!config.remoteApi) {
    return null
  }
  return getDb()!.collection<GroupRoundRobinState>(COLLECTION_NAME)
}

const TEN_MINUTES_IN_SECONDS = 60 * 10
export async function initCollection () {
  if (!config.remoteApi) {
    return
  }
  const collection = await getDb()!.createCollection<GroupRoundRobinState>(COLLECTION_NAME)

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

export const getNextLightId: GetNextLightIdFn = async function (session, groupId) {
  if (!config.remoteApi) {
    return -1
  }
  const coll = getCollection()!
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

export const setupRoundRobin: SetupRoundRobinFn = async function (session, groupId, lightIds) {
  if (!config.remoteApi) {
    return
  }
  const coll = getCollection()!
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
