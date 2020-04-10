
import { Router } from 'express'
import * as asyncHandler from 'express-async-handler'
import { getApi } from '../../hue-helpers/getApi'
import { InputValidationError } from '../../errors/InputValidationError'
import { HueApi } from '../../hue/api'
import { GroupLightState, LightState } from '../../hue'
import { CommonLightState } from '../../hue/LightState'

import {
  ApiGroupInfo,
  ApiSelectGroup,
  ApiSetGroupColor,
  LightColor,
} from '../../../shared/apiTypes/hue'
import { logger } from '../../../shared/logger'
import { getNextLightId, setupRoundRobin } from '../../db/groupRoundRobin'
import { DbWriteError } from '../../errors/DbWriteError'

export const hueRouter = Router()

hueRouter.get('/groups', asyncHandler(async (req, res) => {
  const api = await getApi(req.getSessionId())
  const [rooms, zones] = await Promise.all([
    api.groups.getRooms(),
    api.groups.getZones(),
  ])

  rooms.forEach(room => {
    logger.info('Room lights', room.lights)
  })

  const groupData = [...rooms, ...zones]
    .map(({ id, name, lights, type }): ApiGroupInfo => ({
      id,
      name,
      type,
      lightCount: lights.length,
    }))

  res.json(groupData)
}))

hueRouter.post('/groups/select', asyncHandler(async (req, res) => {
  const body: ApiSelectGroup = req.body
  const api = await getApi(req.getSessionId())
  if (!body || !body.groupId) {
    throw new InputValidationError<ApiSelectGroup>([
      'groupId',
    ])
  }

  const state = new GroupLightState().alertShort()
  await api.groups.setGroupState(body.groupId, state)
  res.status(204).end()
}))

function setColor<T extends CommonLightState<T>> (state: T, { h, s,v }: LightColor): T {
  return state
    .hue(Math.floor(h * 65535 / 360))
    .saturation(s * 100)
    .brightness(v * 100)
}

async function updateGroupColor (api: HueApi, { groupId, color }: ApiSetGroupColor) {
  const state = setColor(new GroupLightState(), color)
    .transitiontime(10)

  await api.groups.setGroupState(groupId, state)
}

async function updateRoundRobinColor (session: string, api: HueApi, { groupId, color }: ApiSetGroupColor, time = 2) {
  const state = setColor(new LightState(), color)
    .transitiontime(time)

  let lightId: number
  try {
    lightId = await getNextLightId(session, groupId)
  } catch (e) {
    if (!(e instanceof DbWriteError)) {
      throw e
    }

    const group = await api.groups.getGroup(groupId)
    const lightIds = group.lights.map(id => parseInt(id, 10))
    const lights = await Promise.all(
      lightIds.map(id => api.lights.getLight(id)),
    )

    const validIds = lights.filter(l => {
      return !!l.colorGamut
    }).map(l => l.id)

    logger.info('Setting up round robin')
    await setupRoundRobin(session, groupId, validIds)
    lightId = validIds[0]
  }

  logger.info('Setting color on light', lightId)
  api.lights.setLightState(lightId, state).then(() => {
    logger.info('Light color set for light', lightId)
  }).catch(e => {
    logger.warn('Failed to set light color:', e)
  })
}

hueRouter.post('/groups/setColor', asyncHandler(async (req, res) => {
  const session = req.getSessionId()
  const body: ApiSetGroupColor = req.body
  const api = await getApi(session)
  if (!body || !body.groupId || !body.color) {
    throw new InputValidationError<ApiSetGroupColor>([
      'groupId',
      'color',
    ])
  }

  switch (body.mode) {
    case 'round-robin':
      await updateRoundRobinColor(session, api, body)
      break
    case 'group':
    default:
      await updateGroupColor(api, body)
  }

  res.status(204).end()
}))
