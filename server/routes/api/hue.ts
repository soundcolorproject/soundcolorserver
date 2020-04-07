
import { Router } from 'express'
import * as asyncHandler from 'express-async-handler'
import { getApi } from '../../hue-helpers/getApi'
import { GroupType } from '../../hue/api/groups'

export const hueRouter = Router()

const validGroupTypes: GroupType[] = [
  'Room',
  'Zone',
]

hueRouter.get('/groups', asyncHandler(async (req, res) => {
  const api = await getApi(req.getSessionId())
  const allGroups = await api.groups.getAll()

  const groupData = allGroups
    .filter(g => validGroupTypes.includes(g.type))
    .map(({ id, name, type }) => ({ id, name, type }))

  res.send(groupData)
}))
