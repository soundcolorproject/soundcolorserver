
import { GroupRoundRobinState, SetupRoundRobinFn, GetNextLightIdFn } from '../types/GroupRoundRobin'

const state = new Map<number, GroupRoundRobinState>()
export const setupRoundRobin: SetupRoundRobinFn = async function (session, groupId, lightIds) {
  state.set(groupId, {
    session,
    groupId,
    lightIds,
    currentIndex: 0,
    lastModified: new Date(),
  })
}

export const getNextLightId: GetNextLightIdFn = async function (_session, groupId): Promise<number> {
  if (!state.has(groupId)) {
    throw new Error('Group not initialized')
  }

  const data = state.get(groupId)!
  data.lastModified = new Date()
  const lightIdx = (data.currentIndex++) % data.lightIds.length
  return data.lightIds[lightIdx]
}
