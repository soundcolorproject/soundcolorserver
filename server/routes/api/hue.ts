
import { Router } from 'express'
import * as asyncHandler from 'express-async-handler'
import { getApi } from '../../hue-helpers/getApi'
import { InputValidationError } from '../../errors/InputValidationError'
import { GroupLightState } from '../../hue'
import {
  ApiGroupInfo,
  ApiSelectGroup,
  ApiSetGroupColor,
} from '../../../shared/apiTypes/hue'

export const hueRouter = Router()

hueRouter.get('/groups', asyncHandler(async (req, res) => {
  const api = await getApi(req.getSessionId())
  const [rooms, zones] = await Promise.all([
    api.groups.getRooms(),
    api.groups.getZones(),
  ])

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

hueRouter.post('/groups/setColor', asyncHandler(async (req, res) => {
  const body: ApiSetGroupColor = req.body
  const api = await getApi(req.getSessionId())
  if (!body || !body.groupId || !body.color) {
    throw new InputValidationError<ApiSetGroupColor>([
      'groupId',
      'color',
    ])
  }

  const { h, s, v } = body.color
  const state = new GroupLightState()
    .transitiontime(10)
    .hue(Math.floor(h * 65535 / 360))
    .saturation(s * 100)
    .brightness(v * 100)

  await api.groups.setGroupState(body.groupId, state)
  res.status(204).end()
}))
