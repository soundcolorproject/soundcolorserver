
import { config } from '../config'
import { SetupRoundRobinFn, GetNextLightIdFn } from './types/GroupRoundRobin'

export * from './types/GroupRoundRobin'

export const setupRoundRobin: SetupRoundRobinFn = config.remoteApi
  ? require('./mongo/groupRoundRobin').setupRoundRobin
  : require('./memory/groupRoundRobin').setupRoundRobin

export const getNextLightId: GetNextLightIdFn = config.remoteApi
  ? require('./mongo/groupRoundRobin').getNextLightId
  : require('./memory/groupRoundRobin').getNextLightId
